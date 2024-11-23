import axios from 'axios'

export const api=axios.create({
    baseURL:'https://ndesa.pythonanywhere.com/',
    headers:{
        'Content-Type':'application/json',
    }

})

api.interceptors.request.use(
    (config)=>{
       const token=localStorage.getItem('access')
       if(token){
           config.headers['Authorization']=`Bearer ${token}`
       }
       return config
    },
    (error)=>{
        return Promise.reject(error);
    }
)

api.interceptors.response.use(
    (response)=>{
        console.log(response.data)
        return response.data
    },
    (error)=>{
        return Promise.reject(error);
    }
)

