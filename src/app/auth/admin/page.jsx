"use client"
import { useState } from "react"
import { Shield } from "lucide-react"
import Image from "next/image"
import Button from "@/components/ui/Button"
import { toast } from "react-toastify"
import { useAuth } from "@/components/AuthProvider"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    
    const { adminLogin } = useAuth()

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields")
            return
        }

        setIsLoading(true)
        
        const result = await adminLogin({ email, password })
        
        if (result.success) {
            setIsSuccess(true)
        }
        
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center mb-4">
                <Image src="/logo.svg" width={150} height={170} alt="Logo" priority />
            </div>

            <div className="w-[90%] md:w-full max-w-[500px] bg-transparent rounded-xl border-2 border-[rgba(101,231,140,0.25)] flex flex-col items-center py-8 px-12 shadow-lg">
                <div
                    className="bg-dark-700 rounded-full flex items-center justify-center mb-2"
                    style={{ width: 56, height: 56 }}
                >
                    <Shield size={32} fill="#98F08C" strokeWidth={0} />
                </div>

                <h1 className="mt-4 text-2xl font-semibold text-dark-100 text-center">Admin Login</h1>

                <p className="mt-2 text-base text-[#A9D7B8] text-center">Enter your credentials to continue.</p>

                {!isSuccess && (
                    <form onSubmit={handleLogin} className="mt-8 w-full space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:border-[#65E78C] focus:ring-1 focus:ring-[#65E78C] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-400 focus:outline-none focus:border-[#65E78C] focus:ring-1 focus:ring-[#65E78C] disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 border-none"
                            style={{
                                background: "linear-gradient(90deg,#65E78C 0%, #A9D7B8 100%)",
                                color: "#05281B",
                            }}
                            disabled={isLoading}
                        >
                            {isLoading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>
                )}

                {/* Success message */}
                {isSuccess && (
                    <div className="mt-8 text-green-100 text-center font-bold text-lg">
                        Login successful! Redirecting...
                    </div>
                )}

                <div className="mt-4 text-xs text-[#A9D7B8] text-center opacity-80">
                    Secure admin login with email and password authentication
                </div>
            </div>
        </div>
    )
}
