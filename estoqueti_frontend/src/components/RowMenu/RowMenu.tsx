import React, { useState, useEffect } from 'react';
import Dropdown from '@mui/joy/Dropdown';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Divider from '@mui/joy/Divider';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';
import Textarea from '@mui/joy/Textarea';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useLocation } from 'react-router-dom';
import config from "../../config";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';

export default function RowMenu({ row, onSave }) {
  const backendIp = config.backend_ip;
  const secretKey = config.secretKey;
  const [open, setOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(row);
  const location = useLocation();
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [alert, setAlert] = useState({ severity: '', message: '' });
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [barcodePath, setBarcodePath] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const cachedData = getUserData();
  }, []);

  const handleEdit = async () => {
    try {
      const response = await axios.post(`${backendIp}/api/editar_ativo`, {
        ativo_id: editedRow.id,
        name: editedRow.name,
        identification: editedRow.identification,
        category_id: editedRow.category,
        quantity: editedRow.quantity,
        description: editedRow.description,
        state: editedRow.state,
        local: editedRow.local,
        specificFields: editedRow.specificFields,
        user: usuario,
        nome: nome,
      });

      if (response.status === 200) {
        setAlert({ severity: 'success', message: 'Ativo editado com sucesso!' });
        onSave(editedRow);
        setOpen(false);
      } else {
        setAlert({ severity: 'danger', message: 'Erro ao editar ativo.' });
      }
    } catch (error) {
      console.error('Erro ao editar ativo:', error);
      setAlert({ severity: 'danger', message: 'Erro ao editar ativo.' });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.post(`${backendIp}/api/delete_ativo`, {
        ativo_id: row.id,
        user: usuario,
        nome: nome,
      });

      if (response.status === 200) {
        setAlert({ severity: 'success', message: 'Ativo deletado com sucesso!' });
        onSave(row.id);
      } else {
        setAlert({ severity: 'danger', message: 'Erro ao deletar ativo.' });
      }
    } catch (error) {
      console.error('Erro ao deletar ativo:', error);
      setAlert({ severity: 'danger', message: 'Erro ao deletar ativo.' });
    }
    setConfirmDeleteOpen(false);
  };

  const getUserData = () => {
    const cachedData = localStorage.getItem('userData');
    if (!cachedData) return null;

    try {
      // Descriptografar o dado
      const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      const nomeCompleto = decryptedData.nome_completo.split(' ');
      const nomeFormatado = `${nomeCompleto[0]} ${nomeCompleto[nomeCompleto.length - 1]}`;
      setNome(nomeFormatado);
      setUsuario(decryptedData.usuario);
      return decryptedData;
    } catch (error) {
      console.error('Erro ao descriptografar os dados:', error);
      return null; // Retorna null se ocorrer um erro na descriptografia
    }
  };

  const handleEditClick = () => {
    // Monta os campos específicos conforme a categoria
    let specificFields = {};
    if (location.pathname === '/home/estoque/adaptadores') {
      specificFields = {
        tipo: row.type || '',
        conexao_entrada: row.inputConnection || '',
        conexao_saida: row.outputConnection || '',
      };
    } else if (location.pathname === '/home/estoque/armazenamento') {
      specificFields = {
        tipo: row.type || '',
        capacity: row.capacity || '',
        interface: row.interface || '',
      };
    } else if (location.pathname === '/home/estoque/cabos') {
      specificFields = {
        tipo: row.type || '',
        comprimento: row.comprimento || '',
        material: row.material || '',
      };
    } else if (location.pathname === '/home/estoque/desktops') {
      specificFields = {
        processador: row.processador || '',
        memoria_ram: row.memoria_ram || '',
        armazenamento: row.armazenamento || '',
        fonte_alimentacao: row.fonte_alimentacao || '',
      };
    } else if (location.pathname === '/home/estoque/fontes') {
      specificFields = {
        potencia_watts: row.potencia_watts || '',
        modular: row.modular || '',
      };
    } else if (location.pathname === '/home/estoque/memoria_ram') {
      specificFields = {
        capacidade: row.capacidade || '',
        tipo: row.tipo || '',
        frequencia: row.frequencia || '',
        latencia: row.latencia || '',
      };
    } else if (location.pathname === '/home/estoque/monitores') {
      specificFields = {
        tamanho_polegadas: row.tamanho_polegadas || '',
        resolucao: row.resolucao || '',
        tipo_painel: row.tipo_painel || '',
        taxa_atualizacao: row.taxa_atualizacao || '',
        conexoes: row.conexoes || '',
      };
    } else if (location.pathname === '/home/estoque/notebooks') {
      specificFields = {
        processador: row.processador || '',
        memoria_ram: row.memoria_ram || '',
        armazenamento: row.armazenamento || '',
        tamanho_tela: row.tamanho_tela || '',
        bateria: row.bateria || '',
      };
    } else if (location.pathname === '/home/estoque/nucs') {
      specificFields = {
        processador: row.processador || '',
        memoria_ram: row.memoria_ram || '',
        armazenamento: row.armazenamento || '',
      };
    } else if (location.pathname === '/home/estoque/perifericos') {
      specificFields = {
        tipo: row.tipo || '',
        conexoes: row.conexoes || '',
        marca: row.marca || '',
      };
    } else if (location.pathname === '/home/estoque/redes') {
      specificFields = {
        tipo: row.tipo || '',
        velocidade: row.velocidade || '',
        interface: row.interface || '',
        protocolo_suportado: row.protocolo_suportado || '',
      };
    } else if (location.pathname === '/home/estoque/telefonia') {
      specificFields = {
        tipo: row.tipo || '',
        tecnologia: row.tecnologia || '',
        compatibilidade: row.compatibilidade || '',
      };
    }

    setEditedRow({
      ...row,
      specificFields,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    await handleEdit();
  };

  const handleBarcodeClick = async () => {
    try {
      const response = await axios.get(`${backendIp}/api/get_barcode`, {
        params: { identificacao: row.identification },
      });

      if (response.status === 200) {
        setBarcodePath(`${backendIp}${response.data.barcode_url}`);
        setBarcodeModalOpen(true);
      } else {
        setAlert({ severity: 'danger', message: 'Erro ao obter código de barras.' });
      }
    } catch (error) {
      console.error('Erro ao obter código de barras:', error);
      setAlert({ severity: 'danger', message: 'Erro ao obter código de barras.' });
    }
  };

  const renderFields = () => {
    const commonFields = (
      <Box
        sx={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : 'repeat(2, 1fr)',
          gap: 2,
        }}
      >
        <Box>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Nome
          </Typography>
          <Input
            value={editedRow.name}
            onChange={(e) => setEditedRow({ ...editedRow, name: e.target.value })}
            placeholder="Digite o nome"
          />
        </Box>
        {editedRow.supervisionado === 0 ? (
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Quantidade
            </Typography>
            <Input
              type="number"
              value={editedRow.quantity}
              onKeyDown={(e) => {
                // Permite apenas números, backspace, delete, setas, tab, home, end
                if (
                  !(
                    (e.key >= '0' && e.key <= '9') ||
                    ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)
                  )
                ) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                // Permite apenas números inteiros >= 0
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setEditedRow({ ...editedRow, quantity: value });
                }
              }}
              placeholder="Digite a quantidade"
            />
          </Box>
        ):(
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Quantidade (Ativo supervisionado)
            </Typography>
            <Input
              type="number"
              value={editedRow.quantity}
              placeholder="Digite a quantidade"
              disabled
            />
          </Box>
        )}
        <Box>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Estado
          </Typography>
          <Select
            value={editedRow.state || ''}
            onChange={(_, value) => setEditedRow({ ...editedRow, state: value })}
            placeholder="Selecione o estado"
            sx={{ width: '100%' }}
            slotProps={{ listbox: { sx: { zIndex: 13000 } } }}
          >
            <Option value="">Selecione o estado</Option>
            <Option value="Novo">Novo</Option>
            <Option value="Usado">Usado</Option>
            <Option value="Defeituoso">Defeituoso</Option>
          </Select>
        </Box>
        <Box sx={{ gridRow: 'span 2' }}>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Descrição
          </Typography>
          <Textarea
            minRows={4}
            value={editedRow.description}
            onChange={(e) => setEditedRow({ ...editedRow, description: e.target.value })}
            placeholder="Digite a descrição"
          />
        </Box>
        <Box>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Local
          </Typography>
          <Select
            value={editedRow.local || ''}
            onChange={(_, value) => setEditedRow({ ...editedRow, local: value })}
            placeholder="Selecione o local"
            sx={{ width: '100%' }}
            slotProps={{ listbox: { sx: { zIndex: 13000 } } }}
          >
            <Option value="">Selecione o local</Option>
            <Option value="Lab TI">Lab TI</Option>
            <Option value="TI">TI</Option>
            <Option value="CGR">CGR</Option>
            <Option value="Engenharia">Engenharia</Option>
            <Option value="Homologação">Homologação</Option>
            <Option value="Aferição">Aferição</Option>
            <Option value="Estoque">Estoque</Option>
          </Select>
        </Box>
      </Box>
    );

    const handleSpecificFieldChange = (field, value) => {
      setEditedRow((prev) => ({
        ...prev,
        specificFields: {
          ...prev.specificFields,
          [field]: value,
        },
      }));
    };

    if (location.pathname === '/home/estoque/adaptadores') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexão de Entrada
            </Typography>
            <Input
              value={editedRow.specificFields?.conexao_entrada || ''}
              onChange={(e) => handleSpecificFieldChange('conexao_entrada', e.target.value)}
              placeholder="Digite a conexão de entrada"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexão de Saída
            </Typography>
            <Input
              value={editedRow.specificFields?.conexao_saida || ''}
              onChange={(e) => handleSpecificFieldChange('conexao_saida', e.target.value)}
              placeholder="Digite a conexão de saída"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/armazenamento') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Capacidade
            </Typography>
            <Input
              value={editedRow.specificFields?.capacity || ''}
              onChange={(e) => handleSpecificFieldChange('capacity', e.target.value)}
              placeholder="Digite a capacidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Interface
            </Typography>
            <Input
              value={editedRow.specificFields?.interface || ''}
              onChange={(e) => handleSpecificFieldChange('interface', e.target.value)}
              placeholder="Digite a interface"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/cabos') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Comprimento
            </Typography>
            <Input
              value={editedRow.specificFields?.comprimento || ''}
              onChange={(e) => handleSpecificFieldChange('comprimento', e.target.value)}
              placeholder="Digite o comprimento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Material
            </Typography>
            <Input
              value={editedRow.specificFields?.material || ''}
              onChange={(e) => handleSpecificFieldChange('material', e.target.value)}
              placeholder="Digite o material"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/desktops') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Processador
            </Typography>
            <Input
              value={editedRow.specificFields?.processador || ''}
              onChange={(e) => handleSpecificFieldChange('processador', e.target.value)}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.specificFields?.memoria_ram || ''}
              onChange={(e) => handleSpecificFieldChange('memoria_ram', e.target.value)}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.specificFields?.armazenamento || ''}
              onChange={(e) => handleSpecificFieldChange('armazenamento', e.target.value)}
              placeholder="Digite o armazenamento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Fonte de Alimentação
            </Typography>
            <Input
              value={editedRow.specificFields?.fonte_alimentacao || ''}
              onChange={(e) => handleSpecificFieldChange('fonte_alimentacao', e.target.value)}
              placeholder="Digite a fonte de alimentação"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/fontes') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Potência (Watts)
            </Typography>
            <Input
              value={editedRow.specificFields?.potencia_watts || ''}
              onChange={(e) => handleSpecificFieldChange('potencia_watts', e.target.value)}
              placeholder="Digite a potência (Watts)"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Modular
            </Typography>
            <Input
              value={editedRow.specificFields?.modular || ''}
              onChange={(e) => handleSpecificFieldChange('modular', e.target.value)}
              placeholder="Digite se é modular (1 para Sim, 0 para Não)"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/memoria_ram') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Capacidade
            </Typography>
            <Input
              value={editedRow.specificFields?.capacidade || ''}
              onChange={(e) => handleSpecificFieldChange('capacidade', e.target.value)}
              placeholder="Digite a capacidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Frequência
            </Typography>
            <Input
              value={editedRow.specificFields?.frequencia || ''}
              onChange={(e) => handleSpecificFieldChange('frequencia', e.target.value)}
              placeholder="Digite a frequência"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Latência
            </Typography>
            <Input
              value={editedRow.specificFields?.latencia || ''}
              onChange={(e) => handleSpecificFieldChange('latencia', e.target.value)}
              placeholder="Digite a latência"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/monitores') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Polegadas
            </Typography>
            <Input
              value={editedRow.specificFields?.tamanho_polegadas || ''}
              onChange={(e) => handleSpecificFieldChange('tamanho_polegadas', e.target.value)}
              placeholder="Digite o tamanho em polegadas"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Resolução
            </Typography>
            <Input
              value={editedRow.specificFields?.resolucao || ''}
              onChange={(e) => handleSpecificFieldChange('resolucao', e.target.value)}
              placeholder="Digite a resolução"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo de Painel
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo_painel || ''}
              onChange={(e) => handleSpecificFieldChange('tipo_painel', e.target.value)}
              placeholder="Digite o tipo de painel"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Taxa de Atualização
            </Typography>
            <Input
              value={editedRow.specificFields?.taxa_atualizacao || ''}
              onChange={(e) => handleSpecificFieldChange('taxa_atualizacao', e.target.value)}
              placeholder="Digite a taxa de atualização"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexões
            </Typography>
            <Input
              value={editedRow.specificFields?.conexoes || ''}
              onChange={(e) => handleSpecificFieldChange('conexoes', e.target.value)}
              placeholder="Digite as conexões"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/notebooks') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Processador
            </Typography>
            <Input
              value={editedRow.specificFields?.processador || ''}
              onChange={(e) => handleSpecificFieldChange('processador', e.target.value)}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.specificFields?.memoria_ram || ''}
              onChange={(e) => handleSpecificFieldChange('memoria_ram', e.target.value)}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.specificFields?.armazenamento || ''}
              onChange={(e) => handleSpecificFieldChange('armazenamento', e.target.value)}
              placeholder="Digite o armazenamento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tela
            </Typography>
            <Input
              value={editedRow.specificFields?.tamanho_tela || ''}
              onChange={(e) => handleSpecificFieldChange('tamanho_tela', e.target.value)}
              placeholder="Digite o tamanho da tela"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Bateria
            </Typography>
            <Input
              value={editedRow.specificFields?.bateria || ''}
              onChange={(e) => handleSpecificFieldChange('bateria', e.target.value)}
              placeholder="Digite a capacidade da bateria"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/nucs') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Processador
            </Typography>
            <Input
              value={editedRow.specificFields?.processador || ''}
              onChange={(e) => handleSpecificFieldChange('processador', e.target.value)}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.specificFields?.memoria_ram || ''}
              onChange={(e) => handleSpecificFieldChange('memoria_ram', e.target.value)}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.specificFields?.armazenamento || ''}
              onChange={(e) => handleSpecificFieldChange('armazenamento', e.target.value)}
              placeholder="Digite o armazenamento"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/perifericos') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexões
            </Typography>
            <Input
              value={editedRow.specificFields?.conexoes || ''}
              onChange={(e) => handleSpecificFieldChange('conexoes', e.target.value)}
              placeholder="Digite as conexões"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Marca
            </Typography>
            <Input
              value={editedRow.specificFields?.marca || ''}
              onChange={(e) => handleSpecificFieldChange('marca', e.target.value)}
              placeholder="Digite a marca"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/redes') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Velocidade
            </Typography>
            <Input
              value={editedRow.specificFields?.velocidade || ''}
              onChange={(e) => handleSpecificFieldChange('velocidade', e.target.value)}
              placeholder="Digite a velocidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Interface
            </Typography>
            <Input
              value={editedRow.specificFields?.interface || ''}
              onChange={(e) => handleSpecificFieldChange('interface', e.target.value)}
              placeholder="Digite a interface"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Protocolo Suportado
            </Typography>
            <Input
              value={editedRow.specificFields?.protocolo_suportado || ''}
              onChange={(e) => handleSpecificFieldChange('protocolo_suportado', e.target.value)}
              placeholder="Digite o protocolo suportado"
            />
          </Box>
        </>
      );
    }
    if (location.pathname === '/home/estoque/telefonia') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.specificFields?.tipo || ''}
              onChange={(e) => handleSpecificFieldChange('tipo', e.target.value)}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tecnologia
            </Typography>
            <Input
              value={editedRow.specificFields?.tecnologia || ''}
              onChange={(e) => handleSpecificFieldChange('tecnologia', e.target.value)}
              placeholder="Digite a tecnologia"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Compatibilidade
            </Typography>
            <Input
              value={editedRow.specificFields?.compatibilidade || ''}
              onChange={(e) => handleSpecificFieldChange('compatibilidade', e.target.value)}
              placeholder="Digite a compatibilidade"
            />
          </Box>
        </>
      );
    }

    return commonFields;
  };

  return (
    <>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 140 }}>
          <MenuItem onClick={handleEditClick}>Editar</MenuItem>
          <MenuItem onClick={handleBarcodeClick}>Código de Barras</MenuItem>
          <Divider />
          <MenuItem color="danger" onClick={() => setConfirmDeleteOpen(true)}>Deletar</MenuItem>
        </Menu>
      </Dropdown>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ backdropFilter: 'blur(4px)', zIndex: '10001' }}
      >
        <ModalDialog
          sx={{
            width: isMobile ? '100vw' : '100vh',
            maxWidth: isMobile ? '100vw' : '90%',
            minHeight: isMobile ? '100vh' : undefined,
            m: isMobile ? 0 : undefined,
            p: isMobile ? 2 : undefined,
            borderRadius: isMobile ? 0 : undefined,
            boxShadow: isMobile ? 'none' : undefined,
            ...(isMobile && {
              maxHeight: '100vh',
              overflowY: 'auto',
            }),
            position: 'relative',
          }}
        >
          {/* Botão de fechar no canto superior direito */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
            }}
            aria-label="Fechar"
            size="sm"
            variant="plain"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
            Editar Ativo
          </Typography>
          <form>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: isMobile ? '100%' : undefined,
                ...(isMobile && {
                  maxHeight: 'calc(100vh - 100px)',
                  overflowY: 'auto',
                }),
              }}
            >
              {renderFields()}
            </Box>
            <Button
              onClick={handleSave}
              sx={{
                mt: 2,
                width: isMobile ? '100%' : undefined,
                fontSize: isMobile ? '1.1rem' : undefined,
              }}
            >
              Salvar
            </Button>
          </form>
        </ModalDialog>
      </Modal>
      <Modal
        open={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        sx={{ backdropFilter: 'blur(4px)', zIndex: '10001' }}
      >
        <ModalDialog sx={{ width: 'auto', maxWidth: '90%' }}>
          <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
            Código de Barras
          </Typography>
          {barcodePath && (
            <Box sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={barcodePath} alt="Código de Barras" style={{ maxWidth: '100%' }} />
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = barcodePath;
                  link.setAttribute('download', `barcode_${row.identification}.png`);
                  link.style.display = 'none';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                sx={{ mt: 2 }}
              >
                Baixar Código de Barras
              </Button>
            </Box>
          )}
        </ModalDialog>
      </Modal>
      <Modal
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        sx={{ backdropFilter: 'blur(4px)', zIndex: '10001' }}
      >
        <ModalDialog>
          <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
            Confirmar Exclusão
          </Typography>
          <Typography sx={{ mb: 2 }}>
            Tem certeza que deseja deletar este ativo? Esta ação não pode ser desfeita.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="plain" color="neutral" onClick={() => setConfirmDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button variant="solid" color="danger" onClick={handleDelete}>
              Deletar
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </>
  );
}
