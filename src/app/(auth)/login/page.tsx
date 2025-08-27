"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, CardHeader, CardActions, TextField, Typography, Link, Stack, Alert } from '@mui/material';
import { signIn } from "next-auth/react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (data?.error) {
        console.error(data.error);
        return false;
      }

      console.log("Login success:", data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาด");
    }
  };

  return (  
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 2 }}>
        <CardHeader
          sx={{ textAlign: "center" }}
          title={
            <Typography
              variant="h5"
              sx={{
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold",
              }}
            >
              SpendMemo
            </Typography>
          }
          subheader="เข้าสู่ระบบเพื่อจัดการรายรับ-รายจ่ายของคุณ"
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="อีเมล"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              เข้าสู่ระบบ
            </Button>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              ยังไม่มีบัญชี?
            </Typography>
            <Link
              component="button"
              onClick={() => router.push("/register")}
              underline="hover"
              color="primary"
              variant="body2"
            >
              สมัครสมาชิก
            </Link>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
}
