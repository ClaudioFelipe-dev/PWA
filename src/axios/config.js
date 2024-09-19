import axios from "axios";

const partyFetch = axios.create({
  baseURL: "https://api-1-wjn8.onrender.com/api-pwa",
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch