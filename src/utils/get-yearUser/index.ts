

export function getAgeText(data_nascimento: string, currentYear: number) {
  const birthYear = new Date(data_nascimento).getFullYear();
  const age = currentYear - birthYear;
  if (age <= 0) {
    return "Meses";
  }
  return age;
}