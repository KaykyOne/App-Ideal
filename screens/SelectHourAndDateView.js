import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import AntDesign from '@expo/vector-icons/AntDesign';
import LoadingIndicator from '../components/LoadingIndicator';
import { SelectHourViewModel } from '../viewmodels/SelectHourViewModel';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Modal from 'react-native-modal';

const SelectHourAndDateView = ({ route, navigation }) => {
  const { cpf, type, nameInstructor } = route.params;
  const [loading, setLoading] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [horas, setHoras] = useState([]);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [actionToConfirm, setActionToConfirm] = useState(null); // Para armazenar a ação a ser confirmada

  const selectHourViewModel = new SelectHourViewModel();

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch(
          'https://brasilapi.com.br/api/feriados/v1/2024'
        );
        const data = await response.json();
        setHolidays(data.map((holiday) => holiday.date));
      } catch {
        showError('Erro ao buscar os feriados.');
      }
    };

    fetchHolidays();
  }, []);

  useEffect(() => {
    const fetchHoursAndCurrentTime = async () => {
      setLoading(true);
      try {
        await selectHourViewModel.atualizarValores(nameInstructor, date, type);
        const { currentTime } =
          await selectHourViewModel.getCurrentTimeAndDateFromServer();
        setHoras(selectHourViewModel.horasDisponiveis);
        setCurrentTime(currentTime);
      } catch (err) {
        showError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHoursAndCurrentTime();
  }, [date]);

  const showError = (message) => {
    setError(message);
    Toast.show({
      type: 'error',
      text1: 'Erro',
      text2: message,
      position: 'top',
    });
  };

  const showConfirmationModal = (message, action) => {
    setModalMessage(message);
    setActionToConfirm(action);
    setModalVisible(true);
  };

  const isHolidayOrWeekend = (date) => {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    return (
      holidays.includes(formattedDate) || [0, 6].includes(moment(date).day())
    );
  };

  const changeDate = (days) => {
    const newDate = moment(date).add(days, 'days');
    if (newDate.isBetween(moment(), moment().add(7, 'days'))) {
      setDate(newDate.format('YYYY-MM-DD'));
    }
  };

  const handleHourClick = (hora) => {
    if (hora < currentTime && date === moment().format('YYYY-MM-DD')) {
      showError('Hora anterior à atual.');
      return;
    }

    // Exibir modal de confirmação antes de navegar
    showConfirmationModal(
      `Você tem certeza que deseja marcar para ${hora} neste dia?`,
      () => {
        navigation.navigate('ConfirmAula', {
          cpf,
          type,
          nameInstructor,
          data: date,
          hora,
        });
      }
    );
  };

  const renderHourItem = ({ item }) => {
    const isPast = item < currentTime && date === moment().format('YYYY-MM-DD');
    return (
      <TouchableOpacity
        style={[styles.button, isPast && styles.buttonDisabled]}
        onPress={() => !isPast && handleHourClick(item)}
        disabled={isPast}>
        <Text style={[styles.buttonText, isPast && styles.buttonTextDisabled]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const abrirCalendario = () => setShowPicker(true);

  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(moment(selectedDate).format('YYYY-MM-DD'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tipText}>
        Toque na data para escolher um novo dia ou use as setas!
      </Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={() => changeDate(-1)}>
          <AntDesign name="caretleft" size={60} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={abrirCalendario}
          style={styles.dateContainer}>
          <Ionicons name="calendar" size={28} color="blue" />
          <Text style={styles.dateTime}>
            {moment(date).format('DD/MM/YYYY')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeDate(1)}>
          <AntDesign name="caretright" size={60} color="black" />
        </TouchableOpacity>
      </View>

      <LoadingIndicator visible={loading} />
      {error ? (
        <Text style={styles.errorText}>Erro: {error}</Text>
      ) : (
        <ScrollView style={styles.listContainer}>
          {isHolidayOrWeekend(date) ? (
            <Text style={styles.messageText}>Dia não letivo</Text>
          ) : (
            <FlatList
              data={horas}
              renderItem={renderHourItem}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatListContentContainer}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        style={[styles.button, styles.buttonBack]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={moment(date).toDate()}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={moment().toDate()}
          maximumDate={moment().add(7, 'days').toDate()}
        />
      )}

      <View style={styles.contador}>
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'lightgray' }]} />
      </View>

      {/* Modal de confirmação */}
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                actionToConfirm(); // Executa a ação confirmada
                setModalVisible(false); // Fecha o modal
              }}>
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
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTime: {
    fontSize: 28,
    marginVertical: 20,
    color: '#333',
    margin: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: 'blue',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
    elevation: 2,
  },
  tipText: {
    color: 'green',
    fontSize: 20,
    textAlign: 'center',
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
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: '#999',
  },
  listContainer: {
    width: '100%',
  },
  flatListContentContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
  messageText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
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

export default SelectHourAndDateView;
