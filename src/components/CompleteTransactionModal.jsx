import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose } from "react-icons/md";
import Button from "./ui/Button";
import { clearReservation, getReservation } from "@/utils/localStorage.utils";
import ImageUploadBox from "./ui/ImageUpload";
import Input from "./ui/Input";
import { adModalSchema } from "@/schemas/ad.schema";
import { toast } from "react-toastify";
import { purchasePixelMutation } from "@/api/pixel";
import { useMutation } from "@tanstack/react-query";

export default function CompleteTransactionModal({ open, onClose }) {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitted },
    } = useForm({
        resolver: zodResolver(adModalSchema),
        defaultValues: {
            displayName: "",
            adTitle: "",
            websiteUrl: "",
            telegramContact: "",
            referredBy: "",
            adImage: null,
        },
        mode: "onTouched",
    });

    const reservation = getReservation()

    const createPurchase = useMutation({
        mutationFn: purchasePixelMutation,
        onSuccess: (_data) => {
            toast.success('Pixel purchase successful!');
        },
        onError: (error) => {
            toast.error(error.message || 'Pixel purchase failed!');
        },
    });

    function handleClose() {
        reset()
        // clearReservation();
        onClose();
    }

    function onFormSubmit(data) {
        createPurchase.mutate({ ...data, pixelArea: reservation })
        // handleClose();
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-700 rounded-2xl px-12 py-8 max-w-[500px] w-full shadow-2xl border border-green-400 flex flex-col items-start relative">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    className="absolute top-10 right-10 text-light hover:text-error transition-colors cursor-pointer"
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
                        error={errors.displayName?.message}
                        {...register("displayName")}
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

                    {/* <Input */}
                    {/*     label="Telegram Contact (Optional)" */}
                    {/*     name="telegramContact" */}
                    {/*     placeholder="@TelegramTag" */}
                    {/*     error={errors.telegramContact?.message} */}
                    {/*     {...register("telegramContact")} */}
                    {/* /> */}
                    {/* <Input */}
                    {/*     label="Referred By (Optional)" */}
                    {/*     name="referredBy" */}
                    {/*     placeholder="Referred by" */}
                    {/*     error={errors.referredBy?.message} */}
                    {/*     {...register("referredBy")} */}
                    {/* /> */}

                    <div className="mb-8">
                        <ImageUploadBox
                            label="Upload Ad Image"
                            onUpload={file => setValue("adImage", file, { shouldValidate: true })}
                        />
                        {errors.adImage && (
                            <div className="text-error text-sm mt-2">
                                {errors.adImage.message}
                            </div>
                        )}
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
