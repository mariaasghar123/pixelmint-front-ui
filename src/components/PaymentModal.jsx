"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, AlertTriangle, Loader2, RefreshCw, ShieldAlert, CheckCircle2 } from "lucide-react"
import { toast } from "react-toastify"
import { z } from "zod"
import {
    useAccount,
    useWriteContract,
    useWaitForTransactionReceipt,
    useChains,
    useSwitchChain,
    useSignMessage
} from "wagmi"
import { parseUnits } from "viem"

// Import hooks
import { useInitiatePayment, useVerifyPayment } from "@/hooks/usePayment"
import { useEasterEgg } from "@/hooks/useEasterEgg"
import { useAuth } from "./AuthProvider"

// Import constants
import { TOKENS, SUPPORTED_NETWORKS, PAYMENT_STATES, ERC20_ABI } from "@/constants"

// Import UI components
import { Button, Label, Card, CardContent, Select, AmountDisplay } from "@/components/Payment/UI"
import TokenSelector from "@/components/Payment/TokenSelector"
import NetworkSwitchBanner from "@/components/Payment/NetworkSwitch"
import TransactionHashDisplay from "@/components/Payment/TransactionHash"
import {
    InitiationStatus,
    SigningStatus,
    VerificationStatus,
    ProcessingStatus,
    SuccessStatus
} from "@/components/Payment/StatusIndicators"

import { getReservation, saveReservation, clearReservation } from "@/utils/localStorage.utils"

// Form validation schema
const paymentSchema = z.object({
    token: z.string().min(1, "Token is required"),
    networkId: z.string().min(1, "Network is required")
})

// Error categories for better handling
const ERROR_TYPES = {
    CONNECTION: 'CONNECTION',
    PURCHASE_ID: 'PURCHASE_ID',
    SERVER: 'SERVER',
    WALLET: 'WALLET',
    SIGNING: 'SIGNING',
    NETWORK: 'NETWORK',
    TRANSACTION: 'TRANSACTION',
    VERIFICATION: 'VERIFICATION',
    UNKNOWN: 'UNKNOWN'
}

const ErrorBanner = ({ error, errorType, onRetry, onReset }) => {
    let title = "An error occurred";
    let message = error || "Something went wrong. Please try again.";
    let showRetry = true;
    let showReset = false;

    switch (errorType) {
        case ERROR_TYPES.CONNECTION:
            title = "Connection Error";
            message = "Please connect your wallet to continue.";
            showRetry = false;
            break;
        case ERROR_TYPES.PURCHASE_ID:
            title = "Purchase ID Missing";
            message = "The purchase ID is missing. Please go back to the product page and try again.";
            showRetry = false;
            showReset = true;
            break;
        case ERROR_TYPES.SERVER:
            title = "Server Error";
            message = error || "Our server is experiencing issues. Please try again later.";
            showReset = true;
            break;
        case ERROR_TYPES.WALLET:
            title = "Wallet Error";
            message = error || "There was an issue with your wallet. Please check your connection and try again.";
            break;
        case ERROR_TYPES.SIGNING:
            title = "Signing Failed";
            message = error || "Failed to sign the transaction. Please try again.";
            break;
        case ERROR_TYPES.NETWORK:
            title = "Network Error";
            message = error || "There was an issue with the blockchain network. Please try again.";
            break;
        case ERROR_TYPES.TRANSACTION:
            title = "Transaction Failed";
            message = error || "Your transaction could not be processed. Please try again.";
            break;
        case ERROR_TYPES.VERIFICATION:
            title = "Verification Failed";
            message = error || "We couldn't verify your payment. You can try verifying again or restart the payment process.";
            showReset = true;
            break;
    }

    return (
        <div className="w-full p-4 bg-[#E0524D]/10 border border-[#E0524D]/20 rounded-lg mb-6">
            <div className="flex items-start gap-3">
                <ShieldAlert className="h-6 w-6 text-[#E0524D] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-medium text-[#E0524D] mb-1">{title}</h4>
                    <p className="text-sm text-[#EBFFF9]/80 mb-3">{message}</p>
                    <div className="flex gap-2">
                        {showRetry && (
                            <Button
                                onClick={onRetry}
                                className="bg-[#21c192] hover:bg-[#21c192]/80 text-[#002420] flex-1"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Retry
                            </Button>
                        )}
                        {showReset && (
                            <Button
                                onClick={onReset}
                                className="bg-transparent border border-[#FFFFFF33] hover:bg-[#FFFFFF11] text-[#EBFFF9] flex-1"
                            >
                                Start New Payment
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Admin panel component that shows simplified payment flow
const AdminPaymentPanel = ({
    paymentDetails,
    onCompleteAdminPayment,
    selectedNetworkId = "11155111"
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdminPayment = async () => {
        if (!paymentDetails) return;

        setIsSubmitting(true);

        try {
            // Generate a mock transaction hash for admin payments
            const mockTxHash = `admin-payment-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

            // Small delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 800));

            // Call the callback with the mock hash
            onCompleteAdminPayment(mockTxHash, selectedNetworkId);

            toast.success("Admin payment initiated");
        } catch (error) {
            toast.error("Failed to process admin payment");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-300 mb-1">Admin Payment Mode</h4>
                        <p className="text-sm text-[#EBFFF9]/80 mb-3">
                            As an admin, you can approve this payment without wallet transactions.
                        </p>
                    </div>
                </div>
            </div>

            <Card className="mb-5">
                <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-[#94D9C0]/70">Total Amount</span>
                        <div className="text-right">
                            <span className="text-xl md:text-2xl font-bold text-[#EBFFF9]">${paymentDetails?.amount || 0}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Button
                onClick={handleAdminPayment}
                disabled={isSubmitting || !paymentDetails}
                className="w-full mb-2 font-semibold bg-blue-600 hover:bg-blue-700"
            >
                {isSubmitting ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                        <span>Processing...</span>
                    </>
                ) : (
                    "Approve Payment as Admin"
                )}
            </Button>
        </div>
    );
};

export default function PaymentModal({
    open,
    onClose,
    title = "Complete Payment",
    description = "Complete your purchase with cryptocurrency",
    onPaymentComplete = () => { },
}) {
    const { user } = useAuth();

    // Check if user is admin
    const isAdmin = user?.user?.role === 'admin';

    // Payment flow state
    const [paymentState, setPaymentState] = useState(PAYMENT_STATES.INITIATING);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [signedNonce, setSignedNonce] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState(ERROR_TYPES.UNKNOWN);
    const [hasInitiated, setHasInitiated] = useState(false);
    const [isErrorHandling, setIsErrorHandling] = useState(false);

    // Refs for preventing duplicate calls
    const initiateCallInProgress = useRef(false);
    const verifyCallInProgress = useRef(false);
    const isModalMounted = useRef(false);

    // Easter egg hook
    const { easterEggActivated, incrementEasterEggCounter } = useEasterEgg();

    // Wallet connection
    const { address, isConnected, chainId } = useAccount();
    const chains = useChains();

    // Chain switching
    const {
        switchChain,
        isPending: isSwitchingChain,
        error: switchChainError
    } = useSwitchChain();

    // Message signing
    const {
        signMessage,
        data: signData,
        isPending: isSignPending,
        error: signError
    } = useSignMessage();

    // Token transfer
    const {
        writeContract,
        data: hash,
        error: writeError,
        isPending: isWritePending,
        reset: resetWriteContract
    } = useWriteContract();

    // Transaction confirmation
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        error: confirmError
    } = useWaitForTransactionReceipt({
        hash,
    });

    // TanStack Query mutations
    const initiateMutation = useInitiatePayment();
    const verifyMutation = useVerifyPayment();

    // Form handling
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset: resetForm,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            token: "usdt",
            networkId: "11155111" // Default to Sepolia
        },
    });

    const selectedNetworkId = parseInt(watch("networkId"));
    const selectedToken = watch("token");
    const selectedNetworkName = SUPPORTED_NETWORKS[selectedNetworkId] || "Unknown Network";
    const selectedTokenConfig = TOKENS[selectedNetworkId]?.[selectedToken];

    // Check if chain switch is needed
    const isChainSwitchNeeded = isConnected && chainId !== selectedNetworkId;

    // Current chain name
    const currentChain = chains?.find(chain => chain.id === chainId);
    const currentChainName = currentChain?.name || "Unknown Network";

    // Reset error state helper
    const resetErrorState = useCallback(() => {
        setErrorMessage("");
        setErrorType(ERROR_TYPES.UNKNOWN);
        setIsErrorHandling(false);
    }, []);

    // Handle error with categorization for better UX
    const handleError = useCallback((error, type, state = PAYMENT_STATES.FAILED) => {
        console.error(`${type} error:`, error);

        // Extract message from error object
        let message = "";
        if (typeof error === 'string') {
            message = error;
        } else if (error?.message) {
            message = error.message;
        } else if (error?.toString) {
            message = error.toString();
        } else {
            message = "An unknown error occurred";
        }

        // Clean up error message - remove technical details after colon
        if (message.includes("[")) {
            message = message.split("[")[0].trim();
        }

        // Set error state
        setErrorMessage(message);
        setErrorType(type);
        setPaymentState(state);
        setIsErrorHandling(true);

        // Reset in-progress flags to allow retries
        if (type === ERROR_TYPES.SERVER || type === ERROR_TYPES.PURCHASE_ID) {
            setHasInitiated(false);
            initiateCallInProgress.current = false;
        }

        if (type === ERROR_TYPES.VERIFICATION) {
            verifyCallInProgress.current = false;
        }

        // Show toast for better visibility
        toast.error(message);
    }, []);

    // 1. INITIATE PAYMENT - Get payment details from server
    const initiatePayment = useCallback(async () => {
        // Prevent duplicate calls
        if (initiateCallInProgress.current || !isModalMounted.current) return;
        initiateCallInProgress.current = true;

        if ((!isConnected || !address)) {
            handleError("Please connect your wallet first", ERROR_TYPES.CONNECTION);
            initiateCallInProgress.current = false;
            return;
        }

        // Prevent double calls
        if (hasInitiated) {
            initiateCallInProgress.current = false;
            return;
        }

        setHasInitiated(true);
        resetErrorState();
        setPaymentState(PAYMENT_STATES.INITIATING);

        try {
            const purchaseId = getReservation().purchaseId;
            if (!purchaseId) {
                handleError("Reservation not found. Please try again.", ERROR_TYPES.PURCHASE_ID);
                initiateCallInProgress.current = false;
                return;
            }

            console.log("Initiating payment for purchase:", purchaseId);

            const result = await initiateMutation.mutateAsync({
                purchaseId,
                walletAddress: isAdmin ? user.user.walletAddress : address,
            });

            console.log("Payment initiated successfully:", result);

            // API responds with "recieverAddress" (misspelled) 
            setPaymentDetails({
                receiverAddress: result.recieverAddress,
                amount: result.payment.amount,
                nonce: result.payment.nonce
            });
            setPaymentId(result.payment._id);

            // Reset the in-progress flag
            initiateCallInProgress.current = false;

            // For admin users, skip to READY state
            if (isAdmin) {
                setPaymentState(PAYMENT_STATES.READY);
            }
            // For regular users, move to signing in useEffect
        } catch (error) {
            // Determine error type for better UX
            const errorMsg = error?.message?.toLowerCase() || "";

            if (errorMsg.includes("network") || errorMsg.includes("connection")) {
                handleError(error, ERROR_TYPES.NETWORK);
            } else if (errorMsg.includes("server") || errorMsg.includes("500") || errorMsg.includes("unavailable")) {
                handleError(error, ERROR_TYPES.SERVER);
            } else {
                handleError(error, ERROR_TYPES.UNKNOWN);
            }

            setHasInitiated(false);
            initiateCallInProgress.current = false;
        }
    }, [address, isConnected, initiateMutation, hasInitiated, handleError, resetErrorState, isAdmin, user]);

    // 2. SIGN MESSAGE - Sign the nonce for authentication
    const signNonce = useCallback(() => {
        if (!paymentDetails?.nonce) {
            handleError("No nonce available to sign", ERROR_TYPES.SIGNING);
            return;
        }

        // Admin users don't need to sign
        if (isAdmin) {
            // Generate a mock signature for admin
            setSignedNonce(`admin-signature-${Date.now()}`);
            setPaymentState(PAYMENT_STATES.READY);
            return;
        }

        resetErrorState();
        setPaymentState(PAYMENT_STATES.SIGNING);

        try {
            console.log("Signing nonce:", paymentDetails.nonce);
            signMessage({ message: paymentDetails.nonce });
        } catch (error) {
            handleError(error, ERROR_TYPES.SIGNING);
        }
    }, [paymentDetails, signMessage, handleError, resetErrorState, isAdmin]);

    // Handle admin payment completion
    const handleAdminPaymentComplete = useCallback((adminTxHash, networkId) => {
        setTxHash(adminTxHash);

        // Create a mock signature if needed
        if (!signedNonce) {
            setSignedNonce(`admin-signature-${Date.now()}`);
        }

        // Move to verification step
        setPaymentState(PAYMENT_STATES.VERIFYING);

        // Trigger verification after a short delay
        setTimeout(() => {
            verifyPayment(adminTxHash, networkId);
        }, 500);
    }, [signedNonce]);

    // 3. VERIFY PAYMENT - Verify the payment with backend
    const verifyPayment = useCallback(async (adminTxHash, adminNetworkId) => {
        // Prevent duplicate verification calls
        if (verifyCallInProgress.current) return;
        verifyCallInProgress.current = true;

        // Use provided admin values or the component state
        const transactionHash = adminTxHash || txHash;
        const networkId = adminNetworkId || selectedNetworkId;

        if (!transactionHash || !signedNonce || !paymentId) {
            handleError("Missing transaction hash, signature, or payment ID", ERROR_TYPES.VERIFICATION);
            verifyCallInProgress.current = false;
            return;
        }

        const tokenConfig = TOKENS[networkId]?.[selectedToken];
        if (!tokenConfig && !isAdmin) {
            handleError("Token configuration missing", ERROR_TYPES.VERIFICATION);
            verifyCallInProgress.current = false;
            return;
        }

        resetErrorState();
        setPaymentState(PAYMENT_STATES.VERIFYING);

        try {
            console.log("Verifying payment:", {
                paymentId,
                transactionHash,
                signedNonce,
                chainKey: isAdmin ? "sepolia" : tokenConfig.chainKey
            });

            // Use the verify payment mutation
            const result = await verifyMutation.mutateAsync({
                paymentId,
                transactionHash,
                signedNonce,
                chainKey: isAdmin ? "sepolia" : tokenConfig.chainKey
            });

            console.log("Verification response:", result);

            if (result.success) {
                setPaymentState(PAYMENT_STATES.SUCCESS);
                toast.success("Payment verified successfully!");

                clearReservation();

                // Close modal after delay
                setTimeout(() => {
                    handleClose();
                    onPaymentComplete();
                }, 3000);
            } else {
                throw new Error(result.message || "Payment could not be verified");
            }

            verifyCallInProgress.current = false;
        } catch (error) {
            handleError(error, ERROR_TYPES.VERIFICATION);
            verifyCallInProgress.current = false;
        }
    }, [
        txHash,
        signedNonce,
        paymentId,
        selectedTokenConfig,
        selectedNetworkId,
        selectedToken,
        verifyMutation,
        onPaymentComplete,
        handleError,
        resetErrorState,
        isAdmin
    ]);

    // Reset entire payment flow
    const resetPaymentFlow = useCallback(() => {
        resetForm();
        resetWriteContract?.();
        setPaymentDetails(null);
        setSignedNonce(null);
        setTxHash(null);
        setPaymentId(null);
        resetErrorState();
        setPaymentState(PAYMENT_STATES.INITIATING);
        setHasInitiated(false);

        // Reset in-progress flags
        initiateCallInProgress.current = false;
        verifyCallInProgress.current = false;

        // Start a new payment flow after a short delay
        setTimeout(() => {
            initiatePayment();
        }, 100);
    }, [resetForm, resetWriteContract, resetErrorState, initiatePayment]);

    // Handle retry based on the current failed step
    const handleRetry = useCallback(() => {
        resetErrorState();

        if (!paymentDetails) {
            // Retry initiation
            setHasInitiated(false);
            initiateCallInProgress.current = false;
            initiatePayment();
        } else if (!isAdmin && !signedNonce) {
            // Retry signing (only for non-admin)
            signNonce();
        } else if (txHash) {
            // Retry verification
            verifyCallInProgress.current = false;
            verifyPayment();
        } else {
            // Default: reset to beginning
            resetPaymentFlow();
        }
    }, [
        paymentDetails,
        signedNonce,
        txHash,
        initiatePayment,
        signNonce,
        verifyPayment,
        resetPaymentFlow,
        resetErrorState,
        isAdmin
    ]);

    // Track component mount/unmount for preventing unnecessary API calls
    useEffect(() => {
        isModalMounted.current = true;

        return () => {
            isModalMounted.current = false;
        };
    }, []);

    // Start payment initiation when modal opens
    useEffect(() => {
        if (open && (isAdmin || isConnected) && !hasInitiated && !isErrorHandling && isModalMounted.current) {
            initiatePayment();
        }
    }, [open, isConnected, initiatePayment, hasInitiated, isErrorHandling, isAdmin]);

    // Automatically trigger nonce signing when payment details are received
    useEffect(() => {
        // When payment details are set and we haven't moved to the next state yet
        if (paymentDetails?.nonce && paymentState === PAYMENT_STATES.INITIATING && !isErrorHandling && !isAdmin) {
            // Move to signing state
            setPaymentState(PAYMENT_STATES.SIGNING);
            // Short delay to ensure state update before triggering the signature
            setTimeout(() => {
                signNonce();
            }, 100);
        }
    }, [paymentDetails, paymentState, signNonce, isErrorHandling, isAdmin]);

    // Handle signature results
    useEffect(() => {
        if (signData) {
            console.log("Signature received:", signData);
            setSignedNonce(signData);
            setPaymentState(PAYMENT_STATES.READY);
        } else if (signError && !isAdmin) {
            // Don't process again if already handling an error
            if (isErrorHandling) return;

            const errorMsg = signError?.message?.toLowerCase() || "";

            if (errorMsg.includes("user denied") || errorMsg.includes("user rejected") || errorMsg.includes("rejected")) {
                handleError("You declined to sign the message", ERROR_TYPES.SIGNING);
            } else {
                handleError(signError, ERROR_TYPES.SIGNING);
            }
        }
    }, [signData, signError, handleError, isErrorHandling, isAdmin]);

    // Handle transaction results
    useEffect(() => {
        if (hash) {
            console.log("Transaction submitted:", hash);
            setTxHash(hash);
            setPaymentState(PAYMENT_STATES.CONFIRMING);
        } else if (writeError && !isErrorHandling) {
            // Check if user rejected transaction
            const errorMessage = writeError.message?.toLowerCase() || "";

            if (
                errorMessage.includes("user rejected") ||
                errorMessage.includes("user denied") ||
                errorMessage.includes("rejected")
            ) {
                handleError("Transaction was canceled by user", ERROR_TYPES.TRANSACTION, PAYMENT_STATES.CANCELED);
            } else if (
                errorMessage.includes("insufficient funds") ||
                errorMessage.includes("balance")
            ) {
                handleError("Insufficient funds in your wallet", ERROR_TYPES.TRANSACTION);
            } else {
                handleError(writeError, ERROR_TYPES.TRANSACTION);
            }

            resetWriteContract?.();
        }
    }, [hash, writeError, resetWriteContract, handleError, isErrorHandling]);

    // Handle transaction confirmation
    useEffect(() => {
        if (isConfirmed && txHash && !isErrorHandling) {
            console.log("Transaction confirmed:", txHash);
            verifyPayment();
        } else if (confirmError && !isErrorHandling) {
            handleError(confirmError, ERROR_TYPES.TRANSACTION);
        }
    }, [isConfirmed, txHash, confirmError, handleError, isErrorHandling, verifyPayment]);

    // Handle chain switching errors
    useEffect(() => {
        if (switchChainError && !isErrorHandling && !isAdmin) {
            const errorMsg = switchChainError?.message?.toLowerCase() || "";

            if (errorMsg.includes("user rejected") || errorMsg.includes("user denied")) {
                handleError("Network switch was canceled", ERROR_TYPES.NETWORK);
            } else {
                handleError(switchChainError, ERROR_TYPES.NETWORK);
            }
        }
    }, [switchChainError, handleError, isErrorHandling, isAdmin]);

    // Close and reset modal
    function handleClose() {
        resetForm();
        resetWriteContract?.();
        setPaymentDetails(null);
        setSignedNonce(null);
        setTxHash(null);
        setPaymentId(null);
        resetErrorState();
        setPaymentState(PAYMENT_STATES.INITIATING);
        setHasInitiated(false);

        // Reset in-progress flags
        initiateCallInProgress.current = false;
        verifyCallInProgress.current = false;

        onClose();
    }

    // Get available tokens for the selected network
    const getAvailableTokens = useCallback(() => {
        const networkTokens = TOKENS[selectedNetworkId];
        if (!networkTokens) return [];

        return Object.entries(networkTokens)
            .filter(([_, config]) => !config.isEasterEgg || easterEggActivated)
            .map(([id, config]) => ({
                id,
                ...config
            }));
    }, [selectedNetworkId, easterEggActivated]);

    const availableTokens = getAvailableTokens();

    // Update token selection when network changes
    useEffect(() => {
        if (selectedNetworkId &&
            (!TOKENS[selectedNetworkId]?.[selectedToken] ||
                (TOKENS[selectedNetworkId]?.[selectedToken]?.isEasterEgg && !easterEggActivated))) {
            const availableTokens = getAvailableTokens();
            if (availableTokens.length > 0) {
                setValue("token", availableTokens[0].id);
            }
        }
    }, [selectedNetworkId, selectedToken, easterEggActivated, setValue, getAvailableTokens]);

    // Handle form submission (token transfer)
    async function onFormSubmit(data) {
        if (!isAdmin && !isConnected) {
            handleError("Please connect your wallet first", ERROR_TYPES.CONNECTION);
            return;
        }

        if (paymentState !== PAYMENT_STATES.READY) {
            toast.error("Please complete the previous steps first");
            return;
        }

        const networkId = parseInt(data.networkId);

        // Admin users skip the payment process
        if (isAdmin) {
            // Admin users don't need to make actual blockchain transactions
            handleAdminPaymentComplete(`admin-payment-${Date.now()}`, networkId);
            return;
        }

        // Check if user is on the correct chain
        if (chainId !== networkId) {
            if (switchChain) {
                try {
                    await switchChain({ chainId: networkId });
                    return;
                } catch (err) {
                    // Error will be handled by the useEffect watching switchChainError
                    return;
                }
            } else {
                handleError(`Please switch to ${SUPPORTED_NETWORKS[networkId]} in your wallet`, ERROR_TYPES.NETWORK);
                return;
            }
        }

        // Get token configuration
        const tokenConfig = TOKENS[networkId]?.[data.token];
        if (!tokenConfig) {
            handleError(`Selected token is not available on ${SUPPORTED_NETWORKS[networkId]}`, ERROR_TYPES.TRANSACTION);
            return;
        }

        resetErrorState();
        setPaymentState(PAYMENT_STATES.PROCESSING);

        try {
            // Calculate token amount based on token decimals
            const amount = parseUnits(
                paymentDetails?.amount?.toString() || "0",
                tokenConfig.decimals
            );

            console.log("Sending payment:", {
                token: tokenConfig.address,
                recipient: paymentDetails?.receiverAddress,
                amount: amount.toString()
            });

            // Make the token transfer
            writeContract({
                address: tokenConfig.address,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [paymentDetails?.receiverAddress, amount],
            });
        } catch (error) {
            handleError(error, ERROR_TYPES.TRANSACTION);
        }
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto">
            <div className="bg-[#002420] rounded-2xl px-5 md:px-8 py-6 max-w-[500px] w-full shadow-2xl border border-green-200 flex flex-col items-start relative max-h-[90vh] overflow-auto">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-[#94D9C0]/60 hover:text-[#EBFFF9] transition-colors cursor-pointer z-10"
                >
                    <X size={24} />
                </button>

                {/* Secret clickable area for easter egg */}
                <div
                    className="absolute top-3 left-3 w-8 h-8 rounded-full"
                    onClick={incrementEasterEggCounter}
                ></div>

                <div className="text-2xl md:text-3xl font-semibold mb-2 text-[#EBFFF9] font-sans tracking-tight pr-8">
                    {isAdmin ? "Admin Payment Approval" : title}
                </div>

                <p className="text-[#94D9C0]/70 mb-5">
                    {isAdmin
                        ? "Approve this payment as an administrator"
                        : description}
                </p>

                {!isAdmin && !isConnected && (
                    <div className="w-full mb-4 p-3 bg-[#E0524D]/10 border border-[#E0524D]/20 rounded-lg">
                        <p className="text-[#E0524D] text-sm">Please connect your wallet first</p>
                    </div>
                )}

                <div className="w-full">
                    {/* Error Banner - Show when there's an error */}
                    {isErrorHandling && errorMessage && (
                        <ErrorBanner
                            error={errorMessage}
                            errorType={errorType}
                            onRetry={handleRetry}
                            onReset={resetPaymentFlow}
                        />
                    )}

                    {/* Only show payment flow when not handling errors */}
                    {!isErrorHandling && (
                        <>
                            {/* Payment Flow Status Display - Different for admin and regular users */}
                            {!isAdmin && (
                                <div className="mb-6">
                                    {/* Step 1: Initiate Payment */}
                                    <InitiationStatus
                                        isLoading={paymentState === PAYMENT_STATES.INITIATING || initiateMutation.isPending}
                                        error={false} // Errors now handled by ErrorBanner
                                        onRetry={handleRetry}
                                    />

                                    {/* Step 2: Sign Nonce (only show if Step 1 completed) */}
                                    {(paymentDetails || paymentState === PAYMENT_STATES.SIGNING || paymentState === PAYMENT_STATES.READY) && (
                                        <SigningStatus
                                            isLoading={paymentState === PAYMENT_STATES.SIGNING || isSignPending}
                                            error={false} // Errors now handled by ErrorBanner
                                            onRetry={handleRetry}
                                        />
                                    )}

                                    {/* Step 4: Verification (only show after transaction sent) */}
                                    {(paymentState === PAYMENT_STATES.VERIFYING || paymentState === PAYMENT_STATES.SUCCESS) && (
                                        <VerificationStatus
                                            isLoading={paymentState === PAYMENT_STATES.VERIFYING || verifyMutation.isPending}
                                            error={false} // Errors now handled by ErrorBanner
                                            onRetry={handleRetry}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Admin Payment Panel */}
                            {isAdmin && paymentState === PAYMENT_STATES.READY && (
                                <AdminPaymentPanel
                                    paymentDetails={paymentDetails}
                                    onCompleteAdminPayment={handleAdminPaymentComplete}
                                    selectedNetworkId={selectedNetworkId}
                                />
                            )}

                            {/* Show admin verification status */}
                            {isAdmin && (paymentState === PAYMENT_STATES.VERIFYING || paymentState === PAYMENT_STATES.SUCCESS) && (
                                <div className="mb-6">
                                    <VerificationStatus
                                        isLoading={paymentState === PAYMENT_STATES.VERIFYING || verifyMutation.isPending}
                                        error={false}
                                        onRetry={handleRetry}
                                    />
                                </div>
                            )}

                            {/* Network Switch Banner */}
                            {!isAdmin && isChainSwitchNeeded && paymentState === PAYMENT_STATES.READY && (
                                <NetworkSwitchBanner
                                    currentNetwork={currentChainName}
                                    targetNetwork={selectedNetworkName}
                                    targetNetworkId={selectedNetworkId}
                                    onSwitchChain={switchChain}
                                    isSwitching={isSwitchingChain}
                                />
                            )}

                            {/* Transaction form - only show if we're ready to make payment */}
                            {!isAdmin && paymentState === PAYMENT_STATES.READY && (
                                <form className="w-full" onSubmit={handleSubmit(onFormSubmit)}>
                                    <Card className="mb-5">
                                        <CardContent className="p-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-[#94D9C0]/70">Total Amount</span>
                                                <div className="text-right">
                                                    <span className="text-xl md:text-2xl font-bold text-[#EBFFF9]">${paymentDetails?.amount || 0}</span>
                                                    <div className="text-xs text-[#94D9C0]/70 mt-1">
                                                        on {selectedNetworkName}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <div className="mb-5">
                                        <Label htmlFor="networkId" className="text-base font-medium mb-2 block">
                                            Network
                                        </Label>
                                        <Select
                                            id="networkId"
                                            {...register("networkId")}
                                            className={`${isChainSwitchNeeded ? 'border-[#FFC107] ring-1 ring-[#FFC107]/30' : ''}`}
                                        >
                                            {Object.entries(SUPPORTED_NETWORKS).map(([id, name]) => (
                                                <option key={id} value={id}>
                                                    {name}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.networkId && <p className="text-[#E0524D] text-sm mt-2">{errors.networkId.message}</p>}
                                    </div>

                                    <TokenSelector
                                        tokens={availableTokens}
                                        selectedToken={selectedToken}
                                        register={register}
                                        errors={errors}
                                    />

                                    <div className="mb-5">
                                        <Label className="text-base font-medium mb-2 block">
                                            Payment Amount
                                        </Label>
                                        <AmountDisplay
                                            amount={paymentDetails?.amount || 0}
                                            token={selectedTokenConfig?.name || ''}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className={`w-full mb-2 font-semibold ${isChainSwitchNeeded ? 'bg-[#FFC107] hover:bg-[#FFD54F] text-[#000000]' : ''}`}
                                        disabled={
                                            !isConnected ||
                                            paymentState !== PAYMENT_STATES.READY ||
                                            isWritePending ||
                                            !selectedTokenConfig ||
                                            isSwitchingChain
                                        }
                                    >
                                        {isWritePending || paymentState === PAYMENT_STATES.PROCESSING ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                                                <span>Confirm in Wallet...</span>
                                            </>
                                        ) : isChainSwitchNeeded ? (
                                            <>
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                <span>{isSwitchingChain ? "Switching Chain..." : `Switch to ${selectedNetworkName}`}</span>
                                            </>
                                        ) : (
                                            `Pay ${paymentDetails?.amount || 0} ${selectedTokenConfig.name}`
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Processing States - For non-admin users */}
                            {!isAdmin && (paymentState === PAYMENT_STATES.PROCESSING || paymentState === PAYMENT_STATES.CONFIRMING) && (
                                <ProcessingStatus state={paymentState} />
                            )}
                        </>
                    )}

                    {/* Transaction Hash Display - Show regardless of error state */}
                    {txHash && (paymentState === PAYMENT_STATES.CONFIRMING ||
                        paymentState === PAYMENT_STATES.VERIFYING ||
                        paymentState === PAYMENT_STATES.SUCCESS ||
                        paymentState === PAYMENT_STATES.FAILED) && (
                            <div className="mb-5 mt-4">
                                <Label className="text-base font-medium mb-2 block">
                                    Transaction Details
                                </Label>
                                <TransactionHashDisplay
                                    hash={txHash}
                                    networkId={selectedNetworkId}
                                    isAdminTransaction={isAdmin}
                                />
                            </div>
                        )}

                    {/* Success State */}
                    {paymentState === PAYMENT_STATES.SUCCESS && (
                        <SuccessStatus isAdminApproved={isAdmin} />
                    )}
                </div>
            </div>
        </div>
    );
}
