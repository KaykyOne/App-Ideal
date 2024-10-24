import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import { HomeViewModel } from '../viewmodels/HomeViewModel';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

const HomeView = ({ route }) => {
  const { nome, cpf } = route.params;
  const { height, width } = Dimensions.get('window');
  const buttonHeight = height * 0.2;
  const fontSize = Math.max(16, Math.min(height * 0.025, 24)); // Tamanho da fonte dinâmico com limites
  const [loading, setLoading] = useState(false);
  const homeViewModel = new HomeViewModel();
  const navigation = useNavigation();
  const [modalMessage, setModalMessage] = useState('');

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

  // Função para verificar e concluir aulas pendentes ao carregar a view
  useEffect(() => {
    const verificarAulasPendentes = async () => {
      setLoading(true);
      try {
        // Chama a função que conclui as aulas pendentes
        await homeViewModel.marcarAulasConcluidas(cpf);
      } catch (error) {
        showToast('error', 'Erro', error);
      } finally {
        setLoading(false);
      }
    };

    verificarAulasPendentes();
  }, []); // Esse efeito vai rodar uma vez ao carregar a view

  const alterPage = async (page) => {
    setLoading(true);
    try {
      const test = await homeViewModel.testUser(cpf);
      console.log(test);
      if (test) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        navigation.navigate(page, { cpf });
      } else {
        toggleModal('Você está bloqueado temporariamente, vá até o atendimento!');
      }
    } catch (error) {
      showToast('error', 'Erro', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.welcomeText, { fontSize: fontSize * 1.5 }]}>
        Bem-vindo, {nome}!
      </Text>
      <TouchableOpacity
        style={[styles.fullWidthButton, { height: buttonHeight }]}
        onPress={() => alterPage('SelectType')}>
        <Text style={[styles.buttonText, { fontSize }]}>Marcar Aula</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.fullWidthButton2, { height: buttonHeight }]}
        onPress={() => alterPage('ListAulas')}>
        <Text style={[styles.buttonText2, { fontSize }]}>Aulas</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.goBack()}>
        <Text style={[styles.buttonText, { fontSize }]}>Voltar</Text>
      </TouchableOpacity>
      <LoadingIndicator visible={loading} />
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  welcomeText: {
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  fullWidthButton: {
    width: '100%',
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonBack: {
    width: '40%',
    backgroundColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  fullWidthButton2: {
    width: '100%',
    backgroundColor: '#FFC601',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonText2: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeView;
