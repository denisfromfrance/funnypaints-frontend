import axios from "axios";
import { ADMIN_ACCESS_TOKEN, ADMIN_REFRESH_TOKEN, API_BASE_URL, USER_ACCESS_TOKEN, USER_REFRESH_TOKEN } from "../state/Constants";
import { jwtDecode } from "jwt-decode";

export const api = axios.create({baseURL: API_BASE_URL});
api.interceptors.request.use(config => {
    let accessToken = null;

    config.withCredentials = true;

    try{
        accessToken = localStorage.getItem(USER_ACCESS_TOKEN);
        if(accessToken != null){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }catch(e){
        console.log("Failed to get access token for user.")
    }

    if (accessToken == null){
        accessToken = localStorage.getItem(ADMIN_ACCESS_TOKEN);
    }

    if (accessToken != null){
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
    
}, (error) => Promise.reject(error));


export async function SignIn(props: any){
    const response = await api.post("/api/v1/auth/sign-in", {email: props.email, password: props.password})
    return response;
}


export async function SinUp(props: any){
    const response = await api.post("/api/v1/auth/sign-in", 
    {
        firstName: props.firstName, 
        lastName: props.firstName, 
        email: props.firstName, 
        password: props.firstName, 
        confirmationPassword: props.confirmationPassword
    });
    return response;
}


export async function POST(endpoint: string, data: any, onSuccess?: CallableFunction, onError?: CallableFunction){
    const response = await api.post(endpoint, data);
    if (response.status === 200){
        if (onSuccess){
            onSuccess(response);
        }
    }else{
        if (onError){
            onError(response)
        }
    }
}


export async function POSTMedia(endpoint: string, data: any, onSuccess?: CallableFunction, onError?: CallableFunction){
    const response = await api.post(endpoint, data, {headers: {"Content-Type": "multipart/form-data"}});
    if (response.status === 200){
        if (onSuccess){
            onSuccess(response);
        }
    }else{
        if (onError){
            onError(response)
        }
    }
}


export async function GET(endpoint: string, onSuccess?: CallableFunction, onError?: CallableFunction){
    const response = await api.get(endpoint);
    if (response.status === 200){
        if (onSuccess){
            onSuccess(response);
        }
    }else{
        if (onError){
            onError(response)
        }
    }
}



export async function setAdminTokens(access: string, refresh: string){
    localStorage.setItem(ADMIN_ACCESS_TOKEN, access);
    localStorage.setItem(ADMIN_REFRESH_TOKEN, refresh);
}

export async function setUserTokens(access: string, refresh: string){
    localStorage.setItem(USER_ACCESS_TOKEN, access);
    localStorage.setItem(USER_REFRESH_TOKEN, refresh);
}


export function validateAdminAuthState(){
    const accessToken = localStorage.getItem(ADMIN_ACCESS_TOKEN);
    if (accessToken){
        const decodedData = jwtDecode(accessToken);
        const now = Date.now() / 1000;
        if (decodedData.exp){
            if (decodedData?.exp > now){
                return true;
            }else{
                return false;
            }
        }
    }
    return false;
}

export function validateUserAuthState(){
    const accessToken = localStorage.getItem(USER_ACCESS_TOKEN);
    if (accessToken){
        const decodedData = jwtDecode(accessToken);
        const now = Date.now() / 1000;
        if (decodedData.exp){
            if (decodedData?.exp > now){
                return true;
            }else{
                return false;
            }
        }
    }
    return false;
}


const entryCallbackMap = new Map();

const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
        const callback = entryCallbackMap.get(entry.target);
        if(callback){
            callback(entry.target);
        }
    }
  });
});

export const observeElement = (element: Element, callback: CallableFunction) => {
    entryCallbackMap.set(element, callback);
    intersectionObserver.observe(element);
}

export const unobserveElement = (element: Element) => {
    if (!element) return;
    intersectionObserver.unobserve(element);
    entryCallbackMap.delete(element);
}