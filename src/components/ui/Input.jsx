export default function Input({ label, name, error, ...props }) {
    return (
        <div className="flex flex-col mb-4">
            <label htmlFor={name} className="mb-1">{label}</label>
            <input
                id={name}
                name={name}
                className={`placeholder:text-light border w-full px-4 py-2 rounded-lg ${error ? "border-error" : "border-light"
                    }`}
                {...props}
            />
            {error && (
                <span className="text-error text-sm mt-1">{error}</span>
            )}
        </div>
    );
}
