import { supabase } from '../services/supabaseService';
import { UserModel } from '../models/UserModel';

export class LoginViewModel {
  users = [];

  async searchUsersByCPF(cpf) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('nome')
      .eq('cpf', cpf)
      .single(); // Adiciona .single() para retornar apenas um resultado
    
    if (error) {
      console.error('Erro ao buscar usuário:', error);
      return null; // Retorna null em caso de erro
    }

    return data ? data.nome : null; // Retorna apenas o campo 'nome'
  }
}
