import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView, View,TouchableOpacity } from 'react-native';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import{ AntDesign,SimpleLineIcons }from "@expo/vector-icons";
import CustomListItem from '../components/CustomListItem';
import { auth,db } from '../firebase';

const HomeScreen = ({ navigation }) => {
    const [chats,setChats]=useState([]);

    const signOutUser = () =>{
        auth.signOut().then(()=>{
            navigation.replace("Login");
        });
    };
    useEffect(()=>{
        const unsubscribe=db.collection('chats').onSnapshot((snapshot)=>
            setChats(
                snapshot.docs.map(doc=>({
                id:doc.id,
                data:doc.data(),
            }))
        )
        );
        return unsubscribe;
    },[])

    useLayoutEffect(()=>{
        
        navigation.setOptions({
            title:"Profile",
            headerStyle:{ backgroundColor:"#EAABBC"},
            headerTitleStyle:{color:"black"},
            headerTintColor:"black",
            headerLeft:()=>(
                <View 
                style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width:80,
                    marginLeft:20,
                }}>


                    <TouchableOpacity //onPress={signOutUser} 
                    activeOpacity={0.5}>
                    
                    <Avatar rounded source={{uri:auth?.currentUser?.photoURL}}size={36}/>

                    </TouchableOpacity>

                </View>
            ),
            headerRight:()=>(
                <View 
                style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width:80,
                    marginRight:30,
                    
                }}>
                    <TouchableOpacity
                    onPress={() =>navigation.navigate("AddChat")}
                     activeOpacity={0.5}>
                    <SimpleLineIcons name="pencil" size={24}color="black"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={signOutUser}activeOpacity={0.5}>
                    <SimpleLineIcons name="logout" size={26}color="black"/>
                    </TouchableOpacity>
                </View>
        ),
        });
    },[navigation]);

    const enterChat=(id,chatName)=>{
        navigation.navigate("Chat",{
            id,
            chatName,
        });
    };
 
    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                {chats.map(({id,data:{chatName} })=>(
                    <CustomListItem 
                    key={id}
                    id={id}
                    chatName={chatName}
                    enterChat={enterChat} />
                ))}
            <CustomListItem/>
            </ScrollView>
        </SafeAreaView>
    );
};

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        height:"100%",
        
    },
});

