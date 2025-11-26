"use client"

import { useState } from "react"
import Button from "@/components/ui/Button"
import ThemeSwitcher from "@/components/ThemeSwitcher"

const CustomInput = ({ type = "text", placeholder, value, onChange, required = false, className = "" }) => (
    <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`flex h-10 w-full rounded-md border border-dark-600 bg-dark-700 px-3 py-2 text-sm text-dark-100 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
)

const CustomCard = ({ children, className = "" }) => (
    <div className={`rounded-lg border border-dark-700 dark:bg-dark-600 bg-dark-300 shadow-sm ${className}`}>{children}</div>
)

const CustomCardContent = ({ children, className = "" }) => <div className={`p-6 ${className}`}>{children}</div>

const CustomProgress = ({ value, className = "" }) => (
    <div className={`w-full bg-dark-700 rounded-full overflow-hidden ${className}`}>
        <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
    </div>
)

export default function Page() {
    const [email, setEmail] = useState("")
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubscribe = (e) => {
        e.preventDefault()
        if (email) {
            setIsSubscribed(true)
            setEmail("")
        }
    }

    return (
        <div className="min-h-screen bg-dark-200 dark:bg-dark-700 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center space-y-8">
                {/* Header Section */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-emerald-400 font-sans">We're Building Something Great!</h1>
                    <p className="text-lg md:text-xl text-dark-400 dark:text-dark-300 font-sans">
                        Stay tuned for updates as we craft an amazing experience for you.
                    </p>
                </div>

                {/* Progress Section */}
                <CustomCard className="p-6">
                    <CustomCardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium dark:text-dark-100 text-dark-400">Development Progress</span>
                            <span className="text-sm font-bold dark:text-emerald-400 text-dark-400">75%</span>
                        </div>
                        <CustomProgress value={75} className="h-3" />
                        <p className="text-sm dark:text-dark-300 text-dark-400">We're making great progress! The core features are taking shape.</p>
                    </CustomCardContent>
                </CustomCard>
            </div>
        </div>
    )
}

