import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
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

interface OrderTableProps {
  data: any[];
  type: 'orders' | 'logs';
}

export default function OrderTable({ data, type }: OrderTableProps) {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);

  // State for filters
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
  const [userFilter, setUserFilter] = React.useState<string | null>(null);
  const [dateFilter, setDateFilter] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const filteredData = React.useMemo(() => {
    let filtered = [...data];
    if (type === 'orders') {
      if (statusFilter) {
        filtered = filtered.filter((item) => item.status === statusFilter);
      }
      if (categoryFilter && categoryFilter !== 'Todas') {
        filtered = filtered.filter((item) => item.category === categoryFilter);
      }
      if (userFilter && userFilter !== 'Todos') {
        filtered = filtered.filter((item) => item.customer.name === userFilter);
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
  }, [data, type, statusFilter, categoryFilter, userFilter, dateFilter, searchQuery]);

  const renderFilters = () => {
    if (type === 'orders') {
      return (
        <React.Fragment>
          <FormControl size="sm">
            <FormLabel>Status</FormLabel>
            <Select
              size="sm"
              placeholder="Filtrar pelo status"
              value={statusFilter || ''}
              onChange={(event, newValue) => setStatusFilter(newValue)}
              slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            >
              <Option value="pending">Pendente</Option>
              <Option value="refunded">Recusado</Option>
              <Option value="cancelled">Cancelado</Option>
            </Select>
          </FormControl>
          <FormControl size="sm">
            <FormLabel>Categoria</FormLabel>
            <Select
              size="sm"
              placeholder="Todas"
              value={categoryFilter || ''}
              onChange={(event, newValue) => setCategoryFilter(newValue)}
            >
              <Option value="Todas">Todas</Option>
              <Option value="refund">Categoria 1</Option>
              <Option value="purchase">Categoria 2</Option>
              <Option value="debit">Categoria 3</Option>
            </Select>
          </FormControl>
          <FormControl size="sm">
            <FormLabel>Usuário</FormLabel>
            <Select
              size="sm"
              placeholder="Todos"
              value={userFilter || ''}
              onChange={(event, newValue) => setUserFilter(newValue)}
            >
              <Option value="Todos">Todos</Option>
              <Option value="Maria Zefiro">Maria Zefiro</Option>
              <Option value="Gabriel Reis">Gabriel Reis</Option>
              <Option value="Gabriel Simonassi">Gabriel Simonassi</Option>
              <Option value="Ricardo Robson">Ricardo Robson</Option>
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
          sx={{ flexGrow: 1 }}
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
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
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
              {type === 'orders' && (
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
                  <th style={{ width: 120, padding: '12px' }}>
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
                  <th style={{ padding: '12px' }}>Data</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Usuário</th>
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
            {type === 'orders' &&
              filteredData.map((row: any) => (
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
                          Recusado: <AutorenewRoundedIcon />,
                          Cancelado: <BlockIcon />,
                        }[row.status]
                      }
                      color={
                        {
                          Concluído: 'success',
                          Recusado: 'neutral',
                          Cancelado: 'danger',
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
                        <Typography level="body-xs">{row.customer.email}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Link level="body-xs" component="button">
                        Download
                      </Link>
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
    </React.Fragment>
  );
}
