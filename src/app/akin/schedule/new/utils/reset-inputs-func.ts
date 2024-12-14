

 export const resetInputs = () => {
    // Selecionar os elementos pelo atributo `name`
    const getCalendaryInput = document.getElementsByName("calendario")[0] as HTMLInputElement;
    const getGenderInput = document.getElementsByName("gender")[0] as HTMLSelectElement;
    const getPhoneNumberInput = document.getElementsByName("phone_number")[0] as HTMLInputElement;
    const getIdentityInput = document.getElementsByName("identity")[0] as HTMLInputElement;
    const getAutocompleteInput = document.getElementsByName("name")[0] as HTMLInputElement


    // Resetar os valores dos campos
    if (getAutocompleteInput) getAutocompleteInput.placeholder = " d";
    if (getCalendaryInput) getCalendaryInput.value = "";
    if (getGenderInput) getGenderInput.value = "";
    if (getPhoneNumberInput) getPhoneNumberInput.value = "";
    if (getIdentityInput) getIdentityInput.value = "";
  };