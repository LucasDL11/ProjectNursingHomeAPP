const dividirFechaYHora = (fechaYhora) => {
  const [fecha, horaWithTimeZone] = fechaYhora.split("T");
  const hora = horaWithTimeZone.slice(0, 5);
  return { fecha, hora };
};

const primerPalabra = (palabra) => {
  const partes = palabra.split(" ");
  return partes[0];
}

const formatoCedula = (input) => {
  if (typeof input !== 'number' || input < 0 || input >= 100000000) {
    return input; // Devuelve el mismo input si no es válido
  }

  const inputString = input.toString().padStart(8, '0');

  const part1 = inputString.slice(0, 1); // Primer dígito
  const part2 = inputString.slice(1, 4); // Dígitos 2 al 4
  const part3 = inputString.slice(4, 7); // Dígitos 5 al 7
  const part4 = inputString.slice(7);    // Último dígito

  return `${part1}.${part2}.${part3}-${part4}`;
}

export default dividirFechaYHora;

export {primerPalabra, formatoCedula}