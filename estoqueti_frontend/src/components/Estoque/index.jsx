import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Autocomplete from '@mui/joy/Autocomplete';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
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
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import AtivosTable from '../AtivosTable/index.tsx';


export default function Estoque() {
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
            <Box sx={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <Typography level="h2" component="h1">
                        Estoque
                    </Typography>
                </div>
                <Box sx={{ display: 'flex', flex: 1, gap:'10px'}}>
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
                            <Button size="sm" variant="plain">
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
                                            options={[
                                                {
                                                    category: 'Estado',
                                                    title: 'Novo',
                                                },
                                                {
                                                    category: 'Estado',
                                                    title: 'Usado',
                                                },
                                                {
                                                    category: 'Estado',
                                                    title: 'Defeituoso',
                                                },
                                            ]}
                                            groupBy={(option) => option.category}
                                            getOptionLabel={(option) => option.title}
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
                                            options={[
                                                'LAB de TI',
                                                'TI',
                                                'CGR',
                                                'Engenharia',
                                                'Homologação',
                                                'Aferição',
                                                'Estoque',
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
                                        <RadioGroup name="education" defaultValue="any">
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
                                            valueLabelFormat={(value) => `${value}`}
                                            defaultValue={[5, 10]}
                                            step={1}
                                            min={0}
                                            max={30}
                                            valueLabelDisplay="on"
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>
                        </AccordionGroup>
                    </Box>
                    <Box sx={{ flex: 1, minHeight: '100%' }}>
                        <AtivosTable />
                    </Box>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
