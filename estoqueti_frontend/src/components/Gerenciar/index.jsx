import { useState, useEffect } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import config from '../../config';
import BasicAlert from '../Alert';
import CryptoJS from 'crypto-js';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import CadastrarAtivos from './CadastrarAtivos';
import AtivosSupervisionados from './AtivosSupervisionados';
import EstoqueAlertas from './EstoqueAlertas';

export default function Gerenciar() {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        quantity: '',
        description: '',
        state: '',
        local: '',
        type: '',
        serial: '',
        specificFields: {},
    });

    const [categories, setCategories] = useState([]);
    const [ativos, setAtivos] = useState([]);
    const [specificFields, setSpecificFields] = useState([]);
    const [alert, setAlert] = useState({ severity: '', message: '' });
    const [nome, setNome] = useState('');
    const [usuario, setUsuario] = useState('');
    const [supervisionados, setSupervisionados] = useState({});
    const [userCargo, setUserCargo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterSupervisionado, setFilterSupervisionado] = useState('Todos');
    const [editAlertas, setEditAlertas] = useState({});
    // Novos estados para EstoqueAlertas
    const [searchTermAlertas, setSearchTermAlertas] = useState('');
    const [filterCategoriaAlertas, setFilterCategoriaAlertas] = useState('');
    const [filterAlerta, setFilterAlerta] = useState('Todos');

    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;

    useEffect(() => {
        getUserData();
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${backendIp}/api/categorias`);
                if (!response.ok) throw new Error('Erro ao buscar categorias');
                const data = await response.json();
                setCategories(data.map((cat) => ({ id: cat[0], nome: cat[1] })));
            } catch (error) {
                console.error('Erro ao carregar categorias:', error);
            }
        };
        fetchCategories();
        fetchAtivos();
    }, [backendIp]);

    useEffect(() => {
        if (ativos.length > 0) {
            setEditAlertas((prev) => {
                const novo = {};
                ativos.forEach((ativo) => {
                    novo[ativo.id] = {
                        editEstAlerta: ativo.est_alerta !== null && ativo.est_alerta !== undefined ? String(ativo.est_alerta) : '',
                        editAlertar: ativo.est_alerta !== null && ativo.est_alerta !== undefined,
                        saving: false,
                    };
                });
                return novo;
            });
        }
    }, [ativos]);

    const fetchAtivos = async () => {
        try {
            const response = await fetch(`${backendIp}/api/list_all_sup`);
            if (!response.ok) throw new Error('Erro ao buscar ativos');
            const data = await response.json();
            setAtivos(data);
            const supervisionadosInit = {};
            data.forEach((ativo) => {
                supervisionadosInit[ativo.id] = ativo.supervisionado === 1;
            });
            setSupervisionados(supervisionadosInit);
            console.log(data)
        } catch (error) {
            console.error('Erro ao carregar ativos:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSpecificFieldChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            specificFields: {
                ...prev.specificFields,
                [field]: value,
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
            setUserCargo(decryptedData.admin);
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

            const quantidade = parseInt(formData.quantity, 10);
            let payload = {
                name: formData.name,
                category_id: category_id,
                quantity: quantidade,
                description: formData.description,
                state: formData.state,
                local: formData.local,
                serial: formData.serial, 
                specificFields: {
                    ...formData.specificFields,
                    ...(formData.category === 'Fontes' && formData.specificFields.Modular
                        ? { Modular: formData.specificFields.Modular === 'Sim' ? 1 : 0 }
                        : {}),
                },
                user: usuario,
                nome: nome,
            };

            // Lógica para SNs
            if (quantidade === 1) {
                // payload já está correto
            } else if (quantidade > 1) {
                const serials = (formData.serials || []).map(s => (s || '').trim()).filter(s => s !== '');
                if (serials.length === 0) {
                    // Nenhum SN preenchido, não envia serials (backend trata)
                } else if (serials.length === quantidade) {
                    payload.serials = serials;
                } else {
                    setAlert({ severity: 'warning', message: 'Se for informar números de série, preencha todos os campos de serial ou deixe todos em branco.' });
                    return;
                }
            }

            const response = await fetch(`${backendIp}/api/cadastrar_ativo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao adicionar ativo');
            }
            setAlert({ severity: 'success', message: 'Ativo adicionado com sucesso!' });
            setFormData({
                name: '',
                category: '',
                quantity: '',
                description: '',
                state: '',
                local: '',
                type: '',
                serial: '', 
                serials: [],
                specificFields: {},
            });
        } catch (error) {
            console.error('Erro ao adicionar componente:', error);
            setAlert({ severity: 'danger', message: error.message || 'Erro ao adicionar componente.' });
        }
    };

    const handleSupervisionadoChange = async (ativoId, checked) => {
        setSupervisionados((prev) => ({
            ...prev,
            [ativoId]: checked,
        }));

        try {
            const response = await fetch(`${backendIp}/api/editar_ativo_sup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ativo_id: ativoId,
                    supervisionado: checked ? 1 : 0,
                }),
            });
            if (!response.ok) throw new Error('Erro ao atualizar supervisionado');
        } catch (error) {
            setAlert({ severity: 'danger', message: 'Erro ao atualizar supervisionado.' });
        }
    };

    // Filtro dos ativos supervisionados
    const filteredAtivos = ativos.filter((ativo) => {
        const categoriaNome = ativo.categoria_nome || '';
        const nomeAtivo = ativo.nome ? ativo.nome.toLowerCase() : '';
        const supervisionado = ativo.supervisionado === 1;

        const matchSearch = nomeAtivo.includes(searchTerm.toLowerCase());
        const matchCategoria = !filterCategoria || categoriaNome === filterCategoria;

        let matchSupervisionado = true;
        if (filterSupervisionado === 'Supervisionados') matchSupervisionado = supervisionado;
        else if (filterSupervisionado === 'Não supervisionados') matchSupervisionado = !supervisionado;

        return matchSearch && matchCategoria && matchSupervisionado;
    });

    // Filtro dos ativos para EstoqueAlertas
    const filteredAtivosAlertas = ativos.filter((ativo) => {
        const categoriaNome = ativo.categoria_nome || '';
        const nomeAtivo = ativo.nome ? ativo.nome.toLowerCase() : '';
        const temAlerta = ativo.est_alerta != null;

        const matchSearch = nomeAtivo.includes(searchTermAlertas.toLowerCase());
        const matchCategoria = !filterCategoriaAlertas || categoriaNome === filterCategoriaAlertas;

        let matchAlerta = true;
        if (filterAlerta === 'Com alerta') matchAlerta = temAlerta;
        else if (filterAlerta === 'Sem alerta') matchAlerta = !temAlerta;

        return matchSearch && matchCategoria && matchAlerta;
    });

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 1, sm: 2, md: 3 },
                    height: '100vh',
                    minHeight: 0,
                    width: '100%',
                    boxSizing: 'border-box',
                    flex: '1 1 auto',
                }}
            >
                <Typography level="h2" component="h1" sx={{ fontSize: { xs: 22, sm: 28 } }}>
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
                <Tabs
                    defaultValue={0}
                    sx={{
                        width: '100%',
                        flex: '1 1 auto',
                        minHeight: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        mt: 2,
                    }}
                >
                    <TabList
                        size="sm"
                        sx={{
                            minHeight: 36,
                            '& .MuiTab-root': {
                                fontSize: { xs: 12, sm: 14 },
                                minHeight: 32,
                            },
                        }}
                        scrollButtons="auto"
                    >
                        <Tab>Cadastrar Ativos</Tab>
                        {userCargo == 'admin' && <Tab>Ativos Supervisionados</Tab>}
                        {userCargo == 'admin' && <Tab>Estoque & Alertas</Tab>}
                    </TabList>
                    <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
                        <TabPanel value={0}>
                            <CadastrarAtivos
                                formData={formData}
                                setFormData={setFormData}
                                categories={categories}
                                specificFields={specificFields}
                                setSpecificFields={setSpecificFields}
                                handleInputChange={handleInputChange}
                                handleSpecificFieldChange={handleSpecificFieldChange}
                                handleCategoryChange={handleCategoryChange}
                                handleSubmit={handleSubmit}
                            />
                        </TabPanel>
                        {userCargo == 'admin' && (
                            <TabPanel value={1}>
                                <AtivosSupervisionados
                                    ativos={ativos}
                                    supervisionados={supervisionados}
                                    handleSupervisionadoChange={handleSupervisionadoChange}
                                    searchTerm={searchTerm}
                                    setSearchTerm={setSearchTerm}
                                    filterCategoria={filterCategoria}
                                    setFilterCategoria={setFilterCategoria}
                                    filterSupervisionado={filterSupervisionado}
                                    setFilterSupervisionado={setFilterSupervisionado}
                                    filteredAtivos={filteredAtivos}
                                />
                            </TabPanel>
                        )}
                        {userCargo == 'admin' && (
                            <TabPanel value={2}>
                                <EstoqueAlertas
                                    ativos={ativos}
                                    editAlertas={editAlertas}
                                    setEditAlertas={setEditAlertas}
                                    setAlert={setAlert}
                                    fetchAtivos={fetchAtivos}
                                    backendIp={backendIp}
                                    // Novos props para filtros
                                    searchTerm={searchTermAlertas}
                                    setSearchTerm={setSearchTermAlertas}
                                    filterCategoria={filterCategoriaAlertas}
                                    setFilterCategoria={setFilterCategoriaAlertas}
                                    filterAlerta={filterAlerta}
                                    setFilterAlerta={setFilterAlerta}
                                    filteredAtivos={filteredAtivosAlertas}
                                />
                            </TabPanel>
                        )}
                    </Box>
                </Tabs>
            </Box>
        </CssVarsProvider>
    );
}
