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
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import Avatar from '@mui/joy/Avatar';
import LaptopIcon from '@mui/icons-material/Laptop';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import StorageIcon from '@mui/icons-material/Storage';
import MonitorIcon from '@mui/icons-material/Monitor';
import CableIcon from '@mui/icons-material/Cable';
import DevicesOtherIcon from '@mui/icons-material/DevicesOther';
import MemoryIcon from '@mui/icons-material/Memory';
import PowerIcon from '@mui/icons-material/Power';
import DnsIcon from '@mui/icons-material/Dns';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import UsbIcon from '@mui/icons-material/Usb';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import { useColorScheme } from '@mui/joy/styles';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
    const navigate = useNavigate();
    const backendIp = config.backend_ip;
    const { mode } = useColorScheme();

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
    const [ram, setRAM] = useState([]);
    const [nucs, setNucs] = useState([]);

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
                    perifericosRes,
                    ramRes,
                    nucsRes
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
                    axios.get(`${backendIp}/api/list_perifericos`),
                    axios.get(`${backendIp}/api/list_ram`),
                    axios.get(`${backendIp}/api/list_nucs`)
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
                setRAM(transformData(ramRes.data));
                setNucs(transformData(nucsRes.data));
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

    // Função para somar quantidades de um array de ativos
    const sumQuantidade = (data) => data.reduce((acc, item) => acc + (parseInt(item.quantidade) || 0), 0);

    // Cards de resumo principais 
    const summaryCards = [
        {
            label: 'Adaptadores',
            value: sumQuantidade(adaptadores),
            icon: <UsbIcon fontSize="25px" color="success" />,
        },
        {
            label: 'Armazenamento',
            value: sumQuantidade(armazenamento),
            icon: <StorageIcon fontSize="25px" color="primary" />,
        },
        {
            label: 'Cabos',
            value: sumQuantidade(cabos),
            icon: <CableIcon fontSize="25px" color="secondary" />,
        },
        {
            label: 'Desktops',
            value: sumQuantidade(desktops),
            icon: <DesktopWindowsIcon fontSize="25px" color="success" />,
        },
        {
            label: 'Fontes',
            value: sumQuantidade(fontes),
            icon: <PowerIcon fontSize="25px" color="warning" />,
        },
        {
            label: 'Memória RAM',
            value: sumQuantidade(ram),
            icon: <MemoryIcon fontSize="25px" color="secondary" />,
        },
        {
            label: 'Monitores',
            value: sumQuantidade(monitores),
            icon: <MonitorIcon fontSize="25px" color="info" />,
        },
        {
            label: 'Notebooks',
            value: sumQuantidade(notebooks),
            icon: <LaptopIcon fontSize="25px" color="primary" />,
        },
        {
            label: 'NUCs',
            value: sumQuantidade(nucs),
            icon: <ImportantDevicesIcon fontSize="25px" color="info" />,
        },
        {
            label: 'Periféricos',
            value: sumQuantidade(perifericos),
            icon: <DevicesOtherIcon fontSize="25px" color="error" />,
        },
        {
            label: 'Redes',
            value: sumQuantidade(redes),
            icon: <DnsIcon fontSize="25px" color="primary" />,
        },
        {
            label: 'Telefonia',
            value: sumQuantidade(telefonia),
            icon: <PhoneIphoneIcon fontSize="25px" color="info" />,
        },
    ];

    // Grupos de gráficos para exibir (ordem alfabética)
    const chartGroups = [
        {
            title: 'Acessórios',
            charts: [
                { data: adaptadores, title: 'Adaptadores' },
                { data: cabos, title: 'Cabos' },
                { data: monitores, title: 'Monitores' },
                { data: perifericos, title: 'Periféricos' },
            ],
        },
        {
            title: 'Computadores',
            charts: [
                { data: desktops, title: 'Desktops' },
                { data: notebooks, title: 'Notebooks' },
                { data: nucs, title: 'NUCs' },
            ],
        },
        {
            title: 'Outros',
            charts: [
                { data: armazenamento, title: 'Armazenamento' },
                { data: fontes, title: 'Fontes' },
                { data: ram, title: 'Memória RAM' },
                { data: redes, title: 'Redes' },
                { data: telefonia, title: 'Telefonia' },
            ],
        },
    ];

    // Função para obter cor de fundo dos cards conforme o modo
    const getCardBg = () => mode === 'dark' ? '#23272f' : '#fff';
    const getCardText = () => mode === 'dark' ? '#e5e7eb' : '#374151';
    const getCardSubText = () => mode === 'dark' ? '#b0b4ba' : '#6b7280';
    const getChartBg = () => mode === 'dark' ? '#181a20' : '#f5f5f5';

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Typography level="h2" component="h1" sx={{
                fontWeight: 'bold',
                marginBottom: '30px',
                color: getCardText()
            }}>
                Dashboard
            </Typography>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: '20px', md: '32px' },
                padding: { xs: '8px', sm: '12px', md: '40px' },
                height: '100%',
                overflowY: 'auto',
            }}>
                <Grid
                    container
                    spacing={{ xs: 2, sm: 3 }}
                    sx={{
                        justifyContent: { xs: 'flex-start', md: 'center' },
                        width: '100%',
                        margin: 0,
                    }}
                >
                    {summaryCards.map((card, idx) => (
                        <Grid
                            xs={12}
                            sm={6}
                            md={4}
                            lg={2}
                            key={card.label}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'stretch',
                                width: '100%',
                            }}
                        >
                            <Card
                                variant="soft"
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    py: { xs: 2, sm: 3 },
                                    boxShadow: mode === 'dark'
                                        ? '0 4px 16px rgba(0,0,0,0.40)'
                                        : '0 4px 16px rgba(0,0,0,0.10)',
                                    borderRadius: 3,
                                    minHeight: { xs: 110, sm: 140 },
                                    background: getCardBg(),
                                    width: { xs: '100%', sm: '90%', md: '100%' },
                                    mx: { xs: 0, sm: 'auto' },
                                }}
                            >
                                <Avatar sx={{
                                    mb: 1,
                                    bgcolor: mode === 'dark' ? 'background.level2' : 'background.level1',
                                    width: { xs: 40, sm: 56 },
                                    height: { xs: 40, sm: 56 },
                                }}>
                                    {card.icon}
                                </Avatar>
                                <Typography level="h4" sx={{
                                    fontWeight: 700,
                                    color: getCardText(),
                                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                                }}>
                                    {card.value}
                                </Typography>
                                <Typography level="body-md" sx={{
                                    color: getCardSubText(),
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    textAlign: 'center',
                                }}>
                                    {card.label}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* Grupos de gráficos */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: '24px', md: '36px' },
                    mt: 2,
                }}>
                    {chartGroups.map((group) => (
                        <Box key={group.title}>
                            <Typography
                                level="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: 2,
                                    color: getCardText(),
                                    letterSpacing: 0.5,
                                    fontSize: { xs: '1.1rem', sm: '1.5rem' },
                                }}
                            >
                                {group.title}
                            </Typography>
                            <Grid
                                container
                                spacing={{ xs: 2, sm: 3 }}
                                sx={{
                                    width: '100%',
                                    margin: 0,
                                }}
                            >
                                {group.charts.map((chart) => (
                                    <Grid
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={chart.title}
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'stretch',
                                            width: '100%',
                                        }}
                                    >
                                        <Card
                                            variant="outlined"
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                py: { xs: 1, sm: 2 },
                                                borderRadius: 3,
                                                background: getChartBg(),
                                                boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.40)' : 'xs',
                                                width: { xs: '100%', sm: '90%', md: '100%' },
                                                mx: { xs: 0, sm: 'auto' },
                                            }}
                                        >
                                            <Typography
                                                level="title-md"
                                                sx={{
                                                    fontWeight: 600,
                                                    mb: 1,
                                                    color: getCardText(),
                                                    fontSize: { xs: '1rem', sm: '1.2rem' },
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {chart.title}
                                            </Typography>
                                            <Box sx={{
                                                width: '100%',
                                                maxWidth: { xs: 180, sm: 220 },
                                                minHeight: { xs: 120, sm: 180 },
                                                mx: 'auto',
                                            }}>
                                                <Doughnut data={generateChartData(chart.data)} />
                                            </Box>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    ))}
                </Box>
            </Box>
        </CssVarsProvider>
    );
}