import { AlertTriangle, SwitchCamera } from "lucide-react";

const NetworkSwitchBanner = ({ currentNetwork, targetNetwork, targetNetworkId, onSwitchChain, isSwitching, className = "" }) => (
    <div className={`w-full p-4 bg-[#FFC107]/15 border border-[#FFC107]/30 rounded-lg mb-6 ${className}`}>
        <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-[#FFC107] flex-shrink-0" />
            <div className="flex-1">
                <h4 className="font-medium text-[#FFC107] mb-1">Network Switch Required</h4>
                <p className="text-sm text-[#EBFFF9]/80">
                    Please switch to <span className="font-medium">{targetNetwork}</span> to continue.
                </p>
            </div>
        </div>
        <button
            onClick={() => onSwitchChain({ chainId: targetNetworkId })}
            disabled={isSwitching}
            className="mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-[#FFC107] text-black rounded-md font-medium hover:bg-[#FFD54F] transition-colors w-full"
        >
            {isSwitching ? (
                <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2" />
                    <span>Switching...</span>
                </>
            ) : (
                <>
                    <SwitchCamera className="h-4 w-4 mr-2" />
                    <span>Switch to {targetNetwork}</span>
                </>
            )}
        </button>
    </div>
);

export default NetworkSwitchBanner;
