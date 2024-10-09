import { supabase } from '../services/supabaseService'; // Certifique-se de que o caminho está correto

export class SelectTypeViewModel {

  async searchCategoriaPretendida(cpf) {
    // Valida se o CPF é fornecido
    if (!cpf) {
      alert('O CPF é necessário.');
      return;
    }

    // Faz a consulta ao Supabase
    const { data, error } = await supabase
      .from('usuarios')
      .select('categoria_pretendida')
      .eq('cpf', cpf); // Usa o método 'eq' para filtrar pela coluna 'cpf'

    if (error) {
      alert('Erro ao buscar dados: ' + error.message); // Melhora a mensagem de erro
      console.error(error); // Log do erro para depuração
      return [];
    }

    return data; // Retorna os dados encontrados
  }
}
