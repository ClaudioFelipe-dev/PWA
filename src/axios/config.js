import axios from "axios";

const partyFetch = axios.create({
  baseURL: "http://localhost:3000/api-pwa",
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch