

export const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' });
};