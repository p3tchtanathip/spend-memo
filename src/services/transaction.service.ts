import axios from 'axios';
import { TransactionType } from '@/types/transaction';
import { TransactionDto } from '@/common/dto/transaction.dto';
import { DashboardType } from '@/types/dashboard';

export const transactionService = {
  gets: async (): Promise<TransactionType[]> => {
    const res = await axios.get('/api/transaction');
    return res.data;
  },
  getSummary: async (): Promise<DashboardType> => {
    const res = await axios.get('/api/transaction/summary');
    return res.data;
  },
  add: async(data: TransactionDto): Promise<TransactionType> => {
    const res = await axios.post('/api/transaction', data);
    return res.data;
  },
};
