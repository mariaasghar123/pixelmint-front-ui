import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose } from "react-icons/md";
import Button from "./ui/Button";
import { clearReservation } from "@/utils/localStorage.utils";
import ImageUploadBox from "./ui/ImageUpload";
import Input from "./ui/Input";
import { adModalSchema } from "@/schemas/ad.schema";
import { toast } from "react-toastify";

export default function CompleteTransactionModal({ open, onClose }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
    } = useForm({
        resolver: zodResolver(adModalSchema),
        defaultValues: {
            name: "",
            adTitle: "",
            websiteUrl: "",
            telegramContact: "",
            referredBy: "",
            image: null,
        },
        mode: "onTouched",
    });

    function handleClose() {
        clearReservation();
        onClose();
    }

    function onFormSubmit(data) {
        handleClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-700 rounded-2xl px-12 py-8 min-w-[500px] shadow-2xl border border-green-400 flex flex-col items-start relative">
                {/* Cross icon in top right */}
                <button
                    type="button"
                    aria-label="Close"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-light hover:text-error transition-colors cursor-pointer"
                >
                    <MdClose size={28} />
                </button>
                <div className="text-4xl font-semibold mb-3 text-light font-ari tracking-tight text-start mb-6">
                    Place Ad
                </div>

                <form
                    className="w-full text-light"
                    onSubmit={handleSubmit(onFormSubmit, () => {
                        toast.error("Please fix the errors before submitting.");
                    })}
                >
                    <Input
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        error={errors.name?.message}
                        {...register("name")}
                    />
                    <Input
                        label="Ad Title"
                        name="adTitle"
                        placeholder="Your ad title"
                        error={errors.adTitle?.message}
                        {...register("adTitle")}
                    />
                    <Input
                        label="Website URL"
                        name="websiteUrl"
                        placeholder="https://example.com"
                        error={errors.websiteUrl?.message}
                        {...register("websiteUrl")}
                    />
                    <Input
                        label="Telegram Contact (Optional)"
                        name="telegramContact"
                        placeholder="@TelegramTag"
                        error={errors.telegramContact?.message}
                        {...register("telegramContact")}
                    />
                    <Input
                        label="Referred By (Optional)"
                        name="referredBy"
                        placeholder="Referred by"
                        error={errors.referredBy?.message}
                        {...register("referredBy")}
                    />

                    <div className="mb-8">
                        <ImageUploadBox />
                    </div>

                    <Button type="submit" className="w-full">
                        Place Your Ad
                    </Button>
                    {isSubmitted && Object.keys(errors).length > 0 && (
                        <div className="text-error text-sm mt-2">
                            Please fix the errors above before submitting.
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
