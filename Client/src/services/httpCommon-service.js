import axios from 'axios';
import { baseURL } from '../config/setting';

console.log("base url : ", baseURL);
export const HTTP = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
      },
});