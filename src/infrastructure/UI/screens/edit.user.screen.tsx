import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import StyledTextInputs from '../components/inputs/StyledTextInputs';
import { CRUDService } from '../../services/user/CRUD.service';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SessionService } from '../../services/user/session.service';
import { UserAuthEntity } from '../../../domain/user/user.entity';
import { UserAuthValue } from '../../../domain/user/user.value';

export default function EditUserScreen() {
    const navigation= useNavigation();
    const [userData, setUserData] = useState({
        uuid: '',
        appUser: '',
        nameUser: '',
        surnameUser: '',
        mailUser: '',
        passwordUser:'',
        photoUser: '',
        birthdateUser: new Date(),
        genderUser: 'male',
        ocupationUser: '',
        descriptionUser: '',
        roleUser: 'common',
        privacyUser: false,
        deletedUser: false,
        followersUser: [],
        followedUser: [],
    });

    useFocusEffect(
        React.useCallback(() => {
          const getUser = async () => {
            const userId = await SessionService.getCurrentUser();
            //console.log("BBBBBBBBBBBB:  "+userId);
            if (userId) {
              try {
                await CRUDService.getUser(userId)
                .then((response) => {
                  //console.log("Punto 1:"+response);
                  //console.log(response?.data);
                  setUserData(response?.data);
                })
              } catch (error) {
                //console.log("Encontre el id pero no va")
              }
            }
          };
          getUser();
        }, [])
    );
    
    const handleChange = (key:any , value:any) => {
        setUserData((prevData) => ({
        ...prevData,
        [key]: value,
        }));
    };

    const handleSubmit = () => {     
        try {
        CRUDService.editUser(userData)
        .then((response) => {
            //console.log("Punto 1:"+response);
            console.log(response?.data);
            navigation.navigate('Profile' as never);
        })
        } catch (error) {
        //console.log("Encontre el id pero no va")
        }
        console.log(userData);
    };

    return (
        <View>
        <Image source={{ uri: userData.photoUser }} style={{ width: 200, height: 200,borderRadius:200/2 }} />
        <StyledTextInputs
            placeholder="Username"
            value={userData.appUser}
            editable={false}
            onChangeText={(value:string) => handleChange('appUser', value)}
        />
        <StyledTextInputs
            placeholder="Name"
            value={userData.nameUser}
            onChangeText={(value:string) => handleChange('nameUser', value)}
        />
        <StyledTextInputs
            placeholder="Surname"
            value={userData.surnameUser}
            onChangeText={(value:string) => handleChange('surnameUser', value)}
        />
        <StyledTextInputs
            placeholder="Email"
            value={userData.mailUser}
            editable={false}
            onChangeText={(value:string) => handleChange('mailUser', value)}
        />
        
        
        <StyledTextInputs
            placeholder="Description"
            value={userData.descriptionUser}
            onChangeText={(value:string) => handleChange('descriptionUser', value)}
        />
        <Button title="Save" onPress={handleSubmit} />
        </View>
    );
};

