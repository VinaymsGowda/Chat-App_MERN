import { CloseIcon } from "@chakra-ui/icons";
import { Badge, Box, Flex, Text, Image } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../Context/ChatProvider";

function UserBadge({ user, handleFunc, groupAdmin }) {
  const { user: currentUser } = ChatState();
  const isAdmin = user._id === groupAdmin;
  const isCurrentUser = user._id === currentUser._id;

  return (
    <Badge
      px={3}
      py={2}
      m={1}
      mb={2}
      variant="solid"
      cursor="pointer"
      color={isAdmin ? "black" : isCurrentUser ? "white" : "white"}
      backgroundColor={
        isAdmin ? "#FFD700" : isCurrentUser ? "#FF5733" : "#19DBAA"
      }
      display="flex"
      alignItems="center"
      columnGap="12px"
      borderRadius="md"
      boxShadow="md"
      onClick={handleFunc}
    >
      <Image
        src={user.profile}
        alt={`${user.username}'s profile`}
        borderRadius="full"
        boxSize="30px"
        objectFit="cover"
      />
      <Text
        fontWeight={isAdmin ? "bold" : isCurrentUser ? "extrabold" : "normal"}
        textTransform="capitalize"
      >
        {isCurrentUser ? "You" : user.username}
      </Text>
      {isAdmin && (
        <Box
          as="span"
          ml={1}
          fontSize="0.8em"
          color="black"
          backgroundColor="#FFD700"
          borderRadius="full"
          px={2}
        >
          Admin
        </Box>
      )}
      <CloseIcon />
    </Badge>
  );
}

export default UserBadge;
