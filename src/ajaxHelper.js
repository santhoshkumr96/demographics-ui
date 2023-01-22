import Axios from "axios";
import { SERVICE_BASE_URL } from "./config";

const ajax = Axios.create({
     withCredentials: true,
    baseURL : `${SERVICE_BASE_URL}`,
    headers:{
        'Content-Type': 'application/json',
    },
})

export default ajax;