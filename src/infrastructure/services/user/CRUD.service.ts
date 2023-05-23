import axios from "axios";
import { AuthHeaderService } from "./authHeaders.service";


const API_URL = "http://147.83.7.158:5432/";

export class CRUDService{
    static async getUser(userId: string) {
        console.log(userId);
        const token=await AuthHeaderService.authHeader()
        if(token){
          try {
            console.log("Hola token")
            const response = await axios.get(API_URL + "user/"+ userId,{ headers:  token});
            return response;
          } catch (error) {
            console.error("Error during register:", error);
            throw error;
          }
        }else(console.log("Token problemas"))
    } 
}
/**
 * const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log("BBBBBBBBBBBB:  "+userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId)
            .then((response) => {
              console.log("Punto 1:"+response);
              console.log(response.data);
              setCurrentUser(response.data);
            })
          } catch (error) {
            console.log("Encontre el id pero no va")
          }
}
      };
 */
