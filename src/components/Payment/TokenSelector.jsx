const TokenSelector = ({ tokens, selectedToken, register, errors }) => (
    <div className="flex justify-between gap-3 items-stretch mb-4">
        {tokens.map((token) => (
            <div key={token.id} className="w-full h-full flex-1 flex items-stretch">
                <input
                    type="radio"
                    value={token.id}
                    id={token.id}
                    {...register("token")}
                    className="peer sr-only"
                />
                <label
                    htmlFor={token.id}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-[#FFFFFF11] bg-[#00302A] p-3 hover:bg-[#123D34] hover:border-[#21c192]/50 peer-checked:border-[#21c192] peer-checked:bg-[#123D34] cursor-pointer transition-colors h-full w-full"
                >
                    {token.icon}
                    <span className="font-medium text-[#EBFFF9]">{token.name}</span>
                    <span className="text-xs text-[#94D9C0]/60 text-center">{token.fullName}</span>
                </label>
            </div>
        ))}
        {errors?.token && <p className="text-[#E0524D] text-sm mt-2">{errors.token.message}</p>}
    </div>
);

export default TokenSelector;
