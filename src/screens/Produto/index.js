import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';

export default function ProdutoScreen() {
  const navigation = useNavigation();
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const setup = async () => {
      try {
        await loadData();
      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Ocorreu um erro ao carregar os produtos.');
      }
    };
    setup();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    try {
      const response = await api.get('/produtos');
      setProdutos(response.data.result); 
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível carregar os produtos.');
    }
  }

 
  function openEdit(item) {
    navigation.navigate('ProdutoScreenEditar', {
      id: item.IdProduto,       
      Nome: item.Nome,          
      Valor: item.Valor,
      IdCategoria: item.IdCategoria, 
    });
  }

  // Função para deletar um produto
  async function deletarProduto(id) {
    // Exibe alerta de confirmação
    Alert.alert('Confirmação', 'Deseja realmente excluir este produto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              // Validação básica do ID
              if (!id || id <= 0) {
                Alert.alert('Atenção', 'ID do produto é inválido');
                return;
              }

              // Chama a API para deletar
              await api.delete(`/produtos/${id}`);

              // Atualiza lista após exclusão
              await loadData();

              Alert.alert('Sucesso', 'Produto excluído com sucesso!');

            } catch (error) {
              console.log(error);
              Alert.alert('Erro', 'Não foi possível excluir o produto.');
            }
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Cabeçalho da tela */}
      <View style={styles.header}>
        <Text style={styles.titleScreen}>Gestão de produtos</Text>

        {/* Botão para adicionar novo produto */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ProdutoScreenIncluir')}
        >
          <Text style={styles.addButtonText}>+ Novo</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de produtos */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => String(item.IdProduto)}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>

            {/* Barra lateral decorativa */}
            <View style={styles.sideBar} />

            <View style={styles.cardInner}>
              <View style={styles.cardContent}>
                <Text style={styles.title}>ID: {item.IdProduto}</Text>
                <Text style={styles.title}>Produto: {item.Nome}</Text>
                <Text style={styles.title}>Valor R$: {item.Valor}</Text>
              </View>

              {/* Área de ações */}
              <View style={styles.actions}>

                {/* Botão de editar */}
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#E3F2FD' }]}
                  onPress={() => openEdit(item)}
                >
                  <Text style={styles.iconText}>✏️ Editar</Text>
                </TouchableOpacity>

                {/* Botão de excluir */}
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: '#FFEBEE' }]}
                  onPress={() => deletarProduto(item.IdProduto)}
                >
                  <Text style={styles.iconText}>🗑️ Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sideBar: {
    width: 6,
    backgroundColor: '#FF9800',
  },
  cardInner: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleScreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  cardContent: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  iconButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: 5,
  },
  iconText: {
    fontWeight: '600',
  },
});