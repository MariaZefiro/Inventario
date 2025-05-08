import React, { useState } from 'react';
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
import { useLocation } from 'react-router-dom';

export default function RowMenu({ row, onSave }) {
  const [open, setOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(row);
  const location = useLocation();

  const handleEditClick = () => {
    setEditedRow(row);
    setOpen(true);
  };

  const handleSave = () => {
    onSave(editedRow);
    setOpen(false);
  };

  const renderFields = () => {
    const commonFields = (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
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
        <Box>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Quantidade
          </Typography>
          <Input
            type="number"
            value={editedRow.quantity}
            onChange={(e) => setEditedRow({ ...editedRow, quantity: e.target.value })}
            placeholder="Digite a quantidade"
          />
        </Box>
        <Box>
          <Typography level="body-sm" sx={{ mb: 0.5 }}>
            Estado
          </Typography>
          <Box
            component="select"
            value={editedRow.state}
            onChange={(e) => setEditedRow({ ...editedRow, state: e.target.value })}
            sx={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'neutral.outlinedBorder',
              backgroundColor: '#fbfcfe',
              fontSize: '16px',
              color: 'text.primary',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main',
              },
            }}
          >
            <option value="">Selecione o estado</option>
            <option value="Novo">Novo</option>
            <option value="Usado">Usado</option>
            <option value="Defeituoso">Defeituoso</option>
          </Box>
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
          <Box
            component="select"
            value={editedRow.local}
            onChange={(e) => setEditedRow({ ...editedRow, local: e.target.value })}
            sx={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'neutral.outlinedBorder',
              backgroundColor: '#fbfcfe',
              fontSize: '16px',
              color: 'text.primary',
              '&:focus': {
                outline: 'none',
                borderColor: 'primary.main',
              },
            }}
          >
            <option value="">Selecione o local</option>
            <option value="Lab TI">Lab TI</option>
            <option value="TI">TI</option>
            <option value="CGR">CGR</option>
            <option value="Engenharia">Engenharia</option>
            <option value="Homologação">Homologação</option>
            <option value="Aferição">Aferição</option>
            <option value="Estoque">Estoque</option>
          </Box>
        </Box>
      </Box>
    );
    if (location.pathname === '/home/estoque/adaptadores') {
      return (
        <>
          {commonFields}
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.type}
              onChange={(e) => setEditedRow({ ...editedRow, type: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexão de Entrada
            </Typography>
            <Input
              value={editedRow.inputConnection}
              onChange={(e) =>
                setEditedRow({ ...editedRow, inputConnection: e.target.value })
              }
              placeholder="Digite a conexão de entrada"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexão de Saída
            </Typography>
            <Input
              value={editedRow.outputConnection}
              onChange={(e) =>
                setEditedRow({ ...editedRow, outputConnection: e.target.value })
              }
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
              value={editedRow.type}
              onChange={(e) => setEditedRow({ ...editedRow, type: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Capacidade
            </Typography>
            <Input
              value={editedRow.capacity}
              onChange={(e) => setEditedRow({ ...editedRow, capacity: e.target.value })}
              placeholder="Digite a capacidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Interface
            </Typography>
            <Input
              value={editedRow.interface}
              onChange={(e) => setEditedRow({ ...editedRow, interface: e.target.value })}
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
              value={editedRow.type}
              onChange={(e) => setEditedRow({ ...editedRow, type: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Comprimento
            </Typography>
            <Input
              value={editedRow.comprimento}
              onChange={(e) =>
                setEditedRow({ ...editedRow, comprimento: e.target.value })
              }
              placeholder="Digite o comprimento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Material
            </Typography>
            <Input
              value={editedRow.material}
              onChange={(e) => setEditedRow({ ...editedRow, material: e.target.value })}
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
              value={editedRow.processador}
              onChange={(e) => setEditedRow({ ...editedRow, processador: e.target.value })}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.memoria_ram}
              onChange={(e) => setEditedRow({ ...editedRow, memoria_ram: e.target.value })}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.armazenamento}
              onChange={(e) => setEditedRow({ ...editedRow, armazenamento: e.target.value })}
              placeholder="Digite o armazenamento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Fonte de Alimentação
            </Typography>
            <Input
              value={editedRow.fonte_alimentacao}
              onChange={(e) =>
                setEditedRow({ ...editedRow, fonte_alimentacao: e.target.value })
              }
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
              value={editedRow.potencia_watts}
              onChange={(e) =>
                setEditedRow({ ...editedRow, potencia_watts: e.target.value })
              }
              placeholder="Digite a potência (Watts)"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Modular
            </Typography>
            <Input
              value={editedRow.modular}
              onChange={(e) => setEditedRow({ ...editedRow, modular: e.target.value })}
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
              value={editedRow.capacidade}
              onChange={(e) => setEditedRow({ ...editedRow, capacidade: e.target.value })}
              placeholder="Digite a capacidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo
            </Typography>
            <Input
              value={editedRow.tipo}
              onChange={(e) => setEditedRow({ ...editedRow, tipo: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Frequência
            </Typography>
            <Input
              value={editedRow.frequencia}
              onChange={(e) => setEditedRow({ ...editedRow, frequencia: e.target.value })}
              placeholder="Digite a frequência"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Latência
            </Typography>
            <Input
              value={editedRow.latencia}
              onChange={(e) => setEditedRow({ ...editedRow, latencia: e.target.value })}
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
              value={editedRow.tamanho_polegadas}
              onChange={(e) =>
                setEditedRow({ ...editedRow, tamanho_polegadas: e.target.value })
              }
              placeholder="Digite o tamanho em polegadas"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Resolução
            </Typography>
            <Input
              value={editedRow.resolucao}
              onChange={(e) => setEditedRow({ ...editedRow, resolucao: e.target.value })}
              placeholder="Digite a resolução"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tipo de Painel
            </Typography>
            <Input
              value={editedRow.tipo_painel}
              onChange={(e) => setEditedRow({ ...editedRow, tipo_painel: e.target.value })}
              placeholder="Digite o tipo de painel"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Taxa de Atualização
            </Typography>
            <Input
              value={editedRow.taxa_atualizacao}
              onChange={(e) =>
                setEditedRow({ ...editedRow, taxa_atualizacao: e.target.value })
              }
              placeholder="Digite a taxa de atualização"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexões
            </Typography>
            <Input
              value={editedRow.conexoes}
              onChange={(e) => setEditedRow({ ...editedRow, conexoes: e.target.value })}
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
              value={editedRow.processador}
              onChange={(e) => setEditedRow({ ...editedRow, processador: e.target.value })}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.memoria_ram}
              onChange={(e) => setEditedRow({ ...editedRow, memoria_ram: e.target.value })}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.armazenamento}
              onChange={(e) => setEditedRow({ ...editedRow, armazenamento: e.target.value })}
              placeholder="Digite o armazenamento"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tela
            </Typography>
            <Input
              value={editedRow.tamanho_tela}
              onChange={(e) => setEditedRow({ ...editedRow, tamanho_tela: e.target.value })}
              placeholder="Digite o tamanho da tela"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Bateria
            </Typography>
            <Input
              value={editedRow.bateria}
              onChange={(e) => setEditedRow({ ...editedRow, bateria: e.target.value })}
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
              value={editedRow.processador}
              onChange={(e) => setEditedRow({ ...editedRow, processador: e.target.value })}
              placeholder="Digite o processador"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Memória RAM
            </Typography>
            <Input
              value={editedRow.memoria_ram}
              onChange={(e) => setEditedRow({ ...editedRow, memoria_ram: e.target.value })}
              placeholder="Digite a memória RAM"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Armazenamento
            </Typography>
            <Input
              value={editedRow.armazenamento}
              onChange={(e) => setEditedRow({ ...editedRow, armazenamento: e.target.value })}
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
              value={editedRow.tipo}
              onChange={(e) => setEditedRow({ ...editedRow, tipo: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Conexões
            </Typography>
            <Input
              value={editedRow.conexoes}
              onChange={(e) => setEditedRow({ ...editedRow, conexoes: e.target.value })}
              placeholder="Digite as conexões"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Marca
            </Typography>
            <Input
              value={editedRow.marca}
              onChange={(e) => setEditedRow({ ...editedRow, marca: e.target.value })}
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
              value={editedRow.tipo}
              onChange={(e) => setEditedRow({ ...editedRow, tipo: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Velocidade
            </Typography>
            <Input
              value={editedRow.velocidade}
              onChange={(e) => setEditedRow({ ...editedRow, velocidade: e.target.value })}
              placeholder="Digite a velocidade"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Interface
            </Typography>
            <Input
              value={editedRow.interface}
              onChange={(e) => setEditedRow({ ...editedRow, interface: e.target.value })}
              placeholder="Digite a interface"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Protocolo Suportado
            </Typography>
            <Input
              value={editedRow.protocolo_suportado}
              onChange={(e) =>
                setEditedRow({ ...editedRow, protocolo_suportado: e.target.value })
              }
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
              value={editedRow.tipo}
              onChange={(e) => setEditedRow({ ...editedRow, tipo: e.target.value })}
              placeholder="Digite o tipo"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Tecnologia
            </Typography>
            <Input
              value={editedRow.tecnologia}
              onChange={(e) => setEditedRow({ ...editedRow, tecnologia: e.target.value })}
              placeholder="Digite a tecnologia"
            />
          </Box>
          <Box>
            <Typography level="body-sm" sx={{ mb: 0.5 }}>
              Compatibilidade
            </Typography>
            <Input
              value={editedRow.compatibilidade}
              onChange={(e) =>
                setEditedRow({ ...editedRow, compatibilidade: e.target.value })
              }
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
          <MenuItem>Renomear</MenuItem>
          <Divider />
          <MenuItem color="danger">Deletar</MenuItem>
        </Menu>
      </Dropdown>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        sx={{ backdropFilter: 'blur(4px)', zIndex: '10001' }} 
      >
        <ModalDialog sx={{ width: '100vh', maxWidth: '90%' }}>
          <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
            Editar Ativo
          </Typography>
          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFields()}
            </Box>
            <Button onClick={handleSave} sx={{ mt: 2 }}>
              Salvar
            </Button>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}
