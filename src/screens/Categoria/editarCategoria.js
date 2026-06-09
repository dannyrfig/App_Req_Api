import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

import api from '../../api/api';

export default function CategoriaScreenEditar() {
  const route = useRoute();

  
  const navigation = useNavigation();

  const [nomeCategoria, setNomeCategoria] = useState(null);
  
  const [idCategoria, setIdCategoria] = useState(null);

  useEffect(() => {
    if (route.params) {
      setIdCategoria(route.params.id);         
      setNomeCategoria(route.params.Nome);    
    }
  }, [route.params]); 
  
  async function salvar() {
 
    if (!nomeCategoria || nomeCategoria.trim().length < 3) {
      Alert.alert('Atenção', 'Informe corretamente o nome da categoria');
      return;
    }

    // Validação do ID
    if (!idCategoria || idCategoria <= 0) {
      Alert.alert('Atenção', 'Verifique o ID da categoria');
      return;
    }

    try {
    await api.put(`/categorias/${idCategoria}`, {
  nome: nomeCategoria,
  descricao: null,
});

      Alert.alert('Sucesso', 'Categoria atualizada com sucesso!');
      navigation.goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar a categoria.');
    }
  }

  return (
    <View style={styles.container}>
      {/* Título da tela */}
      <Text style={styles.titulo}>Editar Categoria</Text>

      {/* Barra de status do sistema */}
      <StatusBar style="auto" />

      {/* Input do ID (somente leitura) */}
      <TextInput
        value={idCategoria ? String(idCategoria) : ''}
        editable={false}
        style={[styles.input, { backgroundColor: '#f5f5f5', color: '#999' }]}
      />

      {/* Input do nome da categoria */}
      <TextInput
        placeholder="Digite o nome da categoria"
        value={nomeCategoria ?? ''}
        onChangeText={setNomeCategoria}
        style={styles.input}
      />

      {/* Área dos botões */}
      <View style={styles.actions}>

        {/* Botão cancelar */}
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        {/* Botão salvar */}
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={salvar}
        >
          <Text style={{ color: "#fff" }}>Salvar</Text>
        </TouchableOpacity>
      </View>
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
  titulo: {
    marginTop: 25,
    marginBottom: 25,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%'
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
  },
  cancelButton: {
    backgroundColor: "#eee",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
});