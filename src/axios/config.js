import axios from "axios";

const partyFetch = axios.create({
  baseURL: "https://api-dog-kappa.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default partyFetch