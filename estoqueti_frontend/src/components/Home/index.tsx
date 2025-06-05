import * as React from 'react';
import { useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Sidebar from '../Sidebar/index.tsx';
import EntradasSaidas from '../EntradasSaidas/index.tsx';
import Estoque from '../Estoque/index.jsx';
import Header from '../Header';
import TelaInicial from '../TelaInicial/index.jsx';
import Dashboard from '../Dashboard/index.jsx';
import Gerenciar from '../Gerenciar/index.jsx';
import Atividade from '../Atividade/index.jsx';
import Reporte from '../Reporte/index.jsx';
import Configuracao from '../Config/index.tsx'

const customTheme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          surface: '#23272f', // Fundo de cards/modais
          body: '#181a20',    // Fundo principal
          popup: '#23272f',
          level1: '#23272f',
          level2: '#181a20',
        },
        primary: {
          solidBg: '#2563eb',        // Azul mais suave
          solidHoverBg: '#1d4ed8',
          solidActiveBg: '#1e40af',
          outlinedColor: '#60a5fa',
          outlinedBorder: '#2563eb',
        },
        neutral: {
          plainColor: '#e5e7eb',
          outlinedColor: '#a1a1aa',
          outlinedBorder: '#334155',
          solidBg: '#334155',
          solidHoverBg: '#1e293b',
        },
        text: {
          primary: '#f3f4f6',   // Texto principal
          secondary: '#a1a1aa', // Texto secundário
        },
        divider: '#334155',
      },
    },
  },
});

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
    }
  }, [navigate]);

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    return (
      <Breadcrumbs
        size="sm"
        aria-label="breadcrumbs"
        separator={<ChevronRightRoundedIcon />}
        sx={{ pl: 0 }}
      >
        <Link
          underline="none"
          color="neutral"
          href="/home"
          aria-label="Home"
        >
          <HomeRoundedIcon />
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <Link
              key={to}
              underline="hover"
              color="neutral"
              href={to}
              sx={{ fontSize: 12, fontWeight: 500 }}
            >
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Link>
          );
        })}
      </Breadcrumbs>
    );
  };

  return (
    <CssVarsProvider disableTransitionOnChange theme={customTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', maxHeight: '100dvh', overflow: 'hidden' }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: 'calc(12px + var(--Header-height))',
              sm: 'calc(12px + var(--Header-height))',
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100dvh',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {generateBreadcrumbs()}
          </Box>
          <Routes>
            <Route path="entradas-saidas" element={<EntradasSaidas />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="estoque/*" element={<Estoque />} />
            <Route path="gerenciar" element={<Gerenciar />} />
            <Route path="atividade" element={<Atividade />} />
            <Route path="/" element={<TelaInicial />} />
            <Route path="/reporte" element={<Reporte />} />
            <Route path="/configuracao" element={<Configuracao />} />
          </Routes>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}