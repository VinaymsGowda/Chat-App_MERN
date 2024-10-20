import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  getSenderFull,
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";
import { ChatState } from "../../Context/ChatProvider";
import { Avatar, Tooltip, Text } from "@chakra-ui/react";
import Profile from "./Profile";

function ScrollableChat({ messages }) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex", marginBottom: "10px" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.username}
                placement="bottom-start"
                hasArrow
              >
                <Profile user={m.sender}>
                  <Avatar
                    marginTop="7px"
                    marginRight="1"
                    size={"sm"}
                    cursor={"pointer"}
                    name={m.sender.username}
                    src={m.sender.profile}
                  />
                </Profile>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "10px 15px",
                maxWidth: "75%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Text fontWeight="bold" fontSize="sm" color="gray.600">
                {m.sender.username}
              </Text>
              <Text>{m.content}</Text>
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default ScrollableChat;
