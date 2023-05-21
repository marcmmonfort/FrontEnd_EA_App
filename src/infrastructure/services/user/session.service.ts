import axios from "axios";
import { AuthEntity, UserAuthEntity } from "../../../domain/user/user.entity";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://192.168.43.231:5432/";

export class SessionService{
    static async login(auth: AuthEntity) {
        try {
          const response = await axios.post(API_URL + "user/login", auth);
          return response;
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
    }

    static async register(user: UserAuthEntity) {
        console.log(user);
        try {
          const response = await axios.post(API_URL + "user/register", user);
          return response;
        } catch (error) {
          console.error("Error during register:", error);
          throw error;
        }
    }

    static async getCurrentUser() {
        try{
            const userId = await AsyncStorage.getItem("userId");
            if (userId) {
            return JSON.parse(userId);
            }
        }catch (error) {}
    }
    
    static setCurrentUser(userId: string, token: string) {
        try {
            AsyncStorage.setItem("userId", userId);
            AsyncStorage.setItem("token", token);
        }catch (error) {}
    }
    
    static logOut() {
        try {
            AsyncStorage.removeItem("userId");
            AsyncStorage.removeItem("token");
        }catch (error) {}
    }
      
}