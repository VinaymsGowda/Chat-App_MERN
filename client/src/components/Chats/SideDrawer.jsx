import { Box, Button, Drawer, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, Avatar, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input,   DrawerCloseButton, useToast, Spinner } from '@chakra-ui/react';
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons" 
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import {useDisclosure} from "@chakra-ui/hooks";
import axios from "axios"
import ChatLoading from './ChatLoading';
import UserList from './UserList';
import { getSender } from '../../config/ChatLogics';
import { Badge } from '@chakra-ui/react';



function SideDrawer() {
  const [search,setSearch]=useState("")
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const {user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [loadingChat,setLoadingChat]=useState();

  

  const navigate=useNavigate()
  const Logout=()=>{
    localStorage.removeItem('userinfo');
    localStorage.removeItem('notification');
    navigate("/");
  }
  const toast=useToast();

  async function handleSearch(){
    console.log(search);
    if(!search) {
      toast({
        title:"Please type something in search",
        status:"warning",
        duration:"3000",
        position:"top-left",
        isClosable:true
      })
      return
    }
    try {
      setLoading(true)
      const {data}=await axios.get(`https://server-side-chat.onrender.com/user/allusers?search=${search}`,{
      headers:{
        Authorization:`Bearer ${user.token}`
      }
    })

    // if(chats.find(c=>c._id!==data._id))
    //   setChats({...chats,data})  //putting in mychat list

    setLoading(false)
    setSearchResult(data)
    // console.log(data);
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

  async function accessChat(user_id){
    console.log(user_id);
    try {
      setLoadingChat(true);
      
      const { data } = await axios.post(
        "https://server-side-chat.onrender.com/chat/create",
        { userid: user_id },
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        }
    );

      setSelectedChat(data)
      setLoading(false)
      onClose();
    } catch (error) {
      toast({
        title:"Error Fetchiing Chat",
        status:"warning",
        duration:"3000",
        position:"bottom-left",
        isClosable:true
      }) 
    }
  }
  return (
    <div>
        <Box
        display="flex"
        justifyContent='space-between'
        alignItems='center'
        bgColor="white"
        padding="3vh 2vw"
        >      
          <Tooltip 
              label="Search Users to Chat"
              placement='bottom-end'
              >
          <Button variant='ghost' onClick={onOpen}>
          <i className="fa fa-search" aria-hidden="true"></i>
            <p style={{padding:"1vw"}}>Search Users</p>
          </Button>
          </Tooltip>
          <Text
            fontSize="2rem"
            fontFamily='Roboto Condenseda,sans-serif'
          >
          Chat Application</Text>

          <div>
            <Menu>
              <MenuButton p='1'>
              
              <div style={{ position: 'relative', }}>
              <BellIcon fontSize='2rem' />
              {notification.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: 'red',
                    borderRadius: '50%',
                    padding: '0.1rem 0.2rem',
                    fontSize: '0.8rem',
                    color: 'white',
                  }}
                >
                  {notification.length}
                </div>
              )}
            </div>
              
              </MenuButton>
              <MenuList paddingLeft={"1rem"}>
                {!notification.length && "No new Messages"}
                {notification.map(notif=>(
                  <MenuItem key={notif._id} onClick={()=>{
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n)=>
                      n!=notif))
                  }}>
                    {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
              <Menu>
              <MenuButton>
                <Avatar size="sm" name={user.username} src={user.profile} />
                <ChevronDownIcon/> 
              </MenuButton>
              <MenuList>
              <Profile user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profile>
                <MenuDivider/>
                <MenuItem onClick={Logout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer
        placement='left'
        onClose={onClose}
        isOpen={isOpen}
        >
        <DrawerContent>
        {/* <DrawerOverlay/> */}
        <DrawerHeader color="black">Search for Users</DrawerHeader>
        <DrawerCloseButton/>
        <DrawerBody>
          <Box
            display="flex"
            padding="2"
          >
            <Input placeholder='Search by name or Email' marginRight="2" value={search} onChange={(e)=>setSearch(e.target.value)}/>
            <Button onClick={handleSearch}>Go</Button>
          </Box>

          {loading ?
            <ChatLoading/>
            :
            (
              searchResult?.map(searchUser=>(
                <UserList key={searchUser._id} searchUser={searchUser} handleFunc={()=>accessChat(searchUser._id)}/>
              ))
            )
        }
        {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        </DrawerContent>
        
        </Drawer>
      
    </div>
  )
}

export default SideDrawer