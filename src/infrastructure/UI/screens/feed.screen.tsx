import { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from "react-native";
import { PublicationEntity } from "../../../domain/publication/publication.entity";
import { SessionService } from "../../services/user/session.service";
import { PublicationService } from "../../services/publication/publication.service";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import React from "react";
import { CommentService } from "../../services/comment/comment.service";
import { AuthHeaderService } from "../../services/user/authHeaders.service";
import { CommentEntity } from "../../../domain/comment/comment.entity";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default function FeedScreen() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [listPublications, setListPublications] = useState<PublicationEntity[]>([]);
  const [numPagePublication, setNumPagePublication] = useState<number>(1);
  const [commentsVisibility, setCommentsVisibility] = useState<{[key: string]: boolean; }>({});
  const [pageComments, setPageComments] = useState<{ [key: string]: number }>({});
  const [commentButton, setCommentButton] = useState<{ [key: string]: string }>({});
  const [listCommentsPublication, setListCommentsPublication] = useState<{ [key: string]: CommentEntity[] }>({});
  const [showCommentForm, setShowCommentForm] = useState<{[key: string]: boolean; }>({});
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [recargar, setRecargar] = useState<string>('');


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

                const initialCommentText= response.data.reduce(
                  (acc: { [key: string]: string }, publication: PublicationEntity) => {
                    acc[publication.uuid] = "";
                    return acc;
                  },
                  {}
                );
                setCommentText(initialCommentText);
  
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
    }, [numPagePublication, recargar])
  );

  const handleLoadMore = async () => {
    console.log("Has pulsado el btn");
    setNumPagePublication((prevPage) => prevPage + 1);
    const userId = await SessionService.getCurrentUser();
    console.log("HandleLoadMore:" + numPagePublication);
    if(userId){
      PublicationService.feed((numPagePublication).toString(), userId)
      .then(response => {
        console.log(response);
        console.log(response.data);
        setListPublications(prevPublications => [...prevPublications, ...response.data]);
      }) .catch(error => {
        //navigation.navigate('NotFoundScreen');
        console.log(error);
      });
    }
  };

  const getComments = (idPublication: string) => {
    console.log("Ver comentarios");
    console.log("idPublication: " + idPublication);
    console.log(
      "commentsVisibility[PublicationId]=" + commentsVisibility[idPublication]
    );
    console.log("pageComments[PublicationId]=" + pageComments[idPublication]);
    setCommentsVisibility((prevVisibility) => {
      const updatedVisibility = {
        ...prevVisibility,
        [idPublication]: !prevVisibility[idPublication],
      };
      console.log("second " + updatedVisibility[idPublication]);

      if (updatedVisibility[idPublication]) {
        setCommentButton((prevCommentButton) => ({
          ...prevCommentButton,
          [idPublication]: (prevCommentButton[idPublication] = "Hide Comments"),
        }));
        console.log("Entro a hide");
        CommentService.getCommentsPublication(idPublication, (pageComments[idPublication]).toString())
        .then(response => {
          console.log(response);
          console.log(response.data);
          setListCommentsPublication(prevListComments => ({
            ...prevListComments,
            [idPublication]: response.data
          }));
        })
        .catch(error => {
          //navigation.navigate('NotFoundScreen' as never);
        });
      } else {
        setCommentButton((prevCommentButton) => ({
          ...prevCommentButton,
          [idPublication]: (prevCommentButton[idPublication] = "Show Comments"),
        }));
        console.log("Entro a show");
        setListCommentsPublication((prevListComments) => ({
          ...prevListComments,
          [idPublication]: [],
        }));
        setPageComments((prevPageComments) => ({
          ...prevPageComments,
          [idPublication]: (prevPageComments[idPublication] = 1),
        }));
      }
      return updatedVisibility;
    });
    console.log("Page comentarios:" + pageComments[idPublication]);
  };


  const showMoreComments = (idPublication: string) => {
    console.log("Ver más comentarios");
    setPageComments((prevPageComments) => ({
      ...prevPageComments,
      [idPublication]: prevPageComments[idPublication] + 1,
    }));
    CommentService.getCommentsPublication(
      idPublication,
      (pageComments[idPublication] + 1).toString()
    )
      .then((response) => {
        console.log(response);
        console.log(response.data);
        setListCommentsPublication((prevListComments) => ({
          ...prevListComments,
          [idPublication]: [
            ...prevListComments[idPublication],
            ...response.data,
          ],
        }));
      })
      .catch(error => {
        //navigation.navigate("");
        console.log(error)
      });
  };

  //Para escribir respuesta a publicación
  const handleToggleCommentForm = (idPublication:string) => {
    setShowCommentForm((prevShowComments) => ({
      ...prevShowComments,
      [idPublication]: !prevShowComments[idPublication],
    }));
  };

  const handleInputChange = (event:any, idPublication:string) => {
    setCommentText((prevCommentText) => ({
      ...prevCommentText,
      [idPublication]: prevCommentText[idPublication] = event.target.value,
    }));
  };

  const handleSubmit = async (event:any, idPublication:string) => {
    event.preventDefault();

    // Lógica para enviar el comentario a la publicación
    const userId = await SessionService.getCurrentUser();

    if(userId){
      const comment:CommentEntity = {
        idUserComment: userId,
        idPublicationComment: idPublication,
        textComment: commentText[idPublication],
      };

      CommentService.createComment(comment)
        .then((response) => {
          console.log(response);
          console.log(response.data);
          setRecargar("recargate");
        })
        .catch(error => {
          //navigation.navigate("");
          console.log(error);
        });
  
    }
    
    setCommentText((prevCommentText) => ({
      ...prevCommentText,
      [idPublication]: prevCommentText[idPublication] = "",
    }));
  };
  




  
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
                  source={{ uri: publication.idUser.photoUser }}
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
            <View style={styles.postComments}>
              <TouchableOpacity style={styles.showHide} onPress={() => {
                getComments(publication.uuid.toString());
                }}
                >
                <Text>
                  {commentsVisibility[publication.uuid]}{" "}
                  {commentButton[publication.uuid]}{" "}
                  {publication.commentsPublication?.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ alignItems: "center" }} onPress={() => {
                  handleToggleCommentForm(publication.uuid.toString());
                }}
                >
                <FontAwesome name="commentIcon" size={24} color="black" />
              </TouchableOpacity>
              {showCommentForm[publication.uuid] && (
                <View>
                  <TextInput
                    style={styles.inputComment}
                    value={commentText[publication.uuid]}
                    onChangeText={(event) => handleInputChange(event, publication.uuid.toString())}
                  />
                  <TouchableOpacity
                    style={styles.buttonSendComment}
                    onPress={(event) => handleSubmit(event, publication.uuid.toString())}
                  >
                    <Text style={styles.textButtonSend}>Send Comment</Text>
                  </TouchableOpacity>
                </View>
              )}  
            </View>
            {commentsVisibility[publication.uuid] && (
              <View>
                {listCommentsPublication[publication.uuid].map((comment) => (
                  <TouchableOpacity
                    key={comment.uuid}
                    //onPress={() => navigation.navigate('ProfileScreen', { userId: comment.idUserComment.uuid })}
                    style={styles.commentContainer}
                  >
                    <View style={styles.userComment}>
                      {comment.idUserComment.photoUser ? (
                        <Image
                          source={{ uri: comment.idUserComment.photoUser }}
                          style={styles.commentProfileImg}
                        />
                      ) : (
                        <Image
                          source={{ uri: "https://pbs.twimg.com/profile_images/1354463303486025733/Bn-iEeUO_400x400.jpg" }}
                          style={styles.commentProfileImg}
                        />
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>@{comment.idUserComment.appUser}</Text>
                        <Text style={styles.commentText}>{comment.textComment}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                
                {publication.commentsPublication &&
                    publication.commentsPublication.length >
                      (pageComments[publication.uuid] ?? 0) * 2 ? (
                      <TouchableOpacity
                        style={styles.showMoreCommentsButton}
                        onPress={() => {
                          showMoreComments(publication.uuid);
                        }}
                      >
                        <Text style={styles.showMoreCommentsButtonText}>Show More</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.showMoreCommentsButtonDisabled}
                        onPress={() => {
                          showMoreComments(publication.uuid);
                        }}
                        disabled
                      >
                        <Text style={styles.showMoreCommentsButtonText}>Show More </Text>
                      </TouchableOpacity>
                )}                
              </View>
            )}
          </View>
          ))}
        </View>
        <TouchableOpacity style={styles.loadMore} onPress={() => {handleLoadMore}}>
          <Text style={styles.loadMoreText}>Load More</Text>
        </TouchableOpacity>

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
    flex:1,
    flexGrow:1,
    height: 400,
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
  postComments:{
    display:'flex',
  },
  showHide:{
    marginTop: 2,
    marginBottom: 0,
    padding: 6,
    backgroundColor: "66fcf2",
    borderWidth: 0,
    width: 200,
    textAlign: "center",
    alignSelf: "center",
  },
  inputComment:{
    backgroundColor: "66fcf2",
    borderWidth: 0,
    height:50,
    width: 200,
    flex:1,
    alignContent:'center',
  },
  buttonSendComment:{

  },
  textButtonSend:{

  },
  commentContainer:{
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 0,
    marginBottom: 10,
  }, 
  userComment:{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderWidth: 0,
    height: 40,
    marginTop: 0,
    marginBottom: -20,
    marginLeft: 0,
    borderRadius: 40,
    borderColor: "#fff",
    paddingTop: 7,
    paddingBottom: 7,

  }, 
  commentProfileImg:{

  }, 
  userInfo:{


  }, 
  userName:{
    margin: 6,
    padding: 6,
    borderWidth: 0,
    color: "#66fcf1",
    fontSize: 16,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 60,
  }, 
  commentText:{
    fontSize: 14,
    marginTop: 0,
    marginBottom: 0,
    color: "#fff",
  },
  showMoreCommentsButton:{
    marginTop: 2,
    marginBottom: 0,
    padding: 6,
    backgroundColor: "66fcf2",
    borderWidth: 0,
    width: 200,
    textAlign: "center",
    alignSelf: "center",
  },
  showMoreCommentsButtonText:{
    color: "#000000",
    fontSize: 14,
  },
  showMoreCommentsButtonDisabled:{
    margin: 18,
    marginTop: 0,
    marginBottom: 46,
    padding: 6,
    backgroundColor: "#66fcf27e",
    borderWidth: 0,
    borderRadius: 20,
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    cursor: "not-allowed",
  },
  loadMore:{
    margin: 6,
    padding: 6,
    backgroundColor: "#66fcf1",
    borderRadius: 20,
    width: 100,
    textAlign: "center",
    alignSelf: "center",
    marginBottom: 60,
  }, 
  loadMoreText:{
    textAlign: 'center',
    fontSize: 14,
    color: '#000',
    marginTop: 10,
    marginBottom: 0,
  }
});
