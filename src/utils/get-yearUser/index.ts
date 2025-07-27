export function getAgeText(data_nascimento: string): string {
  const nascimento = new Date(data_nascimento);
  const hoje = new Date();

  const diffTime = hoje.getTime() - nascimento.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const idadeAnos = hoje.getFullYear() - nascimento.getFullYear();
  const idadeMeses = hoje.getMonth() - nascimento.getMonth();
  const idadeDias = hoje.getDate() - nascimento.getDate();

  let anos = idadeAnos;
  let meses = idadeMeses;
  let dias = idadeDias;

  // Ajustes caso o mês/dia atual seja menor que o mês/dia de nascimento
  if (meses < 0 || (meses === 0 && dias < 0)) {
    anos--;
    meses += 12;
  }

  if (dias < 0) {
    const mesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    dias += mesAnterior.getDate();
    meses--;
  }

  if (anos >= 1) {
    return anos === 1 ? "1 ano" : `${anos} anos`;
  }

  if (meses >= 1) {
    return meses === 1 ? "1 mês" : `${meses} meses`;
  }

  return dias === 1 ? "1 dia" : `${dias} dias`;
}
