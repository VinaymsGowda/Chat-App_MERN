import React from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react';

function UserList({searchUser,handleFunc}) {
    
  return (
    <div>
    <Box
    onClick={handleFunc}
    cursor="pointer"
    bgColor="white"
    _hover={{
        bgColor:"skyblue",
        color:"black",
        fontWeight:"bold"
    }}
    display="flex"
    gap="1rem"
    padding=".7rem 0rem"
    width={"27rem"}
    >
    <Avatar size="sm" cursor={"pointer"} name={searchUser.username} src={searchUser.profile}
    ></Avatar>
    <Box>
        <Text fontSize="xd">{searchUser.username}</Text>
        <Text fontSize="xs">
        <span>Email : </span>
        {searchUser.email}</Text>
    </Box>
    </Box>
    </div>
  )
}

export default UserList