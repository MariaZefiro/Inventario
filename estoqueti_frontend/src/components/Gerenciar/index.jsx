import * as React from 'react';
import { useState, useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Autocomplete from '@mui/joy/Autocomplete';
import Textarea from '@mui/joy/Textarea';
import config from '../../config';
import BasicAlert from '../Alert';
import CryptoJS from 'crypto-js';

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
    const [alert, setAlert] = useState({ severity: '', message: '' });
    const [nome, setNome] = useState('');
    const [usuario, setUsuario] = useState('');
    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;

    useEffect(() => {
        getUserData();
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
            specificFields: {
                ...prev.specificFields,
                [field]: field === 'Modular' ? (value === 'Sim' ? 1 : 0) : value,
            },
        }));
    };

    const getUserData = () => {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) return null; // Retorna null se não houver dados no localStorage

        try {
            // Descriptografar o dado
            const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            const nomeCompleto = decryptedData.nome_completo.split(' ');
            const nomeFormatado = `${nomeCompleto[0]} ${nomeCompleto[nomeCompleto.length - 1]}`;
            setNome(nomeFormatado);
            setUsuario(decryptedData.usuario);
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null; // Retorna null se ocorrer um erro na descriptografia
        }
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
                setSpecificFields(['Processador', 'Memória RAM', 'Armazenamento', 'Tamanho Tela', 'Bateria']);
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

            if (!category_id || !formData.name || !formData.quantity || !formData.state || !formData.local) {
                setAlert({ severity: 'warning', message: 'Por favor, preencha todos os campos obrigatórios*.' });
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
                user: usuario, 
                nome: nome,
            };

            const response = await fetch(`${backendIp}/api/cadastrar_ativo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Erro ao adicionar ativo');
            setAlert({ severity: 'success', message: 'Ativo adicionado com sucesso!' });
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
            setAlert({ severity: 'danger', message: 'Erro ao adicionar componente.' });
        }
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                <Typography level="h2" component="h1">
                    Gerenciar Ativos
                </Typography>
                {alert.message && (
                    <Box sx={{ mb: 2 }}>
                        <BasicAlert
                            severity={alert.severity}
                            message={alert.message}
                            onClose={() => setAlert({ severity: '', message: '' })}
                        />
                    </Box>
                )}
                <Box
                    sx={{
                        backgroundColor: 'background.surface',
                        borderRadius: '12px',
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
                        width: '100%',
                        margin: '0 auto',
                        padding: '32px 100px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 3,
                            width: '100%',
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
                                value={formData.quantity}
                                onChange={(e) => handleInputChange('quantity', e.target.value)}
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
                                <Input
                                    placeholder={`Digite aqui`}
                                    value={
                                        field === 'Modular'
                                            ? formData.specificFields[field] === 1
                                                ? 'Sim'
                                                : formData.specificFields[field] === 0
                                                    ? 'Não'
                                                    : ''
                                            : formData.specificFields[field] || ''
                                    }
                                    onChange={(e) =>
                                        handleSpecificFieldChange(
                                            field,
                                            field === 'Modular' ? e.target.value : e.target.value
                                        )
                                    }
                                    sx={{ borderRadius: '8px', width: '100%' }}
                                />
                            </Box>
                        ))}
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            marginTop: 3,
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
            </Box>
        </CssVarsProvider>
    );
}
