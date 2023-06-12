import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";
import { ActivityEntity } from "../../../domain/activity/activity.entity";

const  API_URL = "http://147.83.7.158:5432/activity";

export class ActivityService {

  // Obtener una actividad por su ID.
  static async getActivityById(uuid: string){
    const token = await AuthHeaderService.authHeader();
    try{
        const response=await axios.get(API_URL + "activity/" + uuid,{headers:token});
        return response;
    } catch(error){
        console.error('Error obtaining an activity by its ID: '+error);
        throw error;
    }
  } 

  // Crear una actividad.
  static async createActivity(activity: ActivityEntity) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.post(API_URL + "/add", activity, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }
  
  // Obtener mis actividades.
  static async getMySchedule(uuid: string, date: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "/myweek/" + uuid + "/" + date, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }
  
  // Obtener las actividades de la gente a la que sigues. 
  static async getOtherSchedule(uuid: string, numPage:string, date: string) {
    const token = await AuthHeaderService.authHeader();
    try {
      const response = await axios.get(API_URL + "/following/" + uuid + "/" + numPage + "/" + date, { headers: token });
      console.log("try response " + response)
      return response;
    } catch (error) {
      console.error('Error during loading comments:', error);
      throw error;
    }
  }

  // Obtener las actividades de una localización.
  static async getActivitiesOfALocation(uuid: string){
    const token = await AuthHeaderService.authHeader();
    try{
        const response=await axios.get(API_URL + "activities/bylocation/" + uuid,{headers:token});
        return response;
    } catch(error){
        console.error('Error obtaining the activities of a location: '+error);
        throw error;
    }
  }  
}