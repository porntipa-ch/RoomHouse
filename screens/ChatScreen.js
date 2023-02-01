import React, { useLayoutEffect, useState } from 'react';
import {KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { TouchableOpacity } from 'react-native';
import{AntDesign,FontAwesome,Ionicons} from "@expo/vector-icons";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Keyboard } from 'react-native';
import { auth,db } from '../firebase';
import "firebase/firestore";


const ChatScreen = ({navigation,route}) => {
    const [input,setInput]=useState("");
    const [messages,setMessages]=useState([]);
    useLayoutEffect(()=>{
        navigation.setOptions({
            title:"Chat",
            headerBackTitleVisible:false,
            headerTitleAlign:"letf",
            headerTitle:()=>(
                <View
                style={{
                    flexDirection:"row",
                    alignItems:"center",
                }}
                >
                    <Avatar rounded source={{
                        uri:"https://sv1.picz.in.th/images/2021/03/29/DVREIN.png",
                    }} />
                    <Text style={{color:"white",marginLeft:10,fontWeight:"700"}}>
                        {route.params.chatName}</Text>
                </View>
            ),
            headerLeft:()=>(
                <TouchableOpacity
                style={{marginLeft:10}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft"size={24}color="white"/>
                </TouchableOpacity>
            ),
            headerRight:()=>(
                <View
                style={{
                    flexDirection:"row",
                    justifyContent:"space-between",
                    width:80,
                    marginRight:20,
                }}
                >
                    <TouchableOpacity>
                    <FontAwesome name="video-camera" size={24}color="white"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Ionicons name="call" size={24}color="white"/>
                    </TouchableOpacity>
                </View>
            ),
        });
    },[navigation]);

    const sendMessage=()=>{
        Keyboard.dismiss();

        db.collection("chats").doc(route.params.id).collection('messages').add({
            //timestamp:firebase.firestore.FieldValue.severTimestamp(),
            message:input,
            displayName:auth.currentUser.displayName,
            email:auth.currentUser.email,
            photoURL:auth.currentUser.photoURL,
            timestamp:Date.now()
            
        });
        setInput("");
    };
    useLayoutEffect(()=>{
        const unsubscribe=db
        .collection('chats')
        .doc(route.params.id)
        .collection('messages')
        .orderBy('timestamp','asc')
        .onSnapshot((snapshot)=>setMessages(
            snapshot.docs.map(doc=>({
                id:doc.id,
                data:doc.data(),
            }))
        )
        );
        return unsubscribe;
    },[route]);
    return (
        <SafeAreaView style={{flex:1,backgroundColor:"white"}}>
            <StatusBar style="light"/>
            <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
                
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                   
                    <ScrollView style={{height:'90%'}} contentContainerStyle={{paddingTop:25}}>
                    {messages.map(({id,data})=>
                        data.email===auth.currentUser.email ? (
                            <View key={id}style={styles.reciever}>
                                <Avatar
                                position="absolute"
                                rounded
                                //web
                                containerStyle={{
                                    position:"absolute",
                                    bottom:-15,
                                    left:-5,
                                }}
                                bottom={-5}
                                left={-5}
                                rounded
                                size={30}
                                //source={{uri:data.photoURL}}
                                />
                                <Text style={styles.recieverText}>{data.message}</Text>
                            </View>
                        ):(
                            <View style={styles.sender}>
                                
                                <Avatar
                                position="absolute"
                                containerStyle={{
                                    position:"absolute",
                                    bottom:-15,
                                    left:-5,
                                }}
                                bottom={40}
                                left={-45}
                                rounded
                                size={35}
                                source={{
                                    uri:data.photoURL,
                                }}
                                />
                                <Text style={styles.senderName}>{data.displayName}</Text>
                                <Text style={styles.senderText}>{data.message}</Text>
                               
                                
                            </View>
                        )
                    )}
                    </ScrollView>
                    <View style={styles.footer}>
                    <TextInput 
                    value={input}
                    onChangeText={(text)=>setInput(text)}
                    onSubmitEditing={sendMessage}
                    placeholder="Enter Message"
                    style={styles.textInput}
                    />
                    <TouchableOpacity style={{zIndex:1}} onPress={sendMessage}activeOpacity={1}>
                    <Ionicons name="send"size={30}color="#2B68E6"/>
                    </TouchableOpacity>
                    </View>
                    
                    </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container:{
       flex:1,

    },
    reciever:{
        padding:15,
        backgroundColor:"#EAABBC",
        alignSelf:"flex-end",
        borderRadius:20,
        marginRight:15,
        marginBottom:20,
        maxWidth:"70%",
        position:"relative",
    },
    sender:{
        marginTop:5,
        padding:15,
        paddingBottom:-5,
        backgroundColor:"#E0E0E0",
        alignSelf:"flex-start",
        borderRadius:20,
        marginBottom:20,
        marginLeft:50,
        maxWidth:"70%",
        position:"relative",
    },
    senderText:{
        color:"black",
        fontWeight:"500",
        top:-20,
        left:0,
        marginLeft:5,
        
    },
    recieverText:{
        color:"white",
        fontWeight:"800",
        marginLeft:10,

    },
    senderName:{
        top:-35,
        left:-5,
        paddingRight:10,
        fontSize:15,
        color:"#808080",
    },
    footer:{
        flexDirection:"row",
        alignItems:"center",
        width:"100%",
        padding:15,

    },
    textInput:{
        bottom:0,
        height:40,
        flex:1,
        marginRight:15,
        paddingTop:15,
        borderBottomColor:"#ECECEC",
        borderWidth:1,
        padding:10,
        color:"grey",
        borderRadius:30,

    },
});