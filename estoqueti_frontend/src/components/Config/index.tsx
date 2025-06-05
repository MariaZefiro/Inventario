import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Chip from '@mui/joy/Chip';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Layout from './Layout.tsx';
import config from '../../config';
import { useEffect } from 'react';
import Button from '@mui/joy/Button';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import { useNavigate } from 'react-router';
import CryptoJS from 'crypto-js'; 

export default function Configuracao() {
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [usuarios, setUsuarios] = React.useState<any[]>([]);
    const navigate = useNavigate();
    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;

    useEffect(() => {
        const admin = getUserData();
        if (admin === 'admin') {
            navigate('/home/configuracao');
        }else{
            navigate('/home');
        }
    }, []);
    
    const getUserData = () => {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) return null; // Retorna null se não houver dados no localStorage

        try {
            // Descriptografar o dado
            const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData.admin;
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null; // Retorna null se ocorrer um erro na descriptografia
        }
    };

    useEffect(() => {
        fetch(`${backendIp}/api/list_usuarios`)
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(() => setUsuarios([]));
    }, []);

    // Função para atualizar admin/cargo
    const atualizarUsuario = async (id: number, novoAdmin: number | null = null, novoCargo: string | null = null) => {
        await fetch(`${backendIp}/api/edit_usuario`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, isAdmin: novoAdmin, cargo: novoCargo }),
        });
        // Recarrega lista após alteração
        fetch(`${backendIp}/api/list_usuarios`)
            .then(res => res.json())
            .then(data => setUsuarios(data))
            .catch(() => setUsuarios([]));
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3, height: '100vh', minHeight: 0 }}>
                <Typography level="h2" component="h1">
                    Configuração de Permissão
                </Typography>
                <Layout.Root
                    sx={[
                        {
                            flex: '1 1 auto',
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: 0,
                        },
                        drawerOpen && {
                            height: '100vh',
                            overflow: 'hidden',
                        },
                    ]}
                >
                    <Layout.Main>
                        <List
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    md: 'repeat(3, 1fr)',
                                    lg: 'repeat(4, 1fr)'
                                },
                                gap: 2,
                            }}
                        >
                            {usuarios.map((usuario, index) => (
                                <Sheet
                                    key={index}
                                    component="li"
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 'sm',
                                        p: 2,
                                        listStyle: 'none',
                                        width: { xs: '100%', sm: '100%', md: '330px' },
                                        minWidth: 0,
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <Avatar
                                            variant="solid"
                                            sx={{
                                                borderRadius: '50%',
                                                width: 45,
                                                height: 45,
                                                fontSize: 25,
                                                color: '#fff',
                                                bgcolor: [
                                                    '#1976d2',
                                                    '#388e3c',
                                                    '#fbc02d',
                                                    '#d32f2f',
                                                    '#7b1fa2'
                                                ][index % 5],
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {usuario.nome ? usuario.nome.charAt(0).toUpperCase() : 'U'}
                                        </Avatar>
                                        <div>
                                            <Typography level="title-md">{usuario.nome}</Typography>
                                            <Typography level="body-xs">{usuario.usuario}</Typography>
                                        </div>
                                    </Box>
                                    <Divider component="div" sx={{ my: 2 }} />
                                    <Typography level="title-sm">Nível de permissão:</Typography>
                                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Chip
                                            variant="outlined"
                                            color={usuario.isAdmin ? "primary" : "neutral"}
                                            size="sm"
                                        >
                                            {usuario.isAdmin ? "Administrador" : "Usuário"}
                                        </Chip>
                                        <Chip
                                            variant="outlined"
                                            color="primary"
                                            size="sm"
                                        >
                                            {usuario.cargo}
                                        </Chip>
                                    </Box>
                                    <Divider component="div" sx={{ my: 2 }} />
                                    <Box sx={{ mt: 1.5, display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <Button
                                            size="sm"
                                            variant="soft"
                                            onClick={() => atualizarUsuario(usuario.id, usuario.isAdmin ? 0 : 1, null)}
                                        >
                                            Tornar {usuario.isAdmin ? "Usuário" : "Admin"}
                                        </Button>
                                        <Select
                                            size="sm"
                                            value={usuario.cargo}
                                            sx={{ minWidth: 120 }}
                                            onChange={(_, value) => {
                                                if (value && value !== usuario.cargo) {
                                                    atualizarUsuario(usuario.id, null, value);
                                                }
                                            }}
                                        >
                                            <Option value="Desenvolvimento">Desenvolvimento</Option>
                                            <Option value="Helpdesk">Helpdesk</Option>
                                            <Option value="TIC">TIC</Option>
                                        </Select>
                                    </Box>
                                </Sheet>
                            ))}
                        </List>
                    </Layout.Main>
                </Layout.Root>
            </Box>
        </CssVarsProvider>
    );
}