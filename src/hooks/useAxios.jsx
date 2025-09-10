import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: `http://localhost:5000`
    // baseURL: `https://explore-bd-server-iota.vercel.app`
    baseURL: `https://explore-bd-server-iota.vercel.app`
})

const useAxios = () => {
    return axiosInstance
}

export default useAxios;