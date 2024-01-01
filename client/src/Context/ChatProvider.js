import React, { useContext, useEffect, useState,createContext } from 'react'
import { useNavigate } from 'react-router-dom';

const ChatContext=createContext();
export function ChatProvider({children}) {
    const navigate=useNavigate();
    const [user,setUser]=useState();
    const [selectedChat,setSelectedChat]=useState()
    const [chats,setChats]=useState([]);
    const [notification,setNotification]=useState([])
    
    useEffect(()=>{
        const userinfo=JSON.parse(localStorage.getItem('userinfo'))
        setUser(userinfo)
        if(!userinfo){
            navigate("/")
        }
    },[navigate])
  return (
    <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
        {children}
    </ChatContext.Provider>
  )
}

function ChatState(){
    return useContext(ChatContext);
}

export {ChatState};