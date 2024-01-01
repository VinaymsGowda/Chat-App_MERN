import React, { Children, useState } from 'react'
import {
    Button,
    Image,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useToast,
    FormControl,
    Input,
    Box
  } from '@chakra-ui/react'
  import { Toast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserList from './UserList';
import UserBadge from './UserBadge';

function GroupCreation({children,handleFunc}) {
    const toast=useToast();
    const [groupName,setGroupName]=useState()
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [search,setSearch]=useState("");
    const [searchData,setSearchData]=useState([])
    const [loading,setLoading]=useState(false);

    const {user,chats,setChats}=ChatState();

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
        setSelectedUsers([...selectedUsers,user])
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

            const {data}=await axios.get(`http://localhost:4000/user/allusers?search=${search}`,config)
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

    function handleDelete(u){
        setSelectedUsers(
        selectedUsers.filter(user=>(
            user._id!==u._id
        ))
        )
    }

    async function handleSubmit(){
         try {
            if(!groupName || !selectedUsers){
                toast({
                    title:"Please Input all fields",
                    status:"warning",
                    duration:"3000",
                    position:"top",
                    isClosable:true
                  })
                  return
            }
            const config={
                "headers":{
                    "Authorization":`Bearer ${user.token}`,
                },
            };

            const {data}=await axios.post('http://localhost:4000/chat/group/create',
            {
                name:groupName,
                users:JSON.stringify(selectedUsers.map(u=>u._id))
            },
            config
            )
            setChats(data,...chats)
            onClose();
            setGroupName("")
            setSearch("")
            setSelectedUsers([])
            setSearchData([])
            handleFunc();
            toast({
                title:"Group Created",
                status:"success",
                duration:"3000",
                position:"top",
                isClosable:true
              })
              return;

         } catch (error) {
            console.log(error);
         }
    }
            
    const { isOpen, onOpen, onClose } = useDisclosure()
            return (
              <>
                <span onClick={onOpen}>{children}</span>
          
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader d="flex" justifyContent={"center"}>Create Group Chat</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                    display={"flex"}
                    gap={"1rem"}
                    flexDir={"column"}
                    padding={"1rem"}
                    >

                    <FormControl>
                        <Input type='text' placeholder='Group-Name' value={groupName} onChange={(event)=>setGroupName(event.target.value)}></Input>
                    </FormControl>
                     
                    <FormControl>
                    <Input type='text' placeholder='Search-Users' onChange={(event)=>handleSearch(event.target.value)}></Input>
                    </FormControl>
                    <Box w="100%" display={"flex"} flexWrap={"wrap"} gap={"1rem"}>
                    {
                        selectedUsers.map((u)=>(
                        <UserBadge key={u._id} user={u} handleFunc={()=>handleDelete(u)}/>
                    ))}
                    </Box>

                    {
                        loading?(
                            <div>Loading</div>
                        ):(
                            <Box>
                            {searchData?.slice(0,4).map(searchUser=>(
                                <UserList
                                key={searchUser._id} searchUser={searchUser} handleFunc={()=>handleGroup(searchUser)}/>
                            ))}
                            </Box>
                        )
                    }


                    </ModalBody>
          
                    <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button onClick={handleSubmit} colorScheme="blue">Create Chat</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
            )
          }

export default GroupCreation