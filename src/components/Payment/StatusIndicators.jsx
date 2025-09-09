import { Loader2, Check, AlertTriangle, RefreshCw, CheckCircle2 } from "lucide-react";

export const InitiationStatus = ({ isLoading, error, onRetry }) => (
    <div className={`w-full p-4 ${error ? "bg-[#E0524D]/10 border-[#E0524D]/20" : "bg-[#21c192]/10 border-[#21c192]/20"} border rounded-lg mb-6`}>
        <div className="flex items-center gap-3">
            {isLoading ? (
                <Loader2 className="h-6 w-6 text-[#21c192] flex-shrink-0 animate-spin" />
            ) : error ? (
                <AlertTriangle className="h-6 w-6 text-[#E0524D] flex-shrink-0" />
            ) : (
                <Check className="h-6 w-6 text-[#21c192] flex-shrink-0" />
            )}
            <div className="flex-1">
                <h4 className={`font-medium ${error ? "text-[#E0524D]" : "text-[#21c192]"} mb-1`}>
                    {isLoading ? "Initiating Payment..." : error ? "Initiation Failed" : "Payment Initiated"}
                </h4>
                <p className="text-sm text-[#EBFFF9]/80">
                    {isLoading
                        ? "Getting payment details from server..."
                        : error
                            ? "Failed to get payment details. Please try again."
                            : "Payment details received. Ready to proceed."
                    }
                </p>
            </div>
        </div>
        {error && (
            <button
                onClick={onRetry}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-[#E0524D]/20 text-[#EBFFF9] rounded-md font-medium hover:bg-[#E0524D]/30 transition-colors w-full"
            >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Retry Initiation</span>
            </button>
        )}
    </div>
);

export const SigningStatus = ({ isLoading, error, onRetry }) => (
    <div className={`w-full p-4 ${error ? "bg-[#E0524D]/10 border-[#E0524D]/20" : "bg-[#21c192]/10 border-[#21c192]/20"} border rounded-lg mb-6`}>
        <div className="flex items-center gap-3">
            {isLoading ? (
                <Loader2 className="h-6 w-6 text-[#21c192] flex-shrink-0 animate-spin" />
            ) : error ? (
                <AlertTriangle className="h-6 w-6 text-[#E0524D] flex-shrink-0" />
            ) : (
                <Check className="h-6 w-6 text-[#21c192] flex-shrink-0" />
            )}
            <div className="flex-1">
                <h4 className={`font-medium ${error ? "text-[#E0524D]" : "text-[#21c192]"} mb-1`}>
                    {isLoading ? "Signing Message..." : error ? "Signing Failed" : "Message Signed"}
                </h4>
                <p className="text-sm text-[#EBFFF9]/80">
                    {isLoading
                        ? "Please confirm the signature request in your wallet..."
                        : error
                            ? "Failed to sign nonce. Please try again."
                            : "Nonce has been signed successfully."
                    }
                </p>
            </div>
        </div>
        {error && (
            <button
                onClick={onRetry}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-[#E0524D]/20 text-[#EBFFF9] rounded-md font-medium hover:bg-[#E0524D]/30 transition-colors w-full"
            >
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Retry Signing</span>
            </button>
        )}
    </div>
);

export const VerificationStatus = ({ isLoading, error, onRetry }) => (
    <div className={`w-full p-4 ${error ? "bg-[#E0524D]/10 border-[#E0524D]/20" : "bg-[#21c192]/10 border-[#21c192]/20"} border rounded-lg mb-6`}>
        <div className="flex items-center gap-3">
            {isLoading ? (
                <Loader2 className="h-6 w-6 text-[#21c192] flex-shrink-0 animate-spin" />
            ) : error ? (
                <AlertTriangle className="h-6 w-6 text-[#E0524D] flex-shrink-0" />
            ) : (
                <Check className="h-6 w-6 text-[#21c192] flex-shrink-0" />
            )}
            <div className="flex-1">
                <h4 className={`font-medium ${error ? "text-[#E0524D]" : "text-[#21c192]"} mb-1`}>
                    {isLoading ? "Verifying Payment..." : error ? "Verification Failed" : "Payment Verified"}
                </h4>
                <p className="text-sm text-[#EBFFF9]/80">
                    {isLoading
                        ? "Confirming payment with our system..."
                        : error
                            ? "We couldn't verify your payment. You can retry or initiate a new payment."
                            : "Payment has been successfully verified."
                    }
                </p>
            </div>
        </div>
        {error && (
            <div className="mt-3 flex flex-col md:flex-row gap-2">
                <button
                    onClick={() => onRetry('verify')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#E0524D]/20 text-[#EBFFF9] rounded-md font-medium hover:bg-[#E0524D]/30 transition-colors"
                >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>Retry Verification</span>
                </button>
                <button
                    onClick={() => onRetry('initiate')}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#21c192]/20 text-[#EBFFF9] rounded-md font-medium hover:bg-[#21c192]/30 transition-colors"
                >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>New Payment</span>
                </button>
            </div>
        )}
    </div>
);

export const ProcessingStatus = ({ state }) => (
    <div className="w-full flex flex-col items-center justify-center p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#21c192] mb-4" />
        <h3 className="text-xl font-medium text-[#EBFFF9] mb-2">
            {state === 'PROCESSING'
                ? "Processing Payment..."
                : "Confirming Transaction..."}
        </h3>
        <p className="text-[#94D9C0]/70 mb-6">
            {state === 'PROCESSING'
                ? "Please confirm the transaction in your wallet."
                : "Waiting for blockchain confirmation. This may take a minute."}
        </p>
    </div>
);

export function SuccessStatus({ isAdminApproved = false }) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-[#EBFFF9] mb-1">
                {isAdminApproved ? "Payment Approved!" : "Payment Successful!"}
            </h3>
            <p className="text-center text-[#94D9C0]/70 max-w-sm">
                {isAdminApproved
                    ? "Your payment has been approved by an administrator."
                    : "Your transaction has been processed and verified successfully."}
            </p>
        </div>
    );
}
