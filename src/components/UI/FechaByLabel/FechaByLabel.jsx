import React from "react";
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useState } from "react";
/*
  para invocarlo: 
  <FechaByLabel
      dateField={} ->campo asociado
      onConfirmDate={} -> funcion para asociar, ej: (date) => handleDateChangeHoraTarea(date)
      placeholder='Hora a realizarse' ---> si no pongo, por defecto->  'Fecha de nacimiento'             
      modeFormat={} --> si no lo pongo por defecto es solo fecha, 
                        las selecciones son:-"time"
                                            -"date" 
                                            -"datetime"
  />
*/
const FechaByLabel = ({ dateField, onConfirmDate, placeholder, modeFormat }) => {
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false);

    const dividirFechaYHora = (fechaYhora) => {
        const [fecha, horaWithTimeZone] = fechaYhora.split("T");
        const hora = horaWithTimeZone.slice(0, 5);
        return { fecha, hora };
    };

    const showDateTimePicker = () => {
        setIsDateTimePickerVisible(true);
    };

    const hideDateTimePicker = () => {
        setIsDateTimePickerVisible(false);
    };

    const styles = StyleSheet.create({
        input: {
            padding: 10,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#707070',
            fontSize: 16,
            marginTop: 10,
            backgroundColor: "#FFFFFF",
        },
        text: {
            paddingVertical: 5,
            fontSize: 16,
            color: dateField ? "#000000" : "#707070"
        },
    });

    return (
        <>
            <TouchableWithoutFeedback onPress={showDateTimePicker}>
                <View style={styles.input}>
                    <Text style={styles.text}>
                        {dateField && modeFormat === "time"
                            ? dividirFechaYHora(dateField.toISOString())?.hora
                            : dateField && modeFormat === "datetime"
                            ? `${dividirFechaYHora(dateField.toISOString())?.fecha} - ${dividirFechaYHora(dateField.toISOString())?.hora}hs`
                            : dateField
                            ? dividirFechaYHora(dateField.toISOString())?.fecha
                            : placeholder || 'Fecha de nacimiento'}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
            <DateTimePickerModal
                isVisible={isDateTimePickerVisible}
                mode={modeFormat ? modeFormat : "date"}
                onConfirm={(date) => {
                    onConfirmDate(date);
                    hideDateTimePicker();
                }}
                onCancel={hideDateTimePicker}
            />
        </>
    );
}

export default FechaByLabel;
