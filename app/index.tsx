import React, { useState, useEffect } from "react";
import { TextInput, View, Alert, TouchableOpacity, Text, BackHandler, Image, useColorScheme, SafeAreaView, ActivityIndicator, StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native"; 
import GestorDados from "./GestorDados";
import { Cliente } from "./GestorDados";
import { styles } from "../CommonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [cpf, setCpf] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navegacao = useNavigation();
  const modoEscuro = useColorScheme() === "dark";
  const estilosDinamicos = styles(modoEscuro);

  useEffect(() => {
    navegacao.setOptions({
      title: "Cliente Certo",
      headerStyle: {
        backgroundColor: modoEscuro ? "#181818" : "#fff",
      },
      headerTintColor: modoEscuro ? "#fff" : "#000",
      animation: "slide_from_right",
      headerLeft: () => (
        <TouchableOpacity onPress={handleBackPress}>
        </TouchableOpacity> // Vazio tfira o botão de voltar da página inicial
      )
    });

    StatusBar.setBarStyle(modoEscuro ? "light-content" : "dark-content");
    StatusBar.setBackgroundColor(modoEscuro ? "#181818" : "#fff");
  }, [navegacao, modoEscuro]);

  const handleBackPress = () => {
    Alert.alert(
      "Deseja sair do Cliente Certo?",
      "",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: () => BackHandler.exitApp(),
        },
      ]
    );
  };

  const gestor = new GestorDados();

  useFocusEffect(
    React.useCallback(() => {
      const acaoVoltar = () => {
        handleBackPress();
        return true;
      };

      const manipuladorVoltar = BackHandler.addEventListener("hardwareBackPress", acaoVoltar);

      return () => manipuladorVoltar.remove();
    }, [])
  );

  const formatarMoeda = (valor: string) => {
    const valorNumerico = valor.replace(/\D/g, "");
    const valorFormatado = (Number(valorNumerico) / 100).toFixed(2).replace(".", ",");
    return valorFormatado;
  };

  const manipularAlteracaoValor = (valor: string) => {
    setValor(formatarMoeda(valor));
  };

  const formatarCpf = (valor: string) => {
    const valorNumerico = valor.replace(/\D/g, "");
    const cpfFormatado = valorNumerico
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpfFormatado;
  };

  const manipularAlteracaoCpf = (valor: string) => {
    setCpf(formatarCpf(valor));
  };

  function validarCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');

    if (cpf.length !== 11) return false;

    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digito1 = resto < 2 ? 0 : 11 - resto;

    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digito2 = resto < 2 ? 0 : 11 - resto;

    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  const cadastrarCliente = async () => {
    const nomeSemEspacos = nome.trim();
    const valorFormatado = parseFloat(parseFloat(valor.replace(",", ".")).toFixed(2));
    const cpfSemFormatacao = cpf.replace(/\D/g, "");

    if (!nomeSemEspacos || isNaN(valorFormatado) || valorFormatado <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente!");
      return;
    }

    if (cpfSemFormatacao && !validarCPF(cpfSemFormatacao)) {
      Alert.alert("Erro", "CPF inválido!");
      return;
    }

    try {
      setCarregando(true);
      const novoCliente: Cliente = {
        id: Date.now(),
        nome: nomeSemEspacos,
        valor: valorFormatado,
        cpf: cpfSemFormatacao || "Não informado",
      };

      await gestor.adicionar(novoCliente);
      setCarregando(false);
      Alert.alert("Sucesso", "Cliente cadastrado com sucesso!");
      setNome("");
      setValor("");
      setCpf("");
    } catch (erro) {
      setCarregando(false);
      Alert.alert("Erro", "Não foi possível cadastrar o cliente.");
      console.error(erro);
    }
  };

  const visualizarClientes = async () => {
    try {
      setCarregando(true);
      const clientes = await gestor.obterTodos();
      setCarregando(false);
      if (clientes.length === 0) {
        Alert.alert("Informação", "Não há clientes cadastrados.");
      } else {
        const chaves = await AsyncStorage.getAllKeys();
        if (chaves.length > 0) {
          navegacao.navigate("ClienteForm");
        } else {
          Alert.alert("Erro", "O banco de dados não está atualizado. Tente novamente.");
        }
      }
    } catch (erro) {
      setCarregando(false);
      Alert.alert("Erro", "Não foi possível verificar os clientes.");
      console.error(erro);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: modoEscuro ? "#181818" : "#fff",
      }}
    >
      <View
        style={[
          estilosDinamicos.container,
          { backgroundColor: modoEscuro ? "#181818" : "#fff" },
        ]}
      >
        {carregando ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={modoEscuro ? "#fff" : "#000"} />
          </View>
        ) : (
          <>
            <Image
              source={require("../logo/cliente_certo_logo.png")}
              style={{ width: 100, height: 100, alignSelf: "center", marginBottom: 20 }}
            />
            <TextInput
              placeholder="Digite o nome do cliente"
              value={nome}
              onChangeText={setNome}
              style={[estilosDinamicos.input, { paddingHorizontal: 20 }]}
              maxLength={100}
              placeholderTextColor={modoEscuro ? "#aaa" : "#666"}
            />
            <TextInput
              placeholder="Digite o CPF (Opcional)"
              value={cpf}
              onChangeText={manipularAlteracaoCpf}
              keyboardType="numeric"
              style={[estilosDinamicos.input, { paddingHorizontal: 20 }]}
              maxLength={14}
              placeholderTextColor={modoEscuro ? "#aaa" : "#666"}
            />
            <TextInput
              placeholder="Digite o valor"
              value={valor}
              onChangeText={manipularAlteracaoValor}
              keyboardType="numeric"
              style={[estilosDinamicos.input, { paddingHorizontal: 20 }]}
              maxLength={10}
              placeholderTextColor={modoEscuro ? "#aaa" : "#666"}
            />
            <View style={{ padding: 3 }}>
              <TouchableOpacity style={estilosDinamicos.button} onPress={cadastrarCliente}>
                <Text style={estilosDinamicos.buttonText}>Cadastrar cliente</Text>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 3 }}>
              <TouchableOpacity style={estilosDinamicos.button} onPress={visualizarClientes}>
                <Text style={estilosDinamicos.buttonText}>Visualizar cadastros</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
