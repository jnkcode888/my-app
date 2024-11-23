import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,Image } from "react-native";
import { Svg, Path } from "react-native-svg";
import { useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { api } from '../components/Axios';



const Max_Input_Height=210
export default function MessageInput({setAlertData, setAlert}) {
    const [message, setMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputHeight,setContentHeight]=useState(50)
    const scrollViewRef = useRef();
    const {userInfo}=useAuth()


    function handleChange(text) {
        console.log('Cleared')
        if(text===''){
            setMessage('')
        }
        setMessage(text);

    }
    useEffect(() => {
        if (message === "") {
          console.log("Input cleared");
          // You could perform some action here when the input is cleared
        }
      }, [message]); // This effect runs only when `inputText` changes
     

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }) + ', ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    function getCurrentTime(isPersonal) {
        const now = new Date();
        if (isPersonal){
            return now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return formatTime(now);
    }

    function parseText(text) {
        const patterns = [
            { type: 'link', regex: /<a href="[^"]+">[^<]+<\/a>/ },
            { type: 'header', regex: /###([^#]+)###/ },
            { type: 'subheader', regex: /\*\*\*([^*]+)\*\*\*/ },
            { type: 'ol', regex: /-#([^#]*)-#/ },
            { type: 'ul', regex: /-\*([^*]*)-\*/ },
            { type: 'reset', regex: /!\|/ },
            { type: 'override', regex: /!\d+\|/ },
            { type: 'expl', regex: /-\|([^\|]*)-\|/ }
        ];

        let elements = [];
        let index = 0;
        let olIndex = 1;

        while (index < text.length) {
            let matched = false;

            for (const { type, regex } of patterns) {
                const match = regex.exec(text.slice(index));
                if (match && match.index === 0) {
                    let elementText = match[0];

                    if (type === 'reset' || type === 'override') {
                        olIndex = type === 'override' ? parseInt(elementText.match(/\d+/)[0], 10) : 1;
                        elements.push({ type, match: elementText, index });
                    } else if (['ol', 'ul', 'expl'].includes(type)) {
                        const subItems = elementText.match(/<a href="[^"]+">[^<]+<\/a>|[^<]+/g) || [];
                        elements.push({ 
                            type, 
                            match: type === 'ol' ? `${olIndex}. ` : '',
                            subItems: subItems.map(item => ({
                                type: item.startsWith('<a') ? 'link' : 'plainText',
                                match: item
                            })),
                            index
                        });
                        if (type === 'ol') olIndex++;
                    } else {
                        elements.push({ type, match: elementText, index });
                    }

                    index += match[0].length;
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                let nextIndex = text.length;
                for (const { regex } of patterns) {
                    const nextMatch = regex.exec(text.slice(index));
                    if (nextMatch && nextMatch.index !== 0 && index + nextMatch.index < nextIndex) {
                        nextIndex = index + nextMatch.index;
                    }
                }
                const plainTextMatch = text.slice(index, nextIndex);
                if (plainTextMatch.trim()) {
                    elements.push({ type: 'plainText', match: plainTextMatch, index });
                }
                index = nextIndex;
            }
        }

        return elements;
    }

    function addMessage(sender, text, isPersonal, typing) {
        const newMessage = {
            sender,
            text,
            isPersonal,
            timestamp: getCurrentTime(isPersonal),
            parsedContent: parseText(text)
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setTyping(false);
    }

 async function sendMessage() {
    try{
        if (message.trim() === "") return;
        setTyping(true);
        addMessage("You", message, true, false);
        
        // Simulating receiving a response after 1.5 seconds

        const response=await api.post('aiMessages/',{request:message})
        addMessage("VA",response['response'] , false, true);

        setMessage("");
    }catch(error){
        if(!error.response){
            setAlert(true)
            setAlertData(
                {
                    title:'Error',
                    message:'Network Error, Check your Internet connection'
                }
            )
            console.log(error)
            return;
        }else{
            setAlert(true)
            setAlertData(
                {
                    title:'Error',
                    message:'Server Error ,Please try again later'
                }
            )
            console.log(error)
            return;
        }
    }
    }

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    function renderMessageContent(parsedContent) {
        return parsedContent.map((part, index) => {
            switch (part.type) {
                case 'plainText':
                    return <Text key={index} style={styles.messageText}>{part.match}</Text>;
                case 'link':
                    // Note: React Native doesn't support HTML. You might want to use a library like react-native-render-html for this.
                    return <Text key={index} style={styles.link}>{part.match}</Text>;
                case 'header':
                    return <Text key={index} style={styles.header}>{part.match.replace(/###([^#]+)###/, '$1')}</Text>;
                case 'subheader':
                    return <Text key={index} style={styles.subheader}>{part.match.replace(/\*\*\*([^*]+)\*\*\*/, '$1')}</Text>;
                case 'ol':
                case 'ul':
                    return (
                        <View key={index} style={styles.list}>
                            {part.subItems.map((item, i) => (
                                <Text key={i} style={styles.listItem}>
                                    {part.type === 'ol' ? `${i + 1}. ` : '• '}
                                    {item.match}
                                </Text>
                            ))}
                        </View>
                    );
                default:
                    return null;
            }
        });
    }

    const onContentSizeChange=useCallback((event)=>{
        const {height}=event.nativeEvent.contentSize
        console.log('my height',height)
        const newHeight=Math.min(Math.max(50,height),Max_Input_Height)
        if(newHeight!==inputHeight){
            setContentHeight(newHeight)
            console.log(newHeight,"  ",inputHeight)

        }
    
    },[inputHeight])

    return (
        <View style={styles.container}>
           {messages.length===0&& <View style={styles.welcome}>
                <Text style={styles.text}>
                    Hello <Text style={{fontSize:20,color:'green'}}>{userInfo.username}</Text> welcome To <Text style={{fontSize:20,color:'green'}}>Agri-bot</Text>🤖
                </Text>
                <Text style={styles.text}>
                  How can i help you ?
                </Text>


            </View>}
            <ScrollView 
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
            >
                {messages.map((msg, index) => (
                    <View key={index} style={[styles.message, msg.isPersonal && styles.messagePersonal]}>
                        <View style={styles.avatar}>
                            <Text>{msg.sender === "You" ? <Image source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrlxVIJblFKsIKiLYlBpuALK1JgYjUcr9Fkg&s'}}
                            /> : 
                        "🤖"
                            

                            }
                            </Text>
                        </View>
                        <View style={styles.messageContent}>
                            {renderMessageContent(msg.parsedContent)}
                            <Text style={styles.timestamp}>{msg.sender} • {msg.timestamp}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.messageBox}>
                <TouchableOpacity style={styles.button}>
                    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={styles.icon}>
                        <Path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                    </Svg>
                </TouchableOpacity>
                <TextInput
                    style={[styles.messageInput,{height:inputHeight}]}
                    value={message}
                    onChangeText={handleChange}
                    placeholder="Type a message..."
                    multiline={true}
                    onContentSizeChange={onContentSizeChange}

                />
                <TouchableOpacity onPress={sendMessage} style={styles.button} disabled={typing}>
                    {typing ? (
                        <Text style={styles.loadingSpinner}>...</Text>
                    ) : (
                        <Text style={styles.sendIcon}>↑</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 10,
    },
    message: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    messagePersonal: {
        flexDirection: 'row-reverse',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        marginHorizontal: 10,
    },
    messageContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        maxWidth: '70%',
    },
    messageText: {
        fontSize: 16,
    },
    timestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    subheader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
    },
    list: {
        marginLeft: 20,
    },
    listItem: {
        fontSize: 16,
        marginVertical: 2,
    },
    messageBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 0,
        borderTopColor: '#ccc',
        backgroundColor: '',
        // marginBottom:'2rem'
        
        // position:'absolute',
        // bottom:0,
        

        
    },
    messageInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        padding: 10,
        marginHorizontal: 10,
        maxHeight:Max_Input_Height
    },
    button: {
        padding: 10,
    },
    icon: {
        width: 24,
        height: 24,
    },
    sendIcon: {
        fontSize: 24,
    },
    loadingSpinner: {
        fontSize: 24,
    },
    welcome:{
        
        width:'70%',
        backgroundColor:'rgba(128,128,128,0.4)',
        position:'absolute',
        top:'30%',
        left:'15%',
        height:'8rem',
        gap:10,
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:5,
        borderRadius:4

    },
    text:{
   fontWeight:'600',
   fontSize:15
    }
});