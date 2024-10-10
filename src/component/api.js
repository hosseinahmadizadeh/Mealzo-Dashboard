import axios from "axios";

const instance = axios.create({
  baseURL: "http://92.205.57.43:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
