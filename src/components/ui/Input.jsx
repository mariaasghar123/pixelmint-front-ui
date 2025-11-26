export default function Input({ label, name, error, className, labelClassName, ...props }) {
    return (
        <div className={`flex flex-col mb-4 ${labelClassName}`}>
            <label htmlFor={name} className="mb-1">{label}</label>
            <input
                id={name}
                name={name}
                className={`placeholder:text-gray-400 dark:placeholder:text-gray-300 
            border w-full px-4 py-2 rounded-lg bg-white dark:bg-dark-600
            focus:outline-none focus:ring-2 focus:ring-green-500
            transition-colors duration-200
            ${error ? "border-error" : "border-gray-300 dark:border-gray-500"
                    } ${className}`}
                {...props}
            />
            {error && (
                <span className="text-error text-sm mt-1">{error}</span>
            )}
        </div>
    );
}
