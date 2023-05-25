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

    static async searchUsers(searchQuery: string) {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          console.log("He entrado al servicio:" + searchQuery);
          const response = await axios.get(API_URL + "user/search/" + searchQuery, { headers:  token});
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
      }else(console.log("Problems with the Token"))
    }

    static async getUsers() {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.get(API_URL + "user/all/" + 1, { headers: token });
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
      }else(console.log("Problems with the Token"))
    }


    static async isFollowed(uuid:string, uuidFollowed: string) {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.get(API_URL + "user/isFollower/" + uuid + "/" + uuidFollowed, { headers: token });
          return response;
        } catch (error) {
          console.error("Error when obtaining if follower:", error);
          throw error;
        }
      }
    }

     //OK
    static async addFollowed(uuid: string, uuidFollowed: string) {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.post(API_URL + "user/followed", {uuid: uuid, uuidFollowed: uuidFollowed}, { headers: token });
          return response;
        } catch (error) {
          console.error("Error adding followed:", error);
          throw error;
        }
      }
    }

    //OK
    static async removeFollowed(uuid: string, uuidFollowed: string) {
      const token=await AuthHeaderService.authHeader()
      if(token){
        try {
          const response = await axios.put(API_URL + "user/followed/this", { uuid: uuid, uuidFollowed: uuidFollowed }, { headers: token}, );
          return response;
        } catch (error) { 
          console.error("Error removing followed:", error);
          throw error;
        }
      }
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
