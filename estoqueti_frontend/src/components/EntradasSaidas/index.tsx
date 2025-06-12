import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import config from "../../config";
import OrderTable from '../OrderTable/index.tsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function EntradasSaidas() {
    const navigate = useNavigate();
    const backendIp = config.backend_ip;
    const [rows, setRows] = useState<any[]>([]);
    const [filteredRows, setFilteredRows] = useState<any[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem('userData');
        if (!userData) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        fetch(`${backendIp}/api/list_movimentacao`)
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((item: any) => ({
                    item_id: item.id,
                    id: item.numero,
                    date: item.data,
                    status: item.status,
                    customer: {
                        initial: item.usuario_nome ? item.usuario_nome[0] : '',
                        name: item.usuario_nome,
                        email: item.usuario_login,
                    },
                    ativo: {
                        nome: item.ativo_nome,
                        descricao: item.ativo_descricao,
                        serial: item.serial, 
                    },
                    movimentacao: item.movimentacao,
                    quantidade: item.quantidade,
                }));
                setRows(mapped);
            })
            .catch(() => setRows([]));
    }, []);

    function generateEntradasSaidasPDF() {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(14);
        doc.text('Relatório de Entradas e Saídas', 10, 10);

        const dataAtual = new Date().toLocaleDateString('pt-BR');
        doc.setFontSize(10);
        doc.text(`Data de emissão: ${dataAtual}`, 10, 17);

        doc.setFontSize(14); 

        const tableColumn = [
            "Número",
            "Data",
            "Status",
            "Usuário",
            "Ativo",
            "Movimentação",
            "Quantidade"
        ];
        // Use filteredRows se houver, senão rows
        const dataToExport = filteredRows.length > 0 ? filteredRows : rows;
        const tableRows = dataToExport.map(row => [
            row.id || '',
            row.date || '',
            row.status || '',
            row.customer?.name || '',
            row.ativo?.nome || '',
            row.movimentacao || '',
            row.quantidade || ''
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255], fontSize: 12 },
        });

        doc.save('entradas_saidas.pdf');
    }

    return (
        <CssVarsProvider disableTransitionOnChange>
            <CssBaseline />
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
                    Entradas e Saídas
                </Typography>
                <Button
                    color="primary"
                    startDecorator={<DownloadRoundedIcon />}
                    size="sm"
                    onClick={generateEntradasSaidasPDF}
                >
                    Download PDF
                </Button>
            </Box>
            <OrderTable
                data={rows}
                type="entradas_saidas"
                // callback para receber os dados filtrados
                onFilteredChange={setFilteredRows}
            />
        </CssVarsProvider >
    );
}