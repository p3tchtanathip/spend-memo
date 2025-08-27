"use client";
import { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Card, CardContent, Button, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Alert, Autocomplete, Snackbar } from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";
import * as Icons from "@mui/icons-material";
import { categoryService } from "@/services/category.service";
import { CategoryType } from "@/types/category";
import { CategoryDto } from "@/common/dto/category.dto";
import DynamicIcon from "@/components/DynamicIcon";

const iconOptions = Object.keys(Icons);

export default function Setting() {
  const [tab, setTab] = useState<number>(0);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<CategoryType | null>(null);
  const [form, setForm] = useState<CategoryDto>({
    name: "",
    type: "INCOME",
    icon: "Abc",
  });
  const [error, setError] = useState<string>("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number|null>(null);
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const fetchCategories = async () => {
    try {
      const data = await categoryService.gets();
      setCategories(data);
    } catch (e) {
      setError("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpen = (cat?: CategoryType) => {
    if (cat) {
      setEditing(cat);
      setForm({ name: cat.name, type: cat.type, icon: cat.icon });
    } else {
      setEditing(null);
      setForm({ name: "", type: "INCOME", icon: "Abc" });
    }
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await categoryService.update(editing.id, form);
        setSuccessMessage("แก้ไขรายการสำเร็จ!");
      } else {
        await categoryService.add(form);
        setSuccessMessage("เพิ่มรายการสำเร็จ!");
      }
      setOpenDialog(false);
      setSuccessOpen(true);
      fetchCategories();
    } catch (e) {
      setError("บันทึกไม่สำเร็จ");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.delete(id);
      setSuccessMessage("ลบรายการสำเร็จ!");
      setSuccessOpen(true);
      fetchCategories();
    } catch (e) {
      setError("ลบไม่สำเร็จ");
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
        >
          การตั้งค่า
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          จัดการหมวดหมู่และการตั้งค่าอื่น ๆ
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 3
      }}>
        <Tabs
          value={tab}
          onChange={(e, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': {
              fontWeight: 500,
              minHeight: 48
            }
          }}
        >
          <Tab label="Category" sx={{ textTransform: 'none' }} />
        </Tabs>
      </Box>

      {/* Category Tab */}
      {tab === 0 && (
        <Box sx={{ mt: 3 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpen()}
              sx={{
                borderRadius: "50px",
                px: 3,
                py: 1,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                textTransform: 'none'
              }}
            >
              เพิ่ม Category
            </Button>
          </Stack>

          <Stack spacing={2}>
            {categories.map((cat) => {
              return (
                <Card 
                  key={cat.id}
                  variant="outlined" 
                  sx={{ 
                    borderRadius: 4,
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <DynamicIcon name={cat.icon as keyof typeof Icons} size="medium" color="text.primary" />
                      <Box>
                        <Typography fontWeight="bold">{cat.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cat.type}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0}>
                      <IconButton onClick={() => handleOpen(cat)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => setConfirmDeleteId(cat.id)}>
                        <Delete />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* Add or Edit Dialog*/}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "แก้ไข Category" : "เพิ่ม Category"}</DialogTitle>
        <DialogContent>
          <TextField
            label="ชื่อ"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="ประเภท"
            select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as "INCOME" | "EXPENSE" })}
            fullWidth
            sx={{ mb: 2 }}
          >
            <MenuItem value="INCOME">INCOME</MenuItem>
            <MenuItem value="EXPENSE">EXPENSE</MenuItem>
          </TextField>
          <Autocomplete
            options={iconOptions}
            value={form.icon}
            onChange={(e, v) => setForm({ ...form, icon: v || "AttachMoney" })}
            renderInput={(params) => (
              <TextField {...params} label="เลือก Icon" fullWidth />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <Box
                  key={key}
                  component="li"
                  {...otherProps}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <DynamicIcon name={option as keyof typeof Icons} size="small" />
                  <Typography sx={{ ml: 1 }}>{option}</Typography>
                </Box>
              );
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave}>
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={!!confirmDeleteId} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>ยืนยันการลบ</DialogTitle>
        <DialogContent>
          <Typography>คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>ยกเลิก</Button>
          <Button 
            variant="contained" 
            onClick={() => { 
              handleDelete(confirmDeleteId!); 
              setConfirmDeleteId(null); 
            }}
          >
            ลบ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
            fontSize: '1.1rem',
            fontWeight: 600
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
