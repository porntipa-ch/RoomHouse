import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem,Avatar } from 'react-native-elements';
import { db } from '../firebase';

const CustomListItem = ({id,chatName,enterChat}) => {
    const[chatMessages,setChatMessages]=useState([]);

    useEffect(()=>{
        const unsubscribe=db
        .collection('chats')
        .doc(id)
        .collection('messages')
        .orderBy('timestamp','desc')
        .onSnapshot((snapshot)=>
        setChatMessages(snapshot.docs.map((doc)=>doc.data()))
        );
        return unsubscribe;
    });


    return (
        <ListItem  
        key={id}
        onPress={()=>enterChat(id,chatName)} key={id} bottomDivider>
            <Avatar
            rounded
            source={{
                uri:
                "https://sv1.picz.in.th/images/2021/03/29/DVREIN.png",
            }}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight:"800",color:"black",marginTop:15,}}>
                {chatName}
                </ListItem.Title>
                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail">
                        {chatMessages?.[0]?.displayName}:{chatMessages?.[0]?.message}
                    </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
};

export default CustomListItem;

const styles = StyleSheet.create({});
