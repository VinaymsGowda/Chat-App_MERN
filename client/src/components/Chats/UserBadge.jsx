import { CloseIcon } from '@chakra-ui/icons'
import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import React from 'react'

function UserBadge({user,handleFunc}) {
  return (
    <Badge
    px={3}
    py={2}
    m={1}
    mb={2}
    variant="solid"
    cursor="pointer"
    color={"white"}
    backgroundColor={"#19DBAA"}
    display={"flex"}
    justifyContent={"center"}
    alignContent={"center"}
    columnGap={"12px"}
    onClick={handleFunc}
    >
    {user.username}
    <CloseIcon/>
    </Badge>
  )
}

export default UserBadge