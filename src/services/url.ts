import axios from "axios";

const Instance = axios.create({
  baseURL: "http://localhost:8995/",
});

export default Instance;
