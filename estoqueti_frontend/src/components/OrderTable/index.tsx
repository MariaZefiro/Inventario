import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import { useState, useEffect } from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import CircularProgress from '@mui/joy/CircularProgress';
import config from "../../config";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CryptoJS from 'crypto-js';

type Order = 'asc' | 'desc';

interface OrderTableProps {
  data: any[];
  type: 'entradas_saidas' | 'logs';
  onFilteredChange?: (filtered: any[]) => void;
}

export default function OrderTable({ data, type, onFilteredChange }: OrderTableProps) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<string>('id');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [userFilter, setUserFilter] = React.useState<string | null>(null);
  const [dateFilter, setDateFilter] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [manageOpen, setManageOpen] = React.useState(false);
  const [manageRow, setManageRow] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);
  const [refresh, setRefresh] = React.useState(0);
  const [userCargo, setUserCargo] = useState('');
  const backendIp = config.backend_ip;
  const secretKey = config.secretKey;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    const cachedData = localStorage.getItem('userData');
    if (!cachedData) return null; // Retorna null se não houver dados no localStorage

    try {
      // Descriptografar o dado
      const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      setUserCargo(decryptedData.admin);
    } catch (error) {
      console.error('Erro ao descriptografar os dados:', error);
      return null; // Retorna null se ocorrer um erro na descriptografia
    }
  };

  const users = React.useMemo(() => {
    if (type !== 'entradas_saidas') return [];
    const set = new Set<string>();
    data.forEach(item => {
      if (item.customer?.name) set.add(item.customer.name);
    });
    return Array.from(set);
  }, [data, type]);

  // Filtros e busca para entradas/saídas
  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    if (type === 'entradas_saidas') {
      if (statusFilter && statusFilter !== 'Todos') {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }
      // Ajuste: filtra por movimentacao (Entrada/Retirada)
      if (categoryFilter && categoryFilter !== 'Todas') {
        filtered = filtered.filter((item) => item.movimentacao === categoryFilter);
      }
      if (userFilter && userFilter !== 'Todos') {
        filtered = filtered.filter((item) => item.customer?.name === userFilter);
      }
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter((item) =>
          (item.id && item.id.toString().includes(lowerQuery)) ||
          (item.date && item.date.toLowerCase().includes(lowerQuery)) ||
          (item.status && item.status.toLowerCase().includes(lowerQuery)) ||
          (item.customer?.name && item.customer.name.toLowerCase().includes(lowerQuery)) ||
          (item.customer?.email && item.customer.email.toLowerCase().includes(lowerQuery)) ||
          (item.ativo?.nome && item.ativo.nome.toLowerCase().includes(lowerQuery)) ||
          (item.movimentacao && item.movimentacao.toLowerCase().includes(lowerQuery))
        );
      }
    } else if (type === 'logs') {
      if (dateFilter) {
        filtered = filtered.filter((log) => {
          const logDate = log.date.split(' ')[0].split('/').reverse().join('-');
          return logDate === dateFilter;
        });
      }
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (log) =>
            log.date.toLowerCase().includes(lowerQuery) ||
            log.user.toLowerCase().includes(lowerQuery) ||
            log.name.toLowerCase().includes(lowerQuery) ||
            log.active.toLowerCase().includes(lowerQuery) ||
            log.id.toString().includes(lowerQuery)
        );
      }
      if (userFilter && userFilter !== 'Todos') {
        filtered = filtered.filter((log) => log.user === userFilter);
      }
    }
    return filtered;
  }, [data, type, statusFilter, categoryFilter, userFilter, searchQuery, dateFilter]);

  // Ordenação dos dados filtrados
  const sortedData = React.useMemo(() => {
    if (type !== 'entradas_saidas') return filteredData;
    const sorted = [...filteredData];
    if (orderBy === 'id') {
      sorted.sort((a, b) => {
        // Remove '#' e zeros à esquerda antes de converter para número
        const parseId = (id: any) => {
          if (typeof id === 'number') return id;
          if (typeof id === 'string') {
            // Remove tudo que não for dígito
            const clean = id.replace(/[^0-9]/g, '');
            return Number(clean);
          }
          return 0;
        };
        const aId = parseId(a.id);
        const bId = parseId(b.id);
        if (order === 'asc') return aId - bId;
        return bId - aId;
      });
    }
    // Pode adicionar outras colunas aqui se quiser ordenar por outras colunas no futuro
    return sorted;
  }, [filteredData, order, orderBy, type]);

  // Notifica o componente pai sempre que filteredData mudar
  React.useEffect(() => {
    if (onFilteredChange) onFilteredChange(filteredData);
  }, [filteredData, onFilteredChange]);

  // Filtros dinâmicos para entradas/saídas
  const renderFilters = () => {
    if (type === 'entradas_saidas') {
      return (
        <React.Fragment>
          <FormControl size="sm">
            <FormLabel>Status</FormLabel>
            <Select
              size="sm"
              placeholder="Todos"
              value={statusFilter || 'Todos'}
              onChange={(event, newValue) => setStatusFilter(newValue)}
              slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            >
              <Option value="Todos">Todos</Option>
              <Option value="Pendente">Pendente</Option>
              <Option value="Concluído">Concluído</Option>
              <Option value="Recusado">Recusado</Option>
            </Select>
          </FormControl>
          <FormControl size="sm">
            <FormLabel>Categoria</FormLabel>
            <Select
              size="sm"
              placeholder="Todas"
              value={categoryFilter || 'Todas'}
              onChange={(event, newValue) => setCategoryFilter(newValue)}
            >
              <Option value="Todas">Todas</Option>
              <Option value="Entrada">Entrada</Option>
              <Option value="Retirada">Retirada</Option>
            </Select>
          </FormControl>
          <FormControl size="sm">
            <FormLabel>Usuário</FormLabel>
            <Select
              size="sm"
              placeholder="Todos"
              value={userFilter || 'Todos'}
              onChange={(event, newValue) => setUserFilter(newValue)}
            >
              <Option value="Todos">Todos</Option>
              {users.map((user) => (
                <Option key={user} value={user}>{user}</Option>
              ))}
            </Select>
          </FormControl>
        </React.Fragment>
      );
    } else if (type === 'logs') {
      return (
        <React.Fragment>
          <FormControl size="sm">
            <FormLabel>Data</FormLabel>
            <Input
              size="sm"
              type="date"
              value={dateFilter || ''}
              onChange={(event) => setDateFilter(event.target.value)}
            />
          </FormControl>
        </React.Fragment>
      );
    }
  };

  const handleAction = async (acao: 'aprovado' | 'recusado') => {
    if (!manageRow) return;
    setLoading(true);
    setActionMsg(null);
    try {
      const res = await fetch(`${backendIp}/api/validador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: manageRow.item_id, acao }),
      });
      const result = await res.json();
      if (res.ok) {
        setActionMsg(result.message || 'Sucesso');
        setTimeout(() => {
          setManageOpen(false);
          setActionMsg(null);
          setLoading(false);
          setRefresh(r => r + 1);
        }, 1000);
      } else {
        setActionMsg('Erro ao realizar validação!');
        setLoading(false);
      }
    } catch (e) {
      setActionMsg('Erro de conexão');
      setLoading(false);
    }
  };

  function generateRowPDF(row: any) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Relatório de Entrada/Saída', 10, 10);

    // Adiciona a data do relatório logo abaixo do título
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${formattedDate}`, 10, 17);

    const tableColumn = ["Campo", "Valor"];
    const tableRows = [
      ["Número", row.id || ''],
      ["Data", row.date || ''],
      ["Status", row.status || ''],
      ["Usuário", row.customer?.name || ''],
      ["Email", row.customer?.email || ''],
      ["Ativo", row.ativo?.nome || ''],
      ["Descrição do Ativo", row.ativo?.descricao || ''],
      ["Movimentação", row.movimentacao || ''],
      ["Quantidade", row.quantidade || ''],
    ];

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 },
    });

    doc.save(`entrada_saida_${row.id || 'detalhe'}.pdf`);
  }

  // Função para exportar selecionados em PDF
  const exportSelectedPDF = () => {
    if (selected.length === 0) return;
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(14);
    doc.text('Relatório de Entradas/Saídas Selecionadas', 10, 10);

    // Adiciona a data do relatório logo abaixo do título
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR');
    doc.setFontSize(10);
    doc.text(`Data do relatório: ${formattedDate}`, 10, 17);

    const tableColumn = [
      "Número", "Data", "Status", "Usuário", "Email", "Ativo", "Descrição do Ativo", "Movimentação", "Quantidade"
    ];

    // Filtra os selecionados apenas do que está visível (filtrado)
    const selectedRows = filteredData.filter(row => selected.includes(row.id));
    const tableRows = selectedRows.map(row => [
      row.id || '',
      row.date || '',
      row.status || '',
      row.customer?.name || '',
      row.customer?.email || '',
      row.ativo?.nome || '',
      row.ativo?.descricao || '',
      row.movimentacao || '',
      row.quantidade || '',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 },
      theme: 'grid',
    });

    doc.save('entradas_saidas_selecionadas.pdf');
  };

  React.useEffect(() => {
    // Forçar atualização dos dados após ação
    if (refresh > 0 && typeof window !== "undefined") {
      // Simplesmente recarrega a página ou pode disparar um evento para o componente pai recarregar os dados
      window.location.reload();
    }
  }, [refresh]);

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Buscar"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1, border: '1px solid #a2a2a2' }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filtros
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Enviar
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Buscar</FormLabel>
          <Input
            size="sm"
            placeholder="Buscar"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            startDecorator={<SearchIcon />}
            sx={{ border: '1px solid #a2a2a2' }}
          />
        </FormControl>
        {renderFilters()}
      </Box>
      {/* Botão exportar PDF responsivo */}
      {type === 'entradas_saidas' && (
        <Box
          sx={{
            mb: 1,
            display: selected.length === 0 ? 'none' : 'flex',
            gap: 2,
            justifyContent: { xs: 'flex-end', sm: 'flex-start' },
            width: '100%',
          }}
        >
          <Button
            size="sm"
            variant="outlined"
            color="primary"
            onClick={exportSelectedPDF}
            sx={{
              alignSelf: 'end',
              // O botão aparece em todas as telas agora
            }}
          >
            Exportar Selecionados em PDF
          </Button>
        </Box>
      )}
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          maxHeight: '100%',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            border: '1px solid rgba(162, 162, 162, 0.14)',
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              {type === 'entradas_saidas' && (
                <>
                  <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                    <Checkbox
                      size="sm"
                      indeterminate={
                        selected.length > 0 && selected.length !== data.length
                      }
                      checked={selected.length === data.length}
                      onChange={(event) => {
                        setSelected(
                          event.target.checked ? data.map((_, index) => index.toString()) : [],
                        );
                      }}
                      color={
                        selected.length > 0 || selected.length === data.length
                          ? 'primary'
                          : undefined
                      }
                      sx={{ verticalAlign: 'text-bottom' }}
                    />
                  </th>
                  <th style={{ width: 120, padding: '12px 12px 12px 5px' }}>
                    <Link
                      underline="none"
                      color="primary"
                      component="button"
                      onClick={() => {
                        setOrder(order === 'asc' ? 'desc' : 'asc');
                        setOrderBy('id');
                      }}
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
                  <th style={{ padding: '12px', width: 160 }}>Data</th>
                  <th style={{ padding: '12px', width: 190 }}>Status</th>
                  <th style={{ padding: '12px', width: 320 }}>Usuário</th>
                  <th style={{ padding: '12px', width: 320 }}>Ativo</th>
                  <th style={{ padding: '12px 12px 12px 5px', width: 130 }}>Movimentação</th>
                  <th style={{ padding: '12px 12px 12px 5px', width: 120 }}>Quantidade</th>
                  <th style={{ padding: '12px' }}></th>
                </>
              )}
              {type === 'logs' && (
                <>
                  <th style={{ padding: '12px' }}>Data</th>
                  <th style={{ padding: '12px' }}>Usuário</th>
                  <th style={{ padding: '12px' }}>Movimentação</th>
                  <th style={{ padding: '12px' }}>Identificação</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {type === 'entradas_saidas' &&
              sortedData.map((row: any) => (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center', width: 48 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? 'primary' : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id)
                            : ids.filter((itemId) => itemId !== row.id),
                        );
                      }}
                      sx={{ verticalAlign: 'text-bottom' }}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs">{row.id}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.date}</Typography>
                  </td>
                  <td>
                    <Chip
                      variant="soft"
                      size="sm"
                      startDecorator={
                        {
                          Concluído: <CheckRoundedIcon />,
                          Recusado: <BlockIcon />,
                          Cancelado: <BlockIcon />,
                          Pendente: <AutorenewRoundedIcon />,
                        }[row.status]
                      }
                      color={
                        {
                          Concluído: 'success',
                          Recusado: 'danger',
                          Cancelado: 'danger',
                          Pendente: 'warning',
                        }[row.status] as ColorPaletteProp
                      }
                    >
                      {row.status}
                    </Chip>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar size="sm">{row.customer.initial}</Avatar>
                      <div>
                        <Typography level="body-xs">{row.customer.name}</Typography>
                        <Typography level="body-xs">@{row.customer.email}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.ativo?.nome}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.movimentacao}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.quantidade}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Link
                        level="body-xs"
                        component="button"
                        onClick={() => generateRowPDF(row)}
                      >
                        Download
                      </Link>
                      {userCargo == 'admin' && row.status == 'Pendente' && (
                        <Link
                          level="body-xs"
                          component="button"
                          onClick={() => {
                            setManageRow(row);
                            setManageOpen(true);
                          }}
                        >
                          Gerenciar
                        </Link>
                      )}
                    </Box>
                  </td>
                </tr>
              ))}
            {type === 'logs' &&
              filteredData.map((log: any, index: number) => (
                <tr key={index}>
                  <td>{log.date}</td>
                  <td>{log.user} - {log.name}</td>
                  <td>{log.active}</td>
                  <td>#{log.id}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        sx={{
          display: { xs: 'block', sm: 'none' },
          width: '100%',
          overflowY: 'auto',
          maxHeight: '100%',
        }}
      >
        {type === 'entradas_saidas' && filteredData.length === 0 && (
          <Typography level="body-md" sx={{ textAlign: 'center', mt: 2 }}>
            Nenhum registro encontrado.
          </Typography>
        )}
        {type === 'entradas_saidas' &&
          sortedData.map((row: any) => (
            <Sheet
              key={row.id}
              variant="outlined"
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: 'sm',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography level="body-sm" fontWeight={700}>{row.id}</Typography>
                <Chip
                  size="sm"
                  variant="soft"
                  color={
                    {
                      Concluído: 'success',
                      Recusado: 'danger',
                      Cancelado: 'danger',
                      Pendente: 'warning',
                    }[row.status] as ColorPaletteProp
                  }
                  startDecorator={
                    {
                      Concluído: <CheckRoundedIcon />,
                      Recusado: <BlockIcon />,
                      Cancelado: <BlockIcon />,
                      Pendente: <AutorenewRoundedIcon />,
                    }[row.status]
                  }
                >
                  {row.status}
                </Chip>
              </Box>
              <Typography level="body-xs">{row.date}</Typography>
              <Typography level="body-xs">
                <b>Usuário:</b> {row.customer?.name}
              </Typography>
              <Typography level="body-xs">
                <b>Ativo:</b> {row.ativo?.nome}
              </Typography>
              <Typography level="body-xs">
                <b>Movimentação:</b> {row.movimentacao}
              </Typography>
              <Typography level="body-xs">
                <b>Quantidade:</b> {row.quantidade}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => generateRowPDF(row)}
                >
                  Download
                </Button>
                {userCargo == 'admin' && row.status == 'Pendente' && (
                  <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    onClick={() => {
                      setManageRow(row);
                      setManageOpen(true);
                    }}
                  >
                    Gerenciar
                  </Button>
                )}
              </Box>
            </Sheet>
          ))}
        {type === 'logs' && filteredData.length === 0 && (
          <Typography level="body-md" sx={{ textAlign: 'center', mt: 2 }}>
            Nenhum registro encontrado.
          </Typography>
        )}
        {type === 'logs' &&
          filteredData.map((log: any, index: number) => (
            <Sheet
              key={index}
              variant="outlined"
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                boxShadow: 'sm',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              <Typography level="body-sm" fontWeight={700}>{log.date}</Typography>
              <Typography level="body-xs"><b>Usuário:</b> {log.user} - {log.name}</Typography>
              <Typography level="body-xs"><b>Movimentação:</b> {log.active}</Typography>
              <Typography level="body-xs"><b>Identificação:</b> #{log.id}</Typography>
            </Sheet>
          ))}
      </Box>
      <Modal
        sx={{
          zIndex: '10001',
          width: { xs: '95vw', sm: 450 },
          maxWidth: 500,
          mx: 'auto',
        }}
        open={manageOpen}
        onClose={() => { setManageOpen(false); setManageRow(null); setActionMsg(null); }}
      >
        <ModalDialog
          layout="center"
          sx={{
            borderRadius: '8px',
            boxShadow: 'lg',
            p: 3,
            minWidth: { xs: 280, sm: 600 },
            bgcolor: 'background.body',
            overflowY: 'scroll',
          }}
        >
          <ModalClose />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <InventoryIcon color="primary" sx={{ fontSize: 25 }} />
            <Typography level="h4" sx={{ fontWeight: 700 }}>
              Gerenciar Movimentação
            </Typography>
          </Box>
          {manageRow && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '20px',
                background: 'var(--joy-palette-background-level1)',
                borderRadius: 2,
                p: 2,
              }}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography level="body-sm" color="neutral">Número:</Typography>
                <Typography level="body-md">{manageRow.id}</Typography>
              </Box>
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography level="body-sm" color="neutral">Data:</Typography>
                <Typography level="body-md">{manageRow.date}</Typography>
              </Box>
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography level="body-sm" color="neutral">Status:</Typography>
                <Chip
                  size="sm"
                  variant="solid"
                  color={
                    {
                      Concluído: 'success',
                      Recusado: 'neutral',
                      Cancelado: 'danger',
                      Pendente: 'warning',
                    }[manageRow.status] as ColorPaletteProp
                  }
                  startDecorator={
                    {
                      Concluído: <CheckRoundedIcon />,
                      Recusado: <AutorenewRoundedIcon />,
                      Cancelado: <BlockIcon />,
                      Pendente: <AutorenewRoundedIcon />,
                    }[manageRow.status]
                  }
                  sx={{ fontWeight: 600 }}
                >
                  {manageRow.status}
                </Chip>
              </Box>
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography level="body-sm" color="neutral">Usuário:</Typography>
                <Typography level="body-md">{manageRow.customer?.name}</Typography>
              </Box>
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography level="body-sm" color="neutral">Ativo:</Typography>
                <Typography level="body-md">
                  {manageRow.ativo?.nome}
                  {manageRow.ativo?.serial && (
                    <span style={{ marginLeft: 15 }}>
                      <Typography level="body-sm" color="neutral">Serial Number: </Typography>
                      <Typography level="body-md">{manageRow.ativo.serial}</Typography>
                    </span>
                  )}
                </Typography>
              </Box>
              <Divider sx={{ gridColumn: '1 / -1' }} />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Typography level="body-sm" color="neutral">Movimentação:</Typography>
                <Typography level="body-md">{manageRow.movimentacao} de {manageRow.quantidade} ativos.</Typography>
              </Box>
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          {actionMsg && (
            <Typography
              color={actionMsg.toLowerCase().includes('erro') ? 'danger' : 'success'}
              sx={{ mb: 1, textAlign: 'center', fontWeight: 600 }}
            >
              {actionMsg}
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 2, mt: 1, justifyContent: 'center', position: 'relative', minHeight: 40 }}>
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  zIndex: 2,
                  borderRadius: 1,
                }}
              >
                <CircularProgress size="md" />
              </Box>
            )}
            <Button
              color="primary"
              disabled={loading}
              variant="solid"
              sx={{ minWidth: 120, fontWeight: 600 }}
              onClick={() => handleAction('aprovado')}
              startDecorator={<CheckRoundedIcon />}
            >
              Aprovar
            </Button>
            <Button
              color="danger"
              disabled={loading}
              variant="solid"
              sx={{ minWidth: 120, fontWeight: 600 }}
              onClick={() => handleAction('recusado')}
              startDecorator={<BlockIcon />}
            >
              Recusar
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
