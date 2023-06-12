import axios from "axios";
import { AuthHeaderService } from "../user/authHeaders.service";
import { ActivityEntity } from "../../../domain/activity/activity.entity";

const API_URL = "http://147.83.7.158:5432/";

export class ActivityService {

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

    // CREATE ACTIVITY.
    // routeActivity.post("/activity/add",checkJwt,activityCtrl.insertActivityCtrl);//OK

    /*
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

    static async numPublicationsFollowing( uuid: string) {
    const token = await AuthHeaderService.authHeader();
    try {
        const response = await axios.get(API_URL + "/numFollowingPost/" + uuid, { headers: token });
        //console.log("try response " + response)
        return response;
    } catch (error) {
        console.error('Error during load feed:', error);
        throw error;
    }
    }

    static async updateLike( uuid: string, uuidUser:string) {
    const token = await AuthHeaderService.authHeader();
    try {
        const response = await axios.put(API_URL + "/parameter/like",{ uuid: uuid, uuidUser: uuidUser}, { headers: token });
        //console.log("try response " + response)
        return response;
    } catch (error) {
        console.error('Error during load feed:', error);
        throw error;
    }
    }

    static async deleteLike( uuid: string, uuidUser:string) {
    const token = await AuthHeaderService.authHeader();
    try {
        const response = await axios.put(API_URL + "/delete/like",{ uuid: uuid, uuidUser: uuidUser}, { headers: token });
        //console.log("try response " + response)
        return response;
    } catch (error) {
        console.error('Error during load feed:', error);
        throw error;
    }
    }
    */

}