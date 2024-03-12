import { Picker } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";

const ParentescoPicker = ({ value, onChange }) => {
    const defaultValue = value !== "" ? value : undefined;
    return (
        <View style={styles.container}>

        <Picker selectedValue={value} onValueChange={onChange} style={styles.pick} defaultValue={defaultValue}>
            <Picker.Item key="r-1" value="" label="Parentesco con residente" />
            <Picker.Item key={"1"} value={"Esposo/a"} label={"Esposo/a"} />
            <Picker.Item key={"2"} value={"Hijo/a"} label={"Hijo/a"} />
            <Picker.Item key={"3"} value={"Abuelo/a"} label={"Abuelo/a"} />
            <Picker.Item key={"4"} value={"Nieto/a"} label={"Nieto/a"} />
            <Picker.Item key={"5"} value={"Hermano/a"} label={"Hermano/a"} />
            <Picker.Item key={"6"} value={"Tío/a"} label={"Tío/a"} />
            <Picker.Item key={"7"} value={"Sobrino/a"} label={"Sobrino/a"} />
            <Picker.Item key={"8"} value={"Bisabuelo/a"} label={"Bisabuelo/a"} />
            <Picker.Item key={"9"} value={"Bisnieto/a"} label={"Bisnieto/a"} />
            <Picker.Item key={"10"} value={"Tatarabuelo/a"} label={"Tatarabuelo/a"} />
            <Picker.Item key={"11"} value={"Tataranieto/a"} label={"Tataranieto/a"} />
            <Picker.Item key={"12"} value={"Tío/a abuelo/a"} label={"Tío/a abuelo/a"} />
            <Picker.Item key={"13"} value={"Sobrino/a nieto/a"} label={"Sobrino/a nieto/a"} />
            <Picker.Item key={"14"} value={"Amigo/a"} label={"Amigo/a"} />
            <Picker.Item key={"15"} value={"Otro"} label={"Otro"} />
        </Picker>
        </View>
    )
    
    
}
    const styles = StyleSheet.create({
        container: {
            
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#808080',
            fontSize: 16,
            marginTop: 10,
            backgroundColor: '#FFFFFF',
        },
        pick:{
            color: '#696969'
        }


    })

export default ParentescoPicker;