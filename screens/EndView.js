import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

const EndView = ({ navigation, route }) => {
  const {cpf } = route.params;

  const handleSecondButton = () => {
    navigation.navigate('Login');
  };

  const secondClassButton = () => {
    navigation.navigate('SelectType', {cpf});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sucesso!</Text>

      <TouchableOpacity style={styles.button} onPress={handleSecondButton}>
        <Text style={styles.buttonText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button2} onPress={secondClassButton}>
        <Text style={styles.buttonText}>Marcar Outra Aula</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    backgroundColor: 'green',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 3,
  },
  button2: {
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
});

export default EndView;
