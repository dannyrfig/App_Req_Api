import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function ProdutoScreenIncluir() {
  const navigation = useNavigation();

  const [nomeProduto, setNomeProduto] = useState(); 
  const [valorProduto, setValorProduto] = useState(); 
  const [categorias, setCategorias] = useState([]); 
  const [categoriaId, setCategoriaId] = useState(null); 

  const produtoRep = new ProdutoRepository();
  const categoriaRep = new CategoriaRepository();

  
  useEffect(() => {
    try {
      const setup = async () => {
        setCategorias(result);
      }
      setup();
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro');
    }
  }, []);

  function salvar() {

    // Validação do nome
    if (!nomeProduto || nomeProduto.trim().length < 3) {
      Alert.alert('Atencão', 'Informe corretamente o nome do produto');
      return
    }

    // Validação da categoria
    if (!categoriaId) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return
    }

    // Validação do valor
    if (!valorProduto || valorProduto <= 0) {
      Alert.alert('Atenção', 'Informe um valor');
      return;
    }

    

    // Volta para a tela anterior
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Incluir Produto</Text>
      <StatusBar style="auto" />

      {/* Campo para nome do produto */}
      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      {/* Campo para valor do produto */}
      <TextInput
        placeholder="Digite valor do produto"
        value={valorProduto}
        style={styles.input}
        keyboardType="numeric"
        onChangeText={(text) => {

          const cleaned = text.replace(/[^0-9.]/g, '');

          const parts = cleaned.split('.');
          if (parts.length > 2) return;


          setValorProduto(cleaned);
        }}
      />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={categoriaId}
          onValueChange={(itemValue) => setCategoriaId(itemValue)}
          style={styles.picker}
        >
      
          <Picker.Item label='Selecione uma categoria' value={null} />

         
          {categorias.map((cat) => (
            <Picker.Item
              key={cat.Id}
              label={cat.NomeCategoria}
              value={cat.Id}
            />
          ))}
        </Picker>
      </View>

      {/* Botão de cancelar */}
      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.textButton}>Cancelar</Text>
      </TouchableOpacity>

      {/* Botão de salvar */}
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={salvar}
      >
        <Text style={[styles.textButton, { color: '#fff' }]}>Salvar</Text>
      </TouchableOpacity>

    </View>
  );
}

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  // Título da tela
  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 16,
    fontWeight: 'bold'
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
    height: 50
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
    width: '95%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10
  },

  // Botão cancelar
  cancelButton: {
    backgroundColor: "#eee",
  },

  // Botão salvar
  saveButton: {
    backgroundColor: "#4CAF50",
  },

  // Container do Picker (dropdown)
  pickerContainer: {
    width: '95%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginBottom: 16,
  },

  // Texto dos botões
  textButton: {
    fontSize: 16
  }

});