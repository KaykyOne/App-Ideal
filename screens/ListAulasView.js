import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ListAulasViewModel } from '../viewmodels/ListAulasViewModel';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

export default function ListAulasView({ route }) {
  const { cpf } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const listAulasViewModel = new ListAulasViewModel();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);
  const [modalAction, setModalAction] = useState(null); // Para diferenciar se é excluir ou confirmar

  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 5000,
    });
  };

  const fetchAulas = async () => {
    setLoading(true);
    setError(null);

    try {
      const { currentTime, currentDate } =
        await listAulasViewModel.getCurrentTimeAndDateFromServer();
      setCurrentTime(currentTime);
      setCurrentDate(currentDate);

      const data = await listAulasViewModel.searchAulas(cpf);
      setAulas(data || []);
      if (!data) setError('Nenhuma aula encontrada.');
    } catch (error) {
      setError(error.message);
      showToast('error', 'Erro', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, [cpf]);

  const handleAction = (action, item) => {
    console.log(`Ação: ${action}, ID da Aula: ${item.aula_id}`);

    const { data, hora } = item;
    const aulaDateTime = moment(`${data} ${hora}`, 'YYYY-MM-DD HH:mm');
    const currentDateTime = moment();

    if (action === 'Excluir') {
      if (
        aulaDateTime.isAfter(currentDateTime) &&
        (data !== currentDate || aulaDateTime.diff(currentDateTime, 'hours') >= 3)
      ) {
        setSelectedAula(item);
        setModalAction('Excluir');
        setModalVisible(true);
      } else {
        showToast('error', 'Erro', 'Você só pode excluir a aula com pelo menos 3 horas de antecedência.');
      }
    } else if (action === 'Confirmar') {
      if (aulaDateTime.isBefore(currentDateTime)) {
        setSelectedAula(item);
        setModalAction('Confirmar');
        setModalVisible(true);
      } else {
        showToast('error', 'Erro', 'Você só pode confirmar aulas passadas.');
      }
    }
  };

  const confirmAction = async () => {
    if (selectedAula && selectedAula.aula_id) {
      try {
        if (modalAction === 'Excluir') {
          console.log('Aula excluída!', selectedAula);
          await listAulasViewModel.deleteAula(selectedAula.aula_id);
          showToast('success', 'Sucesso', 'Aula excluída com sucesso!');
        } else if (modalAction === 'Confirmar') {
          console.log('Aula confirmada!', selectedAula);
          await listAulasViewModel.alterAula("Concluída", selectedAula.aula_id, "Concluída", cpf);
          showToast('success', 'Sucesso', 'Aula confirmada com sucesso!');
        }

        fetchAulas();
        setModalVisible(false);
        setSelectedAula(null);
      } catch (error) {
        showToast('error', 'Erro', error.message);
      }
    } else {
      console.error('Erro: Aula ou ID da aula não selecionado corretamente.');
    }
  };

  const renderAulaItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.aula_id}</Text>
      <Text style={styles.itemTitle}>Data:</Text>
      <Text style={styles.itemText}>
        {moment(item.data).format('DD/MM/YYYY')}
      </Text>
      <Text style={styles.itemTitle}>Tipo:</Text>
      <Text style={styles.itemText}>{item.tipo}</Text>
      <Text style={styles.itemTitle}>Hora:</Text>
      <Text style={styles.itemText}>{item.hora}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleAction('Excluir', item)}>
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={() => handleAction('Confirmar', item)}>
          <Text style={styles.actionButtonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aulas</Text>
      <LoadingIndicator visible={loading} />
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro: {error}</Text>
        </View>
      ) : (
        <FlatList
          data={aulas}
          renderItem={renderAulaItem}
          keyExtractor={(item) => item.aula_id.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      )}
      <TouchableOpacity
        style={styles.buttonBack}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>
            {modalAction === 'Excluir'
              ? `Você tem certeza que deseja excluir a aula ${selectedAula?.tipo}?`
              : `Você tem certeza que deseja confirmar a aula ${selectedAula?.tipo}?`}
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={confirmAction}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 50,
    margin: 20,
    textAlign: 'center',
  },
  flatListContainer: {
    flexGrow: 1,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'green',
    width: '100%',
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonBack: {
    backgroundColor: 'gray',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});
