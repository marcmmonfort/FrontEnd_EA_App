import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { PublicationEntity } from "../../../domain/publication/publication.entity";
import { SessionService } from "../../services/user/session.service";
import { PublicationService } from "../../services/publication/publication.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import NotFoundScreen from "./notFound.screen";
import ProfileScreen from "./profile.screen";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import React from "react";

export default function FeedScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [listPublications, setListPublications] = useState<PublicationEntity[]>([]);
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [commentsVisibility, setCommentsVisibility] = useState<{[key: string]: boolean; }>({});
  const [pageComments, setPageComments] = useState<{ [key: string]: number }>({});
  const [commentButton, setCommentButton] = useState<{ [key: string]: string }>({});
  const [listCommentsPublication, setListCommentsPublication] = useState<{ [key: string]: Comment[] }>({});
  useFocusEffect(
    React.useCallback(() => {
      console.log("Iniciamos feed");
      const fetchData = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            const response = await CRUDService.getUser(userId);
            console.log("Punto 1:", response);
            console.log(response?.data);
            setCurrentUser(response?.data);
  
            PublicationService.feed(numPagePublication.toString(), userId)
              .then((response) => {
                console.log(response);
                console.log(response.data);
                console.log("userId", userId);
  
                const initialVisibility = response.data.reduce(
                  (acc: { [key: string]: boolean }, publication: PublicationEntity) => {
                    acc[publication.uuid] = false;
                    return acc;
                  },
                  {}
                );
                setCommentsVisibility(initialVisibility);
  
                const initialPage = response.data.reduce(
                  (acc: { [key: string]: number }, publication: PublicationEntity) => {
                    acc[publication.uuid] = 1;
                    return acc;
                  },
                  {}
                );
                setPageComments(initialPage);
  
                const initialCommentButton = response.data.reduce(
                  (acc: { [key: string]: string }, publication: PublicationEntity) => {
                    acc[publication.uuid] = "Show comments";
                    return acc;
                  },
                  {}
                );
                setCommentButton(initialCommentButton);
  
                const initialListComments = response.data.reduce(
                  (acc: { [key: string]: Comment[] }, publication: PublicationEntity) => {
                    acc[publication.uuid] = [];
                    return acc;
                  },
                  {}
                );
                setListCommentsPublication(initialListComments);
  
                setListPublications(response.data);
              })
              .catch(error => {
                //navigation.navigate('NotFoundScreen' as never);
                console.log(error)
              });
          } catch (error) {
            console.log("Encontre el id pero no va")
          }
        }
      };
      fetchData();
    }, [numPagePublication])
  );


  
  return (
    <ScrollView>
      <View>
        <Text>Feed</Text>
        <View style={styles.feed}>
          {listPublications.map((publication) => (
          <View style={styles.post} key={publication.uuid}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfileScreen' as never)}
              style={styles.userLink}
            >
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: "https://pbs.twimg.com/profile_images/1354463303486025733/Bn-iEeUO_400x400.jpg" }}
                  style={styles.postProfileImg}
                  resizeMode="cover"
                />
                <View style={styles.postInfo}>
                  <Text style={styles.postUsernameHeader}>{publication.idUser.appUser}</Text>
                  <Text style={styles.postTimestampHeader}>{new Date(publication.createdAt).toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.postBody}>
            {publication.photoPublication.map((photo) => (
                <Image
                  key={photo}
                  source={{ uri: photo }}
                  style={styles.postImage}
                  resizeMode="cover"
                />
              ))}
            
              <Text style={styles.postText}>{publication.textPublication}</Text>
            </View>
          </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  feed: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  post: {
    height: 350,
    flexDirection: 'column',
    width: 300,
    justifyContent: 'flex-start',
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 6,
  },
  userLink: {
    alignItems: 'center',
    padding: 10,
  },
  postHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
  },
  postProfileImg: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 50,
  },
  postInfo: {
    flex: 1,
    textAlign: 'left',
  },
  postUsernameHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 6,
    marginLeft: 0,
    color: '#66fcf1',
  },
  postTimestampHeader: {
    fontSize: 12,
    color: '#000',
    marginLeft: 0,
    marginTop: 0,
  },
  postBody: {
    alignItems: 'center',
    padding: 10,
  },
  postImage: {
    alignItems: 'center',
    padding: 10,
    width: 200, 
    height: 200
  },
  postText: {
    textAlign: 'left',
    fontSize: 18,
    color: '#000',
    marginTop: 10,
    marginBottom: 0,
  },
});
