import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Autocomplete from '@mui/joy/Autocomplete';
import { useTheme } from '@mui/joy/styles';

export default function EstoqueAlertas({
    ativos,
    editAlertas,
    setEditAlertas,
    setAlert,
    fetchAtivos,
    backendIp,
    // Novos props para filtros
    searchTerm,
    setSearchTerm,
    filterCategoria,
    setFilterCategoria,
    filterAlerta,
    setFilterAlerta,
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
                Estoque & Alertas
            </Typography>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { sm: 'flex-end' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    mb: 4,
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
                            }}
                        />
                    )}
                    sx={{ minWidth: 180, maxWidth: 220 }}
                />
                <Autocomplete
                    placeholder="Filtrar por alerta"
                    options={['Todos', 'Com alerta', 'Sem alerta']}
                    value={filterAlerta}
                    onChange={(e, newValue) => setFilterAlerta(newValue || 'Todos')}
                    renderInput={(params) => (
                        <Input {...params} placeholder="Status alerta"
                            sx={{
                                borderRadius: '8px',
                                minWidth: 180,
                                maxWidth: 220,
                            }}
                        />
                    )}
                    sx={{ minWidth: 180, maxWidth: 220 }}
                />
            </Box>
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
                    overflow: 'hidden'
                }}>
                    <thead>
                        <tr style={{
                            background: theme.vars.palette.background.level1
                        }}>
                            <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: 600 }}>Nome</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600 }}>Qtd. Atual</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600 }}>Alertar</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600 }}>Qtd. Alerta</th>
                            <th style={{ padding: '12px 8px', textAlign: 'center', fontWeight: 600 }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(filteredAtivos || ativos).map((ativo, idx) => {
                            const edit = editAlertas[ativo.id] || { editEstAlerta: '', editAlertar: false, saving: false };

                            // Estado original
                            const originalAlertar = ativo.est_alerta !== null;
                            const originalEstAlerta = originalAlertar ? String(ativo.est_alerta) : '';

                            // Detecta se houve alteração
                            const changed =
                                edit.editAlertar !== originalAlertar ||
                                (edit.editAlertar && edit.editEstAlerta !== originalEstAlerta);

                            const handleEditChange = (field, value) => {
                                setEditAlertas(prev => ({
                                    ...prev,
                                    [ativo.id]: {
                                        ...prev[ativo.id],
                                        [field]: value
                                    }
                                }));
                            };

                            const handleSave = async () => {
                                setEditAlertas(prev => ({
                                    ...prev,
                                    [ativo.id]: {
                                        ...prev[ativo.id],
                                        saving: true
                                    }
                                }));
                                try {
                                    const response = await fetch(`${backendIp}/api/editar_ativo_alerta`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            ativo_id: ativo.id,
                                            est_alerta: edit.editAlertar && edit.editEstAlerta !== '' ? Number(edit.editEstAlerta) : null
                                        }),
                                    });
                                    if (!response.ok) throw new Error('Erro ao salvar alerta');
                                    setAlert({ severity: 'success', message: 'Alerta atualizado!' });
                                    await fetchAtivos();
                                } catch (error) {
                                    setAlert({ severity: 'danger', message: 'Erro ao salvar alerta.' });
                                }
                                setEditAlertas(prev => ({
                                    ...prev,
                                    [ativo.id]: {
                                        ...prev[ativo.id],
                                        saving: false
                                    }
                                }));
                            };

                            return (
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
                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>{ativo.quantidade}</td>
                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                        <Checkbox
                                            checked={edit.editAlertar}
                                            onChange={e => {
                                                const checked = e.target.checked;
                                                handleEditChange('editAlertar', checked);
                                                // Se desmarcar, limpa o valor do alerta
                                                if (!checked) handleEditChange('editEstAlerta', '');
                                                // Se marcar e não houver valor, sugere 1 como padrão
                                                if (checked && edit.editEstAlerta === '') handleEditChange('editEstAlerta', '1');
                                            }}
                                            sx={{ marginLeft: 0 }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 8px', display: 'flex', justifyContent: 'center' }}>
                                        <Input
                                            type="number"
                                            value={edit.editEstAlerta}
                                            onKeyDown={e => {
                                                // Permite apenas números, backspace, delete, setas, tab, home, end
                                                if (
                                                    !(
                                                        (e.key >= '0' && e.key <= '9') ||
                                                        ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)
                                                    )
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={e => {
                                                // Permite apenas números inteiros >= 0
                                                const value = e.target.value;
                                                if (/^\d*$/.test(value)) {
                                                    handleEditChange('editEstAlerta', value);
                                                }
                                            }}
                                            disabled={!edit.editAlertar}
                                            sx={{ width: 90, borderRadius: '8px' }}
                                            slotProps={{ input: { min: 0 } }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                        <Button
                                            size="sm"
                                            color="primary"
                                            loading={edit.saving}
                                            onClick={handleSave}
                                            disabled={
                                                !changed ||
                                                (edit.editAlertar && (
                                                    edit.editEstAlerta === '' ||
                                                    isNaN(Number(edit.editEstAlerta)) ||
                                                    Number(edit.editEstAlerta) < 0
                                                ))
                                            }
                                            sx={{ borderRadius: '8px', minWidth: 70 }}
                                        >
                                            Salvar
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Box>
        </Box>
    );
}
