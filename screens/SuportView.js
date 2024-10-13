import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';

const SuportView = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false); // Estado para controle do modal
  const [selectedAction, setSelectedAction] = useState(null); // Ação selecionada para confirmação

  // Função acionada pelo primeiro botão
  const handleFirstButton = () => {
    navigation.navigate('Login');
  };

  const openWhatsApp = () => {
    const phoneNumber = '5517997572900';
    const url = `https://wa.me/${phoneNumber}`;
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };

  const confirmWhatsApp = () => {
    setModalVisible(false); // Fecha o modal
    openWhatsApp(); // Abre o WhatsApp
  };

  const handleWhatsAppButton = () => {
    setSelectedAction('whatsapp');
    setModalVisible(true); // Abre o modal de confirmação
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Entre em contato nesse número abaixo (Clique nele para ser redirecionado
        para conversar com o mesmo)
      </Text>

      <TouchableOpacity>
        <Text onPress={handleWhatsAppButton} style={styles.num}>
          (17) 99757-2900
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFirstButton}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      {/* Modal de confirmação */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>
            Você tem certeza que deseja abrir o WhatsApp?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmWhatsApp}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast ref={(ref) => Toast.setRef(ref)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  num: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'none',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SuportView;
