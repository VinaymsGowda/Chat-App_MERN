import { Box, FormControl, IconButton, Input, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Image,
  Modal,
  ModalOverlay, 
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text
} from '@chakra-ui/react'
import axios from 'axios';
import { Toast } from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import UserBadge from './UserBadge.jsx';
import UserList from './UserList.jsx';

function UpdateGroupChat({children,fetchAgain,setFetchAgain,fetchMessages}) {

    const {isOpen,onClose,onOpen}=useDisclosure();
    const {selectedChat,setSelectedChat,user}=ChatState();
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [selectedUsers,setSelectedUsers]=useState([])
    const [loading, setLoading] = useState(false);
    const toast = useToast();



    async function handleRename(){
        if(!groupChatName)
        return;

        try {
        const {data}=await axios.put("http://https://server-side-chat.onrender.com/chat/group/rename",
        {
            chatid:selectedChat._id,
            newchatname:groupChatName,
        },
        {
        headers:{
          Authorization:`Bearer ${user.token}`
        },

    })
    setSelectedChat(data)
    setFetchAgain(!fetchAgain)
    setGroupChatName('')
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSearch(query){
      console.log(query);
      
      setSearch(query)
      if(!query){
          return;
      }
      setLoading(true)

      try{
          const config={
              "headers":{
                  "Authorization":`Bearer ${user.token}`,
              },
          };

          const {data}=await axios.get(`http://https://server-side-chat.onrender.com/user/allusers?search=${search}`,config)
          setSearchData(data)
          setLoading(false)
          console.log(data);
      }
      catch(error){
          console.log(error);
          toast({
              title:"Please type something in search",
              status:"warning",
              duration:"3000",
              position:"top-left",
              isClosable:true
            })
      }


  }

async function handleAddUser(userToadd) {
  // Check if the user is already in the group
  if (selectedChat.users.find((u) => u._id === userToadd._id)) {
    toast({
      title: "User Already in group!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  // Check if the user is an admin
  if (selectedChat.groupAdmin._id !== user._id) {
    toast({
      title: "Only admins can add someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await axios.put(
      "http://https://server-side-chat.onrender.com/chat/group/add",
      {
        chatid: selectedChat._id,
        userid: userToadd._id,
      },
      config
    );
    const { data } = response;
    if (data) {
      console.log(data);

      // Update selectedChat.users to include the newly added user
      setSelectedChat((prevChat) => ({
        ...prevChat,
        users: [...prevChat.users, userToadd],
      }));
      console.log(selectedChat);
      // Update selectedUsers state to include the newly added user
      setSelectedUsers([...selectedUsers, userToadd]);
      console.log(selectedUsers);
      setFetchAgain(!fetchAgain);
    }
    setLoading(false);
  } catch (error) {
    console.log(error);
    setLoading(false);
  }
  setGroupChatName("");
}

async function handleRemove(u){
  if (selectedChat.groupAdmin._id !== user._id && u._id !== user._id) {
    toast({
      title: "Only admins can remove someone!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }

  try {

    const config={
      "headers":{
          "Authorization":`Bearer ${user.token}`,
      },
  };
    const isLeavingGroup = u._id === user._id;

    const { data } = await axios.put("http://https://server-side-chat.onrender.com/chat/group/remove", {
      chatid: selectedChat._id,
      userid: u._id,
    }, config);

    if (data) {
      setSelectedChat((prevChat) => {
        const updatedUsers = prevChat.users.filter((user) => user._id !== u._id);
        return {
          ...prevChat,
          users: updatedUsers,
        };
      });
    }

    setLoading(false);

    if (isLeavingGroup) {
      setSelectedChat(null);
    }
    
  } catch (error) {
    toast({
      title: "Error Occured!",
      description: error.response.data.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
  setGroupChatName("");
  setFetchAgain(!fetchAgain)
  fetchMessages();
}

  return (
    <>
        {children?
        <span onClick={onOpen}>{children}</span>:
        {/* <i className="fa fa-eye" aria-hidden="true" onClick={onOpen} style={{padding:"0.7rem 2rem"}}></i> */}
        }


        <Modal size="lg" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody 
          display="flex"
          justifyContent="space-between"
          flexDirection="column"
          gap={"1.3rem"}
          alignItems="center"
          >

          <Box w="100%" display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                {selectedChat.users.map((u)=>(
                    <UserBadge key={u._id} user={u} handleFunc={()=>handleRemove(u)}/>
                ))}
          </Box>

          <FormControl display={"flex"}>
            <Input type='text' placeholder='Rename Group' value={groupChatName} onChange={(event)=>setGroupChatName(event.target.value)}></Input>
            <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
              >
                Update
              </Button>
          </FormControl>
             

            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {
                        loading?(
                            <div>Loading</div>
                        ):(
                            searchData?.slice(0,4).map(searchUser=>(
                                <UserList
                                key={searchUser._id} searchUser={searchUser} handleFunc={()=>handleAddUser(searchUser)}/>
                            ))
                        )
                    }

          </ModalBody>
          <ModalFooter>
            <Button onClick={() => {handleRemove(selectedChat.groupAdmin)
              onClose()
            }} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChat