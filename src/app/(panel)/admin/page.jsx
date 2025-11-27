import { Eye, Grid, TrendingDown, TrendingUp } from "lucide-react";

export default function Page() {
    return (
        <main className="mt-5">
            <div>
                <h1 className="font-bold text-2xl">Dashboard Overview</h1>
                <p className="dark:text-light/60 text-green-500">Welcome back! Here's what's happening with your pixel platform.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-4">
                <div className="dark:bg-dark-800 bg-gray-300 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <div className="bg-green-100 w-fit rounded-lg p-1">
                            <Grid className="text-dark-800" />
                        </div>
                        <div className="flex gap-2 items-center">
                            <TrendingUp className="dark:text-green-100 text-green-700" />
                            <span className="dark:text-green-100 text-green-700 font-semibold">+12.5%</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold">847,293</h2>
                        <p className="dark:text-light/50 mt-1">Total Pixels Sold / 1,250,000</p>
                    </div>
                </div>

                <div className="dark:bg-dark-800 bg-gray-300 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <div className="bg-green-100 w-fit rounded-lg p-1">
                            <Eye className="text-dark-800" />
                        </div>
                        <div className="flex gap-2 items-center">
                            <TrendingDown className="text-error" />
                            <span className="text-error font-semibold">-12.5%</span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <h2 className="text-2xl font-bold">152,707</h2>
                        <p className="dark:text-light/50 mt-1">Total Pixels Sold / 1,250,000</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
