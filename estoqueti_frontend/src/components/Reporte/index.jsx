import React, { useEffect, useState } from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import Textarea from '@mui/joy/Textarea';
import config from "../../config";
import CryptoJS from 'crypto-js';
import axios from 'axios';
import BasicAlert from '../Alert';
import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion, { accordionClasses } from '@mui/joy/Accordion';
import AccordionSummary from '@mui/joy/AccordionSummary';
import AccordionDetails from '@mui/joy/AccordionDetails';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';

const Reporte = () => {
    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;
    const [formData, setFormData] = useState({
        feedbackName: '',
        mensagem: '',
        images: [],
    });
    const [alert, setAlert] = useState({ severity: '', message: '' });
    const [username, setUsername] = useState('');
    const [userCargo, setUserCargo] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const cachedData = getUserData();
        if (cachedData) {
            setUsername(cachedData.usuario);
            setUserCargo(cachedData.cargo);
        }
    }, []);

    useEffect(() => {
        if (username && userCargo) {
            // Se for Desenvolvimento, busca todos os feedbacks 
            if (userCargo === "Desenvolvimento") {
                axios.get(`${backendIp}/api/list_feedbacks_dev`)
                    .then(response => {
                        setFeedbacks(response.data);
                    })
                    .catch(error => {
                        console.error("Erro ao carregar feedbacks:", error);
                    });
            } else {
                axios.get(`${backendIp}/api/list_feedbacks`, { params: { nome: username } })
                    .then(response => {
                        setFeedbacks(response.data);
                    })
                    .catch(error => {
                        console.error("Erro ao carregar feedbacks:", error);
                    });
            }
        }
    }, [username, userCargo]); 

    const getUserData = () => {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null;
        }
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, images: files }));
    };

    const handleSubmit = async () => {
        if (!formData.feedbackName || !formData.mensagem) {
            setAlert({ severity: 'warning', message: 'Por favor, preencha todos os campos obrigatórios*.' });
            return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('nome', username);
        console.log(username)
        formDataToSend.append('feedbackName', formData.feedbackName);
        formDataToSend.append('mensagem', formData.mensagem);
        formDataToSend.append('data', new Date().toLocaleString());
        formData.images.forEach((image) => formDataToSend.append('images', image));

        try {
            await axios.post(`${backendIp}/api/add_feedbacks`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAlert({ severity: 'success', message: 'Feedback enviado com sucesso!' });
            setFormData({ feedbackName: '', mensagem: '', images: [] });
        } catch (error) {
            setAlert({ severity: 'danger', message: `Erro ao enviar feedback!` });
            console.error('Erro ao enviar feedback:', error);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 1, sm: 2, md: 3 }, overflowY:'scroll' }}>
                <Typography level="h2" component="h1">
                    Reportar
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
                        width: { xs: '100%', sm: '95%', md: '100%' },
                        margin: '0 auto',
                        padding: { xs: '16px', sm: '24px', md: '32px' },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                            width: { xs: '100%', sm: '90%', md: '60%' },
                        }}
                    >
                        <p style={{ fontSize: '15px', color: 'gray', margin:'0' }}>Preencha o formulário e reporte falhas para os desenvolvedores do sistema.</p>
                        <Box>
                            <Typography level="body1" sx={{ marginBottom: 1 }}>
                                Assunto *
                            </Typography>
                            <Input
                                placeholder="Digite o assunto"
                                value={formData.feedbackName}
                                onChange={(e) => handleInputChange('feedbackName', e.target.value)}
                                sx={{ borderRadius: '8px', width: '100%' }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body1" sx={{ marginBottom: 1 }}>
                                Sua Mensagem *
                            </Typography>
                            <Textarea
                                placeholder="Digite aqui a sua mensagem"
                                value={formData.mensagem}
                                minRows={3}
                                onChange={(e) => handleInputChange('mensagem', e.target.value)}
                                sx={{ borderRadius: '8px', width: '100%' }}
                            />
                        </Box>
                        <Box>
                            <Typography level="body1" sx={{ marginBottom: 1 }}>
                                Anexos
                            </Typography>
                            <p className="anexos" style={{ fontSize: '13px', color: 'gray', marginBottom: '10px', margin: '10px 0px' }}>Por exemplo, capturas de tela dos erros ou sugestões.</p>
                            <label
                                htmlFor="file-upload"
                                style={{
                                    display: 'inline-block',
                                    padding: '10px 20px',
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    backgroundColor: '#0b6bcb',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                }}
                            >
                                Escolher Arquivos
                            </label>
                            <Input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                multiple
                                sx={{
                                    display: 'none',
                                }}
                            />
                            {formData.images.length > 0 && (
                                <Box sx={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {formData.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={URL.createObjectURL(image)}
                                            alt={`Pré-visualização ${index + 1}`}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                borderRadius: '5px',
                                                border: '1px solid #ccc',
                                            }}
                                        />
                                    ))}
                                </Box>
                            )}
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            justifyContent: { xs: 'center', sm: 'end' },
                            gap: 2,
                            marginTop: 3,
                            width: { xs: '100%', sm: '90%', md: '60%' },
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
                                width: '200px',
                            }}
                        >
                            Enviar
                        </Button>
                        <Button
                            onClick={() => setFormData({ feedbackName: '', mensagem: '', images: [] })}
                            color="neutral"
                            sx={{
                                paddingX: 5,
                                paddingY: 1.5,
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                width: '200px',
                            }}
                        >
                            Limpar
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        marginTop: 4,
                        width: '100%',
                        backgroundColor: 'background.surface',
                        borderRadius: '12px',
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
                        padding: { xs: '16px', sm: '24px', md: '32px' },
                    }}
                >
                    <Typography level="h3" component="h2" sx={{ marginBottom: 2 }}>
                        Feedbacks Enviados
                    </Typography>
                    {feedbacks.length === 0 ? (
                        <Typography>Nenhum feedback enviado ainda.</Typography>
                    ) : (
                        <AccordionGroup
                            sx={(theme) => ({
                                maxWidth: '100%',
                                [`& .${accordionClasses.root}`]: {
                                    marginTop: '0.5rem',
                                    transition: '0.2s ease',
                                    '& button:not([aria-expanded="true"])': {
                                        transition: '0.2s ease',
                                        paddingBottom: '0.625rem',
                                    },
                                    '& button:hover': {
                                        background: 'transparent',
                                    },
                                },
                                [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                                    bgcolor: 'background.level1',
                                    borderRadius: 'md',
                                    borderBottom: '1px solid',
                                    borderColor: 'background.level2',
                                },
                                '& [aria-expanded="true"]': {
                                    boxShadow: `inset 0 -1px 0 ${theme.vars.palette.divider}`,
                                },
                            })}
                        >
                            {feedbacks.map((feedback, index) => (
                                <Accordion key={feedback.id}>
                                    <AccordionSummary>
                                        {feedback.feedback_name} - {feedback.nome}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography><strong>Mensagem:</strong> {feedback.mensagem}</Typography>
                                        <Typography><strong>Data:</strong> {feedback.data}</Typography>
                                        {feedback.images.length > 0 && (
                                            <Box sx={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                {feedback.images.map((image, imgIndex) => (
                                                    <img
                                                        key={imgIndex}
                                                        src={`${backendIp}/uploads/feedback_images/${feedback.id}/${image}`}
                                                        alt={`Imagem ${imgIndex + 1}`}
                                                        onClick={() => handleImageClick(`${backendIp}/uploads/feedback_images/${feedback.id}/${image}`)}
                                                        style={{
                                                            width: '80px',
                                                            height: '80px',
                                                            objectFit: 'cover',
                                                            borderRadius: '5px',
                                                            border: '1px solid #ccc',
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </AccordionGroup>
                    )}
                </Box>
            </Box>
            {selectedImage && (
                <Modal style={{zIndex:'10001'}} open={!!selectedImage} onClose={handleCloseModal}>
                    <ModalDialog
                        layout="center"
                        sx={{
                            bgcolor: 'background.surface',
                            borderRadius: 'md',
                            boxShadow: 'lg',
                            p: 0,
                            maxWidth: '90%',
                            maxHeight: '90%',
                            zIndex:'10001'
                        }}
                    >
                        <img
                            src={selectedImage}
                            alt="Imagem ampliada"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '8px',
                            }}
                        />
                    </ModalDialog>
                </Modal>
            )}
        </CssVarsProvider>
    );
};

export default Reporte;