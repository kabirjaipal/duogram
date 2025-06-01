import EmptyBanner from "@/components/EmptyBanner";
import GifPicker from "@/components/GifPicker";
import Loading from "@/components/Loading";
import MessageItem from "@/components/MessageItem";
import MessageModal from "@/components/MessageModal";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useThemeContext } from "@/context/ThemeContext";
import client, { config, databases, storage } from "@/lib/appwrite";
import {
  debounce,
  deleteOldMessages,
  getFileType,
  isAttachment,
} from "@/lib/functions";
import { Message } from "@/types";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Clipboard,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ID, Query } from "react-native-appwrite";
import EmojiPicker from "rn-emoji-picker";
import { emojis } from "rn-emoji-picker/dist/data";
import { Emoji } from "rn-emoji-picker/dist/interfaces";

const Chat: React.FC = () => {
  const flatListRef = useRef<FlatList>(null);
  const { user, partner } = useGlobalContext();
  const { theme } = useThemeContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastMessageId, setLastMessageId] = useState<string | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [gifPickerOpen, setGifPickerOpen] = useState(false);  const [recentEmoji, setRecentEmoji] = useState<Emoji[]>([]);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0); // Track cursor position

  const handleLongPress = (message: Message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const handleReplyPress = (messageId: string) => {
    const index = messages.findIndex((message) => message.$id === messageId);
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const handleEdit = () => {
    if (selectedMessage) {
      setInputText(selectedMessage.content);
      setIsEditing(true);
    }
    setModalVisible(false);
  };

  const handleReply = () => {
    if (selectedMessage) {
      setReplyToMessage(selectedMessage);
    }
    setModalVisible(false);
  };

  const handleCopy = () => {
    if (selectedMessage) {
      Clipboard.setString(selectedMessage.content);
    }
    setModalVisible(false);
  };

  const handleDelete = async () => {
    if (selectedMessage) {
      try {
        // delete file from bucket if message type is file
        if (isAttachment(getFileType(selectedMessage.contentType))) {
          const fileId = selectedMessage.content.match(/files\/([^/]+)\//)?.[1];
          await storage.deleteFile(config.messagesMediaBucketId, fileId!);
        }

        await databases.deleteDocument(
          config.databaseId,
          config.messagesCollectionId,
          selectedMessage.$id
        );
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.$id !== selectedMessage.$id)
        );
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
    setModalVisible(false);
  };

  const fetchMessages = useCallback(
    async (limit: number, startAfter?: string) => {
      try {
        const filters = [
          Query.equal("relationshipId", user?.relationshipId!),
          Query.orderDesc("$createdAt"),
          Query.limit(limit),
        ];
        if (startAfter) {
          filters.push(Query.cursorAfter(startAfter));
        }
        const response = await databases.listDocuments(
          config.databaseId,
          config.messagesCollectionId,
          filters
        );
        setMessages((prevMessages) => {
          const existingIds = new Set(prevMessages.map((msg) => msg.$id));
          const newMessages = response.documents
            .filter((doc) => !existingIds.has(doc.$id))
            .map((doc) => doc as unknown as Message);
          return [...prevMessages, ...newMessages];
        });
        setLoadingMessages(false);
        setLoadingMore(false);
        if (response.documents.length > 0) {
          setLastMessageId(
            response.documents[response.documents.length - 1].$id
          );
          setHasMoreMessages(response.documents.length === limit);
        } else {
          setHasMoreMessages(false);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setLoadingMessages(false);
        setLoadingMore(false);
      }
    },
    [user]
  );

  const debouncedFetchMessages = useCallback(debounce(fetchMessages, 300), [
    fetchMessages,
  ]);
  useEffect(() => {
    // Notification functionality has been removed

    setLoadingMessages(true);
    deleteOldMessages(user?.relationshipId!);
    debouncedFetchMessages(10);

    const unsubscribe = client.subscribe(
      `databases.${config.databaseId}.collections.${config.messagesCollectionId}.documents`,
      (response) => {
        const { events, payload } = response;
        const message = payload as Message;        if (events.some((event) => event.includes(".create"))) {
          setMessages((prevMessages: Message[]) => [message, ...prevMessages]);
        } else if (events.some((event) => event.includes(".delete"))) {
          setMessages((prevMessages: Message[]) =>
            prevMessages.filter((msg) => msg.$id !== message.$id)
          );
        } else if (events.some((event) => event.includes(".update"))) {
          setMessages((prevMessages: Message[]) =>
            prevMessages.map((msg) => (msg.$id === message.$id ? message : msg))
          );
        }
      }
    );
  }, [debouncedFetchMessages]);

  const loadMoreMessages = useCallback(() => {
    if (!loadingMore && lastMessageId && hasMoreMessages) {
      setLoadingMore(true);
      fetchMessages(10, lastMessageId);
    }
  }, [fetchMessages, lastMessageId, loadingMore, hasMoreMessages]);

  const sendMessage = async (text?: string, contentType?: string) => {
    const messageContent = text || inputText.trim();

    if (messageContent) {
      if (isEditing && selectedMessage) {
        try {
          await databases.updateDocument(
            config.databaseId,
            config.messagesCollectionId,
            selectedMessage.$id,
            { content: inputText }
          );
          setMessages((prevMessages) =>
            prevMessages.map((msg) =>
              msg.$id === selectedMessage.$id
                ? { ...msg, content: inputText }
                : msg
            )
          );
          setIsEditing(false);
          setSelectedMessage(null);
        } catch (error) {
          console.error("Error updating message:", error);
        }
      } else {
        const newMessage = {
          content: messageContent,
          senderId: user?.$id,
          timestamp: new Date().toISOString(),
          relationshipId: user?.relationshipId,
          replyTo: replyToMessage ? replyToMessage.$id : null, // Add replyTo field
          contentType: contentType || "text", // Add contentType field
        };
        try {
          await databases.createDocument(
            config.databaseId,
            config.messagesCollectionId,
            ID.unique(),
            newMessage
          );
        } catch (error) {
          console.error("Error sending message:", error);
        }
      }
      setInputText("");
      setReplyToMessage(null);
    }
  };

  const handleEmojiSelect = useCallback(
    (emoji: Emoji) => {
      const newText =
        inputText.slice(0, cursorPosition) +
        emoji.emoji +
        inputText.slice(cursorPosition);
      setInputText(newText);
      setCursorPosition(cursorPosition + emoji.emoji.length); // Update cursor position
    },
    [cursorPosition, inputText]
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Message> | null | undefined, index: number) => ({
      length: 80,
      offset: 80 * index,
      index,
    }),
    []
  );

  async function SendMedia(result: ImagePicker.ImagePickerResult) {
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      if (asset.uri) {
        // Convert URI to a local file path
        const fileUri = asset.uri;
        const file = {
          uri: fileUri,
          type: asset.mimeType || "image/jpeg",
          name: asset.fileName || `image-${Date.now()}.jpg`,
          size: asset.fileSize || 0,
        };

        try {
          // Use Appwrite SDK to upload the file
          const uploadResponse = await storage.createFile(
            config.messagesMediaBucketId, // Your bucket ID
            ID.unique(), // Generate a unique ID for the file
            file // The file object
          );

          const fileUrl = `${config.endpoint}/storage/buckets/${config.messagesMediaBucketId}/files/${uploadResponse.$id}/view?project=${config.projectId}`;
          `?project=6678559c0032fe735040&project=6678559c0032fe735040&mode=admin`;

          const FileType = file.type;

          // Send the file URL as a message
          sendMessage(fileUrl, FileType);
          return result;
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }
    }
  }

  const openImagePicker = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Gallery",
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              legacy: true,
            });

            await SendMedia(result);
          },
        },
        {
          text: "Camera",
          onPress: async () => {
            const cameraStatus =
              await ImagePicker.requestCameraPermissionsAsync();
            if (cameraStatus.status !== "granted") {
              alert("Sorry, we need camera permissions to make this work!");
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              quality: 1,
              cameraType: ImagePicker.CameraType.front,
            });

            await SendMedia(result);
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  }, [sendMessage]);

  if (loadingMessages) {
    return <Loading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ height: 32, backgroundColor: '#36393f' }} />
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        {messages.length === 0 && (
          <EmptyBanner user={user} partner={partner} theme={theme} />
        )}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={({ item }) => (
            <TouchableOpacity onLongPress={() => handleLongPress(item)}>
              <MessageItem
                item={item}
                onReplyPress={handleReplyPress}
                replyToMessage={
                  messages.find((msg) => msg.$id === item.replyTo)!
                }
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.$id}
          style={styles.messagesList}
          inverted
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            loadingMore && hasMoreMessages ? <Loading /> : null
          }
          getItemLayout={getItemLayout}
        />
        {replyToMessage && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyLabel}>Replying to:</Text>
            <Text style={styles.replyText}>
              {isAttachment(getFileType(replyToMessage.contentType))
                ? "📷 Attachment"
                : replyToMessage.content}
            </Text>
            <TouchableOpacity onPress={() => setReplyToMessage(null)}>
              <Text style={styles.cancelReply}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={openImagePicker}
            style={styles.mediaButton}
          >
            <Ionicons name="image" size={18} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message"
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#dcddde"
            multiline={false}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
            onSelectionChange={(event) =>
              setCursorPosition(event.nativeEvent.selection.start)
            }
          />
          <TouchableOpacity
            onPress={() => setEmojiPickerOpen((prev) => !prev)}
            style={styles.sendButton}
          >
            <Entypo name="emoji-happy" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGifPickerOpen((prev) => !prev)}
            style={styles.sendButton}
          >
            <MaterialIcons name="gif" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => sendMessage()}
            style={styles.sendButton}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <MessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onEdit={handleEdit}
        onReply={handleReply}
        onCopy={handleCopy}
        onDelete={handleDelete}
      />
      {gifPickerOpen && (
        <GifPicker
          onGifSelect={(gifUrl) => {
            setGifPickerOpen(false);
            sendMessage(gifUrl, "gif");
          }}
          onClose={() => setGifPickerOpen(false)}
        />
      )}
      {emojiPickerOpen && (
        <EmojiPicker
          emojis={emojis}
          recent={recentEmoji}
          autoFocus={false}
          loading={false}
          darkMode={true}
          perLine={7}
          onSelect={handleEmojiSelect}
          onChangeRecent={setRecentEmoji}
          backgroundColor="#36393f"
          key={recentEmoji.length}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#36393f", // Dark background
  },
  messagesList: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#2f3136", // Darker border
    backgroundColor: "#2f3136", // Dark background for input area
  },
  mediaButton: {
    padding: 10,
    borderRadius: 20, // Rounded button
    backgroundColor: "#5865f2", // Discord blue
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#dcddde", // Light text color
    backgroundColor: "#40444b", // Slightly lighter background for input
    borderRadius: 20, // Rounded input area
  },
  sendButton: {
    padding: 10,
    borderRadius: 20, // Rounded button
    backgroundColor: "#5865f2", // Discord blue
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  replyContainer: {
    backgroundColor: "#40444b",
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#5865f2", // Discord blue
    marginBottom: 10,
    borderRadius: 8, // Rounded corners
  },
  replyLabel: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#dcddde", // Light text color
  },
  replyText: {
    fontStyle: "italic",
    color: "#dcddde", // Light text color
  },
  cancelReply: {
    color: "#f04747", // Error color
    marginTop: 5,
  },
});

export default Chat;
