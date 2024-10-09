import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { ListAulasViewModel } from '../viewmodels/ListAulasViewModel';
import { useNavigation } from '@react-navigation/native';
import LoadingIndicator from '../components/LoadingIndicator';
import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

export default function ListAulasView ({ route }) {
  const { cpf } = route.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aulas, setAulas] = useState([]);
  const [currentTime, setCurrentTime] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const listAulasViewModel = new ListAulasViewModel();
  const navigation = useNavigation();
  const [modalMessage, setModalMessage] = useState('');

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const showToast = (type, text1, text2, onPress) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      // Customizando o Toast para ter um botão
      visibilityTime: 5000,
      onPress: () => {
        if (onPress) {
          onPress();
        }
      }
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
      showToast('error', 'Erro', error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAulas();
  }, [cpf]);

  const handleAction = async (action, aulaId, item) => {
    const { data, hora } = item;
    const aulaDateTime = moment(`${data} ${hora}`, 'YYYY-MM-DD HH:mm');
    const currentDateTime = moment();
  
    if (action === 'Excluir') {
      if (
        aulaDateTime.isAfter(currentDateTime) &&
        (data !== currentDate || aulaDateTime.diff(currentDateTime, 'hours') >= 3)
      ) {
        // Exibe o Toast para confirmar a exclusão
        showToast('info', 'Confirmação', 'Tem certeza que deseja excluir esta aula?', {
          onPress: async () => {
            try {
              setLoading(true);
              await listAulasViewModel.deleteAula(aulaId);
              showToast('success', 'Sucesso', 'Aula excluída com sucesso');
              fetchAulas(); // Atualiza as aulas após a exclusão
            } catch (error) {
              showToast('error', 'Erro', error.message);
              console.error(error);
            } finally {
              setLoading(false);
            }
          }
        });
      } else {
        showToast('error', 'Erro', 'Você só pode excluir a aula com pelo menos 3 horas de antecedência.');
      }
      return;
    }
  
    try {
      setLoading(true);
  
      if (
        data < currentDate ||
        (data === currentDate && item.hora < currentTime)
      ) {
        await listAulasViewModel.alterAula(action, aulaId, action, cpf);
        showToast('success', 'Sucesso', `Aula marcada como ${action.toLowerCase()}`);
        fetchAulas(); // Atualiza a lista de aulas
      } else {
        showToast('error', 'Aviso', 'A aula não pode ser marcada como concluída ou ausente antes do horário!');
      }
    } catch (error) {
      showToast('error', 'Erro', error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const renderAulaItem = ({ item }) => (
    <View style={styles.itemContainer}>
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
            onPress={() => handleAction('Excluir', item.aula_id, item)}>
            <Text style={styles.actionButtonText}>Excluir</Text>
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
  secondaryButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeButton: {
    backgroundColor: '#4caf50',
    width: '100%',
  },
  absentButton: {
    backgroundColor: '#ff9800',
    width: '48%',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    width: '48%',
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
});
