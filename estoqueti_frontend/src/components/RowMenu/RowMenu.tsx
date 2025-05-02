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
import Autocomplete from '@mui/joy/Autocomplete';
import Box from '@mui/joy/Box';
import Textarea from '@mui/joy/Textarea';

export default function RowMenu({ row, onSave }) {
  const [open, setOpen] = useState(false);
  const [editedRow, setEditedRow] = useState(row);

  const handleEditClick = () => {
    setEditedRow(row);
    setOpen(true);
  };

  const handleSave = () => {
    onSave(editedRow);
    setOpen(false);
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
        <ModalDialog sx={{ width: 500 }}>
          <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
            Editar Ativo
          </Typography>
          <form>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                  Categoria
                </Typography>
                <Input
                  value={editedRow.category}
                  onChange={(e) => setEditedRow({ ...editedRow, category: e.target.value })}
                  placeholder="Digite a categoria"
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
                  Estado
                </Typography>
                <Autocomplete
                  placeholder="Selecione o estado"
                  options={['Novo', 'Usado', 'Defeituoso']}
                  value={editedRow.state}
                  onChange={(event, newValue) =>
                    setEditedRow({ ...editedRow, state: newValue || '' })
                  }
                  renderInput={(params) => <Input {...params} />}
                />
              </Box>
              <Box>
                <Typography level="body-sm" sx={{ mb: 0.5 }}>
                  Local
                </Typography>
                <Autocomplete
                  placeholder="Selecione o local"
                  options={[
                    'Lab TI',
                    'TI',
                    'CGR',
                    'Engenharia',
                    'Homologação',
                    'Aferição',
                    'Estoque',
                  ]}
                  value={editedRow.local}
                  onChange={(event, newValue) =>
                    setEditedRow({ ...editedRow, local: newValue || '' })
                  }
                  renderInput={(params) => <Input {...params} />}
                />
              </Box>
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
