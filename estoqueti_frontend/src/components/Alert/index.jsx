import * as React from 'react';
import Box from '@mui/joy/Box';
import Alert from '@mui/joy/Alert';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import InfoIcon from '@mui/icons-material/Info';

const iconMap = {
  success: <CheckCircleIcon />,
  warning: <WarningIcon />,
  danger: <ReportIcon />,
  neutral: <InfoIcon />,
};

export default function BasicAlert({ severity = 'neutral', message = '', onClose }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Alert
        sx={{ alignItems: 'flex-start' }}
        startDecorator={iconMap[severity]}
        variant="soft"
        color={severity}
        endDecorator={
          <IconButton variant="soft" color={severity} onClick={onClose}>
            <CloseRoundedIcon />
          </IconButton>
        }
      >
        <Typography level="body-sm" color={severity}>
          {message}
        </Typography>
      </Alert>
    </Box>
  );
}