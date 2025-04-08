import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Cliente {
  id: number;
  nome: string;
  valor: number;
}

const salvarCliente = async (chave: string, valor: any) => {
  try {
    const valorJSON = JSON.stringify(valor);
    await AsyncStorage.setItem(chave, valorJSON);
  } catch (erro) {
    console.error("Erro ao salvar cliente:", erro);
    throw erro;
  }
};

const removerCliente = async (chave: string) => {
  try {
    await AsyncStorage.removeItem(chave);
  } catch (erro) {
    console.error("Erro ao remover cliente:", erro);
    throw erro;
  }
};

const obterClientesJSON = async () => {
  try {
    const chaves = await AsyncStorage.getAllKeys();
    return await AsyncStorage.multiGet(chaves);
  } catch (erro) {
    console.error("Erro ao obter clientes JSON:", erro);
    return [];
  }
};

const obterClientes = async () => {
  try {
    const listaClientes: Cliente[] = [];
    const clientesJSON = await obterClientesJSON();
    if (clientesJSON && clientesJSON.length > 0) {
      clientesJSON.forEach((elemento) => {
        if (elemento[1] !== null) {
          const cliente: Cliente = JSON.parse(elemento[1]);
          listaClientes.push(cliente);
        }
      });
    }
    return listaClientes;
  } catch (erro) {
    console.error("Erro ao obter clientes:", erro);
    return [];
  }
};

class GestorDados {
  public async remover(chave: number) {
    await removerCliente(chave.toString());
  }

  public async adicionar(cliente: Cliente) {
    await salvarCliente(cliente.id.toString(), cliente);
  }

  public async obterTodos(): Promise<Array<Cliente>> {
    return await obterClientes();
  }

  public async removerTodos() {
    try {
      const chaves = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(chaves);
    } catch (erro) {
      console.error("Erro ao excluir todos os dados:", erro);
      throw erro;
    }
  }
}

export default GestorDados;