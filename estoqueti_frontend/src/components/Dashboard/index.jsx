import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import config from '../../config';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const navigate = useNavigate();
    const backendIp = config.backend_ip;

    const [ativosData, setAtivosData] = useState([]);
    const [adaptadores, setAdaptadores] = useState([]);
    const [armazenamento, setArmazenamento] = useState([]);
    const [cabos, setCabos] = useState([]);
    const [desktops, setDesktops] = useState([]);
    const [notebooks, setNotebooks] = useState([]);
    const [fontes, setFontes] = useState([]);
    const [monitores, setMonitores] = useState([]);
    const [telefonia, setTelefonia] = useState([]);
    const [redes, setRedes] = useState([]);
    const [perifericos, setPerifericos] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        }

        const fetchData = async () => {
            try {
                const [
                    ativosRes,
                    adaptadoresRes,
                    armazenamentoRes,
                    cabosRes,
                    desktopsRes,
                    notebooksRes,
                    fontesRes,
                    monitoresRes,
                    telefoniaRes,
                    redesRes,
                    perifericosRes
                ] = await Promise.all([
                    axios.get(`${backendIp}/api/list_all`),
                    axios.get(`${backendIp}/api/list_adaptadores`),
                    axios.get(`${backendIp}/api/list_armazenamento`),
                    axios.get(`${backendIp}/api/list_cabos`),
                    axios.get(`${backendIp}/api/list_desktops`),
                    axios.get(`${backendIp}/api/list_notebooks`),
                    axios.get(`${backendIp}/api/list_fontes`),
                    axios.get(`${backendIp}/api/list_monitores`),
                    axios.get(`${backendIp}/api/list_telefonia`),
                    axios.get(`${backendIp}/api/list_redes`),
                    axios.get(`${backendIp}/api/list_perifericos`)
                ]);

                setAtivosData(transformData(ativosRes.data));
                setAdaptadores(transformData(adaptadoresRes.data));
                setArmazenamento(transformData(armazenamentoRes.data));
                setCabos(transformData(cabosRes.data));
                setDesktops(transformData(desktopsRes.data));
                setNotebooks(transformData(notebooksRes.data));
                setFontes(transformData(fontesRes.data));
                setMonitores(transformData(monitoresRes.data));
                setTelefonia(transformData(telefoniaRes.data));
                setRedes(transformData(redesRes.data));
                setPerifericos(transformData(perifericosRes.data));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate]);

    const transformData = (data) => {
        return data.map(item => ({
            nome: item[1], 
            quantidade: item[3] 
        }));
    };

    const generateChartData = (data) => ({
        labels: data.map(item => item.nome),
        datasets: [
            {
                label: 'Quantidade',
                data: data.map(item => item.quantidade),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'
                ],
                hoverOffset: 10,
            },
        ],
    });

    const renderDoughnutChart = (data, title) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', borderRadius: '12px', backgroundColor: '#f5f5f5', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Typography level="h4" sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#333' }}>{title}</Typography>
            <Doughnut data={generateChartData(data)} />
        </Box>
    );

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px', minHeight: '100vh' }}>
                <Typography level="h2" component="h1" sx={{ fontWeight: 'bold', marginBottom: '30px' }}>
                    Dashboard
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', overflowY: 'auto', maxHeight: '80vh' }}>
                    {renderDoughnutChart(ativosData, 'Todos os Ativos')}
                    {renderDoughnutChart(adaptadores, 'Adaptadores')}
                    {renderDoughnutChart(armazenamento, 'Armazenamento')}
                    {renderDoughnutChart(cabos, 'Cabos')}
                    {renderDoughnutChart(desktops, 'Desktops')}
                    {renderDoughnutChart(notebooks, 'Notebooks')}
                    {renderDoughnutChart(fontes, 'Fontes')}
                    {renderDoughnutChart(monitores, 'Monitores')}
                    {renderDoughnutChart(telefonia, 'Telefonia')}
                    {renderDoughnutChart(redes, 'Redes')}
                    {renderDoughnutChart(perifericos, 'Periféricos')}
                </Box>
            </Box>
        </CssVarsProvider>
    );
}