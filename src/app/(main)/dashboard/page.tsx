'use client';
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Typography, Stack, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSession } from 'next-auth/react';
import { DashboardType, expensesByCategory } from "@/types/dashboard";
import { transactionService } from "@/services/transaction.service";
import RecentTransactionList from "@/components/RecentTransactionList";

export default function Dashboard() {
  const theme = useTheme();
  const { data: session } = useSession();

  const [data, setData] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await transactionService.getSummary();
        if (summary) {
          // add colors for pie chart
          const palette = ["#f8961e", "#90be6d", "#f94144", "#277da1", "#577590"];
          summary.expensesByCategories = (summary.expensesByCategories ?? []).map((cat: expensesByCategory, i: number) => ({
            ...cat,
            color: palette[i % palette.length],
          }));
          setData(summary);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
          กำลังโหลด...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
          ไม่พบข้อมูล
        </Typography>
      </Box>
    );
  }

  const savingsRate = data.totalIncome
    ? (((data.totalIncome - data.totalExpense) / data.totalIncome) * 100).toFixed(1)
    : "0";

  const axisStyle = { fontFamily: theme.typography.fontFamily, fontSize: 12, fill: theme.palette.text.primary };
  const tooltipStyle = { fontFamily: theme.typography.fontFamily, fontSize: 12 };

  return (
    <Stack spacing={2}>
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
          ภาพรวมการเงินของคุณ {session?.user?.name}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          ดูสรุปรายรับและรายจ่ายของคุณ
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
        <Card
          variant="outlined" 
          sx={{ 
            flex: 1,
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>รายรับทั้งหมด</Typography>
            }
          />
          <CardContent>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              ฿{data.totalIncome.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined" 
          sx={{ 
            flex: 1,
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>รายจ่ายทั้งหมด</Typography>
            }
          />
          <CardContent>
            <Typography variant="h4" color="error.main" fontWeight="bold">
              ฿{data.totalExpense.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card
          variant="outlined" 
          sx={{ 
            flex: 1,
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>ยอดคงเหลือ</Typography>
            }
          />
          <CardContent>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              ฿{data.balance.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>อัตราการออม {savingsRate}%</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Charts */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        {/* Pie Chart */}
       <Card
          variant="outlined" 
          sx={{ 
            flex: 1,
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>รายจ่ายตามหมวดหมู่</Typography>
            }
          />
          <CardContent>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.expensesByCategories}
                    dataKey="value"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                  >
                    {data.expensesByCategories.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={tooltipStyle} formatter={(value) => `฿${(value as number).toLocaleString()}`} />
                  <Legend wrapperStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Stack spacing={1} mt={2}>
              {data.expensesByCategories.map((cat) => (
                <Stack key={cat.name} direction="row" spacing={1} alignItems="center">
                  <Box sx={{ width: 12, height: 12, bgcolor: cat.color, borderRadius: '50%' }} />
                  <Typography variant="body2">{cat.name}</Typography>
                  <Box flexGrow={1} />
                  <Typography variant="body2" color="text.secondary">฿{cat.value.toLocaleString()}</Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card
          variant="outlined" 
          sx={{ 
            flex: 1,
            borderRadius: 4,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            p: 1
          }}
        >
          <CardHeader
            title={
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>รายจ่ายรายเดือน</Typography>
            }
          />
          <CardContent>
            <Box sx={{ height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={axisStyle} />
                  <YAxis tick={axisStyle} />
                  <Tooltip wrapperStyle={tooltipStyle} formatter={(value) => [`฿${(value as number).toLocaleString()}`, 'รายจ่าย']} />
                  <Bar dataKey="amount" fill={theme.palette.primary.main} />
                  <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* Recent Transactions */}
      <Card
        variant="outlined" 
        sx={{ 
          flex: 1,
          borderRadius: 4,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          p: 1
        }}
      >
        <CardHeader
          title={
            <Typography variant="h6" fontWeight="bold" sx={{ color: 'text.primary' }}>รายการล่าสุด</Typography>
          }
        />
        <CardContent>
          <Stack spacing={2}>
            {data.recentTransactions.length === 0 ? (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
                  ไม่มีประวัติรายการ
                </Typography>
              </Box>
            ) : (
              <RecentTransactionList transactions={data.recentTransactions} />
            )}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
