import React from "react";
import Button from "./ui/Button";
import { clearReservation } from "@/utils/localStorage.utils";
import ImageUploadBox from "./ui/ImageUpload";

export default function CompleteTransactionModal({ open, onClose }) {
    if (!open) return null;
    function handleClose() {
        clearReservation();
        onClose();
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-700 rounded-2xl px-12 py-8 min-w-[500px] shadow-2xl border border-green-400 flex flex-col items-start">
                <div className="text-4xl font-semibold mb-3 text-light font-ari tracking-tight text-start mb-6">
                    Place Ad
                </div>

                <form className="w-full text-light">
                    <div className="flex flex-col mb-4">
                        <label htmlFor="name" className="mb-1">Name</label>
                        <input type="text" name="name" id="name" placeholder="Enter your name" className="placeholder:text-light border border-light w-full px-4 py-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="adTitle" className="mb-1">Ad Title</label>
                        <input type="text" name="adTitle" id="adTitle" placeholder="Enter ad title" className="placeholder:text-light border border-light w-full px-4 py-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="websiteUrl" className="mb-1">Website URL</label>
                        <input type="url" name="websiteUrl" id="websiteUrl" placeholder="Enter website URL" className="placeholder:text-light border border-light w-full px-4 py-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="telegramContact" className="mb-1">
                            Telegram Contact (Optional)
                        </label>
                        <input type="text" name="telegramContact" id="telegramContact" placeholder="Enter Telegram contact" className="placeholder:text-light border border-light w-full px-4 py-2 rounded-lg" />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="referredBy" className="mb-1">
                            Referred By (Optional)
                        </label>
                        <input type="text" name="referredBy" id="referredBy" placeholder="Who referred you?" className="placeholder:text-light border border-light w-full px-4 py-2 rounded-lg" />
                    </div>

                    <div className="mb-8">
                        <ImageUploadBox />
                    </div>


                </form>

                <Button onClick={handleClose} className="w-full">
                    Place Your Ad
                </Button>
            </div>
        </div>
    );
}
