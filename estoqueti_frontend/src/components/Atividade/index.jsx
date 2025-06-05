import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import OrderTable from '../OrderTable/index.tsx';
import axios from 'axios';
import config from '../../config';

export default function Atividade() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const backendIp = config.backend_ip;

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        } else {
            axios.get(`${backendIp}/api/list_logs`)
                .then((response) => {
                    const parsedLogs = response.data.map((log) => {
                        const match = log.match(
                            /\[(.*?)\] Usuário: (.*?), Nome: (.*?), Movimentação: (.*?), Identificação: (.*)/
                        );
                        return match
                            ? {
                                  date: match[1],
                                  user: match[2],
                                  name: match[3],
                                  active: match[4],
                                  id: match[5],
                              }
                            : null;
                    }).filter(Boolean).reverse(); 
                    setLogs(parsedLogs);
                })
                .catch((error) => console.error('Erro ao buscar logs:', error));
        }
    }, [navigate]);

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
                    Atividade
                </Typography>
            </Box>
            <OrderTable data={logs} type="logs" />
        </CssVarsProvider >
    );
}