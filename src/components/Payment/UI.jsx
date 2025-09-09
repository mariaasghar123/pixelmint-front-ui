export const Button = ({ children, className = "", disabled = false, type = "button", ...props }) => (
    <button
        type={type}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center ${disabled
            ? "bg-dark-600 text-green-200/50 cursor-not-allowed"
            : "bg-green-300 text-dark-900 hover:bg-green-100"
            } ${className}`}
        {...props}
    >
        {children}
    </button>
);

export const Label = ({ children, className = "", ...props }) => (
    <label className={`text-sm font-medium text-[#EBFFF9] ${className}`} {...props}>
        {children}
    </label>
);

export const Card = ({ children, className = "" }) => (
    <div className={`bg-[#00302A] border border-[#FFFFFF11] rounded-lg shadow-sm ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }) => (
    <div className={`p-6 ${className}`}>{children}</div>
);

export const Select = ({ className = "", ...props }) => (
    <select
        className={`w-full px-3 py-2 border border-[#FFFFFF11] rounded-lg bg-[#00302A] text-[#EBFFF9] focus:outline-none focus:ring-2 focus:ring-[#21c192] ${className}`}
        {...props}
    />
);

export const AmountDisplay = ({ amount, token, className = "" }) => (
    <div className={`w-full px-4 py-3 border border-[#FFFFFF11] rounded-lg bg-[#00302A]/80 text-[#EBFFF9] ${className}`}>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <span className="text-[#94D9C0]/70 text-sm mb-1 sm:mb-0">Amount</span>
            <div className="flex flex-col items-end">
                <span className="text-xl font-medium">{amount} {token}</span>
                <span className="text-xs text-[#94D9C0]/70 mt-1">(${amount} USD)</span>
            </div>
        </div>
    </div>
);
