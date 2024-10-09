import { supabase } from '../services/supabaseService'; 
import ServerTimeService from '../services/ServerTimeService';

export class ConfirmAulaViewModel {
  constructor() {
    this.serverTimeService = new ServerTimeService(); // Instancia a classe
  }

  async getAlunoAndInstrutorIds(cpf, nameInstructor) {
    try {
      // Iniciar as duas requisições em paralelo
      const [alunoResponse, instrutorResponse] = await Promise.all([
        supabase.from('usuarios').select('usuario_id').eq('cpf', cpf).single(),
        supabase
          .from('instrutores')
          .select('instrutor_id')
          .eq('nome_instrutor', nameInstructor)
          .single(),
      ]);

      // Verificar se houve algum erro nas requisições
      if (alunoResponse.error) {
        console.error('Erro ao buscar aluno:', alunoResponse.error.message);
        return { usuario_id: null, instrutor_id: null };
      }

      if (instrutorResponse.error) {
        console.error(
          'Erro ao buscar instrutor:',
          instrutorResponse.error.message
        );
        return {
          usuario_id: alunoResponse.data?.usuario_id,
          instrutor_id: null,
        };
      }

      // Retornar os IDs do aluno e instrutor
      return {
        usuario_id: alunoResponse.data?.usuario_id,
        instrutor_id: instrutorResponse.data?.instrutor_id,
      };
    } catch (error) {
      // Captura e tratamento de erros inesperados
      console.error('Erro inesperado ao buscar IDs:', error);
      return { usuario_id: null, instrutor_id: null };
    }
  }

  async insertClass(alunoId, instrutorId, data, type, hora) {
    try {
      const { data: aulaData, error } = await supabase.from('aulas').insert([{
        aluno_id: alunoId,
        instrutor_id: instrutorId,
        situacao: 'Pendente',
        data: data,
        hora: hora,
        tipo: type,
      }]);

      if (error) {
        console.error('Erro ao inserir aula:', error.message);
        return null;
      } else {
        console.log('Dados da aula inseridos com sucesso:');
        return true; // Retorna os dados da aula inserida
      }
    } catch (error) {
      console.error('Erro inesperado ao inserir aula:', error.message);
      return null;
    }
  }

  async createClass(nameInstructor, data, cpf, type, hora) {
    try {
      // Obtém IDs de aluno e instrutor
      const result = await this.getAlunoAndInstrutorIds(cpf, nameInstructor);

      if (!result.usuario_id || !result.instrutor_id) {
        console.error('Não foi possível encontrar IDs para a aula.');
        return null;
      }

      return await this.insertClass(
        result.usuario_id,
        result.instrutor_id,
        data,
        type,
        hora
      );
    } catch (error) {
      console.error('Erro inesperado ao criar aula:', error);
      return null;
    }
  }

  async getUsuarioByCpf(cpf) {
    try {
      // Executa a consulta no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .select(
          'usuario_id, tipo_usuario, categoria_pretendida, data_cadastro, outra_cidade'
        )
        .eq('cpf', cpf)
        .single(); // Use .single() para garantir que apenas um registro é retornado

      // Lidar com erros na consulta
      if (error) {
        throw new Error(`Erro ao buscar usuário: ${error.message}`);
      }

      // Verificar se o usuário foi encontrado
      if (!data) {
        throw new Error('Nenhum usuário encontrado com o CPF fornecido.');
      }

      // Manipule os valores individualmente
      const {
        usuario_id,
        tipo_usuario,
        categoria_pretendida,
        data_cadastro,
        outra_cidade,
      } = data;

      // Retornar todos os valores para uso posterior
      return {
        usuario_id,
        tipo_usuario,
        categoria_pretendida,
        data_cadastro,
        outra_cidade,
      };
    } catch (err) {
      console.error('Erro na função getUsuarioByCpf:', err.message);
      throw err;
    }
  }

  async countClass(id, situacao) {
    try {
      const { count, error } = await supabase
        .from('aulas')
        .select('*', { count: 'exact' })
        .eq('aluno_id', id)
        .eq('situacao', situacao);

      if (error) {
        console.error('Erro ao contar gerais aulas:', error.message);
        return null; // Retorna null em caso de erro
      }

      return count; // Retorna a contagem dos registros encontrados
    } catch (error) {
      console.error('Erro inesperado ao contar aulas gerais:', error.message);
      return null; // Retorna null em caso de erro inesperado
    }
  }

  async countClassHoje(id, data) {
    try {
      const { count, error } = await supabase
        .from('aulas')
        .select('*', { count: 'exact' })
        .eq('aluno_id', id)
        .eq('data', data);

      if (error) {
        console.error('Erro ao contar de hoje aulas:', error.message);
        return null; // Retorna null em caso de erro
      }

      return count; // Retorna a contagem dos registros encontrados
    } catch (error) {
      console.error('Erro inesperado ao contar aulas hoje:', error.message);
      return null; // Retorna null em caso de erro inesperado
    }
  }

  async getCurrentTimeAndDateFromServer() {
    const { currentDate, currentTime } = await this.serverTimeService.getCurrentTimeAndDateFromServer();
    return { currentDate, currentTime }; // Retorna um objeto com data e hora
  }
}
