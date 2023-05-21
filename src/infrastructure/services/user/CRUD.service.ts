import axios from "axios";

const API_URL = "http://192.168.43.231:5432/";

export class CRUDService{
    static async getUser(userId: string) {
        console.log(userId);
        try {
          const response = await axios.get(API_URL + "user/"+ userId);
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
    } 
}