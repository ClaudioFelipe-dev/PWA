import axios from "axios";

const partyFetch = axios.create({
  baseURL: "https://api-henna-five-66.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch