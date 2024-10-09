import { supabase } from '../services/supabaseService'; // Certifique-se de que o caminho está correto

export class SelectVehicleViewModel {

  async searchVehiclesForCategory(type) {
    // Valida se o CPF é fornecido
    if (!type) {
      console.log('O Tipo é necessário.');
      return;
    }

    // Faz a consulta ao Supabase
    const { data, error } = await supabase
      .from('veiculos')
      .select('nome_veiculo')
      .eq('tipo_veiculo', type); // Usa o método 'eq' para filtrar pela coluna 'cpf'

    if (error) {
      alert('Erro ao buscar dados: ' + error.message); // Melhora a mensagem de erro
      console.error(error); // Log do erro para depuração
      return [];
    }

    return data; // Retorna os dados encontrados
  }
}
