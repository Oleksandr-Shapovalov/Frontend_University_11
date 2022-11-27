import axios from "axios";

export const $api = axios.create({
  baseURL: "https://translated-mymemory---translation-memory.p.rapidapi.com/api",
  headers: {
    "X-RapidAPI-Key": "60d11bdc2amsha5328666cf21b6ap1ba2fbjsn13198ae2b9a6",
    "X-RapidAPI-Host": "translated-mymemory---translation-memory.p.rapidapi.com",
  },
});
