
//devuelve un mensaje con los errores encontrados
const validarCampos = (documento, nombre, apellido, fecha, telefono, sexo, parentesco, domicilio, email) => {
  
    let mensaje = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numerosRegex = /^[0-9]+$/;

    if(!documento.trim()){
        mensaje+= '\nEl campo de Documento no puede estar vacío.';
    }else if (!numerosRegex.test(documento)) {
        mensaje+= '\nEl campo de Documento debe tener solo números.';
    }else if (!validarCedula(documento)) {
        mensaje+= '\nDebe ingresar un Documento nacional válido.';
    }
    if (!nombre.trim()) {
        mensaje+= '\nEl campo del Nombre no puede estar vacío.';
    }
    if (!apellido.trim()) {
        mensaje+= '\nEl campo del Apellido no puede estar vacío.';
    }
   /*  if (!fecha || !fecha.toISOString().trim()) {
        mensaje+= '\nEl campo de la Fecha no puede estar vacío.';
    } */
    if (!telefono.trim()) {
        mensaje+= '\nEl campo del Teléfono no puede estar vacío.';
    }
    if (!sexo.trim()) {
        mensaje+= '\nEl campo de Sexo no puede estar vacío.';
    }
    if (parentesco == "") {
        mensaje+= '\nEl campo de Parentesco no puede estar vacío.';
    }
    if (!domicilio.trim()) {
        mensaje+= '\nEl campo de Domicilio no puede estar vacío.';
    }
    if (!emailRegex.test(email)) {
        mensaje+= '\nDebe ingrear un email válido.';        
    }

    return mensaje;
}

function validarCedula(cedula) {
    const buffer = cedula;
  
    if (buffer.length !== 8) {
      return false;
    }
  
    const sum = buffer
      .split("")
      .slice(0, 7)
      .map((digit, index) => parseInt(digit) * [2, 9, 8, 7, 6, 3, 4][index])
      .reduce((acc, curr) => acc + curr, 0);
  
    const verificador = parseInt(buffer[7]);
    const valor = sum + verificador;
    const valorString = valor.toString();
  
    return valorString.endsWith("00") || valorString.endsWith("0");
  }
  

export default validarCampos;