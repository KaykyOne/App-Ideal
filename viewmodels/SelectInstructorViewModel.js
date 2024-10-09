import { supabase } from '../services/supabaseService';

export class SelectInstructorViewModel {
  async searchInstructoresForCategory(cpf, type) {
    if (!type) {
      console.log('O Tipo é necessário.');
      return [];
    }

    // Buscar usuario_id pelo CPF
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('usuario_id')
      .eq('cpf', cpf)
      .single();

    if (usuarioError || !usuarioData) {
      alert('Erro ao buscar dados do usuário: ' + (usuarioError?.message || 'Usuário não encontrado'));
      console.error(usuarioError);
      return [];
    }

    // Buscar instrutores relacionados ao usuario_id
    const { data: usuarioInstrutorData, error: usuarioInstrutorError } = await supabase
      .from('usuarios_instrutores')
      .select('instrutor_id')
      .eq('usuario_id', usuarioData.usuario_id);

    if (usuarioInstrutorError || !usuarioInstrutorData.length) {
      alert('Erro ao buscar dados de instrutores para o usuário: ' + (usuarioInstrutorError?.message || 'Nenhum instrutor encontrado'));
      console.error(usuarioInstrutorError);
      return [];
    }

    // Extrair os IDs dos instrutores
    let instrutores_id = usuarioInstrutorData.map(instrutor => instrutor.instrutor_id);

    // Buscar instrutores usando uma única query com todos os IDs
    const { data: instrutoresData, error: instrutoresError } = await supabase
      .from('instrutores')
      .select('nome_instrutor')
      .in('instrutor_id', instrutores_id)
      .or(`tipo_instrutor.ilike.%${type}%,tipo_instrutor.ilike.%${type}`);

    if (instrutoresError) {
      alert('Erro ao buscar instrutores: ' + instrutoresError.message);
      console.error(instrutoresError);
      return [];
    }

    return instrutoresData;
  }
}
