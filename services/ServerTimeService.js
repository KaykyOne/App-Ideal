import { supabase } from '../services/supabaseService';

class ServerTimeService {
  // Método para pegar data e hora atuais do servidor
  async getCurrentTimeAndDateFromServer() {
    try {
      // Faz as requisições ao banco de dados em paralelo
      const [adjustedTimeResponse, currentDateResponse] = await Promise.all([
        supabase.rpc('get_adjusted_time'),
        supabase.rpc('get_current_date'),
      ]);

      // Verifica se houve erros
      if (adjustedTimeResponse.error || currentDateResponse.error) {
        console.error(
          'Erro ao buscar dados:',
          adjustedTimeResponse.error || currentDateResponse.error
        );
        return { currentDate: null, currentTime: null };
      }

      // Obtém os valores retornados diretamente
      const currentDate = currentDateResponse.data; // Data no formato 'YYYY-MM-DD'
      const currentTime = adjustedTimeResponse.data; // Hora no formato 'HH:mm:ss'

      // Verifica se os valores existem
      if (!currentDate || !currentTime) {
        throw new Error('Data ou hora inválidas retornadas pelo servidor');
      }

      return { currentDate, currentTime }; // Retorna a data e hora
    } catch (error) {
      console.error('Erro ao buscar a data e hora do servidor:', error);
      return { currentDate: null, currentTime: null };
    }
  }
}

export default ServerTimeService;
