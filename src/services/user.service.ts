import axios from 'axios';
import { RegisterDto } from "@/common/dto/register.dto";
import { UserType } from '@/types/user';

export const userService = {
  register: async (data: RegisterDto): Promise<UserType> => {
    const res = await axios.post('/api/auth/register', data);
    return res.data;
  },
};
