import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import config from '../../config';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { useEffect } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import RowMenu from '../RowMenu/RowMenu.tsx';

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
  tipo: string;
  quantidade: number[];
};

export default function AtivosTable({ estado, local, tipo, quantidade }: AtivosTableProps) {
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

  const [todos, setTodos] = React.useState([]);

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

  const originalFilteredRows: Item[] = location === '/home/estoque/adaptadores'
    ? adaptadores.map(adaptador => ({
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
      }))
    : location === '/home/estoque/armazenamento'
      ? armazenamento.map(item => ({
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
        }))
      : location === '/home/estoque/cabos'
        ? cabos.map(item => ({
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
          }))
        : location === '/home/estoque/desktops'
          ? desktops.map(item => ({
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
            fonte_alimentacao: item[11]
          }))
          : location === '/home/estoque/fontes'
            ? fontes.map(item => ({
              id: item[0],
              name: item[1],
              category: item[2],
              quantity: item[3],
              description: item[4],
              identification: item[5],
              state: item[6],
              local: item[7],
              potencia_watts: item[8],
              modular: item[9]
            }))
            : location === '/home/estoque/memoria_ram'
              ? ram.map(item => ({
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
                latencia: item[11]
              }))
              : location === '/home/estoque/monitores'
                ? monitores.map(item => ({
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
                  conexoes: item[12]
                }))
                : location === '/home/estoque/notebooks'
                  ? notebooks.map(item => ({
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
                    bateria: item[12]
                  }))
                  : location === '/home/estoque/nucs'
                    ? nucs.map(item => ({
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
                      armazenamento: item[10]
                    }))
                    : location === '/home/estoque/perifericos'
                      ? perifericos.map(item => ({
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
                        marca: item[10]
                      }))
                      : location === '/home/estoque/redes'
                        ? redes.map(item => ({
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
                          protocolo_suportado: item[11]
                        }))
                        : location === '/home/estoque/telefonia'
                          ? telefonia.map(item => ({
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
                            compatibilidade: item[10]
                          }))
                          : location === '/home/estoque/todos-componentes'
                          ? todos.map(item => ({
                            id: item[0],
                            name: item[1],
                            category: item[2],
                            quantity: item[3],
                            description: item[4],
                            identification: item[5],
                            state: item[6],
                            local: item[7]
                          }))
                          : []; 

  const filteredRows = React.useMemo(() => {
    return [...originalFilteredRows].filter((row) => {
        return (
            (!estado || row.state === estado) &&
            (!local || row.local === local) &&
            row.quantity >= quantidade[0] &&
            row.quantity <= quantidade[1]
        );
    });
}, [originalFilteredRows, estado, local, quantidade]); 

function generateRowPDF(row) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(`Relatório do Ativo: ${row.name}`, 10, 10);

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

  const tableRows = Object.entries(row)
    .filter(([key]) => key !== "id") 
    .map(([key, value]) => [translations[key] || key, value || "N/A"]);

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

  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '90%' }}>
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
                  <td style={{ textAlign: 'center', width: 120 }}>
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
                  <td>
                    <Typography level="body-xs">{row.identification}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.name}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.quantity}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.description}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.state}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.local}</Typography>
                  </td>
                  {location === '/home/estoque/armazenamento' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.type}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.capacity}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.interface}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/adaptadores' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.type}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.inputConnection}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.outputConnection}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/cabos' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.type}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.comprimento}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.material}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/desktops' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.processador}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.memoria_ram}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.armazenamento}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.fonte_alimentacao}</Typography>
                      </td>
                    </>
                  )}

                  {location === '/home/estoque/fontes' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.potencia_watts}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">
                          {row.modular === 1 ? 'Sim' : row.modular === 0 ? 'Não' : 'N/A'}
                        </Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/memoria_ram' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.capacidade}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.tipo}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.frequencia}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.latencia}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/monitores' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.tamanho_polegadas}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.resolucao}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.tipo_painel}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.taxa_atualizacao}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.conexoes}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/notebooks' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.processador}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.memoria_ram}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.armazenamento}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.tamanho_tela}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.bateria}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/nucs' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.processador}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.memoria_ram}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.armazenamento}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/perifericos' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.tipo}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.conexoes}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.marca}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/redes' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.tipo}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.velocidade}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.interface}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.protocolo_suportado}</Typography>
                      </td>
                    </>
                  )}
                  {location === '/home/estoque/telefonia' && (
                    <>
                      <td>
                        <Typography level="body-xs">{row.tipo}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.tecnologia}</Typography>
                      </td>
                      <td>
                        <Typography level="body-xs">{row.compatibilidade}</Typography>
                      </td>
                    </>
                  )}
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Link
                        level="body-xs"
                        component="button"
                        onClick={() => generateRowPDF(row)} 
                      >
                        Download
                      </Link>
                      <RowMenu />
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>
    </React.Fragment>
  );
}
