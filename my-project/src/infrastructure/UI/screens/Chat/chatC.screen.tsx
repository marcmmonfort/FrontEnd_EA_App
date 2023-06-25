import React, {useState, useRef, useEffect, useCallback} from 'react';
//import { RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc'
import { GiftedChat } from 'react-native-gifted-chat';
import io from "socket.io-client";

import { Text, View, StyleSheet, TextInput, Button } from 'react-native';

type RouteParams ={
    params:{
        roomID?: string;
    }
    
  }

const ChatC = ({ route }:{route:RouteParams}) => {
  const peerRef = useRef<any>();
  const socketRef = useRef<any>();
  const otherUser = useRef<any>();
  const sendChannel = useRef<any>();
  const { roomID } = route.params;
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    socketRef.current = io("http://147.83.7.158:3000");
    socketRef.current.emit("join room", roomID); // Provide Room ID here

    socketRef.current.on("other user", (userID:any) => {
      callUser(userID);
      otherUser.current = userID;
    });

    socketRef.current.on("user joined", (userID:any) => {
      otherUser.current = userID;
    });

    socketRef.current.on("offer", handleOffer);
    
    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);

  }, []);

  function callUser(userID:any){
    // This will initiate the call
    console.log("[INFO] Initiated a call")
    peerRef.current = Peer(userID);
    sendChannel.current = peerRef.current.createDataChannel("sendChannel");
    
    // listen to incoming messages
    sendChannel.current.onmessage = handleReceiveMessage;
  }

  function Peer(userID:any) {
    const peer = new RTCPeerConnection({
      iceServers: [
          {
              urls: "stun:stun.stunprotocol.org"
          },
          {
              urls: 'turn:numb.viagenie.ca',
              credential: 'muazkh',
              username: 'webrtc@live.com'
          },
         ]
      });
    peer.onicecandidate = handleICECandidateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

    return peer;
  }

  function handleNegotiationNeededEvent(userID:any){
    // Make Offer
    peerRef.current.createOffer().then((offer:any) => {
       return peerRef.current.setLocalDescription(offer);
    })
    .then(() => {
      const payload = {
        target: userID,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription,
      };
      socketRef.current.emit("offer", payload);
    })
    .catch((err:any) => console.log("Error handling negotiation needed event", err));
  }

  function handleOffer(incoming:any,userID:any) {
    // Handle Offer made by the initiating peer
    console.log("[INFO] Handling Offer")
    peerRef.current = Peer(userID);
    peerRef.current.ondatachannel = (event:any) => {
      sendChannel.current = event.channel;
      sendChannel.current.onmessage = handleReceiveMessage;
      console.log('[SUCCESS] Connection established')
    }

    const desc = new RTCSessionDescription(incoming.sdp);
    peerRef.current.setRemoteDescription(desc).then(() => {
    }).then(() => {
      return peerRef.current.createAnswer();
    }).then((answer:any) => {
      return peerRef.current.setLocalDescription(answer);
    }).then(() => {
      const payload = {
        target: incoming.caller,
        caller: socketRef.current.id,
        sdp: peerRef.current.localDescription
      }
      socketRef.current.emit("answer", payload);
    })
  }

  function handleAnswer(message:any){
    // Handle answer by the remote peer
    const desc = new RTCSessionDescription(message.sdp);
    peerRef.current.setRemoteDescription(desc).catch((e:any) => console.log("Error handle answer", e));
  }

  function handleReceiveMessage(e:any){
    console.log("[INFO] Message received from peer", e.data);
    const msg = [{
      _id: Math.random().toString(),
      text: e.data,
      createdAt: new Date(),
      user: {
        _id: 2,
      },
    }];
    setMessages((previousMessages:any) => GiftedChat.append(previousMessages, msg))
    // setMessages(messages => [...messages, {yours: false, value: e.data}]);
  };

  function handleICECandidateEvent(e:any) {
    if (e.candidate) {
        const payload = {
            target: otherUser.current,
            candidate: e.candidate,
        }
        socketRef.current.emit("ice-candidate", payload);
    }
}

function handleNewICECandidateMsg(incoming:any) {
    const candidate = new RTCIceCandidate(incoming);
  
    peerRef.current.addIceCandidate(candidate)
        .catch((e:any) => console.log(e));
  }

  function sendMessage(messages = []){
    console.log(messages);
    sendChannel.current.send(messages[0].text);
    setMessages((previousMessages:any) => GiftedChat.append(previousMessages, messages))
  }
  /*function sendMessage(messages = []) {
    if (messages.length > 0) {
      console.log("Enviando mensaje");
      const { text } = messages[0];
      console.log('Texto'+text)
      if (sendChannel.current) {
        sendChannel.current.onopen = () => {
          // Channel is open, you can send data here
          sendChannel.current?.send(text);
        };
      }
      
      setMessages(
        (previousMessages:any) =>
          GiftedChat.append(previousMessages, messages) as unknown as never
      );
    }
  }*/

  return (
    <GiftedChat
      messages = {messages}
      onSend = {(messages:any) => sendMessage(messages)}
      user={{
        _id: 1,
      }}
    />
)
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    },
  
    textHeader: {
      fontFamily: "sans-serif",
      fontSize: 22,
      alignSelf: "center",
      marginTop: 20,
    }
  })
  
  export default ChatC;