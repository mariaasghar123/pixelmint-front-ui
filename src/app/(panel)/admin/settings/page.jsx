import Input from "@/components/ui/Input";

export default function Page() {
    return (
        <main>
            <div className="dark:bg-dark-800 bg-gray-300 p-5 rounded-xl mt-8">
                <h2 className="font-bold text-xl">Pricing</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <Input
                        label="Pixel Price (USD)"
                        labelClassName="font-bold mb-1"
                        placeholder="1"
                        className="border-light/40 text-light/40 dark:placeholder:text-light/40"
                    />
                    <Input
                        label="Minimum Buy"
                        labelClassName="font-bold mb-1"
                        placeholder="E.G 10 x 10"
                        className="border-light/40 text-light/40 dark:placeholder:text-light/40"
                    />
                </div>
            </div>
        </main>
    )
}
