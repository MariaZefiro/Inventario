import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Autocomplete from '@mui/joy/Autocomplete';
import Checkbox from '@mui/joy/Checkbox';
import { useTheme } from '@mui/joy/styles';

export default function AtivosSupervisionados({
    ativos,
    supervisionados,
    handleSupervisionadoChange,
    searchTerm,
    setSearchTerm,
    filterCategoria,
    setFilterCategoria,
    filterSupervisionado,
    setFilterSupervisionado,
    filteredAtivos,
}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                width: '100%',
                margin: '0 auto',
                padding: { xs: '16px 8px', sm: '32px 100px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Typography level="h3" component="h1" sx={{ fontSize: { xs: 18, sm: 24 } }}>
                Ativos Supervisionados
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { sm: 'flex-end' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mb: 2,
                    gap: 2,
                    flexWrap: 'wrap',
                    marginTop: '20px'
                }}
            >
                <Input
                    placeholder="Buscar por nome"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{
                        borderRadius: '8px',
                        minWidth: 180,
                        maxWidth: 220,
                        background: theme => theme.vars.palette.background.surface,
                        color: theme => theme.vars.palette.text.primary,
                        border: '1px solid',
                        borderColor: theme => theme.vars.palette.neutral.outlinedBorder,
                    }}
                />
                <Autocomplete
                    placeholder="Filtrar por categoria"
                    options={['', ...Array.from(new Set(ativos.map(a => a.categoria_nome || '')).values()).filter(Boolean)]}
                    value={filterCategoria}
                    onChange={(e, newValue) => setFilterCategoria(newValue || '')}
                    renderInput={(params) => (
                        <Input {...params} placeholder="Filtrar por categoria"
                            sx={{
                                borderRadius: '8px',
                                minWidth: 180,
                                maxWidth: 220,
                                // background: '#fff'
                            }}
                        />
                    )}
                    sx={{ minWidth: 180, maxWidth: 220 }}
                />
                <Autocomplete
                    placeholder="Filtrar por status"
                    options={['Todos', 'Supervisionados', 'Não supervisionados']}
                    value={filterSupervisionado}
                    onChange={(e, newValue) => setFilterSupervisionado(newValue || 'Todos')}
                    renderInput={(params) => (
                        <Input {...params} placeholder="Status"
                            sx={{
                                borderRadius: '8px',
                                minWidth: 180,
                                maxWidth: 220,
                                // background: '#fff'
                            }}
                        />
                    )}
                    sx={{ minWidth: 180, maxWidth: 220 }}
                />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                {filteredAtivos.length === 0 ? (
                    <Typography>Nenhum ativo encontrado.</Typography>
                ) : (
                    <Box
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                            background: theme => theme.vars.palette.background.surface,
                            borderRadius: '5px',
                            boxShadow: '0px 2px 8px rgba(0,0,0,0.07)',
                            border: theme => `1px solid ${theme.vars.palette.neutral.outlinedBorder}`,
                        }}
                    >
                        <table style={{
                            width: '100%',
                            minWidth: 600,
                            borderCollapse: 'separate',
                            borderSpacing: 0,
                            fontSize: 15,
                            borderRadius: '5px',
                            overflow: 'hidden',
                            background: 'transparent', // herda do Box
                            color: theme.vars.palette.text.primary,
                        }}>
                            <thead>
                                <tr style={{
                                    background: theme.vars.palette.background.level1
                                }}>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Nome</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Descrição</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Categoria</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Local</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Estado</th>
                                    <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600 }}>Supervisionado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAtivos.map((ativo, idx) => (
                                    <tr
                                        key={ativo.id}
                                        style={{
                                            background: idx % 2 === 0
                                                ? theme.vars.palette.background.body
                                                : theme.vars.palette.background.level1,
                                            borderBottom: `1px solid ${theme.vars.palette.divider}`
                                        }}
                                    >
                                        <td style={{ padding: '10px 8px', fontWeight: 500 }}>{ativo.nome} - {ativo.serial}</td>
                                        <td style={{ padding: '10px 8px' }}>{ativo.descricao}</td>
                                        <td style={{ padding: '10px 8px' }}>{ativo.categoria_nome || ''}</td>
                                        <td style={{ padding: '10px 8px' }}>{ativo.local}</td>
                                        <td style={{ padding: '10px 8px' }}>{ativo.estado}</td>
                                        <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                            <Checkbox
                                                label=""
                                                checked={!!supervisionados[ativo.id]}
                                                onChange={(e) => handleSupervisionadoChange(ativo.id, e.target.checked)}
                                                sx={{
                                                    marginLeft: 0,
                                                    // '& .MuiCheckbox-root': { color: '#1976d2' }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}
            </Box>
        </Box>
    );
}
