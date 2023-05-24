import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";

//const API_URL = "http://localhost:5432/publication";
let API_URL="";
if (process.env.NODE_ENV === 'production') {
  // Cargar variables de entorno desde .env.production
  API_URL = "http://147.83.7.158:5432/publication";
} else {
  // Cargar variables de entorno desde .env.local
  API_URL = "http://localhost:5432/publication";
}


export class PublicationService {
  static async feed(numPage: string, uuid: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "/followingPost/" + numPage + "/" + uuid, { headers: token });
      //console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during load feed:', error);
      throw error;
    }
  }

}