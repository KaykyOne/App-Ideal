import { supabase } from '../services/supabaseService';
import ServerTimeService from '../services/ServerTimeService';

export class ListAulasViewModel {
  aulas = [];
  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }
  
  async searchAulas(cpf) {
    try {
      // Busca o ID do usuário com base no CPF e verifica se a situação é 'Pendente'
      const { data: alunoData, error: alunoError } = await supabase
        .from('usuarios')
        .select('usuario_id')
        .eq('cpf', cpf)
        .single();

      if (alunoError) {
        throw new Error(alunoError.message);
      }

      const alunoId = alunoData?.usuario_id;

      if (!alunoId) {
        throw new Error(
          'ID do aluno não encontrado ou situação não é Pendente.'
        );
      }

      // Busca as aulas associadas ao ID do aluno
      const { data, error } = await supabase
        .from('aulas')
        .select('aula_id, data, hora, tipo') // Incluindo aula_id
        .eq('aluno_id', alunoId)
        .eq('situacao', 'Pendente')
        .order('data', { ascending: true });

      if (error) {
        return null; // Retorna null em caso de erro
      }

      this.aulas = data || []; // Armazena os dados no ViewModel
      return this.aulas;
    } catch (error) {
      return null;
    }
  }

  async alterAula(campo, id, tipy, cpf) {
    try {
      // Atualiza o campo 'situacao' da aula
      const { data: updateAulaData, error: updateAulaError } = await supabase
        .from('aulas')
        .update({ situacao: campo })
        .eq('aula_id', id);

      if (updateAulaError) {
        throw new Error(updateAulaError.message);
      }

      // Busca o valor atual dos contadores
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
<<<<<<< HEAD
        .select('num_aulas, num_faltas')
=======
        .select('num_aulas')
>>>>>>> main
        .eq('cpf', cpf)
        .single();

      if (userError) {
        throw new Error(userError.message);
      }

      // Incrementa o valor apropriado
      const newValues = {};
      if (tipy === 'Concluída') {
        newValues.num_aulas = (userData.num_aulas || 0) + 1;
      } else if (tipy === 'Ausente') {
        newValues.num_faltas = (userData.num_faltas || 0) + 1;
      } else {
        return;
      }

      // Atualiza os contadores no banco de dados
      const { data: updateUserData, error: updateUserError } = await supabase
        .from('usuarios')
        .update(newValues)
        .eq('cpf', cpf);

      if (updateUserError) {
        throw new Error(updateUserError.message);
      }

      return updateUserData;
    } catch (error) {
<<<<<<< HEAD
=======
      console.log(error);
>>>>>>> main
      throw error; // Repassa o erro para quem chamou o método
    }
  }

  async deleteAula(id) {
    try {
      // Deleta a aula com base no id fornecido
      const { data, error } = await supabase
        .from('aulas')
        .delete()
        .eq('aula_id', id);

      if (error) {
        throw error; // Repassa o erro para quem chamou o método
      }

      return data; // Retorna os dados deletados, se necessário
    } catch (error) {
      throw error; // Repassa o erro para quem chamou o método
    }
  }

  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } =
      await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime }; // Retorna um objeto com data e hora
  }
}
