import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Autocomplete from '@mui/joy/Autocomplete';
import Button from '@mui/joy/Button';
import Slider from '@mui/joy/Slider';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails, {
    accordionDetailsClasses,
} from '@mui/joy/AccordionDetails';
import AccordionSummary, {
    accordionSummaryClasses,
} from '@mui/joy/AccordionSummary';
import AtivosTable from '../AtivosTable/index.tsx';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import config from '../../config';
import Drawer from '@mui/joy/Drawer';
import IconButton from '@mui/joy/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function Estoque() {
    const navigate = useNavigate();
    const [estado, setEstado] = useState('');
    const [local, setLocal] = useState('');
    const [quantidade, setQuantidade] = useState([0, 100]);
    const [sliderValue, setSliderValue] = useState([0, 100]); 
    const [ativosData, setAtivosData] = useState([]); 
    const [extraFilter, setExtraFilter] = useState('');
    const exportPDFRef = useRef(null);
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    const backendIp = config.backend_ip;
    
    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setQuantidade(sliderValue); 
        }, 300); 

        return () => clearTimeout(timeout); 
    }, [sliderValue]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${backendIp}/api/list_all`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar dados dos ativos');
                }
                const data = await response.json();
                setAtivosData(data.map(item => ({
                    id: item[0],
                    name: item[1],
                    category: item[2],
                    quantity: item[3],
                    description: item[4],
                    identification: item[5],
                    state: item[6],
                    local: item[7],
                })));
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
            }
        };
        fetchData();
    }, [backendIp]);

    // Detecta categoria atual
    const pathname = window.location.pathname;
    let extraFilterLabel = '';
    let extraFilterOptions = [];

    switch (pathname) {
        case '/home/estoque/memoria_ram':
            extraFilterLabel = 'Tipo de RAM';
            extraFilterOptions = ['DDR3', 'DDR4', 'DDR5'];
            break;
        case '/home/estoque/armazenamento':
            extraFilterLabel = 'Interface';
            extraFilterOptions = ['SATA', 'NVMe', 'IDE'];
            break;
        case '/home/estoque/telefonia':
            extraFilterLabel = 'Tecnologia';
            extraFilterOptions = ['IP', 'Analógica'];
            break;
        case '/home/estoque/perifericos':
            extraFilterLabel = 'Marca';
            extraFilterOptions = ['Logitech', 'Microsoft', 'HP', 'Dell'];
            break;
        case '/home/estoque/redes':
            extraFilterLabel = 'Velocidade';
            extraFilterOptions = ['100Mbps', '1Gbps', '10Gbps'];
            break;
        default:
            extraFilterLabel = '';
            extraFilterOptions = [];
    }

    function getFilteredData() {
        return ativosData.filter(item =>
            (!estado || item.state === estado) &&
            (!local || item.local === local) &&
            item.quantity >= quantidade[0] &&
            item.quantity <= quantidade[1] &&
            (
                !extraFilter ||
                // Filtro dinâmico conforme categoria
                (pathname === '/home/estoque/memoria_ram' && item.tipo === extraFilter) ||
                (pathname === '/home/estoque/armazenamento' && item.interface === extraFilter) ||
                (pathname === '/home/estoque/telefonia' && item.tecnologia === extraFilter) ||
                (pathname === '/home/estoque/perifericos' && item.marca === extraFilter) ||
                (pathname === '/home/estoque/redes' && item.velocidade === extraFilter) ||
                extraFilter === ''
            )
        );
    }

    // Filtros JSX extraídos para reuso
    const FiltrosContent = (
        <Box sx={{ p: 2 }}>
            <Typography level="title-lg" textColor="text.secondary" component="h1">
                Ativos
            </Typography>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Typography level="title-md">Filtros</Typography>
                <Button size="sm" variant="plain" onClick={() => {
                    setEstado('');
                    setLocal('');
                    setQuantidade([0, 100]);
                    setSliderValue([0, 100]);
                    setExtraFilter('');
                }}>
                    Limpar
                </Button>
            </Box>
            <AccordionGroup
                sx={{
                    [`& .${accordionDetailsClasses.content}`]: {
                        px: 2,
                    },
                    [`& .${accordionSummaryClasses.button}`]: {
                        px: 2,
                    },
                }}
            >
                <Accordion defaultExpanded>
                    <AccordionSummary>
                        <Typography level="title-sm">Estado</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ my: 2 }}>
                            <Autocomplete
                                size="sm"
                                placeholder="Novo, usado, etc…"
                                value={estado ? { title: estado } : null}
                                onChange={(event, newValue) => setEstado(newValue?.title || '')}
                                options={[
                                    { category: 'Estado', title: 'Novo' },
                                    { category: 'Estado', title: 'Usado' },
                                    { category: 'Estado', title: 'Defeituoso' },
                                ]}
                                groupBy={(option) => option.category}
                                getOptionLabel={(option) => option.title || ''}
                                isOptionEqualToValue={(option, value) => option.title === value.title}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary>
                        <Typography level="title-sm">Local</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ my: 2 }}>
                            <Autocomplete
                                size="sm"
                                placeholder="Laboratório, estoque, etc…"
                                value={local}
                                onChange={(event, newValue) => setLocal(newValue || '')}
                                options={[
                                    'Lab TI', 'TI', 'CGR', 'Engenharia', 'Homologação', 'Aferição', 'Estoque',
                                ]}
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary>
                        <Typography level="title-sm">
                            {extraFilterLabel || 'Filtro extra'}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ my: 2 }}>
                            {extraFilterLabel ? (
                                <Autocomplete
                                    size="sm"
                                    placeholder={extraFilterLabel}
                                    value={extraFilter}
                                    onChange={(event, newValue) => setExtraFilter(newValue || '')}
                                    options={extraFilterOptions}
                                />
                            ) : (
                                <Typography level="body-xs" color="neutral">
                                    Selecione uma categoria para filtrar.
                                </Typography>
                            )}
                        </Box>
                    </AccordionDetails>
                </Accordion>
                <Accordion defaultExpanded>
                    <AccordionSummary>
                        <Typography level="title-sm">Quantidade</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ my: 2 }}>
                            <Slider
                                size="sm"
                                value={sliderValue}
                                onChange={(event, newValue) => setSliderValue(newValue)}
                                valueLabelFormat={(value) => `${value}`}
                                step={1}
                                min={0}
                                max={100}
                                valueLabelDisplay="on"
                            />
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </AccordionGroup>
        </Box>
    );

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column', gap: '15px' }}>
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
                        Estoque
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {/* Botão para abrir filtros no mobile */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <IconButton
                                color="primary"
                                onClick={() => setMobileFilterOpen(true)}
                                variant="soft"
                                size="sm"
                                sx={{ mr: 1 }}
                            >
                                <FilterAltIcon />
                            </IconButton>
                        </Box>
                        <Button
                            color="primary"
                            startDecorator={<DownloadRoundedIcon />}
                            size="sm"
                            onClick={() => exportPDFRef.current && exportPDFRef.current()}
                        >
                            Download PDF
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, gap: '10px' }}>
                    {/* Filtros desktop */}
                    <Box
                        className="Inbox"
                        sx={{
                            bgcolor: 'background.surface',
                            display: { xs: 'none', md: 'block' },
                            width: '20%',
                            borderRadius: '5px',
                            maxHeight: '90%',
                        }}
                    >
                        {FiltrosContent}
                    </Box>
                    {/* Drawer mobile */}
                    <Drawer
                        open={mobileFilterOpen}
                        onClose={() => setMobileFilterOpen(false)}
                        anchor="left"
                        size="sm"
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            zIndex: 1300,
                        }}
                    >
                        <Box sx={{ width: 260 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                <Button size="sm" onClick={() => setMobileFilterOpen(false)}>
                                    Fechar
                                </Button>
                            </Box>
                            {FiltrosContent}
                        </Box>
                    </Drawer>
                    {/* Tabela */}
                    <Box sx={{ flex: 1, minHeight: '100%' }}>
                        <AtivosTable
                            estado={estado}
                            local={local}
                            quantidade={quantidade}
                            extraFilter={extraFilter}
                            onExportPDF={fn => { exportPDFRef.current = fn; }}
                            mobile={true}
                        />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}