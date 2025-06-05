import Box, { BoxProps } from '@mui/joy/Box';

function Root(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={[
        {
          bgcolor: 'background.appBody',
          minHeight: '90vh',
          height: '90vh',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    />
  );
}

function Main(props: BoxProps) {
  return (
    <Box
      component="main"
      className="Main"
      {...props}
      sx={[
        { 
          p: 2,
          overflowY: 'auto',
          flex: '1 1 auto',
          minHeight: 0,
          gridRow: '2',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    />
  );
}

export default {
  Root,
  Main
};