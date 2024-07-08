import React, { useState } from 'react';
import { SafeAreaView, View, Button, StyleSheet, TextInput, Text, Modal, Dimensions } from 'react-native';
import CreateHouseForm from './CreateHouseForm';

const CustomModal = ({ visible, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    // Add your logic to handle property submission here
    // For example, you can send the property data to your backend API
    // and then close the modal
    console.log('Property title:', title);
    console.log('Property description:', description);
    setModalVisible(false); // Close the modal after submission
  };

  return (
    <SafeAreaView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <Button title="Close" onPress={onClose} style={styles.closeButton} />
            <CreateHouseForm  onClose={onClose}/>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%', // Adjusted to 100% width
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: '80%', // Adjusted to 80% of the screen height
    marginTop: '20%',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    height: '100%', // Adjusted to 100% height
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 50,
  },
});

export default CustomModal;
