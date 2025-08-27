'use client';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Box, Button } from '@mui/material';
import { AddCircle, Dashboard, Settings, Logout } from '@mui/icons-material';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

const drawerWidth = 240;

const menuItems = [
  {
    label: "แดชบอร์ด",
    icon: Dashboard,
    path: "/dashboard",
  },
  {
    label: "บันทึกรายการ",
    icon: AddCircle,
    path: "/transaction/add",
  },
  {
    label: "การตั้งค่า",
    icon: Settings,
    path: "/setting",
  },
];

export default function Sidebar({ currentPath, onNavigate, onLogout }: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* Header */}
      <Toolbar sx={{ flexDirection: "column", alignItems: "flex-start", p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            background: "linear-gradient(to right, #2563eb, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          SpendMemo
        </Typography>
        <Typography variant="body2" color="text.secondary">
          บันทึกรายรับ-รายจ่าย
        </Typography>
      </Toolbar>

      <Divider />

      {/* Menu */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const selected = currentPath === item.path;

            return (
              <ListItemButton
                key={item.path}
                selected={selected}
                onClick={() => onNavigate(item.path)}
                sx={{
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: "action.selected",
                    "&:hover": { backgroundColor: "action.hover" },
                  },
                }}
              >
                <ListItemIcon>
                  <Icon
                    sx={{
                      color: selected ? "primary.main" : "text.secondary",
                    }}
                  />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider />

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={onLogout}
          fullWidth
        >
          ออกจากระบบ
        </Button>
      </Box>
    </Drawer>
  );
}