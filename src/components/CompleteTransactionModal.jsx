import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose } from "react-icons/md";
import Button from "./ui/Button";
import { getReservation, saveReservation } from "@/utils/localStorage.utils";
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
        onSuccess: (data) => {
            console.log(status)
            if (data.success === true) {
                // toast.success('Pixel purchase successful!');
                saveReservation({
                    ...reservation,
                    purchaseId: data.payload._id
                })
                reset()
                onClose();
            } else {
                toast.error(data?.message || 'Pixel purchase failed!');
            }
        },
        onError: (error) => {
            toast.error(error.message || 'Pixel purchase failed!');
        },
    });

    function handleClose() {
        reset()
        onClose();
    }

    function onFormSubmit(data) {
        let reservedAt = null;
        if (reservation && reservation.reservationId) {
            try {
                const timestampStr = reservation.reservationId.split('-')[0];
                const timestamp = parseInt(timestampStr, 10);
                if (!isNaN(timestamp)) {
                    reservedAt = new Date(timestamp).toISOString();
                }
            } catch (error) {
                console.error("Error parsing reservation timestamp:", error);
            }
        }

        createPurchase.mutate({
            ...data,
            pixelArea: reservation,
            reservationId: reservation.reservationId,
            reservedAt: reservedAt
        });
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-dark-300 dark:bg-dark-700 rounded-2xl px-8 md:px-12 py-8 max-w-[500px] w-[90%] md:w-full shadow-2xl border border-green-400 flex flex-col items-start relative">
                <button
                    type="button"
                    aria-label="Close"
                    onClick={handleClose}
                    className="absolute top-10 right-10 dark:text-light hover:text-error transition-colors cursor-pointer"
                >
                    <MdClose size={28} />
                </button>
                <div className="text-4xl font-semibold mb-3 dark:text-light font-ari tracking-tight text-start mb-6">
                    Place Ad
                </div>

                <form
                    className="w-full dark:text-light text-gray-900
             [&_label]:text-gray-900 dark:[&_label]:text-light"
                    onSubmit={handleSubmit(onFormSubmit, () => {
                        toast.error("Please fix the errors before submitting.");
                    })}
                >
                    <Input
                        label="Name"
                        name="name"
                        placeholder="Enter your name"
                        error={errors.displayName?.message}
                        labelClassName="text-gray-900 dark:text-light"
                        {...register("displayName")}
                    />
                    <Input
                        label="Ad Title"
                        name="adTitle"
                        placeholder="Your ad title"
                        error={errors.adTitle?.message}
                        labelClassName="text-gray-900 dark:text-light"
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

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={createPurchase.isPending}
                    >
                        {createPurchase.isPending ? 'Processing...' : 'Place Your Ad'}
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
