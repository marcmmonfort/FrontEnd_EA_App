import axios from "axios";
import { AuthHeaderService } from "./authHeaders.service";
import { UserAuthEntity } from "../../../domain/user/user.entity";

const API_URL = "http://147.83.7.158:5432/user";

export class CRUDService {
  static async getUser(userId: string) {
    console.log(userId);
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        console.log("Hola token");
        const response = await axios.get(API_URL + "/" + userId, {
          headers: token,
        });
        return response;
      } catch (error) {
        console.error("Error during register:", error);
        throw error;
      }
    } else console.log("Token problemas");
  }
  static async editUser(user: any) {
    console.log(user.uuid);
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        console.log("Estamos en el editUser");
        //console.log(user);
        const response = await axios.put(API_URL + "/" + user.uuid, user, {
          headers: token,
        });
        //console.log("Recibimos respuesta" + response);
        return response;
      } catch (error) {
        console.error("Error editing user: ", error);
        throw error;
      }
    }
  }
  //OK
  static async getFollowers(uuid: string | undefined, numPage: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(
          API_URL + "/follower/" + uuid + "/" + numPage,
          { headers: token }
        );
        return response;
      } catch (error) {
        console.error("Error getting followers:", error);
        throw error;
      }
    }
  }

  //OK
  static async getFollowed(uuid: string | undefined, numPage: string) {
    const token = await AuthHeaderService.authHeader();
    if (token) {
      try {
        const response = await axios.get(
          API_URL + "/followed/" + uuid + "/" + numPage,
          { headers: token }
        );
        return response;
      } catch (error) {
        console.error("Error getting followed:", error);
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
