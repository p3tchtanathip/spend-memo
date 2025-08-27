"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, CardHeader, CardActions, TextField, Typography, Stack, Link, Alert } from '@mui/material';
import { userService } from "@/services/user.service";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");
      const data = await userService.register({ name, email, password, confirmPassword });
      console.log("Register success:", data);

      const signinData = await signIn("credentials", {
        redirect: false,
        email,
        password
      });

      if (signinData?.error) {
        console.error(signinData.error);
        return false;
      }

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
          subheader="สร้างบัญชีใหม่เพื่อเริ่มต้นจัดการการเงิน"
        />
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="ชื่อ-นามสกุล"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="อีเมล"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="รหัสผ่าน"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="ยืนยันรหัสผ่าน"
              type="password"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              สมัครสมาชิก
            </Button>
          </form>
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Stack direction="row" spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              มีบัญชีแล้ว?
            </Typography>
            <Link
              component="button"
              onClick={() => router.push("/login")}
              underline="hover"
              color="primary"
              variant="body2"
            >
              เข้าสู่ระบบ
            </Link>
          </Stack>
        </CardActions>
      </Card>
    </Box>
  );
}
