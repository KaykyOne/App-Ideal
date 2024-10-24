import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { ConfirmAulaViewModel } from '../viewmodels/ConfirmAulaViewModel';
import LoadingIndicator from '../components/LoadingIndicator';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';

const ConfirmAulaView = ({ route, navigation }) => {
  const { nameInstructor, data, cpf, type, hora } = route.params;
  const [date] = useState(data); // Inicializa com a data passada pelos parâmetros
  const [holidays] = useState([]);
  var [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const confirmAulaViewModel = new ConfirmAulaViewModel(); // Instância correta

  const isHoliday = (date) =>
    holidays.includes(moment(date).format('YYYY-MM-DD'));
  const isWeekend = (date) =>
    moment(date).day() === 0 || moment(date).day() === 6;

  const markedDates = holidays.reduce((acc, date) => {
    acc[date] = { disabled: true, selectedColor: 'red' };
    return acc;
  }, {});

  const addWeekends = (year, month) => {
    const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD');
      if (date.day() === 0 || date.day() === 6) {
        markedDates[date.format('YYYY-MM-DD')] = {
          disabled: true,
          selectedColor: 'red',
        };
      }
    }
  };

  const toggleModal = (message) => {
    setModalMessage(message);
    setModalVisible(!isModalVisible);
  };

  const currentYear = moment().year();
  const currentMonth = moment().month() + 1; // Mês é 0-indexado
  addWeekends(currentYear, currentMonth);

  markedDates[date] = {
    selected: true,
    selectedColor: 'blue',
    selectedTextColor: 'white',
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (isHoliday(date) || isWeekend(date)) {
        toggleModal('Data Indisponível: A data selecionada é um feriado, sábado ou domingo.');
        setLoading(false);
        return;
      }
      

      const user = await confirmAulaViewModel.getUsuarioByCpf(cpf);
      const totalClassCount = await confirmAulaViewModel.countClass(
        user.usuario_id,
        'Pendente'
      );
      const totalClassHoje = await confirmAulaViewModel.countClassHoje(
        user.usuario_id,
        date
      );

      const config = await confirmAulaViewModel.getConfig();
      const aulas = config['aulas'];
      const maximoNormalDia = config['maximoNormalDia'];           
      console.log(aulas);
      console.log(maximoNormalDia);

      const isOutraCidade = user.outra_cidade;

      // Regra: Máximo de 4 aulas no total
      if (totalClassCount >= aulas) {
        toggleModal(
          'Número máximo de 4 aulas atingido. Conclua suas aulas para poder marcar mais!'
        );
        return;
      }

      // Regra: Verificar aulas por dia
      if (isOutraCidade || type === 'D' || type === 'E') {
        // Se o aluno é de outra cidade ou categoria D/E, pode marcar até 2 aulas por dia
        if (totalClassHoje >= 2) {
          toggleModal(
            'Você já atingiu o número máximo de 2 aulas para este dia.'
          );
          return;
        }
      } else {
        // Para outros alunos, apenas 1 aula por dia é permitida
        if (totalClassHoje >= maximoNormalDia) {
          toggleModal(
            'Você já marcou uma aula para este dia. Marque em outro dia.'
          );
          return;
        }
      }

      // Se todas as condições forem atendidas, cria a aula
      const result = await confirmAulaViewModel.createClass(
        nameInstructor,
        date,
        cpf,
        type,
        hora
      );

      if (result) {
        navigation.navigate('End', { nameInstructor, data, cpf, type, hora });
      } else {
        navigation.navigate('Error', 'Não foi possivel confirmar a aula');
      }
    } catch (error) {
      
      navigation.navigate('Error', error.message);
    } finally {
      setLoading(false); // Certifique-se de que o carregamento é falso ao final
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal de mensagem */}
      <Modal isVisible={isModalVisible}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text>{modalMessage}</Text>
          <TouchableOpacity style={styles.buttonFechar} onPress={() => setModalVisible(false)}>
            <Text style={styles.txtButton}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
  
      <Text style={styles.title}>Confirme sua Aula</Text>
      <Text style={styles.detail}>
        Tipo da Aula: <Text style={styles.detailValue}>{type}</Text>
      </Text>
      <Text style={styles.detail}>
        Instrutor: <Text style={styles.detailValue}>{nameInstructor}</Text>
      </Text>
      <Text style={styles.detail}>
        Data Selecionada: <Text style={styles.detailValue}>{moment(date).format('DD/MM/YYYY')}</Text>
      </Text>
      <Text style={styles.detail}>
        Hora da Aula: <Text style={styles.detailValue}>{hora}</Text>
      </Text>
<<<<<<< HEAD
<<<<<<< HEAD
      <Text style={styles.detail}>
        Seu CPF: <Text style={styles.detailValue}>{cpf}</Text>
      </Text>
=======
>>>>>>> main

=======
  
>>>>>>> main
      <LoadingIndicator visible={loading} />
  
      <TouchableOpacity
        style={styles.button}
        onPress={loading ? null : handleConfirm}>
        <Text style={styles.buttonText}>
          {loading ? 'Processando...' : 'Finalizar'}
        </Text>
      </TouchableOpacity>
  
      <TouchableOpacity
        style={[styles.button, styles.buttonBack]}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
  
      <View style={styles.contador}>
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
        <View style={[styles.circle, { backgroundColor: 'blue' }]} />
      </View>
    </View>
  );
  
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F8F8',
  },
  txtButton: {
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  circle: {
    width: 15,
    margin: 2,
    height: 15,
    borderRadius: 50, // Metade da largura e altura para criar o círculo
    backgroundColor: 'blue',
  },
  contador: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  detail: {
    fontSize: 18,
    marginVertical: 5,
    color: '#555',
  },
  detailValue: {
    fontWeight: 'bold',
    color: '#333',
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
  buttonBack: {
    width: '80%',
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
  buttonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonFechar: {
    backgroundColor: 'red',
    borderRadius: 10,
    margin: 10,
    textAlign: 'center',
    padding: 10,
  }
});

export default ConfirmAulaView;
