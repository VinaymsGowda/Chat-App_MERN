import { Box, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import  {ChatState}  from '../Context/ChatProvider.js';
import SideDrawer from '../components/Chats/SideDrawer.jsx';
import ChatBox from '../components/Chats/ChatBox.jsx';
import MyChats from '../components/Chats/MyChats.jsx';


const Chatpage = () => {

  const {user,setUser,selectedChat,setSelectedChat,chats,setChats}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false)
  return (
    <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    
    <Box
      display="flex"
      justifyContent='space-between'
      width='100%'
      height='88vh'
      padding='10px'
    >
      {user && <MyChats fetchAgain={fetchAgain}/>}{user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
  )
}

export default Chatpage