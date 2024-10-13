export class AulaModel {
  constructor(aulaId, alunoId, instrutorId, veiculoId, situacao, nomeAluno, nomeInstrutor, nomeVeiculo, data, hora, tipo) {
    this.aulaId = aulaId;
    this.alunoId = alunoId;
    this.instrutorId = instrutorId;
    this.veiculoId = veiculoId;
    this.situacao = situacao || '';
    this.data = data; // Deve ser um objeto Date
    this.hora = hora; // Deve ser um objeto Date ou string no formato 'HH:mm'
    this.tipo = tipo || '';
  }
}
