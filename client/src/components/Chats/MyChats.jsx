import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import  axios from "axios";
import { getSender } from '../../config/ChatLogics';
import ChatLoading from './ChatLoading';
import GroupCreation from './GroupCreation';

function MyChats({fetchAgain}) {
const toast=useToast();

    const {user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();

  const [loggedUser,setLoggedUser]=useState();

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem('userinfo')))
    fetchChats();
  },[fetchAgain,selectedChat])

  const fetchChats=async()=>{
    try {
        const {data}=await axios.get("https://server-side-chat.onrender.com/chat/allchats",{
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      })

      
      console.log(data);
      setChats(data)
    } catch (error) {
        toast({
            title:"Failed to Search",
            status:"warning",
            duration:"3000",
            position:"bottom-left",
            isClosable:true
          })
    }
  }
  return (
    <Box 
    display={{base:selectedChat?'none':"flex",md:"flex"}}
    flexDir='column'
    p={3}
    alignItems='center'
    w={{base:"100%",md:"31%"}}
    bgColor={"whitesmoke"}
    borderRadius="lg"
    borderWidth="1px"
    >
    <Box
    display={"flex"}
    padding="1rem 1rem"
    justifyContent="space-between"
    fontSize={{base:"28px",md:"30px"}}
    alignItems="center"
    width="100%"
    >
    My Chats
    <GroupCreation handleFunc={fetchChats}>
    <Button>New Group Chat<i className="fa fa-plus" aria-hidden="true"></i></Button>
    </GroupCreation>
    </Box>
    <Box
        display="flex"
        flexDir="column"
        p={3}
        backgroundColor="whitesmoke"
        width="100%"
        height="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY={"scroll"}>
            {chats.length > 0 ? (
              chats.map((chat) => (
                <Box
                  backgroundColor={selectedChat === chat ? "#16FAFA" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  px={3}
                  py={2}
                  borderRadius="lg"
                >
                  <Text onClick={()=>setSelectedChat(chat)} key={chat._id}>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users, chat)
                      : chat.chatName}
                  </Text>
                </Box>
              ))
            ) : (
              <Text>No chats available</Text>
            )}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyChats;