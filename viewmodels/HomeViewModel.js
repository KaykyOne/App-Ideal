import { supabase } from '../services/supabaseService';
import ServerTimeService from '../services/ServerTimeService';

export class HomeViewModel {
  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }

  // Método para buscar e concluir aulas pendentes passadas
  async marcarAulasConcluidas(cpf) {
    try {
      // Busca o ID do aluno pelo CPF
      const { data: alunoData, error: alunoError } = await supabase
        .from('usuarios')
        .select('usuario_id')
        .eq('cpf', cpf)
        .single();

      if (alunoError || !alunoData) {
        console.error('Erro ao buscar aluno:', alunoError?.message);
        return;
      }

      const alunoId = alunoData.usuario_id;

      // Busca aulas pendentes do aluno
      const { data: aulasPendentes, error: aulasError } = await supabase
        .from('aulas')
        .select('aula_id, data')
        .eq('aluno_id', alunoId)
        .eq('situacao', 'Pendente');

      if (aulasError || !aulasPendentes) {
        console.error('Erro ao buscar aulas pendentes:', aulasError?.message);
        return;
      }

      // Pega a data e hora atuais
      const { currentDate } = await this.getCurrentTimeAndDateFromServer();

      if (!currentDate) {
        throw new Error('Não foi possível obter a data atuais.');
      }

      // Ajuste a data atual para levar em conta a diferença de fuso horário
      const adjustedCurrentDate = new Date(currentDate);
      adjustedCurrentDate.setHours(adjustedCurrentDate.getHours() - 3); // Subtraindo 3 horas

      // Filtra aulas que estão com data anterior ao atual
      const aulasParaConcluir = aulasPendentes.filter((aula) => {
        const aulaDate = new Date(aula.data); // Certifique-se que aula.data é uma string que representa uma data
        // Verifica se a data da aula é anterior à data atual ajustada
        return aulaDate < adjustedCurrentDate;
      });

      if (aulasParaConcluir.length === 0) {
        console.log('Nenhuma aula precisa ser atualizada.');
        return;
      }

      // Atualiza aulas para "Concluída"
      for (const aula of aulasParaConcluir) {
        const { error: updateError } = await supabase
          .from('aulas')
          .update({ situacao: 'Concluída' })
          .eq('aula_id', aula.aula_id);

        if (updateError) {
          console.error(
            'Erro ao marcar aula como concluída:',
            updateError.message
          );
        } else {
          console.log(`Aula marcada como concluída.`);
        }
      }
    } catch (error) {
      console.error('Erro ao marcar aulas como concluídas:', error.message);
    }
  }

  // Método principal para testar usuário e marcar aulas pendentes como concluídas
  async testUser(cpf) {
    try {
      // Primeiro, marca as aulas pendentes como concluídas
      await this.marcarAulasConcluidas(cpf);

      // Busca o `num_aulas` pelo CPF
      const { data: search, error: userError } = await supabase
        .from('usuarios')
        .select('num_aulas')
        .eq('cpf', cpf)
        .single(); // `single()` garante que vai pegar apenas um registro

      if (userError || !search) {
        console.error('Erro ao buscar usuário:', userError?.message);
        return null; // Retorna null em caso de erro ao buscar o usuário
      }

      const { num_aulas: numAulas } = search; // Extrai as variáveis de `search`
      console.log(numAulas);

      // Verifica as condições
      if (numAulas >= 20) {
        return false;
      } else {
        return true; // Retorna true se as condições não forem satisfeitas
      }
    } catch (error) {
      console.error('Erro inesperado ao contar aulas:', error.message);
      return null; // Retorna null em caso de erro inesperado
    }
  }

  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } =
      await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime }; // Retorna um objeto com data e hora
  }
}
