import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Autocomplete from '@mui/joy/Autocomplete';

export default function CadastrarAtivos({
    formData,
    setFormData,
    categories,
    specificFields,
    setSpecificFields,
    handleInputChange,
    handleSpecificFieldChange,
    handleCategoryChange,
    handleSubmit,
}) {
    return (
        <Box
            sx={{
                width: '100%',
                margin: '0 auto',
                padding: { xs: '16px 8px', sm: '24px 24px', md: '32px 100px' },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '30px'
            }}
        >
            <Typography level="h3" component="h1" sx={{ fontSize: { xs: 18, sm: 24 } }}>
                Cadastrar Ativos
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    gap: { xs: 2, sm: 3 },
                    width: '100%',
                    marginTop: '20px'
                }}
            >
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Nome *
                    </Typography>
                    <Textarea
                        placeholder="Digite o nome"
                        value={formData.name}
                        minRows={3}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        sx={{ borderRadius: '8px', width: '100%' }}
                    />
                </Box>
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Descrição *
                    </Typography>
                    <Textarea
                        placeholder="Digite a descrição"
                        value={formData.description}
                        minRows={3}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        sx={{ borderRadius: '8px', width: '100%' }}
                    />
                </Box>
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Categoria *
                    </Typography>
                    <Autocomplete
                        placeholder="Selecione a categoria"
                        options={categories.map((cat) => cat.nome)}
                        value={formData.category}
                        onChange={(event, newValue) => handleCategoryChange(newValue || '')}
                        getOptionLabel={(option) => option || ''}
                        renderInput={(params) => (
                            <Input {...params} placeholder="Selecione a categoria" sx={{ borderRadius: '8px', width: '100%' }} />
                        )}
                        sx={{ width: '100%' }}
                    />
                </Box>
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Quantidade *
                    </Typography>
                    <Input
                        placeholder="Digite a quantidade"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={formData.quantity}
                        onKeyDown={(e) => {
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
                        onChange={(e) => {
                            // Permite apenas números inteiros >= 0
                            const value = e.target.value;
                            if (/^\d*$/.test(value)) {
                                handleInputChange('quantity', value);
                            }
                        }}
                        sx={{ borderRadius: '8px', width: '100%' }}
                    />
                </Box>
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Estado *
                    </Typography>
                    <Autocomplete
                        placeholder="Selecione o estado"
                        options={['Novo', 'Usado', 'Defeituoso']}
                        value={formData.state}
                        onChange={(event, newValue) => handleInputChange('state', newValue || '')}
                        renderInput={(params) => (
                            <Input {...params} placeholder="Selecione o estado" sx={{ borderRadius: '8px', width: '100%' }} />
                        )}
                        sx={{ width: '100%' }}
                    />
                </Box>
                <Box>
                    <Typography level="body1" sx={{ marginBottom: 1 }}>
                        Local *
                    </Typography>
                    <Autocomplete
                        placeholder="Selecione o local"
                        options={[
                            'Lab TI', 'TI', 'CGR', 'Engenharia', 'Homologação', 'Aferição', 'Estoque',
                        ]}
                        value={formData.local}
                        onChange={(event, newValue) => handleInputChange('local', newValue || '')}
                        renderInput={(params) => (
                            <Input {...params} placeholder="Selecione o local" sx={{ borderRadius: '8px', width: '100%' }} />
                        )}
                        sx={{ width: '100%' }}
                    />
                </Box>
                {specificFields.map((field) => (
                    <Box key={field}>
                        <Typography level="body1" sx={{ marginBottom: 1 }}>
                            {field}
                        </Typography>
                        {field === 'Modular' ? (
                            <Autocomplete
                                placeholder="Selecione"
                                options={['Sim', 'Não']}
                                value={formData.specificFields[field] || ''}
                                onChange={(event, newValue) =>
                                    handleSpecificFieldChange(field, newValue)
                                }
                                renderInput={(params) => (
                                    <Input {...params} placeholder="Selecione" sx={{ borderRadius: '8px', width: '100%' }} />
                                )}
                                sx={{ width: '100%' }}
                            />
                        ) : (
                            <Input
                                placeholder={`Digite aqui`}
                                value={formData.specificFields[field] || ''}
                                onChange={(e) => handleSpecificFieldChange(field, e.target.value)}
                                sx={{ borderRadius: '8px', width: '100%' }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    marginTop: 3,
                    width: '100%',
                    justifyContent: { sm: 'flex-start' },
                }}
            >
                <Button
                    onClick={handleSubmit}
                    color="primary"
                    sx={{
                        paddingX: 5,
                        paddingY: 1.5,
                        borderRadius: '8px',
                        fontWeight: 'bold',
                    }}
                >
                    Adicionar
                </Button>
                <Button
                    onClick={() =>
                        setFormData({
                            name: '',
                            category: '',
                            quantity: '',
                            description: '',
                            state: '',
                            local: '',
                            type: '',
                            specificFields: {},
                        })
                    }
                    color="neutral"
                    sx={{
                        paddingX: 5,
                        paddingY: 1.5,
                        borderRadius: '8px',
                        fontWeight: 'bold',
                    }}
                >
                    Limpar
                </Button>
            </Box>
        </Box>
    );
}
