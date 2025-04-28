import * as React from 'react';
import { useState, useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Autocomplete from '@mui/joy/Autocomplete';
import config from '../../config';

export default function Gerenciar() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        description: '',
        state: '',
        local: '',
        type: '',
        specificFields: {},
    });

    const [categories, setCategories] = useState([]);
    const [specificFields, setSpecificFields] = useState([]);
    const backendIp = config.backend_ip;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${backendIp}/api/categorias`);
                if (!response.ok) throw new Error('Erro ao buscar categorias');
                const data = await response.json();
                console.log(data);
                setCategories(data.map((cat) => ({ id: cat[0], nome: cat[1] })));
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };
        fetchCategories();
    }, [backendIp]);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSpecificFieldChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            specificFields: { ...prev.specificFields, [field]: value },
        }));
    };

    const handleCategoryChange = (categoryName) => {
        const selectedCategory = categories.find((cat) => cat.nome === categoryName);
        setFormData((prev) => ({ ...prev, category: categoryName, specificFields: {} }));

        switch (selectedCategory?.nome) {
            case 'Adaptador':
                setSpecificFields(['Tipo', 'Conexão Entrada', 'Conexão Saída']);
                break;
            case 'Armazenamento':
                setSpecificFields(['Tipo', 'Capacidade', 'Interface']);
                break;
            case 'Cabos':
                setSpecificFields(['Tipo', 'Comprimento', 'Material']);
                break;
            case 'Desktop/AIO':
                setSpecificFields(['Processador', 'Memória RAM', 'Armazenamento', 'Fonte Alimentação']);
                break;
            case 'Fontes':
                setSpecificFields(['Potência Watts', 'Modular']);
                break;
            case 'Memória RAM':
                setSpecificFields(['Capacidade', 'Tipo', 'Frequência', 'Latência']);
                break;
            case 'Monitor':
                setSpecificFields(['Tamanho Polegadas', 'Resolução', 'Tipo Painel', 'Taxa Atualização', 'Conexões']);
                break;
            case 'Notebook':
                setSpecificFields(['Processador', 'Memória RAM', 'Armazenamento', 'Tamanho_Tela', 'Bateria']);
                break;
            case 'NUC':
                setSpecificFields(['Processador', 'Memória RAM', 'Armazenamento']);
                break;
            case 'Periféricos':
                setSpecificFields(['Tipo', 'Conexão', 'Marca']);
                break;
            case 'Redes':
                setSpecificFields(['Tipo', 'Velocidade', 'Interface', 'Protocolo Suportado']);
                break;
            case 'Telefonia':
                setSpecificFields(['Tipo', 'Tecnologia', 'Compatibilidade']);
                break;
            default:
                setSpecificFields([]);
        }
    };

    const handleSubmit = async () => {
        try {
            const selectedCategory = categories.find((cat) => cat.nome === formData.category);
            const category_id = selectedCategory ? selectedCategory.id : null;

            if (!category_id) {
                alert('Categoria inválida. Por favor, selecione uma categoria válida.');
                return;
            }

            const payload = {
                name: formData.name,
                category_id: category_id,
                quantity: formData.quantity,
                description: formData.description,
                state: formData.state,
                local: formData.local,
                specificFields: formData.specificFields, 
            };

            const response = await fetch(`${backendIp}/api/cadastrar_ativo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Erro ao adicionar componente');
            alert('Componente adicionado com sucesso!');
            setFormData({
                name: '',
                category: '',
                quantity: '',
                description: '',
                state: '',
                local: '',
                type: '',
                specificFields: {},
            });
        } catch (error) {
            console.error('Erro ao adicionar componente:', error);
            alert('Erro ao adicionar componente.');
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                <Typography level="h2" component="h1">
                    Gerenciar Ativos
                </Typography>
                <Box
                    sx={{
                        backgroundColor: 'background.surface',
                        borderRadius: '12px',
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)', 
                        width: '80%',
                        margin: '0 auto', 
                        padding: 4,
                    }}
                >
                    <Typography
                        level="h4"
                        component="h2"
                        sx={{
                            textAlign: 'center', 
                            marginBottom: 3, 
                            fontWeight: 'bold',
                        }}
                    >
                        Cadastrar Produto
                    </Typography>
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                            gap: 3,
                        }}
                    >
                        <Input
                            placeholder="Nome"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            sx={{ borderRadius: '8px', maxWidth: '500px' }}
                        />
                        <Autocomplete
                            placeholder="Categoria"
                            options={categories.map((cat) => cat.nome)}
                            value={formData.category}
                            onChange={(event, newValue) => handleCategoryChange(newValue || '')}
                            getOptionLabel={(option) => option || ''}
                            renderInput={(params) => (
                                <Input {...params} placeholder="Categoria" sx={{ borderRadius: '8px', maxWidth: '500px' }} />
                            )}
                            sx={{ maxWidth: '500px' }}
                        />
                        <Input
                            placeholder="Quantidade"
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => handleInputChange('quantity', e.target.value)}
                            sx={{ borderRadius: '8px', maxWidth: '500px' }}
                        />
                        <Input
                            placeholder="Descrição"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            sx={{ borderRadius: '8px', maxWidth: '500px' }}
                        />
                        <Autocomplete
                            placeholder="Estado"
                            options={['Novo', 'Usado', 'Defeituoso']}
                            value={formData.state}
                            onChange={(event, newValue) => handleInputChange('state', newValue || '')}
                            renderInput={(params) => (
                                <Input {...params} placeholder="Estado" sx={{ borderRadius: '8px', maxWidth: '500px' }} />
                            )}
                            sx={{ maxWidth: '500px' }}
                        />
                        <Autocomplete
                            placeholder="Local"
                            options={[
                                'Lab TI', 'TI', 'CGR', 'Engenharia', 'Homologação', 'Aferição', 'Estoque',
                            ]}
                            value={formData.local}
                            onChange={(event, newValue) => handleInputChange('local', newValue || '')}
                            renderInput={(params) => (
                                <Input {...params} placeholder="Local" sx={{ borderRadius: '8px', maxWidth: '500px' }} />
                            )}
                            sx={{ maxWidth: '500px' }}
                        />
                        {specificFields.map((field) => (
                            <Input
                                key={field}
                                placeholder={field}
                                value={formData.specificFields[field] || ''}
                                onChange={(e) => handleSpecificFieldChange(field, e.target.value)}
                                sx={{ borderRadius: '8px', maxWidth: '500px' }}
                            />
                        ))}
                    </Box>
                    <Button
                        onClick={handleSubmit}
                        color="primary"
                        sx={{
                            marginTop: 3, 
                            paddingX: 5,
                            paddingY: 1.5, 
                            borderRadius: '8px', 
                            fontWeight: 'bold',
                            display: 'block',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}
                    >
                        Adicionar
                    </Button>
                </Box>
            </Box>
        </CssVarsProvider>
    );
}
