import axios from 'axios';
import { CategoryDto } from '@/common/dto/category.dto';
import { CategoryType } from '@/types/category';
import { EntryType } from '@/types/entry';

export const categoryService = {
  gets: async (): Promise<CategoryType[]> => {
    const res = await axios.get('/api/category');
    return res.data;
  },
  getByType: async(type: EntryType): Promise<CategoryType[]> => {
    const res = await axios.get(`/api/category?type=${type}`);
    return res.data;
  },
  add: async(data: CategoryDto): Promise<CategoryType> => {
    const res = await axios.post('/api/category', data);
    return res.data;
  },
  update: async(id: number, data: CategoryDto): Promise<CategoryType> => {
    const res = await axios.put(`/api/category/${id}`, data);
    return res.data;
  },
  delete: async(id: number): Promise<void> => {
    const res = await axios.delete(`/api/category/${id}`);
    return res.data;
  },
};
