import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '@/api/payments';

export const useInitiatePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ purchaseId, walletAddress }) =>
            paymentService.initiatePayment(purchaseId, walletAddress),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['purchase'] });
        },
    });
};

export const useVerifyPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ paymentId, transactionHash, signedNonce, chainKey }) =>
            paymentService.verifyPayment(paymentId, transactionHash, signedNonce, chainKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['payment'] });
        },
    });
};
