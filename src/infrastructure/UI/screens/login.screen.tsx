import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import Svg, { Defs, Path, Pattern, Use,Image } from "react-native-svg";
import MainContainer from "../components/containers/Main";
import Title from "../components/texts/Title";
import SubTitle from "../components/texts/Subtitle";
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import ButtonGradient from "../components/buttons/ButtonGradient";
import { AuthEntity } from "../../../domain/user/user.entity";
import { SessionService } from "../../services/user/session.service";
import Swal from 'sweetalert2';
import NormalText from "../components/texts/NormalText";
import { StatusBar, TouchableOpacity } from "react-native";
import Register from "../components/texts/Register";




export default function LoginScreen(){
    const navigation=useNavigation();

    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    return(
        <MainContainer>
      <Title>Lplan</Title>
      <SubTitle>Let's Go!</SubTitle>
      <StyledTextInputs 
        placeholder = "mail"
        value = {inputEmail}
        onChangeText = {setInputEmail}
        />         
      <StyledTextInputs 
        placeholder = 'Password' 
        value = {inputPassword} 
        onChangeText = {setInputPassword}
        secureTextEntry={true}
        />   
      <ButtonGradient onPress={() => {
        const formData: AuthEntity = {
          mailUser: inputEmail,
          passwordUser: inputPassword,
        };
        
        console.log("formData " + formData.mailUser)
        console.log("formData " + formData.passwordUser)
        SessionService.login(formData)
          .then((response) => {
            console.log(response)
            if (response.status === 200) {
              Swal.fire({
                position: 'center',
                icon: 'success',
                customClass: {
                  icon: 'swal-icon-color',
                  title: 'swal-title-font',
                  popup: 'swal-popup-width'
                },
                title: 'Login Succesful!',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1000,
                iconColor: '#000',
                background: '#66fcf1',
                backdrop: `rgba(0,0,0,0.8)`
                }).then(() => {
                  console.log(response.data);
                  SessionService.setCurrentUser(JSON.stringify(response.data.user._id), JSON.stringify(response.data.token));
                  console.log('_id' + JSON.stringify(response.data.user._id));
                  console.log('token' + JSON.stringify(response.data.token));
                  navigation.navigate('Home' as never);  
                });
              }
          })
          .catch((error) => {
            console.error("error: " + error);
            console.log("error.response: " + error.response)
            switch (error.response.status) {
              case 403:
                // Poner aquí el alert ...
                Swal.fire({
                  position: 'center',
                icon: 'error',
                customClass: {
                  icon: 'swal-icon-color',
                  title: 'swal-title-font',
                  popup: 'swal-popup-width'
                },
                title: 'Incorrect Password!',
                showConfirmButton: false,
                timerProgressBar: true,
                timer: 1000,
                iconColor: '#000',
                background: '#66fcf1',
                backdrop: `rgba(0,0,0,0.8)`
                });
                break;
              case 404:
                  // Poner aquí el alert ...
                  Swal.fire({
                    position: 'center',
                  icon: 'error',
                  customClass: {
                    icon: 'swal-icon-color',
                    title: 'swal-title-font',
                    popup: 'swal-popup-width'
                  },
                  title: 'User does not exist!',
                  showConfirmButton: false,
                  timerProgressBar: true,
                  timer: 1000,
                  iconColor: '#000',
                  background: '#66fcf1',
                  backdrop: `rgba(0,0,0,0.8)`
                }).then(() => {
                  navigation.navigate('Register' as never);  
                });
                  break;
          }
        });
      }} />
      <NormalText>Aren't you still an @lplan member?</NormalText>
      <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
        <Register>Sign Up!</Register>
      </TouchableOpacity>
      <StatusBar/> 
    </MainContainer>
    )
}