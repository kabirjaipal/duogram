import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";
import { formatTimestamp, getFileType, isAttachment } from "@/lib/functions";
import { Message } from "@/types";
import { ResizeMode, Video } from "expo-video";
import React, { memo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MessageItem: React.FC<{
  item: Message;
  replyToMessage: Message;
  onReplyPress: (messageId: string) => void;
}> = memo(({ item, replyToMessage, onReplyPress }) => {
  const { user, partner } = useGlobalContext();
  const { theme } = useThemeContext();
  const isCurrentUser = item.senderId === user?.$id;
  const sender = isCurrentUser ? user : partner;
  const replySender = replyToMessage?.senderId === user?.$id ? user : partner;

  const fileType = getFileType(item.contentType);

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserMessage : styles.partnerMessage,
      ]}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: sender?.avatar }} style={styles.avatar} />
      </View>
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text
            style={{ ...styles.messageSender, color: theme.secondaryColor }}
          >
            {sender?.username}
          </Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
        {replyToMessage && (
          <TouchableOpacity
            style={{
              ...styles.replyContainer,
              borderLeftColor: theme.secondaryColor,
            }}
            onPress={() => onReplyPress(replyToMessage.$id)}
          >
            <View style={styles.replyHeader}>
              <Image
                source={{ uri: replySender?.avatar }}
                style={styles.replyAvatar}
              />
              <Text style={{ ...styles.replySender, color: theme.textColor }}>
                {replySender?.username}
              </Text>
              <Text style={styles.timestamp}>
                {formatTimestamp(replyToMessage.timestamp)}
              </Text>
            </View>
            <Text style={{ ...styles.replyText, color: theme.textColor }}>
              {isAttachment(getFileType(replyToMessage.content))
                ? "📷 Attachment"
                : replyToMessage.content}
            </Text>
          </TouchableOpacity>
        )}
        {fileType === "GIF" || fileType === "Image" ? (
          <Image source={{ uri: item.content }} style={styles.gifImage} />
        ) : fileType === "Video" ? (
          <Video
            source={{ uri: item.content }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.COVER}
          />
        ) : (
          <Text style={{ ...styles.messageText, color: theme.textColor }}>
            {item.content}
          </Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  currentUserMessage: {
    justifyContent: "flex-end",
  },
  partnerMessage: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 8,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  messageSender: {
    fontWeight: "bold",
    marginRight: 4,
  },
  messageText: {
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    color: "#72767d",
  },
  gifImage: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  video: {
    width: "100%",
    height: 200,
  },
  replyContainer: {
    borderLeftWidth: 2,
    marginBottom: 4,
    paddingLeft: 8,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  replyAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 4,
  },
  replySender: {
    fontWeight: "bold",
    marginRight: 4,
  },
  replyText: {
    fontStyle: "italic",
  },
});

export default MessageItem;
