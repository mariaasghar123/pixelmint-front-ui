import Link from "next/link";

export default function AuthModal({ open, onClose }) {

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-800 rounded-lg px-12 py-6 min-w-[340px] shadow-lg border border-border flex flex-col items-center">
                <div className="text-3xl font-semibold mb-2 text-green-200 font-ari">
                    You are not logged in
                </div>
                <div className="text-gray-400 mb-6 text-center text-lg font-aria">
                    You need to login to buy pixels.
                </div>
                <div className="flex gap-4">
                    <Link
                        href="/auth/login"
                        className="bg-green-100 px-6 py-2 rounded text-dark-900 font-semibold hover:bg-green-200 transition font-ari"
                    >
                        Go to Login
                    </Link>
                    <button
                        className="bg-dark-700 px-6 py-2 rounded text-green-200 hover:bg-dark-600 transition cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
