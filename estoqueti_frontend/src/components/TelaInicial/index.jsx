import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';

export default function TelaInicial() {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: 2,
                }}
            >
                <Card sx={{ maxWidth: 400, textAlign: 'center', padding: 3, boxShadow: 3, borderRadius: 2, border: 'none' }}>
                    <Typography level="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Bem-vindo ao Estoque TI
                    </Typography>
                    <Typography level="body1" sx={{ mb: 3 }}>
                        Gerencie os ativos de TI de forma eficiente e prática.
                    </Typography>
                    <Button
                        onClick={() => navigate('/home/estoque/todos-componentes')}
                        sx={{
                            mb: 1,
                            width: '100%',
                            backgroundColor: '#009373',
                            '&:hover': {
                                backgroundColor: '#007a5e', 
                            },
                        }}
                    >
                        Componentes
                    </Button>
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={() => navigate('/home/dashboard')}
                        sx={{ width: '100%' }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={() => navigate('/home/entradas-saidas')}
                        sx={{ width: '100%' }}
                    >
                        Entradas e Saídas
                    </Button>
                </Card>
            </Box>
        </CssVarsProvider>
    );
}