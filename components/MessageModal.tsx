import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

interface MessageModalProps {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onReply: () => void;
  onCopy: () => void;
  onDelete: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({
  visible,
  onClose,
  onEdit,
  onReply,
  onCopy,
  onDelete,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.modalButton} onPress={onEdit}>
            <Icon name="pencil" size={24} color="#7289da" style={styles.icon} />
            <Text style={styles.modalButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onReply}>
            <Icon name="reply" size={24} color="#7289da" style={styles.icon} />
            <Text style={styles.modalButtonText}>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onCopy}>
            <Icon
              name="content-copy"
              size={24}
              color="#7289da"
              style={styles.icon}
            />
            <Text style={styles.modalButtonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onDelete}>
            <Icon name="delete" size={24} color="#f04747" style={styles.icon} />
            <Text style={{ ...styles.modalButtonText, color: "#f04747" }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#36393f",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    width: "100%",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: "100%",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});

export default MessageModal;
