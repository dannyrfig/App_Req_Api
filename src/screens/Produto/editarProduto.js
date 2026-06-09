import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import api from '../../api/api';

export default function ProdutoScreenEditar() {
  const route = useRoute();
  const navigation = useNavigation();

  const [idProduto, setIdProduto] = useState(null);
  const [nomeProduto, setNomeProduto] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaId, setCategoriaId] = useState(null);

  
  useEffect(() => {
    if (route.params) {
      console.log('Params recebidos:', route.params); 
      setIdProduto(route.params.id);
      setNomeProduto(route.params.Nome ?? '');
      setValor(route.params.Valor ? String(route.params.Valor) : '');
      setCategoriaId(route.params.IdCategoria ?? null);
    }
  }, [route.params]);

  async function salvar() {
    // Validação do nome
    if (!nomeProduto || nomeProduto.trim().length < 3) {
      Alert.alert('Atenção', 'Informe corretamente o nome do produto.');
      return;
    }

    // Validação do valor
    const valorNumerico = parseFloat(valor.replace(',', '.'));
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      Alert.alert('Atenção', 'Informe um valor válido para o produto.');
      return;
    }

    // Validação do ID
    if (!idProduto || idProduto <= 0) {
      Alert.alert('Atenção', 'Verifique o ID do produto.');
      return;
    }

    console.log('Body enviado:', { Nome: nomeProduto, Valor: valorNumerico, IdCategoria: categoriaId }); // 🔍 debug temporário

    try {
      await api.put(`/produtos/${idProduto}`, {
        Nome: nomeProduto,
        Valor: valorNumerico,     
        IdCategoria: categoriaId,
      });

      Alert.alert('Sucesso', 'Produto atualizado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar o produto.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Editar Produto</Text>
      <StatusBar style="auto" />

      {/* ID — somente leitura */}
      <TextInput
        value={idProduto ? String(idProduto) : ''}
        editable={false}
        style={[styles.input, styles.inputDisabled]}
      />

      <TextInput
        placeholder="Digite o nome do produto"
        value={nomeProduto}
        onChangeText={setNomeProduto}
        style={styles.input}
      />

      <TextInput
        placeholder="Digite o valor do produto"
        value={valor}
        onChangeText={setValor}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={salvar}
        >
          <Text style={{ color: '#fff' }}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  titulo: {
    marginTop: 25,
    marginBottom: 25,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    width: '95%',
  },
  inputDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '95%',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#eee',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
});