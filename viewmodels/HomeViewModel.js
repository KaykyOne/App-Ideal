import { supabase } from '../services/supabaseService';
import ServerTimeService from '../services/ServerTimeService';

export class HomeViewModel {
  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }

<<<<<<< HEAD
  // Método para buscar e concluir aulas pendentes passadas
=======
  // Método para buscar e concluir aulas pendentes passadas e do dia atual
>>>>>>> main
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
<<<<<<< HEAD
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
=======
      const { currentDate, currentTime } = await this.getCurrentTimeAndDateFromServer();

      if (!currentDate || !currentTime) {
        throw new Error('Não foi possível obter a data atual.');
      }

      // Ajuste a data atual para levar em conta a diferença de fuso horário
      const adjustedCurrentDate = new Date(currentDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));

      console.log('Data atual ajustada:', adjustedCurrentDate);
      console.log('Aulas pendentes:', aulasPendentes);

      await this.checkAndUpdateLog(alunoId, adjustedCurrentDate, currentTime);

      // Filtra aulas que estão com data anterior ou igual à data atual ajustada
      // Filtra aulas que estão com data anterior ou igual à data atual ajustada
      const aulasParaConcluir = aulasPendentes.filter((aula) => {
<<<<<<< HEAD
        const aulaDate = new Date(aula.data); // Certifique-se que aula.data é uma string que representa uma data
        // Verifica se a data da aula é anterior ou igual à data atual ajustada
        return aulaDate <= adjustedCurrentDate;
>>>>>>> main
=======
        const aulaDateTime = new Date(aula.data); // Certifique-se que aula.data é uma string que representa uma data e hora corretamente formatada
      
        // Verifica se a data da aula é anterior à data atual ajustada
        if (aulaDateTime < adjustedCurrentDate) {
          return true;
        }
      
        // Se as datas forem exatamente iguais, verifica a hora
        if (aulaDateTime.toDateString() === adjustedCurrentDate.toDateString()) {
          // Verifica a hora e minutos
          const aulaHoras = aulaDateTime.getHours();
          const aulaMinutos = aulaDateTime.getMinutes();
      
          const currentHoras = adjustedCurrentDate.getHours();
          const currentMinutos = adjustedCurrentDate.getMinutes();
      
          // Verifica se a hora da aula já passou ou é igual
          if (
            aulaHoras < currentHoras ||
            (aulaHoras === currentHoras && aulaMinutos <= currentMinutos)
          ) {
            return true;
          }
        }
      
        // Se a data for futura ou a hora não atender os critérios, não filtra a aula
        return false;
>>>>>>> main
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

<<<<<<< HEAD
=======
  async checkAndUpdateLog(alunoId, adjustedCurrentDate, currentTime) {
    // Verifica se já existe um log para o aluno
    const { data: existingLogs, error: fetchError } = await supabase
      .from('logs')
      .select('*')
      .eq('aluno_id', alunoId);

    if (fetchError) {
      console.error('Erro ao buscar logs:', fetchError);
      return;
    }

    if (existingLogs.length > 0) {
      // Se já existe um log, atualiza o log existente
      const { error: updateError } = await supabase
        .from('logs')
        .update({
          data: adjustedCurrentDate,
          hora: currentTime,
        })
        .eq('aluno_id', alunoId);

      if (updateError) {
        console.error('Erro ao atualizar log:', updateError);
        return;
      }

      console.log('Log atualizado com sucesso!');
    } else {
      // Se não existe um log, cria um novo
      const { data: insert, error: insertError } = await supabase
        .from('logs')
        .insert([
          {
            aluno_id: alunoId,
            data: adjustedCurrentDate,
            hora: currentTime,
          },
        ]);

      if (insertError) {
        console.error('Erro ao criar log:', insertError);
        return;
      }

      console.log('Log criado com sucesso!', insert);
    }
  }

>>>>>>> main
  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } =
      await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime }; // Retorna um objeto com data e hora
  }
}
