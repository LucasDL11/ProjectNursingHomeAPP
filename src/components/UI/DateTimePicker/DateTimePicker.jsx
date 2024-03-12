import React, { useState } from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Button from '../Button';


//modeFormat: "date", "time", "datetime"

const DateTimePickerComponent = ({ onConfirm, modeFormat, isVisible }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(isVisible);
  const [selectedDate, setSelectedDate] = useState('');

  const showDatePicker = () => {
    if (isDatePickerVisible) {
      setDatePickerVisibility(false);
    } else {
      setDatePickerVisibility(true);
    }


  };





  return (
    <View>
      <Button
        title="Seleccionar"
        onPress={showDatePicker}
        backgroundColor="#FC4F4F"
        textColor="#000000"
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={modeFormat}
        onCancel={showDatePicker}
        onConfirm={onConfirm}

      />


    </View>
  );
};

export default DateTimePickerComponent;