import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Grid from '@mui/joy/Grid';
import axios from 'axios';
import config from "../../config";
import CryptoJS from 'crypto-js';
import Loader from "../Loader";
import BasicAlert from "../Alert";
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function TelaInicial() {
    const navigate = useNavigate();
    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;
    const [retiradaModalOpen, setRetiradaModalOpen] = React.useState(false);
    const [barcode, setBarcode] = React.useState('');
    const [equipmentInfo, setEquipmentInfo] = React.useState(null);
    const [error, setError] = React.useState('');
    const scannedCodeRef = React.useRef('');
    const [originalQuantity, setOriginalQuantity] = React.useState(null);
    const [nome, setNome] = useState('');
    const [usuario, setUsuario] = useState('');
    const [isLoadingMovimentacao, setIsLoadingMovimentacao] = useState(false);
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
    const [isMobile, setIsMobile] = useState(false);
    const fileInputRef = React.useRef(null);
    const [scanModalOpen, setScanModalOpen] = useState(false);
    const videoRef = React.useRef(null);
    const barcodeReaderRef = React.useRef(null);

    useEffect(() => {
        if (!retiradaModalOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                const code = scannedCodeRef.current.trim();
                if (code) {
                    handleFetchEquipment(code);
                }
                scannedCodeRef.current = '';
            } else if (
                e.key.length === 1 &&
                !e.ctrlKey && !e.altKey && !e.metaKey
            ) {
                scannedCodeRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [retiradaModalOpen]);

    useEffect(() => {
        const cachedData = getUserData();
        if (!cachedData) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        // Detecta se é mobile
        const checkMobile = () => {
            setIsMobile(/Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent));
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getUserData = () => {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) return null;

        try {
            // Descriptografar o dado
            const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            const nomeCompleto = decryptedData.nome_completo.split(' ');
            const nomeFormatado = `${nomeCompleto[0]} ${nomeCompleto[nomeCompleto.length - 1]}`;
            setNome(nomeFormatado);
            setUsuario(decryptedData.usuario);
            return decryptedData;
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null; // Retorna null se ocorrer um erro na descriptografia
        }
    };

    const handleFetchEquipment = async (code) => {
        if (!code) return;

        try {
            const response = await axios.get(`${backendIp}/api/list_barcode`, {
                params: { identificacao: code },
            });
            if (response.status === 200) {
                setEquipmentInfo(response.data);
                setOriginalQuantity(response.data.ativo.quantidade);
                setError('');
            } else {
                setEquipmentInfo(null);
                setOriginalQuantity(null);
                setError('Equipamento não encontrado.');
            }
        } catch (err) {
            console.error('Erro ao buscar equipamento:', err);
            setEquipmentInfo(null);
            setOriginalQuantity(null);
            setError('Erro ao buscar equipamento.');
        }
    };

    const handleConcluirMovimentacao = async () => {
        if (!equipmentInfo || !equipmentInfo.ativo) return;
        const quantidadeAtual = Number(equipmentInfo.ativo.quantidade);
        const supervisionado = Number(equipmentInfo.ativo.supervisionado);
        const quantidadeOriginal = Number(originalQuantity);
        let movimentacao = '';
        if (quantidadeAtual < quantidadeOriginal) {
            movimentacao = 'Retirada';
        } else if (quantidadeAtual > quantidadeOriginal) {
            movimentacao = 'Entrada';
        } else {
            setRetiradaModalOpen(false);
            setBarcode('');
            setEquipmentInfo(null);
            setOriginalQuantity(null);
            setError('');
            return;
        }

        setIsLoadingMovimentacao(true);
        try {
            await axios.post(`${backendIp}/api/controle_ativo`, {
                identification: equipmentInfo.ativo.identificacao,
                quantity: quantidadeAtual,
                user: usuario,
                nome: nome,
                ativo_nome: equipmentInfo.ativo.nome,
                movimentacao: movimentacao,
                supervisionado: supervisionado,
            });
            setAlert({ open: true, severity: 'success', message: 'Movimentação realizada com sucesso!' });
        } catch (err) {
            console.error('Erro ao concluir movimentação:', err);
            setAlert({ open: true, severity: 'danger', message: 'Erro ao concluir movimentação.' });
        } finally {
            setIsLoadingMovimentacao(false);
            setRetiradaModalOpen(false);
            setBarcode('');
            setEquipmentInfo(null);
            setOriginalQuantity(null);
            setError('');
            setTimeout(() => setAlert((a) => ({ ...a, open: false })), 4000);
        }
    };

    // Função para processar imagem capturada e ler o código de barras
    const handleImageCapture = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError('');
        try {
            const imageUrl = URL.createObjectURL(file);
            const img = new window.Image();
            img.src = imageUrl;

            img.onload = async () => {
                try {
                    // Redimensiona a imagem para facilitar a leitura
                    const MAX_WIDTH = 600;
                    const scale = Math.min(1, MAX_WIDTH / img.width);
                    const width = img.width * scale;
                    const height = img.height * scale;

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Aumenta contraste e converte para escala de cinza
                    let imageData = ctx.getImageData(0, 0, width, height);
                    for (let i = 0; i < imageData.data.length; i += 4) {
                        // Escala de cinza
                        const avg = (imageData.data[i] + imageData.data[i+1] + imageData.data[i+2]) / 3;
                        // Contraste simples
                        const contrast = avg > 128 ? 255 : 0;
                        imageData.data[i] = contrast;
                        imageData.data[i+1] = contrast;
                        imageData.data[i+2] = contrast;
                    }
                    ctx.putImageData(imageData, 0, 0);

                    // Tenta ler o código de barras/QR code da imagem processada
                    const barcodeReader = new BrowserMultiFormatReader();
                    try {
                        const result = await barcodeReader.decodeFromCanvas(canvas);
                        if (result && result.text) {
                            handleFetchEquipment(result.text);
                            URL.revokeObjectURL(imageUrl);
                            return;
                        }
                    } catch (err) {
                        // Se falhar, tenta inverter as cores
                        imageData = ctx.getImageData(0, 0, width, height);
                        for (let i = 0; i < imageData.data.length; i += 4) {
                            imageData.data[i] = 255 - imageData.data[i];
                            imageData.data[i+1] = 255 - imageData.data[i+1];
                            imageData.data[i+2] = 255 - imageData.data[i+2];
                        }
                        ctx.putImageData(imageData, 0, 0);
                        try {
                            const resultInverted = await barcodeReader.decodeFromCanvas(canvas);
                            if (resultInverted && resultInverted.text) {
                                handleFetchEquipment(resultInverted.text);
                                URL.revokeObjectURL(imageUrl);
                                return;
                            }
                        } catch (err2) {
                            // continua para erro final
                        }
                    }
                    setError('Não foi possível ler o código. Certifique-se de que a foto está focada, com boa iluminação e o código está centralizado.');
                    URL.revokeObjectURL(imageUrl);
                } catch (err) {
                    setError('Não foi possível ler o código. Tente novamente.');
                    URL.revokeObjectURL(imageUrl);
                }
            };
            img.onerror = () => {
                setError('Erro ao carregar a imagem.');
                URL.revokeObjectURL(imageUrl);
            };
        } catch (err) {
            setError('Erro ao processar a imagem.');
        }
    };

    // Função para abrir o scanner de câmera
    const handleOpenScanner = () => {
        setScanModalOpen(true);
        setError('');
    };

    // Função para fechar scanner e parar câmera
    const handleCloseScanner = () => {
        setScanModalOpen(false);
        if (barcodeReaderRef.current) {
            barcodeReaderRef.current.reset();
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    // Efeito para iniciar leitura quando modal de scan abrir
    useEffect(() => {
        if (!scanModalOpen) return;
        setError('');
        barcodeReaderRef.current = new BrowserMultiFormatReader();

        // Tenta usar a câmera traseira
        barcodeReaderRef.current.decodeOnceFromVideoDevice(
            { facingMode: { exact: "environment" } },
            videoRef.current
        )
            .then(result => {
                if (result && result.text) {
                    handleFetchEquipment(result.text);
                    handleCloseScanner();
                } else {
                    setError('Não foi possível ler o código. Tente novamente.');
                }
            })
            .catch((err) => {
                // Mensagem de erro mais detalhada
                if (err && err.name === 'NotAllowedError') {
                    setError('Permissão de acesso à câmera negada. Verifique as permissões do navegador.');
                } else if (err && err.name === 'NotFoundError') {
                    setError('Nenhuma câmera encontrada. Tente em outro dispositivo.');
                } else if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
                    setError('O acesso à câmera só funciona em HTTPS ou localhost.');
                } else {
                    setError('Não foi possível acessar a câmera ou ler o código.');
                }
            });

        return () => {
            if (barcodeReaderRef.current) {
                barcodeReaderRef.current.reset();
            }
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        };
        // eslint-disable-next-line
    }, [scanModalOpen]);

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100%',
                    padding: 2,
                }}
            >
                <Card sx={{ maxWidth: 400, textAlign: 'center', padding: 3, boxShadow: 3, borderRadius: 3, border: 'none' }}>
                    <Typography level="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
                        Bem-vindo ao Estoque TI
                    </Typography>
                    <Typography level="body1" sx={{ mb: 3 }}>
                        Gerencie os ativos de TI de forma eficiente e prática.
                    </Typography>
                    <Button
                        onClick={() => navigate('/home/estoque/todos-componentes')}
                        sx={{
                            mb: 1,
                            width: '100%',
                            backgroundColor: '#0b6bcb',
                            '&:hover': {
                                backgroundColor: '#185ea5',
                            },
                        }}
                    >
                        Componentes
                    </Button>
                    <Button
                        onClick={() => setRetiradaModalOpen(true)}
                        sx={{
                            mb: 1,
                            width: '100%',
                            backgroundColor: '#0b6bcb',
                            '&:hover': {
                                backgroundColor: '#185ea5',
                            },
                        }}
                    >
                        Realizar Movimentação
                    </Button>
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={() => navigate('/home/dashboard')}
                        sx={{ width: '100%' }}
                    >
                        Dashboard
                    </Button>
                    <Button
                        variant="soft"
                        color="neutral"
                        onClick={() => navigate('/home/entradas-saidas')}
                        sx={{ width: '100%' }}
                    >
                        Entradas e Saídas
                    </Button>
                </Card>
            </Box>
            <Modal
                open={retiradaModalOpen}
                onClose={() => {
                    setRetiradaModalOpen(false);
                    setBarcode('');
                    setEquipmentInfo(null);
                    setError('');
                }}
                sx={{ backdropFilter: 'blur(4px)', zIndex: '10001' }}
            >
                <ModalDialog
                    sx={{
                        width: 'auto',
                        maxWidth: '90%',
                        maxHeight: '90vh',
                        overflowY: 'scroll',
                        background: theme => theme.vars.palette.background.surface,
                        p: { xs: 1, sm: 3 },
                    }}
                >
                    <Typography sx={{ mb: 2, fontSize: 'lg' }} component="h2">
                        Realizar Movimentação
                    </Typography>
                    {/* Adiciona botão de escanear se for mobile */}
                    {isMobile && (
                        <Box sx={{ mb: 2, textAlign: 'center' }}>
                            <Button
                                variant="solid"
                                color="primary"
                                onClick={handleOpenScanner}
                                sx={{ mr: 1 }}
                            >
                                Escanear Código
                            </Button>
                            <Button
                                variant="soft"
                                color="primary"
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            >
                                Tirar Foto
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                onChange={handleImageCapture}
                            />
                            <Typography level="body-sm" sx={{ mt: 1 }}>
                                Escaneie ou tire uma foto do código de barras/QR code.
                            </Typography>
                        </Box>
                    )}
                    {isLoadingMovimentacao ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                            <Loader />
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'stretch', sm: 'center' },
                                gap: 2,
                                width: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    width: { xs: '100%', sm: '45%' },
                                    mb: { xs: 2, sm: 0 },
                                }}
                            >
                                {/* Só mostra instrução de escanear se não for mobile */}
                                {!isMobile && (
                                    <>
                                        <img src='/barcode.png' alt="Código de Barras" style={{ maxWidth: '100%' }} />
                                        <Typography level="body-md" textAlign="center" sx={{ mb: 2 }}>
                                            Escaneie o código de barras...
                                        </Typography>
                                    </>
                                )}
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    width: { xs: '100%', sm: '55%' },
                                }}
                            >
                                {error && (
                                    <Typography level="body-sm" color="danger">
                                        {error}
                                    </Typography>
                                )}
                                {equipmentInfo && equipmentInfo.ativo && (
                                    <Box
                                        sx={{
                                            mt: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mb: 3,
                                                gap: 2,
                                            }}
                                        >
                                            <Button
                                                variant="outlined"
                                                color="neutral"
                                                size="sm"
                                                sx={{ minWidth: 40, fontSize: 22, fontWeight: 'bold', px: 0 }}
                                                onClick={() => setEquipmentInfo((prev) => ({
                                                    ...prev,
                                                    ativo: {
                                                        ...prev.ativo,
                                                        quantidade: Math.max(0, Number(prev.ativo.quantidade) - 1)
                                                    }
                                                }))}
                                            >
                                                –
                                            </Button>
                                            <Typography
                                                level="h4"
                                                sx={{
                                                    mx: 2,
                                                    minWidth: 40,
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: '#0b6bcb',
                                                    background: theme => theme.vars.palette.background.level1,
                                                    borderRadius: 1,
                                                    px: 2,
                                                    py: 0.5,
                                                }}
                                            >
                                                {equipmentInfo.ativo.quantidade}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="sm"
                                                sx={{ minWidth: 40, fontSize: 22, fontWeight: 'bold', px: 0 }}
                                                onClick={() => setEquipmentInfo((prev) => ({
                                                    ...prev,
                                                    ativo: {
                                                        ...prev.ativo,
                                                        quantidade: Number(prev.ativo.quantidade) + 1
                                                    }
                                                }))}
                                            >
                                                +
                                            </Button>
                                            <Button
                                                onClick={handleConcluirMovimentacao}
                                                variant="solid"
                                                color="primary"
                                            >
                                                Concluir
                                            </Button>
                                        </Box>
                                        {equipmentInfo.ativo.supervisionado === 1 && (
                                            <p style={{ textAlign: 'center', color: 'red' }}>Esse ativo é supervisionado, qualquer movimentação irá gerar uma solicitação para liderança.</p>
                                        )}
                                        {(() => {
                                            const baseFields = [
                                                {
                                                    label: 'Identificação',
                                                    value: `#${equipmentInfo.ativo.identificacao}`,
                                                },
                                                {
                                                    label: 'Nome',
                                                    value: equipmentInfo.ativo.nome,
                                                },
                                                {
                                                    label: 'Categoria',
                                                    value: equipmentInfo.ativo.categoria_nome,
                                                },
                                                {
                                                    label: 'Quantidade',
                                                    value: equipmentInfo.ativo.quantidade,
                                                },
                                                {
                                                    label: 'Estado',
                                                    value: equipmentInfo.ativo.estado,
                                                },
                                                {
                                                    label: 'Local',
                                                    value: equipmentInfo.ativo.local,
                                                },
                                                {
                                                    label: 'Descrição',
                                                    value: equipmentInfo.ativo.descricao,
                                                },
                                            ];

                                            const detalhes = equipmentInfo.detalhes_categoria
                                                ? Object.entries(equipmentInfo.detalhes_categoria)
                                                    .filter(([key]) => key !== 'id' && key !== 'ativo_id')
                                                    .map(([key, value]) => ({
                                                        label:
                                                            typeof value === 'string' && value.toLowerCase() !== key.replace(/_/g, ' ').toLowerCase()
                                                                ? value
                                                                : key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
                                                        value,
                                                    }))
                                                : [];

                                            const allFields = [...baseFields, ...detalhes];
                                            const total = allFields.length;

                                            return (
                                                <Grid
                                                    container
                                                    spacing={3}
                                                    sx={{
                                                        maxWidth: 600,
                                                        margin: '0 auto',
                                                        background: theme => theme.vars.palette.background.level1,
                                                        borderRadius: 2,
                                                        boxShadow: 2,
                                                        p: 3,
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {allFields.map((field, idx) => {
                                                        const isLast = idx === total - 1;
                                                        const isOdd = total % 2 !== 0;
                                                        const gridProps = isLast && isOdd
                                                            ? { xs: 12 }
                                                            : { xs: 12, sm: 6 };
                                                        return (
                                                            <Grid key={field.label + idx} {...gridProps} display="flex" alignItems="center" sx={{ mb: 1 }}>
                                                                <Typography level="body-sm" sx={{ width: '100%', py: 1 }}>
                                                                    <strong>{field.label}:</strong> {field.value}
                                                                </Typography>
                                                            </Grid>
                                                        );
                                                    })}
                                                </Grid>
                                            );
                                        })()}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                    <Button
                        onClick={() => setRetiradaModalOpen(false)}
                        sx={{ mt: 2 }}
                        variant="solid"
                        color="neutral"
                    >
                        Fechar
                    </Button>
                </ModalDialog>
            </Modal>
            {/* Modal para scanner de câmera */}
            <Modal
                open={scanModalOpen}
                onClose={handleCloseScanner}
                sx={{ backdropFilter: 'blur(4px)', zIndex: '13001' }}
            >
                <ModalDialog
                    sx={{
                        width: 360,
                        maxWidth: '95vw',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        background: '#222',
                    }}
                >
                    <Typography sx={{ color: '#fff', mb: 1 }}>
                        Aponte a câmera para o código
                    </Typography>
                    <video
                        ref={videoRef}
                        style={{ width: '100%', borderRadius: 8, background: '#000' }}
                        autoPlay
                        muted
                    />
                    <Button
                        onClick={handleCloseScanner}
                        sx={{ mt: 2 }}
                        variant="solid"
                        color="neutral"
                    >
                        Fechar Scanner
                    </Button>
                    {error && (
                        <Typography level="body-sm" color="danger" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </ModalDialog>
            </Modal>
            {/* ALERTA FLUTUANTE */}
            {alert.open && (
                <Box
                    sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 13000,
                        minWidth: 280,
                        maxWidth: '90vw',
                    }}
                >
                    <BasicAlert
                        severity={alert.severity}
                        message={alert.message}
                        onClose={() => setAlert((a) => ({ ...a, open: false }))}
                    />
                </Box>
            )}
        </CssVarsProvider >
    );
}