import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    FormControl,
    Input,
    useToast,
  } from '@chakra-ui/react'
import axios from 'axios'
import { ChatState } from '../../Context/ChatProvider'
import { Toast } from '@chakra-ui/react'
import UserList from './UserList'

function GroupOps({children}) {

    const toast=useToast();
const { isOpen, onOpen, onClose } = useDisclosure()
const {user,setUser,selectedChat,setSelectedChat}=ChatState()
const [search,setSearch]=useState("")
const [searchData,setSearchData]=useState([])
const [selectedUsers,setSelectedUsers]=useState();
console.log("Selected Chat",selectedChat);

    const [groupName,setGroupName]=useState("")

    function handleGroup(user){
        if(selectedUsers.includes(user)){
            toast({
                title:"User already added in Group",
                status:"warning",
                duration:"3000",
                position:"top",
                isClosable:true
              })
              return;
        }
        setSelectedUsers([...selectedUsers])
    }

    async function handleSearch(query){
        console.log(query);
        
        setSearch(query)
        if(!query){
            return;
        }
        

        try{
            const config={
                "headers":{
                    "Authorization":`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.get(`http://https://server-side-chat.onrender.com/user/allusers?search=${search}`,config)
            setSearchData(data)
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

    function handleSubmit(){
      console.log("SUbmit form");
    }
  return (

    <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay/>

    <ModalContent>
          <ModalHeader>{!selectedChat ? "Group Name" :selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDirection={"column"} gap={"14px"}>
            <FormControl>
                <Input type='text' placeholder='Change Group Name' value={groupName} onChange={(event)=>setGroupName(event.target.value)}></Input>
            </FormControl>

            <FormControl>
                <Input placeholder='Add new Users' onChange={(event)=>handleSearch(event.target.value)}></Input>
            </FormControl>
            {/* //render search data
            //show selected users */}

            {searchData?.map((data)=>{
                {/* show list of search data */}
                <UserList
                    key={data._id} data={data} handleFunc={()=>handleGroup(data)}/>
            })}


          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost' onClick={handleSubmit}>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default GroupOps