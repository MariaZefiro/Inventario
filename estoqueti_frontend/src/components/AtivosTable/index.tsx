import * as React from 'react';
import Box from '@mui/joy/Box';
import Link from '@mui/joy/Link';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import config from '../../config';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import RowMenu from '../RowMenu/RowMenu.tsx';
import BasicAlert from '../Alert';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

type AtivosTableProps = {
  estado: string;
  local: string;
  quantidade: number[];
  extraFilter?: string;
  onExportPDF?: (fn: () => void) => void; 
  mobile?: boolean;
};

type Item = {
  id: string | number;
  name: string;
  category: string;
  quantity: number;
  description: string;
  identification: string;
  state: string;
  local: string;
  type?: string;
  inputConnection?: string;
  outputConnection?: string;
  capacity?: string;
  interface?: string;
  comprimento?: string;
  material?: string;
  processador?: string;
  memoria_ram?: string;
  armazenamento?: string;
  fonte_alimentacao?: string;
  potencia_watts?: string;
  modular?: number;
  capacidade?: string;
  tipo?: string;
  frequencia?: string;
  latencia?: string;
  tamanho_polegadas?: string;
  resolucao?: string;
  tipo_painel?: string;
  taxa_atualizacao?: string;
  conexoes?: string;
  tamanho_tela?: string;
  bateria?: string;
  velocidade?: string;
  protocolo_suportado?: string;
  tecnologia?: string;
  compatibilidade?: string;
  marca?: string;
};

export default function AtivosTable({ estado, local, quantidade, extraFilter, onExportPDF, mobile }: AtivosTableProps) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly (string | number)[]>([]);
  const [adaptadores, setAdaptadores] = React.useState([]);
  const [armazenamento, setArmazenamento] = React.useState([]);
  const [cabos, setCabos] = React.useState([]);
  const [desktops, setDesktops] = React.useState([]);
  const [fontes, setFontes] = React.useState([]);
  const [ram, setRAM] = React.useState([]);
  const [monitores, setMonitores] = React.useState([]);
  const [notebooks, setNotebooks] = React.useState([]);
  const [nucs, setNucs] = React.useState([]);
  const [perifericos, setPerifericos] = React.useState([]);
  const [redes, setRedes] = React.useState([]);
  const [telefonia, setTelefonia] = React.useState([]);

  const [todos, setTodos] = React.useState<Item[]>([]);
  const [alert, setAlert] = React.useState({ severity: '', message: '' });

  const location = window.location.pathname;
  const backendIp = config.backend_ip;

  useEffect(() => {
    if (location === '/home/estoque/adaptadores') {
      axios.get(`${backendIp}/api/list_adaptadores`)
        .then(response => {
          setAdaptadores(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar adaptadores:', error);
        });
    } else if (location === '/home/estoque/armazenamento') {
      axios.get(`${backendIp}/api/list_armazenamento`)
        .then(response => {
          setArmazenamento(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar armazenamento:', error);
        });
    } else if (location === '/home/estoque/cabos') {
      axios.get(`${backendIp}/api/list_cabos`)
        .then(response => {
          setCabos(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar cabos:', error);
        });
    } else if (location === '/home/estoque/desktops') {
      axios.get(`${backendIp}/api/list_desktops`)
        .then(response => {
          setDesktops(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar desktops:', error);
        });
    } else if (location === '/home/estoque/fontes') {
      axios.get(`${backendIp}/api/list_fontes`)
        .then(response => {
          setFontes(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar fontes:', error);
        });
    } else if (location === '/home/estoque/memoria_ram') {
      axios.get(`${backendIp}/api/list_ram`)
        .then(response => {
          setRAM(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar memória RAM:', error);
        });
    } else if (location === '/home/estoque/monitores') {
      axios.get(`${backendIp}/api/list_monitores`)
        .then(response => {
          setMonitores(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar monitores:', error);
        });
    } else if (location === '/home/estoque/notebooks') {
      axios.get(`${backendIp}/api/list_notebooks`)
        .then(response => {
          setNotebooks(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar notebooks:', error);
        });
    } else if (location === '/home/estoque/nucs') {
      axios.get(`${backendIp}/api/list_nucs`)
        .then(response => {
          setNucs(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar nucs:', error);
        });
    } else if (location === '/home/estoque/perifericos') {
      axios.get(`${backendIp}/api/list_perifericos`)
        .then(response => {
          setPerifericos(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar periféricos:', error);
        });
    } else if (location === '/home/estoque/redes') {
      axios.get(`${backendIp}/api/list_redes`)
        .then(response => {
          setRedes(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar redes:', error);
        });
    } else if (location === '/home/estoque/telefonia') {
      axios.get(`${backendIp}/api/list_telefonia`)
        .then(response => {
          setTelefonia(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar telefonia:', error);
        });
    } else if (location === '/home/estoque/todos-componentes') {
      axios.get(`${backendIp}/api/list_all`)
        .then(response => {
          setTodos(response.data);
        })
        .catch(error => {
          console.error('Erro ao buscar telefonia:', error);
        });
    }
  }, [location]);

  const originalFilteredRows: Item[] = React.useMemo(() => {
    if (location === '/home/estoque/adaptadores') {
      return adaptadores.map(adaptador => ({
        id: adaptador[0],
        name: adaptador[1],
        category: adaptador[2],
        quantity: adaptador[3],
        description: adaptador[4],
        identification: adaptador[5],
        state: adaptador[6],
        local: adaptador[7],
        type: adaptador[8],
        inputConnection: adaptador[9],
        outputConnection: adaptador[10],
        supervisionado: adaptador[11],
      }));
    }
    if (location === '/home/estoque/armazenamento') {
      return armazenamento.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        type: item[8],
        capacity: item[9],
        interface: item[10],
        supervisionado: item[11],
      }));
    }
    if (location === '/home/estoque/cabos') {
      return cabos.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        type: item[8],
        comprimento: item[9],
        material: item[10],
        supervisionado: item[11],
      }));
    }
    if (location === '/home/estoque/desktops') {
      return desktops.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        processador: item[8],
        memoria_ram: item[9],
        armazenamento: item[10],
        fonte_alimentacao: item[11],
        supervisionado: item[12],
      }));
    }
    if (location === '/home/estoque/fontes') {
      return fontes.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        potencia_watts: item[8],
        modular: item[9],
        supervisionado: item[10],
      }));
    }
    if (location === '/home/estoque/memoria_ram') {
      return ram.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        capacidade: item[8],
        tipo: item[9],
        frequencia: item[10],
        latencia: item[11],
        supervisionado: item[12],
      }));
    }
    if (location === '/home/estoque/monitores') {
      return monitores.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        tamanho_polegadas: item[8],
        resolucao: item[9],
        tipo_painel: item[10],
        taxa_atualizacao: item[11],
        conexoes: item[12],
        supervisionado: item[13],
      }));
    }
    if (location === '/home/estoque/notebooks') {
      return notebooks.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        processador: item[8],
        memoria_ram: item[9],
        armazenamento: item[10],
        tamanho_tela: item[11],
        bateria: item[12],
        supervisionado: item[13],
      }));
    }
    if (location === '/home/estoque/nucs') {
      return nucs.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        processador: item[8],
        memoria_ram: item[9],
        armazenamento: item[10],
        supervisionado: item[11],
      }));
    }
    if (location === '/home/estoque/perifericos') {
      return perifericos.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        tipo: item[8],
        conexoes: item[9],
        marca: item[10],
        supervisionado: item[11],
      }));
    }
    if (location === '/home/estoque/redes') {
      return redes.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        tipo: item[8],
        velocidade: item[9],
        interface: item[10],
        protocolo_suportado: item[11],
        supervisionado: item[12],
      }));
    }
    if (location === '/home/estoque/telefonia') {
      return telefonia.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        tipo: item[8],
        tecnologia: item[9],
        compatibilidade: item[10],
        supervisionado: item[11],
      }));
    }
    if (location === '/home/estoque/todos-componentes') {
      return todos.map(item => ({
        id: item[0],
        name: item[1],
        category: item[2],
        quantity: item[3],
        description: item[4],
        identification: item[5],
        state: item[6],
        local: item[7],
        supervisionado: item[8],
      }));
    }
    return [];
  }, [
    location,
    adaptadores,
    armazenamento,
    cabos,
    desktops,
    fontes,
    ram,
    monitores,
    notebooks,
    nucs,
    perifericos,
    redes,
    telefonia,
    todos
  ]);

  const filteredRows = React.useMemo(() => {
    return [...originalFilteredRows].filter((row) => {
      const matchesExtra =
        !extraFilter ||
        (location === '/home/estoque/memoria_ram' && row.tipo === extraFilter) ||
        (location === '/home/estoque/armazenamento' && row.interface === extraFilter) ||
        (location === '/home/estoque/telefonia' && row.tecnologia === extraFilter) ||
        (location === '/home/estoque/perifericos' && row.marca === extraFilter) ||
        (location === '/home/estoque/redes' && row.velocidade === extraFilter) ||
        extraFilter === '';
      return (
        (!estado || row.state === estado) &&
        (!local || row.local === local) &&
        row.quantity >= quantidade[0] &&
        row.quantity <= quantidade[1] &&
        matchesExtra
      );
    });
  }, [originalFilteredRows, estado, local, quantidade, extraFilter, location]);

  function generateRowPDF(row) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Relatório do Ativo: ${row.name}`, 10, 10);

    // Adiciona a data do relatório logo abaixo do título
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${formattedDate}`, 10, 17);

    const tableColumn = ["Campo", "Valor"];
    const translations = {
      name: "Nome",
      category: "Categoria",
      quantity: "Quantidade",
      description: "Descrição",
      identification: "Identificação",
      state: "Estado",
      local: "Local",
      type: "Tipo",
      inputConnection: "Conexão de Entrada",
      outputConnection: "Conexão de Saída",
      capacity: "Capacidade",
      interface: "Interface",
      comprimento: "Comprimento",
      material: "Material",
      processador: "Processador",
      memoria_ram: "Memória RAM",
      armazenamento: "Armazenamento",
      fonte_alimentacao: "Fonte de Alimentação",
      potencia_watts: "Potência (Watts)",
      modular: "Modular",
      capacidade: "Capacidade",
      tipo: "Tipo",
      frequencia: "Frequência",
      latencia: "Latência",
      tamanho_polegadas: "Tamanho (Polegadas)",
      resolucao: "Resolução",
      tipo_painel: "Tipo de Painel",
      taxa_atualizacao: "Taxa de Atualização",
      conexoes: "Conexões",
      tamanho_tela: "Tamanho da Tela",
      bateria: "Bateria",
      velocidade: "Velocidade",
      protocolo_suportado: "Protocolo Suportado",
      tecnologia: "Tecnologia",
      compatibilidade: "Compatibilidade",
    };

    // Mapeamento para nomes de categoria
    const categoryNames = {
      '/home/estoque/adaptadores': 'Adaptadores',
      '/home/estoque/armazenamento': 'Armazenamento',
      '/home/estoque/cabos': 'Cabos',
      '/home/estoque/desktops': 'Desktops',
      '/home/estoque/fontes': 'Fontes',
      '/home/estoque/memoria_ram': 'Memória RAM',
      '/home/estoque/monitores': 'Monitores',
      '/home/estoque/notebooks': 'Notebooks',
      '/home/estoque/nucs': 'NUCs',
      '/home/estoque/perifericos': 'Periféricos',
      '/home/estoque/redes': 'Redes',
      '/home/estoque/telefonia': 'Telefonia',
      '/home/estoque/todos-componentes': 'Todos Componentes',
    };
    const categoriaNome = categoryNames[window.location.pathname] || row.category;

    const tableRows = Object.entries(row)
      .filter(([key]) => key !== "id" && key !== "supervisionado") // Remove supervisão e id
      .map(([key, value]) => {
        if (key === "category") {
          return [translations[key] || key, categoriaNome];
        }
        return [translations[key] || key, value || "N/A"];
      });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
    });

    doc.save(`${row.name || "ativo"}.pdf`);
  }

  const handleSave = (updatedRow) => {
    if (typeof updatedRow === 'string' || typeof updatedRow === 'number') {
      setTodos((prevRows) => prevRows.filter((row) => row.id !== updatedRow));
      setAlert({ severity: 'success', message: 'Ativo deletado com sucesso!' });
    } else if (updatedRow) {
      setTodos((prevRows) =>
        prevRows.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setAlert({ severity: 'success', message: 'Ativo editado com sucesso!' });
    }

    // Atualiza a tabela após edição/deleção em qualquer rota
    let apiPath = '';
    if (location === '/home/estoque/adaptadores') apiPath = '/api/list_adaptadores';
    else if (location === '/home/estoque/armazenamento') apiPath = '/api/list_armazenamento';
    else if (location === '/home/estoque/cabos') apiPath = '/api/list_cabos';
    else if (location === '/home/estoque/desktops') apiPath = '/api/list_desktops';
    else if (location === '/home/estoque/fontes') apiPath = '/api/list_fontes';
    else if (location === '/home/estoque/memoria_ram') apiPath = '/api/list_ram';
    else if (location === '/home/estoque/monitores') apiPath = '/api/list_monitores';
    else if (location === '/home/estoque/notebooks') apiPath = '/api/list_notebooks';
    else if (location === '/home/estoque/nucs') apiPath = '/api/list_nucs';
    else if (location === '/home/estoque/perifericos') apiPath = '/api/list_perifericos';
    else if (location === '/home/estoque/redes') apiPath = '/api/list_redes';
    else if (location === '/home/estoque/telefonia') apiPath = '/api/list_telefonia';
    else if (location === '/home/estoque/todos-componentes') apiPath = '/api/list_all';

    if (apiPath) {
      axios.get(`${backendIp}${apiPath}`)
        .then(response => {
          // Atualiza o estado correto conforme a rota
          if (location === '/home/estoque/adaptadores') setAdaptadores(response.data);
          else if (location === '/home/estoque/armazenamento') setArmazenamento(response.data);
          else if (location === '/home/estoque/cabos') setCabos(response.data);
          else if (location === '/home/estoque/desktops') setDesktops(response.data);
          else if (location === '/home/estoque/fontes') setFontes(response.data);
          else if (location === '/home/estoque/memoria_ram') setRAM(response.data);
          else if (location === '/home/estoque/monitores') setMonitores(response.data);
          else if (location === '/home/estoque/notebooks') setNotebooks(response.data);
          else if (location === '/home/estoque/nucs') setNucs(response.data);
          else if (location === '/home/estoque/perifericos') setPerifericos(response.data);
          else if (location === '/home/estoque/redes') setRedes(response.data);
          else if (location === '/home/estoque/telefonia') setTelefonia(response.data);
          else if (location === '/home/estoque/todos-componentes') setTodos(response.data);
        })
        .catch(error => {
          console.error('Erro ao atualizar a tabela:', error);
        });
    }
  };

  // Função para gerar o PDF da tabela visível
  const generateTablePDF = React.useCallback(() => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);

    // Data atual formatada
    const now = new Date();
    const dataStr = now.toLocaleDateString('pt-BR');
    const dataFile = now.toISOString().slice(0, 10);

    // Nome amigável para categoria
    const categoryNames = {
      '/home/estoque/adaptadores': 'adaptadores',
      '/home/estoque/armazenamento': 'armazenamento',
      '/home/estoque/cabos': 'cabos',
      '/home/estoque/desktops': 'desktops',
      '/home/estoque/fontes': 'fontes',
      '/home/estoque/memoria_ram': 'memoria_ram',
      '/home/estoque/monitores': 'monitores',
      '/home/estoque/notebooks': 'notebooks',
      '/home/estoque/nucs': 'nucs',
      '/home/estoque/perifericos': 'perifericos',
      '/home/estoque/redes': 'redes',
      '/home/estoque/telefonia': 'telefonia',
      '/home/estoque/todos-componentes': 'todos_componentes',
    };
    const categoria = categoryNames[location] || 'estoque';

    doc.text(`Relatório de Estoque - ${categoria.replace('_', ' ').toUpperCase()}`, 10, 10);
    doc.setFontSize(10);
    doc.text(`Data: ${dataStr}`, 10, 18);

    const columnsByPath = {
      '/home/estoque/adaptadores': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Conexão de Entrada", key: "inputConnection" },
        { label: "Conexão de Saída", key: "outputConnection" },
      ],
      '/home/estoque/armazenamento': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Capacidade", key: "capacity" },
        { label: "Interface", key: "interface" },
      ],
      '/home/estoque/cabos': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Comprimento", key: "comprimento" },
        { label: "Material", key: "material" },
      ],
      '/home/estoque/desktops': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
        { label: "Fonte de Alimentação", key: "fonte_alimentacao" },
      ],
      '/home/estoque/fontes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Potência Watts", key: "potencia_watts" },
        { label: "Modular", key: "modular" },
      ],
      '/home/estoque/memoria_ram': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Capacidade", key: "capacidade" },
        { label: "Tipo", key: "tipo" },
        { label: "Frequência", key: "frequencia" },
        { label: "Latência", key: "latencia" },
      ],
      '/home/estoque/monitores': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Polegadas", key: "tamanho_polegadas" },
        { label: "Resolução", key: "resolucao" },
        { label: "Painel", key: "tipo_painel" },
        { label: "Taxa", key: "taxa_atualizacao" },
        { label: "Conexões", key: "conexoes" },
      ],
      '/home/estoque/notebooks': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
        { label: "Tela", key: "tamanho_tela" },
        { label: "Bateria", key: "bateria" },
      ],
      '/home/estoque/nucs': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
      ],
      '/home/estoque/perifericos': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Conexões", key: "conexoes" },
        { label: "Marca", key: "marca" },
      ],
      '/home/estoque/redes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Velocidade", key: "velocidade" },
        { label: "Interface", key: "interface" },
        { label: "Protocolo Suportado", key: "protocolo_suportado" },
      ],
      '/home/estoque/telefonia': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Tecnologia", key: "tecnologia" },
        { label: "Compatibilidade", key: "compatibilidade" },
      ],
      '/home/estoque/todos-componentes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
      ],
    };

    const columns = columnsByPath[location] || columnsByPath['/home/estoque/todos-componentes'];
    const tableColumn = columns.map(col => col.label);

    const tableRows = filteredRows.map(item =>
      columns.map(col => {
        if (col.key === 'description') {
          return doc.splitTextToSize(item[col.key] || 'N/A', 60);
        }
        return item[col.key] !== undefined ? item[col.key] : 'N/A';
      })
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 24,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      columnStyles: {
        2: { cellWidth: 60 },
      },
      theme: 'grid',
      horizontalPageBreak: true,
    });

    doc.save(`estoque_${categoria}_${dataFile}.pdf`);
  }, [filteredRows, location]);

  // Permite que o componente pai acione o PDF
  React.useEffect(() => {
    if (onExportPDF) {
      onExportPDF(generateTablePDF);
    }
  }, [onExportPDF, generateTablePDF]);

  // Nova função para exportar apenas selecionados
  const exportSelectedPDF = () => {
    if (selected.length === 0) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('Relatório de Itens Selecionados', 10, 10);

    // Adiciona a data do relatório logo abaixo do título
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${formattedDate}`, 10, 17);

    const columnsByPath = {
      '/home/estoque/adaptadores': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Conexão de Entrada", key: "inputConnection" },
        { label: "Conexão de Saída", key: "outputConnection" },
      ],
      '/home/estoque/armazenamento': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Capacidade", key: "capacity" },
        { label: "Interface", key: "interface" },
      ],
      '/home/estoque/cabos': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "type" },
        { label: "Comprimento", key: "comprimento" },
        { label: "Material", key: "material" },
      ],
      '/home/estoque/desktops': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
        { label: "Fonte de Alimentação", key: "fonte_alimentacao" },
      ],
      '/home/estoque/fontes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Potência Watts", key: "potencia_watts" },
        { label: "Modular", key: "modular" },
      ],
      '/home/estoque/memoria_ram': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Capacidade", key: "capacidade" },
        { label: "Tipo", key: "tipo" },
        { label: "Frequência", key: "frequencia" },
        { label: "Latência", key: "latencia" },
      ],
      '/home/estoque/monitores': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Polegadas", key: "tamanho_polegadas" },
        { label: "Resolução", key: "resolucao" },
        { label: "Painel", key: "tipo_painel" },
        { label: "Taxa", key: "taxa_atualizacao" },
        { label: "Conexões", key: "conexoes" },
      ],
      '/home/estoque/notebooks': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
        { label: "Tela", key: "tamanho_tela" },
        { label: "Bateria", key: "bateria" },
      ],
      '/home/estoque/nucs': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Processador", key: "processador" },
        { label: "Memória RAM", key: "memoria_ram" },
        { label: "Armazenamento", key: "armazenamento" },
      ],
      '/home/estoque/perifericos': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Conexões", key: "conexoes" },
        { label: "Marca", key: "marca" },
      ],
      '/home/estoque/redes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Velocidade", key: "velocidade" },
        { label: "Interface", key: "interface" },
        { label: "Protocolo Suportado", key: "protocolo_suportado" },
      ],
      '/home/estoque/telefonia': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
        { label: "Tipo", key: "tipo" },
        { label: "Tecnologia", key: "tecnologia" },
        { label: "Compatibilidade", key: "compatibilidade" },
      ],
      '/home/estoque/todos-componentes': [
        { label: "Nome", key: "name" },
        { label: "Quantidade", key: "quantity" },
        { label: "Descrição", key: "description" },
        { label: "Estado", key: "state" },
        { label: "Local", key: "local" },
      ],
    };
    const columns = columnsByPath[location] || columnsByPath['/home/estoque/todos-componentes'];
    const tableColumn = columns.map(col => col.label);

    const selectedRows = filteredRows.filter(row => selected.includes(row.id));
    const tableRows = selectedRows.map(item =>
      columns.map(col => item[col.key] !== undefined ? item[col.key] : 'N/A')
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 },
      theme: 'grid',
    });

    doc.save('itens_selecionados.pdf');
  };

  // Detecta se está em mobile (xs/sm)
  const isMobile = useMediaQuery('(max-width:900px)');

  // Função para renderizar um card mobile para cada item
  function renderMobileCard(row: Item) {
    return (
      <Card key={row.id} sx={{ mb: 2, boxShadow: 'sm' }}>
        <Stack spacing={1}>
          <Typography level="title-md">{row.name}</Typography>
          <Typography level="body-xs" color="neutral">ID: {row.identification}</Typography>
          <Typography level="body-xs">Qtd: {row.quantity}</Typography>
          <Typography level="body-xs">Estado: {row.state}</Typography>
          <Typography level="body-xs">Local: {row.local}</Typography>
          {row.description && (
            <Typography level="body-xs" sx={{ wordBreak: 'break-word' }}>
              {row.description}
            </Typography>
          )}
          {/* Campos extras por categoria */}
          {location === '/home/estoque/armazenamento' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.type}</Typography>
              <Typography level="body-xs">Capacidade: {row.capacity}</Typography>
              <Typography level="body-xs">Interface: {row.interface}</Typography>
            </>
          )}
          {location === '/home/estoque/adaptadores' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.type}</Typography>
              <Typography level="body-xs">Entrada: {row.inputConnection}</Typography>
              <Typography level="body-xs">Saída: {row.outputConnection}</Typography>
            </>
          )}
          {location === '/home/estoque/cabos' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.type}</Typography>
              <Typography level="body-xs">Comprimento: {row.comprimento}</Typography>
              <Typography level="body-xs">Material: {row.material}</Typography>
            </>
          )}
          {location === '/home/estoque/desktops' && (
            <>
              <Divider />
              <Typography level="body-xs">Processador: {row.processador}</Typography>
              <Typography level="body-xs">RAM: {row.memoria_ram}</Typography>
              <Typography level="body-xs">Armazenamento: {row.armazenamento}</Typography>
              <Typography level="body-xs">Fonte: {row.fonte_alimentacao}</Typography>
            </>
          )}
          {location === '/home/estoque/fontes' && (
            <>
              <Divider />
              <Typography level="body-xs">Potência: {row.potencia_watts}</Typography>
              <Typography level="body-xs">Modular: {row.modular}</Typography>
            </>
          )}
          {location === '/home/estoque/memoria_ram' && (
            <>
              <Divider />
              <Typography level="body-xs">Capacidade: {row.capacidade}</Typography>
              <Typography level="body-xs">Tipo: {row.tipo}</Typography>
              <Typography level="body-xs">Frequência: {row.frequencia}</Typography>
              <Typography level="body-xs">Latência: {row.latencia}</Typography>
            </>
          )}
          {location === '/home/estoque/monitores' && (
            <>
              <Divider />
              <Typography level="body-xs">Polegadas: {row.tamanho_polegadas}</Typography>
              <Typography level="body-xs">Resolução: {row.resolucao}</Typography>
              <Typography level="body-xs">Painel: {row.tipo_painel}</Typography>
              <Typography level="body-xs">Taxa: {row.taxa_atualizacao}</Typography>
              <Typography level="body-xs">Conexões: {row.conexoes}</Typography>
            </>
          )}
          {location === '/home/estoque/notebooks' && (
            <>
              <Divider />
              <Typography level="body-xs">Processador: {row.processador}</Typography>
              <Typography level="body-xs">RAM: {row.memoria_ram}</Typography>
              <Typography level="body-xs">Armazenamento: {row.armazenamento}</Typography>
              <Typography level="body-xs">Tela: {row.tamanho_tela}</Typography>
              <Typography level="body-xs">Bateria: {row.bateria}</Typography>
            </>
          )}
          {location === '/home/estoque/nucs' && (
            <>
              <Divider />
              <Typography level="body-xs">Processador: {row.processador}</Typography>
              <Typography level="body-xs">RAM: {row.memoria_ram}</Typography>
              <Typography level="body-xs">Armazenamento: {row.armazenamento}</Typography>
            </>
          )}
          {location === '/home/estoque/perifericos' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.tipo}</Typography>
              <Typography level="body-xs">Conexões: {row.conexoes}</Typography>
              <Typography level="body-xs">Marca: {row.marca}</Typography>
            </>
          )}
          {location === '/home/estoque/redes' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.tipo}</Typography>
              <Typography level="body-xs">Velocidade: {row.velocidade}</Typography>
              <Typography level="body-xs">Interface: {row.interface}</Typography>
              <Typography level="body-xs">Protocolo: {row.protocolo_suportado}</Typography>
            </>
          )}
          {location === '/home/estoque/telefonia' && (
            <>
              <Divider />
              <Typography level="body-xs">Tipo: {row.tipo}</Typography>
              <Typography level="body-xs">Tecnologia: {row.tecnologia}</Typography>
              <Typography level="body-xs">Compatibilidade: {row.compatibilidade}</Typography>
            </>
          )}
          <Divider />
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
            <Link
              level="body-xs"
              component="button"
              onClick={() => generateRowPDF(row)}
            >
              Download
            </Link>
            <RowMenu
              row={row}
              onSave={handleSave}
            />
          </Box>
        </Stack>
      </Card>
    );
  }

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
        {alert.message && (
          <Box sx={{ mb: 2 }}>
            <BasicAlert
              severity={alert.severity}
              message={alert.message}
              onClose={() => setAlert({ severity: '', message: '' })}
            />
          </Box>
        )}
        <Box sx={{ mb: 1, display: 'flex', gap: 2 }}>
          <Button
            size="sm"
            variant="outlined"
            color="primary"
            sx={{
              alignSelf: 'end',
              display: selected.length === 0 ? 'none' : 'inline-flex'
            }}
            onClick={exportSelectedPDF}
          >
            Exportar Selecionados em PDF
          </Button>
        </Box>
        {/* Renderização condicional: cards no mobile, tabela no desktop */}
        <Box sx={{ width: '100%', flex: '1 1 auto', minHeight: 0, maxHeight: '95vh', overflow: 'auto' }}>
          {isMobile ? (
            <Box>
              {filteredRows.length === 0 ? (
                <Typography level="body-xs" sx={{ mt: 2, textAlign: 'center' }}>
                  Nenhum ativo encontrado.
                </Typography>
              ) : (
                filteredRows.map(renderMobileCard)
              )}
            </Box>
          ) : (
            <Sheet
              sx={{
                display: { xs: 'none', sm: 'initial' },
                width: '100%',
                borderRadius: 'sm',
                flexShrink: 1,
                overflow: 'auto',
                minHeight: 0,
                maxHeight: '95vh',
                flex: '1 1 auto',
              }}
            >
              <Table
                aria-labelledby="tableTitle"
                stickyHeader
                hoverRow
                sx={{
                  '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                  '--Table-headerUnderlineThickness': '1px',
                  '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                  '--TableCell-paddingY': '4px',
                  '--TableCell-paddingX': '8px',
                }}
              >
                <thead>
                  <tr>
                    <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                      <Checkbox
                        size="sm"
                        indeterminate={
                          selected.length > 0 && selected.length !== filteredRows.length
                        }
                        checked={selected.length === filteredRows.length}
                        onChange={(event) => {
                          setSelected(
                            event.target.checked ? filteredRows.map((row) => row.id) : [],
                          );
                        }}
                        color={
                          selected.length > 0 || selected.length === filteredRows.length
                            ? 'primary'
                            : undefined
                        }
                        sx={{ verticalAlign: 'text-bottom' }}
                      />
                    </th>
                    <th style={{ width: 120, padding: '12px 6px' }}>
                      <Link
                        underline="none"
                        color="primary"
                        component="button"
                        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                        endDecorator={<ArrowDropDownIcon />}
                        sx={[
                          {
                            fontWeight: 'lg',
                            '& svg': {
                              transition: '0.2s',
                              transform:
                                order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                            },
                          },
                          order === 'desc'
                            ? { '& svg': { transform: 'rotate(0deg)' } }
                            : { '& svg': { transform: 'rotate(180deg)' } },
                        ]}
                      >
                        Número
                      </Link>
                    </th>
                    <th style={{ width: 100, padding: '12px 6px' }}>Nome</th>
                    <th style={{ width: 100, padding: '12px 6px' }}>Quantidade</th>
                    <th style={{ width: 120, padding: '12px 6px' }}>Descrição</th>
                    <th style={{ width: 100, padding: '12px 6px' }}>Estado</th>
                    <th style={{ width: 100, padding: '12px 6px' }}>Local</th>
                    {location === '/home/estoque/armazenamento' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Capacidade</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Interface</th>
                      </>
                    )}
                    {location === '/home/estoque/adaptadores' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Conexão de Entrada</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Conexão de Saída</th>
                      </>
                    )}
                    {location === '/home/estoque/cabos' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Comprimento</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Material</th>
                      </>
                    )}
                    {location === '/home/estoque/desktops' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Processador</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Memória RAM</th>
                        <th style={{ width: 140, padding: '12px 6px' }}>Armazenamento</th>
                        <th style={{ width: 160, padding: '12px 6px' }}>Fonte de Alimentação</th>
                      </>
                    )}

                    {location === '/home/estoque/fontes' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Potência Watts</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Modular</th>
                      </>
                    )}
                    {location === '/home/estoque/memoria_ram' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Capacidade</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Frequência</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Latência</th>
                      </>
                    )}
                    {location === '/home/estoque/monitores' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Polegadas</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Resolução</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Painel</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Taxa</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Conexões</th>
                      </>
                    )}
                    {location === '/home/estoque/notebooks' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Processador</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Memória RAM</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Armazenamento</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tela</th>
                        <th style={{ width: 100, padding: '12px 6px' }}>Bateria</th>
                      </>
                    )}
                    {location === '/home/estoque/nucs' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Processador</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Memória RAM</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Armazenamento</th>
                      </>
                    )}
                    {location === '/home/estoque/perifericos' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Conexões</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Marca</th>
                      </>
                    )}
                    {location === '/home/estoque/redes' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Velocidade</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Interface</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Protocolo Suportado</th>
                      </>
                    )}
                    {location === '/home/estoque/telefonia' && (
                      <>
                        <th style={{ width: 100, padding: '12px 6px' }}>Tipo</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Tecnologia</th>
                        <th style={{ width: 120, padding: '12px 6px' }}>Compatibilidade</th>
                      </>
                    )}
                    <th style={{ width: 140, padding: '12px 6px' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredRows].sort(getComparator(order, 'id')).map((row) => (
                    <tr key={row.id}>
                      <td style={{ textAlign: 'center', width: 120, overflowWrap: 'anywhere' }}>
                        <Checkbox
                          size="sm"
                          checked={selected.includes(row.id)}
                          color={selected.includes(row.id) ? 'primary' : undefined}
                          onChange={(event) => {
                            setSelected((ids) =>
                              event.target.checked
                                ? ids.concat(row.id as string | number)
                                : ids.filter((itemId) => itemId !== row.id),
                            );
                          }}
                          slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                          sx={{ verticalAlign: 'text-bottom' }}
                        />
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.identification}</Typography>
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.name}</Typography>
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.quantity}</Typography>
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.description}</Typography>
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.state}</Typography>
                      </td>
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Typography level="body-xs">{row.local}</Typography>
                      </td>
                      {location === '/home/estoque/armazenamento' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.type}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.capacity}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.interface}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/adaptadores' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.type}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.inputConnection}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.outputConnection}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/cabos' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.type}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.comprimento}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.material}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/desktops' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.processador}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.memoria_ram}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.armazenamento}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.fonte_alimentacao}</Typography>
                          </td>
                        </>
                      )}

                      {location === '/home/estoque/fontes' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.potencia_watts}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">
                              {row.modular}
                            </Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/memoria_ram' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.capacidade}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tipo}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.frequencia}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.latencia}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/monitores' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tamanho_polegadas}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.resolucao}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tipo_painel}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.taxa_atualizacao}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.conexoes}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/notebooks' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.processador}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.memoria_ram}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.armazenamento}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tamanho_tela}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.bateria}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/nucs' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.processador}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.memoria_ram}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.armazenamento}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/perifericos' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tipo}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.conexoes}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.marca}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/redes' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tipo}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.velocidade}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.interface}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.protocolo_suportado}</Typography>
                          </td>
                        </>
                      )}
                      {location === '/home/estoque/telefonia' && (
                        <>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tipo}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.tecnologia}</Typography>
                          </td>
                          <td style={{ overflowWrap: 'anywhere' }}>
                            <Typography level="body-xs">{row.compatibilidade}</Typography>
                          </td>
                        </>
                      )}
                      <td style={{ overflowWrap: 'anywhere' }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Link
                            level="body-xs"
                            component="button"
                            onClick={() => generateRowPDF(row)}
                          >
                            Download
                          </Link>
                          <RowMenu
                            row={row}
                            onSave={handleSave}
                          />
                        </Box>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
}
