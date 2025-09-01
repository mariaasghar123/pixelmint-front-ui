import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const fetchUserPurchases = async () => {
    const { data } = await api.get('/user/purchases');
    return data.payload;
};

export function useUserPurchases() {
    return useQuery({
        queryKey: ['userPurchases'],
        queryFn: fetchUserPurchases,
    });
}
