import { useQuery } from "@tanstack/react-query"
import api from '@/lib/api';

export async function purchasePixelMutation(data) {
    const formData = new FormData();

    formData.append('pixelArea', JSON.stringify(data.pixelArea));
    formData.append('displayName', data.displayName);
    formData.append('adTitle', data.adTitle);
    formData.append('websiteUrl', data.websiteUrl);

    if (data.telegramContact) formData.append('telegramContact', data.telegramContact);
    if (data.referredBy) formData.append('referredBy', data.referredBy);

    formData.append('adImage', data.adImage);

    try {
        const response = await api.post('/pixel/purchase', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        let message = 'Failed to purchase pixel';
        if (error.response && error.response.data) {
            message = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
        } else if (error.message) {
            message = error.message;
        }
        throw new Error(message);
    }
}

const fetchTotalPixels = async () => {
    const data = await api.get('/pixel/total-purchase')
    return data.data.payload.totalPixels
}


export function useTotalPixelPurchased(opts) {
    return useQuery({
        queryKey: ['recentBuyers'],
        queryFn: fetchTotalPixels,
        ...opts
    })
}

