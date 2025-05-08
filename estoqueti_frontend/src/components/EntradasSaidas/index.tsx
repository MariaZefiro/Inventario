import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';

import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import OrderTable from '../OrderTable/index.tsx';
import OrderList from '../OrderList/index.tsx';

export default function EntradasSaidas() {
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        }
    }, [navigate]);

    const rows = [
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'G',
                name: 'Gabriel Reis',
                email: 'gabriel@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Concluído',
            customer: {
                initial: 'M',
                name: 'Maria Zefiro',
                email: 'maria@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'G',
                name: 'Gabriel Simonassi',
                email: 'gabriel@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'M',
                name: 'Maria Zefiro',
                email: 'maria@email.com',
            },
        },
        {
            id: '#1230',
            date: '20 ed fev de 2025',
            status: 'Cancelado',
            customer: {
                initial: 'R',
                name: 'Ricardo Robson',
                email: 'ricardo@email.com',
            },
        },
        {
            id: '#1229',
            date: '20 ed fev de 2025',
            status: 'Cancelado',
            customer: {
                initial: 'R',
                name: 'Ricardo Robson',
                email: 'ricardo@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'G',
                name: 'Gabriel Reis',
                email: 'gabriel@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Concluído',
            customer: {
                initial: 'M',
                name: 'Maria Zefiro',
                email: 'maria@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'G',
                name: 'Gabriel Simonassi',
                email: 'gabriel@email.com',
            },
        },
        {
            id: '#1234',
            date: '20 ed fev de 2025',
            status: 'Recusado',
            customer: {
                initial: 'M',
                name: 'Maria Zefiro',
                email: 'maria@email.com',
            },
        },
        {
            id: '#1230',
            date: '20 ed fev de 2025',
            status: 'Cancelado',
            customer: {
                initial: 'R',
                name: 'Ricardo Robson',
                email: 'ricardo@email.com',
            },
        },
        {
            id: '#1229',
            date: '20 ed fev de 2025',
            status: 'Cancelado',
            customer: {
                initial: 'R',
                name: 'Ricardo Robson',
                email: 'ricardo@email.com',
            },
        },
    ];

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    mb: 1,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'start', sm: 'center' },
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                }}
            >
                <Typography level="h2" component="h1">
                    Entradas e Saídas
                </Typography>
                <Button
                    color="primary"
                    startDecorator={<DownloadRoundedIcon />}
                    size="sm"
                >
                    Download PDF
                </Button>
            </Box>
            <OrderTable data={rows} type="orders" />
        </CssVarsProvider >
    );
}