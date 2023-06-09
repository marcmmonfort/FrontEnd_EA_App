import { ActivityEntity } from './../../../../../Backend_H_EA/src/domain/activity/activity.entity';
import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";


const  API_URL = "http://147.83.7.158:5432/activity";

export class ActivityService {
  
  
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
  
    //OBTENER LAS ACTIVITIES DE LA GENTE QUE SIGUES
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
  
}

