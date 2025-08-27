import { TransactionType } from "@/types/transaction";
import { AttachMoney, MoneyOff } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useState } from "react";

interface RecentTransactionListProps {
  transactions: TransactionType[];
}

export default function RecentTransactionList({ transactions }: RecentTransactionListProps) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const visibleTransactions = showAll ? transactions : transactions.slice(0, 5);

  return (
    <Stack spacing={2}>
      {visibleTransactions.map((tx) => (
        <Box
          key={tx.id} 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          p={2} 
          borderRadius={2} 
          sx={{ bgcolor: '#f9f9f9' }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: tx.type === 'INCOME' ? '#c8e6c9' : '#ffcdd2' }}>
              {tx.type === 'INCOME' ? <AttachMoney color="success" /> : <MoneyOff color="error" />}
            </Avatar>
            <Box>
              <Typography fontWeight="bold">{tx.description}</Typography>
              {tx.category && <Chip label={tx.category.name} size="small" />}
            </Box>
          </Box>
          <Box textAlign="right">
            <Typography color={tx.type === 'INCOME' ? 'success.main' : 'error.main'} fontWeight="bold">
              {tx.type === 'INCOME' ? '+' : '-'}฿{tx.amount.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(tx.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
      ))}

      {transactions.length > 5 && (
        <Box display="flex" justifyContent="center" mt={1}>
          <Button 
            variant="outlined"
            size="small"
            sx={{ borderRadius: 3 }}
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "ย่อรายการ" : "ดูทั้งหมด"}
          </Button>
        </Box>
      )}
    </Stack>
  );
}