"use client";
import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Tabs, Tab, TextField, Chip, Avatar, Snackbar, Alert, Stack, Fade } from '@mui/material';
import { AttachMoney, MoneyOff, CheckCircle } from '@mui/icons-material';
import { CategoryType } from '@/types/category';
import { categoryService } from '@/services/category.service';
import { EntryType } from '@/types/entry';
import { transactionService } from '@/services/transaction.service';
import { TransactionType } from '@/types/transaction';
import * as Icons from "@mui/icons-material";
import { TransactionDto } from '@/common/dto/transaction.dto';
import RecentTransactionList from '@/components/RecentTransactionList';
import DynamicIcon from '@/components/DynamicIcon';
import formatTodayDate from '@/utils/date';

export default function AddTransaction() {
  const [tab, setTab] = useState<number>(0);
  const [transactionType, setTransactionType] = useState<EntryType>('INCOME');
  const [amount, setAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [incomeCategories, setIncomeCategories] = useState<CategoryType[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<CategoryType[]>([]);
  const [description, setDescription] = useState<string>('');
  const [dateValue, setDateValue] = useState<string>(formatTodayDate());
  const [error, setError] = useState<string>('');
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [isDescriptionEdited, setIsDescriptionEdited] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const incomes = await categoryService.getByType("INCOME");
        const expenses = await categoryService.getByType("EXPENSE");
        setIncomeCategories(incomes);
        setExpenseCategories(expenses);

        const transactions = await transactionService.gets();
        setTransactions(transactions);
      } catch (e) {
        console.error("Failed to fetch data: ", e);
        setError("ไม่สามารถโหลดข้อมูลได้");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setSelectedCategory(null);
    setDescription('');
    setIsDescriptionEdited(false);
  }, [transactionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedCategory) {
      setError('กรุณาเลือกหมวดหมู่');
      return;
    }

    try {
      const payload: TransactionDto = {
        amount: Number(amount),
        type: transactionType,
        description: description || selectedCategory.name,
        date: new Date(dateValue),
        categoryId: selectedCategory.id,
      };

      await transactionService.add(payload);
      setSuccessOpen(true);

      const transactions = await transactionService.gets();
      setTransactions(transactions);

      // Reset form
      setAmount('');
      setSelectedCategory(null);
      setDescription('');
      setDateValue(formatTodayDate());
      setIsDescriptionEdited(false);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || "เกิดข้อผิดพลาด");
    }
  };

  const handleCategorySelect = (category: CategoryType) => {
    setSelectedCategory(category);
    
    if (!isDescriptionEdited) {
      setDescription(category.name);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setIsDescriptionEdited(true);
  };

  const categories = transactionType === 'INCOME' ? incomeCategories : expenseCategories;

  const CategoryButton = ({ cat }: { cat: CategoryType }) => {
    const isSelected = selectedCategory?.id === cat.id;

    return (
      <Button
        variant={isSelected ? "contained" : "outlined"}
        onClick={() => handleCategorySelect(cat)}
        sx={{ 
          flexDirection: 'column', 
          height: 80,
          width: '100%',
          borderRadius: 3,
          position: 'relative',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
          '&:hover': {
            transform: 'scale(1.08)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
          '&.MuiButton-contained': {
            background: transactionType === 'INCOME' 
              ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
              : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
            color: 'white',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            '&:hover': {
              background: transactionType === 'INCOME' 
                ? 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)'
                : 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
            }
          },
          '&.MuiButton-outlined': {
            background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
            borderColor: 'rgba(0,0,0,0.12)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              borderColor: transactionType === 'INCOME' ? '#4caf50' : '#f44336',
              background: transactionType === 'INCOME' 
                ? 'linear-gradient(135deg, rgba(76,175,80,0.1) 0%, rgba(129,199,132,0.1) 100%)'
                : 'linear-gradient(135deg, rgba(244,67,54,0.1) 0%, rgba(229,115,115,0.1) 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            }
          }
        }}
      >
        <DynamicIcon name={cat.icon as keyof typeof Icons} size="medium" />
        <Typography variant="caption" sx={{ lineHeight: 1.2, fontWeight: 500, mt: 1, textTransform: 'none' }}>
          {cat.name}
        </Typography>
        {isSelected && (
          <CheckCircle
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              fontSize: 18,
              color: 'white',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}
          />
        )}
      </Button>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
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
          บันทึกรายการ
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          จัดการรายรับและรายจ่ายของคุณ
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
          <Tab label="เพิ่มรายการใหม่" />
          <Tab label="ประวัติรายการ" />
        </Tabs>
      </Box>
      
      {/* Add Transaction Tab */}
      <Fade in={tab === 0} timeout={300}>
        <Box sx={{ display: tab === 0 ? 'block' : 'none' }}>
          <Card 
            variant="outlined" 
            sx={{ 
              borderRadius: 4,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Transaction Type Selection */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                    ประเภทรายการ
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant={transactionType === 'INCOME' ? 'contained' : 'outlined'}
                      onClick={() => setTransactionType('INCOME')}
                      startIcon={<AttachMoney />}
                      sx={{ 
                        flex: 1, 
                        py: 2,
                        height: '3em',
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                        '&.MuiButton-contained': {
                          background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)',
                            boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
                          }
                        },
                        '&.MuiButton-outlined': {
                          borderColor: '#4caf50',
                          color: '#4caf50',
                          background: 'linear-gradient(135deg, rgba(76,175,80,0.05) 0%, rgba(129,199,132,0.05) 100%)',
                        }
                      }}
                    >
                      รายรับ
                    </Button>
                    <Button
                      variant={transactionType === 'EXPENSE' ? 'contained' : 'outlined'}
                      onClick={() => setTransactionType('EXPENSE')}
                      startIcon={<MoneyOff />}
                      sx={{ 
                        flex: 1, 
                        py: 2,
                        height: '3em',
                        borderRadius: 3,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        },
                        '&.MuiButton-contained': {
                          background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                          boxShadow: '0 6px 20px rgba(244, 67, 54, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
                            boxShadow: '0 8px 25px rgba(244, 67, 54, 0.4)',
                          }
                        },
                        '&.MuiButton-outlined': {
                          borderColor: '#f44336',
                          color: '#f44336',
                          background: 'linear-gradient(135deg, rgba(244,67,54,0.05) 0%, rgba(229,115,115,0.05) 100%)',
                        }
                      }}
                    >
                      รายจ่าย
                    </Button>
                  </Stack>
                </Box>

                {/* Amount and Date */}
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 4 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                      จำนวนเงิน
                    </Typography>
                    <TextField
                      placeholder="0.00"
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || Number(val) >= 0) {
                          setAmount(val);
                        }
                      }}
                      fullWidth
                      required
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 4px 12px ${transactionType === 'INCOME' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                            borderColor: transactionType === 'INCOME' ? '#4caf50' : '#f44336',
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '1.4rem',
                          fontWeight: 600,
                          py: 2,
                          height: '1em'
                        }
                      }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <Typography sx={{ mr: 1, color: 'text.secondary', fontSize: '1.2rem', fontWeight: 500 }}>
                              ฿
                            </Typography>
                          )
                        }
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                      วันที่
                    </Typography>
                    <TextField
                      type="date"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
                          backdropFilter: 'blur(10px)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            transform: 'translateY(-1px)',
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 4px 12px ${transactionType === 'INCOME' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                            borderColor: transactionType === 'INCOME' ? '#4caf50' : '#f44336',
                          }
                        },
                        '& .MuiInputBase-input': {
                          fontSize: '1.1rem',
                          fontWeight: 500,
                          py: 2,
                          height: '1.25em'
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Category Selection */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: 'text.primary' }}>
                    หมวดหมู่
                  </Typography>
                  <Box sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
                    gap: 2
                  }}>
                    {categories.map((cat) => (
                      <CategoryButton key={cat.id} cat={cat} />
                    ))}
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'text.primary' }}>
                    รายละเอียด
                  </Typography>
                  <TextField
                    placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
                    value={description}
                    onChange={handleDescriptionChange}
                    fullWidth
                    multiline
                    rows={3}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          transform: 'translateY(-1px)',
                        },
                        '&.Mui-focused': {
                          boxShadow: `0 4px 12px ${transactionType === 'INCOME' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)'}`,
                          borderColor: transactionType === 'INCOME' ? '#4caf50' : '#f44336',
                        }
                      }
                    }}
                    helperText={selectedCategory && !isDescriptionEdited 
                      ? `จากหมวดหมู่: ${selectedCategory.name}` 
                      : ''
                    }
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!amount || !selectedCategory}
                  sx={{ 
                    py: 2,
                    borderRadius: 3,
                    height: '3em',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: transactionType === 'INCOME' 
                      ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
                      : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
                    boxShadow: `0 8px 25px ${transactionType === 'INCOME' ? 'rgba(76, 175, 80, 0.4)' : 'rgba(244, 67, 54, 0.4)'}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: transactionType === 'INCOME' 
                        ? 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)'
                        : 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)',
                      transform: 'translateY(-3px)',
                      boxShadow: `0 12px 30px ${transactionType === 'INCOME' ? 'rgba(76, 175, 80, 0.5)' : 'rgba(244, 67, 54, 0.5)'}`,
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #bdbdbd 0%, #e0e0e0 100%)',
                      color: 'rgba(0,0,0,0.4)',
                      boxShadow: 'none',
                      transform: 'none',
                    }
                  }}
                >
                  บันทึกรายการ
                </Button>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Fade>

      {/* Transaction History Tab */}
      <Fade in={tab === 1} timeout={300}>
        <Box sx={{ display: tab === 1 ? 'block' : 'none' }}>
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
            <CardContent sx={{ p: 3 }}>
              {transactions.length === 0 ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <Typography sx={{ fontSize: "1rem" }} color="text.secondary">
                    ไม่มีประวัติรายการ
                  </Typography>
                </Box>
              ) : (
                <RecentTransactionList transactions={transactions} />
              )}
            </CardContent>
          </Card>
        </Box>
      </Fade>

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
          บันทึกรายการสำเร็จ!
        </Alert>
      </Snackbar>
    </>
  );
}