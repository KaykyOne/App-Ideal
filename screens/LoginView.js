import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { LoginViewModel } from '../viewmodels/LoginViewModel';

export default function LoginView({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const loginViewModel = new LoginViewModel();

  useEffect(() => {
    setTimer(0);
    setIsRunning(false);
  }, []);

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
    });
  };

  const login = async () => {
    if (!cpf) {
      showToast('error', 'Erro', 'Por favor, insira o CPF.');
      return;
    }

    setLoading(true);
    try {
      const nome = await loginViewModel.searchUsersByCPF(cpf);
      if (!nome) {
        toggleModal('Nenhum usuário encontrado com esse CPF.');
      } else {
        navigation.navigate('Home', { nome, cpf });
        setCpf('');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 500000);
      }
    } catch (error) {
      showToast('error', 'Erro', 'Ocorreu um erro ao tentar fazer login.');
      console.error(error);
      setCpf('');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setIsRunning(true);
  };

  const goSuport = () => {
    navigation.navigate('Suport');
  };

  const onTimerEnd = () => {
    setCpf('');
  };

  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      onTimerEnd();
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const handleCpfChange = (text) => {
    setCpf(text);
    if (!isRunning) {
      startTimer();
    } else {
      setTimer(60);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../components/logoAutoEscolaIdeal.png')}
      />
      <TextInput
        placeholder="Digite seu CPF"
        value={cpf}
        onChangeText={handleCpfChange}
        style={styles.textInput}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={login}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.textLink} onPress={goSuport}>Não consegue Entrar? Clique aqui!!</Text>
      </TouchableOpacity>

      {/* Modal para exibir mensagens de erro */}
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Componente de toast */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  image: {
    height: 128,
    width: 250,
    margin: 20,
  },
  textInput: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '80%',
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textLink: {
    marginTop: 20,
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalButton: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
