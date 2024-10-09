import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SelectInstructorViewModel } from '../viewmodels/SelectInstructorViewModel';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';

const SelectInstructorView = ({ route }) => {
  const { cpf, type } = route.params;
  const [instrutores, setInstrutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  
  const selectInstructorViewModel = new SelectInstructorViewModel();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchInstructors = async () => {
      if (!type) {
        showToast('Erro', 'O Tipo é necessário.');
        return;
      }

      setLoading(true);
      try {
        const instructorsData =
          await selectInstructorViewModel.searchInstructoresForCategory(
            cpf,
            type
          );
        setInstrutores(
          instructorsData.map((instructor) => instructor.nome_instrutor)
        );
      } catch (error) {
        showToast('Erro', 'Ocorreu um erro ao buscar os instrutores.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, [type]);

  const showToast = (title, message) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  const handleButtonClick = (value) => {
    setSelectedInstructor(value);
    setModalVisible(true); // Exibe o modal de confirmação
  };

  const confirmSelection = () => {
    setModalVisible(false); // Fecha o modal
    navigation.navigate('SelectHourAndDate', {
      cpf,
      type,
      nameInstructor: selectedInstructor,
    });
  };

  const renderInstrutorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleButtonClick(item)}>
      <Text style={styles.buttonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LoadingIndicator visible={loading} />
      <Text style={styles.textInStart}>
        Clique no instrutor que deseja marcar a aula!
      </Text>
      <FlatList
        data={instrutores}
        renderItem={renderInstrutorItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.flatListContainer}
        style={styles.list}
      />
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.contador}>
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
      </View>

      {/* Modal de confirmação */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>
            Você tem certeza que deseja selecionar {selectedInstructor}?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmSelection}>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  textInStart: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: '10%',
  },
  circle: {
    width: 15,
    margin: 2,
    height: 15,
    borderRadius: 50,
    backgroundColor: '#6200ea',
  },
  contador: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  list: {
    width: '100%',
    marginTop: 40,
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
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  flatListContainer: {
    flexGrow: 1,
    width: '100%',
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

export default SelectInstructorView;
