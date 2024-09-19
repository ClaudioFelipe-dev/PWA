import axios from "axios";

const partyFetch = axios.create({
  baseURL: "https://api-1-wjn8.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch