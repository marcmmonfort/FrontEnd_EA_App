import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { PublicationEntity } from "../../../domain/publication/publication.entity";

const API_URL = "http://147.83.7.158:5432/publication/";



export class PublicationService {
  static async feed(numPage: string, uuid: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "followingPost/" + numPage + "/" + uuid, { headers: token });
      //console.log("try response " + response)
      return response;
    } catch(error){
      console.error('Error during post publication: '+error);
      throw error;
    }
  }

  static async uploadPublication(publication:PublicationEntity){
    const token = await AuthHeaderService.authHeader();
    console.log("ESTO ES EL TOKEN:  "+token)
    try{
      console.log("ando aqui");
      const response=await axios.post(API_URL, publication,{headers:token});
      console.log("RESPUESTA: "+ response.data)
      return response;
    } catch(error){
      console.error('Error during post publication: '+error);
      throw error;
    }
  }
  

}