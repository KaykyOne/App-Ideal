import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SelectTypeViewModel } from '../viewmodels/SelectTypeViewModel';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';

const SelectTypeView = ({ route }) => {
  const { cpf } = route.params;
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const selectTypeViewModel = new SelectTypeViewModel();
  const { height } = Dimensions.get('window');
  const fontSize = height * 0.025;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategorias = async () => {
      if (!cpf) {
        showToast('Erro', 'O CPF é necessário.');
        return;
      }

      setLoading(true);
      try {
        const categoriasData = await selectTypeViewModel.searchCategoriaPretendida(cpf);
        if (categoriasData.length > 0) {
          const categoria = categoriasData[0].categoria_pretendida;
          setCategorias(categoria.split('').map((char) => char.toUpperCase()));
        } else {
          showToast('Nenhum Resultado', 'Nenhuma categoria encontrada.');
        }
      } catch (error) {
        showToast('Erro', 'Ocorreu um erro ao buscar as categorias.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, [cpf]);

  const showToast = (title, message) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  const handleButtonClick = (value) => {
    setSelectedType(value);
    setModalVisible(true); // Abre o modal de confirmação
  };

  const confirmSelection = () => {
    setModalVisible(false); // Fecha o modal
    navigation.navigate('SelectInstructor', { cpf, type: selectedType });
  };

  const renderCategoriaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => handleButtonClick(item)}>
      <Text style={styles.buttonText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.textInStart}>
        Clique no tipo da AULA que deseja marcar!
      </Text>
      <LoadingIndicator visible={loading} />
      <FlatList
        data={categorias}
        renderItem={renderCategoriaItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContainer}
      />
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
      <View style={styles.contador}>
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
      </View>

      {/* Modal de confirmação */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>
            Você tem certeza que deseja selecionar a categoria {selectedType}?
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
  circle: {
    width: 15,
    margin: 2,
    height: 15,
    borderRadius: 50,
    backgroundColor: 'blue',
  },
  contador: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  textInStart: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: '10%',
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
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  flatListContainer: {
    alignItems: 'center',
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

export default SelectTypeView;
