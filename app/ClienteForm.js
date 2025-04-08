import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, BackHandler, useColorScheme, SafeAreaView } from "react-native";
import GestorDados from "./GestorDados";
import { styles } from "../CommonStyles";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClienteForm() {
  const [clientes, setClientes] = useState([]);
  const navigation = useNavigation();
  const isDarkMode = useColorScheme() === "dark";
  const dynamicStyles = styles(isDarkMode);

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        navigation.goBack();
        return true;
      };

      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

      return () => backHandler.remove();
    }, [])
  ); 

  useEffect(() => {
    navigation.setOptions({
      title: "Lista de Clientes",
      headerStyle: {
        backgroundColor: isDarkMode ? "#181818" : "#fff",
      },
      headerTintColor: isDarkMode ? "#fff" : "#000",
      animation: "slide_from_right",
    });
  }, [navigation, isDarkMode]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const gestor = new GestorDados();
        const clientesSalvos = await gestor.obterTodos();
        setClientes(clientesSalvos);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os clientes.");
        console.error(error);
      }
    };

    fetchClientes();
  }, []);

  const isDatabaseEmpty = async () => {
    const keys = await AsyncStorage.getAllKeys();
    return keys.length === 0;
  };

  const deleteCliente = async (id) => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja remover este cliente?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Remover",
          onPress: async () => {
            try {
              const gestor = new GestorDados();
              await gestor.remover(id);
              setClientes((prevClientes) => {
                const updatedClientes = prevClientes.filter((cliente) => cliente.id !== id);
                if (updatedClientes.length === 0) {
                  Alert.alert("Informação", "Todos os clientes foram removidos.");
                  navigation.navigate("index");
                }
                return updatedClientes;
              });
            } catch (error) {
              Alert.alert("Erro", "Não foi possível remover o cliente.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const deleteAllClientes = async () => {
    Alert.alert(
      "Isto excluirá TODOS os dados. Tem certeza que deseja continuar?",
      "",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            Alert.alert(
              "Confirme para excluir todos os dados",
              "",
              [
                {
                  text: "Cancelar",
                  style: "cancel",
                },
                {
                  text: "Excluir permanentemente",
                  onPress: async () => {
                    try {
                      const gestor = new GestorDados();
                      await gestor.removerTodos();
                      setClientes([]);
                      Alert.alert("Sucesso", "Todos os dados foram excluídos.", [
                        {
                          text: "OK",
                          onPress: () => navigation.navigate("index"),
                        },
                      ]);
                    } catch (error) {
                      Alert.alert("Erro", "Não foi possível excluir todos os dados.");
                      console.error(error);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "#181818" : "#fff",
      }}
    >
      <View style={[dynamicStyles.container, { backgroundColor: isDarkMode ? "#181818" : "#fff" }]}>
        <ScrollView
          style={{ backgroundColor: isDarkMode ? "#181818" : "#fff" }}
        >
          {clientes.map((item) => (
            <View key={item.id.toString()} style={dynamicStyles.flatListItemContainer}>
              <View style={dynamicStyles.itemsContainer}>
                <Text style={[dynamicStyles.textItem, dynamicStyles.flatListItemText]}>
                  Nome: {item.nome}{"\n"}
                  Valor: R$ {Number(item.valor).toFixed(2).replace(".", ",")}{"\n"}
                  CPF: {item.cpf ? item.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : "Não informado"}
                </Text>
                <TouchableOpacity
                  style={dynamicStyles.deleteButton}
                  onPress={() => deleteCliente(item.id)}
                >
                  <Text style={dynamicStyles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        {clientes.length > 0 && (
          <TouchableOpacity
            style={[
              dynamicStyles.deleteButton,
              { marginTop: 20, alignSelf: "center", paddingHorizontal: 20 },
            ]}
            onPress={deleteAllClientes}
          >
            <Text style={dynamicStyles.deleteButtonText}>Excluir todos</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}