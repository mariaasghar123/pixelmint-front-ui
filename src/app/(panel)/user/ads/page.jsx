"use client";
import AdsList from "@/components/Panel/AdsList";
import { useUserPurchases } from "@/api/users";
import { Suspense, useState } from "react";
import AdsModal from "@/components/Panel/AdsModal";
import Loader from "@/components/ui/Loader";

export default function AdsPage() {
    const { data, isLoading, error } = useUserPurchases()
    const [selectedAd, setSelectedAd] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleViewDetails = (ad) => {
        setSelectedAd(ad)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedAd(null)
    }

    return (
        <>
            <div className="w-full flex justify-center">
                <Suspense fallback={<Loader />}>
                    <AdsList
                        ads={data?.purchases}
                        onOpen={handleViewDetails}
                    />
                </Suspense>
            </div>
            <AdsModal open={isModalOpen} onClose={handleCloseModal} ad={selectedAd} />
        </>
    );
}
