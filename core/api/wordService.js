import { $api } from "../libs/axios";

export class WordService {
  static getTranslate(word, fromLang = "en", toLang = "uk") {
    return $api.get("/get", {
      params: {
        q: word,
        langpair: `${fromLang}|${toLang}`,
      },
    });
  }
}
