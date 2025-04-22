import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Autocomplete from '@mui/joy/Autocomplete';
import Button from '@mui/joy/Button';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 
import config from '../../config';

function generateAllPDF(data) {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Relatório de Todos os Componentes`, 10, 10);

    const tableColumn = [
        "Nome", 
        "Quantidade", 
        "Descrição", 
        "Estado", 
        "Local"
    ];
    const tableRows = [];

    data.forEach(item => {
        const row = [
            item.name || 'N/A',
            item.quantity || 'N/A',
            doc.splitTextToSize(item.description || 'N/A', 60), 
            item.state || 'N/A',
            item.local || 'N/A'
        ];
        tableRows.push(row);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
            fontSize: 10,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontSize: 12,
        },
        columnStyles: {
            2: { cellWidth: 60 }, 
        },
    });

    doc.save('todos_componentes.pdf');
}

export default function Estoque() {
    const navigate = useNavigate();
    const [estado, setEstado] = useState('');
    const [local, setLocal] = useState('');
    const [tipo, setTipo] = useState('');
    const [quantidade, setQuantidade] = useState([0, 100]);
    const [sliderValue, setSliderValue] = useState([0, 100]); 
    const [ativosData, setAtivosData] = useState([]); 

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
                    <Button
                        color="primary"
                        startDecorator={<DownloadRoundedIcon />}
                        size="sm"
                        onClick={() => generateAllPDF(ativosData)} 
                    >
                        Download PDF
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', flex: 1, gap: '10px' }}>
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
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography level="title-lg" textColor="text.secondary" component="h1">
                                Ativos
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Typography level="title-md">Filtros</Typography>
                            <Button size="sm" variant="plain" onClick={() => {
                                setEstado('');
                                setLocal('');
                                setTipo('');
                                setQuantidade([0, 100]);
                                setSliderValue([0, 100]); 
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
                                    <Typography level="title-sm">Tipo</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Box sx={{ my: 2 }}>
                                        <RadioGroup
                                            name="tipo"
                                            value={tipo}
                                            onChange={(event) => setTipo(event.target.value)}
                                        >
                                            <Radio label="Opção 1" value="any" size="sm" />
                                            <Radio label="Opção 2" value="high-school" size="sm" />
                                            <Radio label="Opção 3" value="college" size="sm" />
                                            <Radio label="Opção 4" value="post-graduate" size="sm" />
                                        </RadioGroup>
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
                    <Box sx={{ flex: 1, minHeight: '100%' }}>
                        <AtivosTable
                            estado={estado}
                            local={local}
                            tipo={tipo}
                            quantidade={quantidade}
                        />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}