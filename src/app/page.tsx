'use client';
import { Box, Typography, Button, Stack } from '@mui/material';

export default function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(to right, #2563eb, #4f46e5)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ยินดีต้อนรับสู่ SpendMemo
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, mb: 4, fontWeight: 'regular' }}
        >
          จัดการการเงิน รู้จักค่าใช้จ่ายของคุณ และวางแผนได้ดีกว่าเดิม
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            color="primary"
            href="/register"
          >
            เริ่มต้นใช้งาน
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            href="/login"
          >
            เข้าสู่ระบบ
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
