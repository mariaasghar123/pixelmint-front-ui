import api from "@/lib/api";

export const paymentService = {
    initiatePayment: async (purchaseId, walletAddress) => {
        const response = await api.post('/payments', {
            purchaseId,
            walletAddress,
        });
        console.log(response.data.payload)
        return response.data.payload;
    },

    verifyPayment: async (paymentId, transactionHash, signedNonce, chainKey) => {
        const response = await api.post('/payments/verify', {
            paymentId,
            transactionHash,
            signedNonce,
            chainKey,
        });
        return response.data;
    },
};
