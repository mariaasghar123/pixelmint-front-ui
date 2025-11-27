"use client"

import Image from "next/image"
import clsx from "clsx"
import { FaCrown, FaClock, FaUsers } from "react-icons/fa"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/pagination"

const iconMap = {
    FaCrown,
    FaUsers,
    FaClock,
}

const buyerGradients = [
    "linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.2) 6%, rgba(255, 215, 0, 0.05) 100%)", // Gold
    "linear-gradient(90deg, rgba(192, 192, 192, 0.3) 0%, rgba(192, 192, 192, 0.3) 6%, rgba(192, 192, 192, 0.05) 100%)", // Silver
    "linear-gradient(90deg, rgba(205, 127, 50, 0.3) 0%, rgba(205, 127, 50, 0.3) 6%, rgba(205, 127, 50, 0.05) 100%)", // Bronze
]

const buyerBorders = ["rgba(255, 215, 0, 0.3)", "rgba(192, 192, 192, 0.3)", "rgba(205, 127, 50, 0.3)"]

const buyerMedals = ["/1st.png", "/2nd.png", "/3rd.png", "/4th.png", "/4th.png"]

const defaultGradient = "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)"
const defaultBorder = "rgba(192, 192, 192, 0.3)"

const SkeletonCard = ({ showColors = true, index = 0 }) => (
    <div
        className={clsx("rounded-xl flex flex-col items-start  gap-3 px-4 py-3 h-full")}
        style={{
            background: showColors ? buyerGradients[index] || defaultGradient : defaultGradient,
            border: `0.5px solid ${showColors ? buyerBorders[index] || defaultBorder : defaultBorder}`,
        }}
    >
        <div className="flex justify-between items-start w-full">
            <div className="w-16 h-16 rounded-md bg-gray-700 animate-pulse"></div>

            {showColors && (
                <div className="w-8 h-12 mt-1 bg-gray-700 animate-pulse"></div>
            )}
        </div>
        <div className="flex flex-col gap-1 w-full dark:text-white">
            <div className="h-6 w-3/4 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-1/2 dark:bg-gray-700/60 text-gray-700 rounded mt-1 animate-pulse"></div>
            <div className="h-4 w-full dark:bg-gray-700/60 rounded mt-1 animate-pulse"></div>
        </div>
    </div>
)

export default function BuyerList({
    title = "Recent buyers",
    buyers,
    icon = "FaCrown",
     iconColor = "#FFFFFF",
    showColors = true,
}) {
    const Icon = iconMap[icon] || FaCrown
    const isLoading = !buyers || buyers.length === 0


    // Create an array of 5 skeleton cards when loading
    const skeletonCards = Array(5).fill(0).map((_, i) => ({ id: `skeleton-${i}`, index: i }))

    return (
        <section className="w-full rounded-lg overflow-hidden bg-[#C6EEC2] dark:bg-[#00302A]" style={{ border: `0.5px solid ${defaultBorder}` }}>
            <div className="bg-[#EEFFEB] dark:bg-dark-800 p-4 flex items-center gap-2">
                <h2 className="text-black dark:text-light text-2xl font-semibold font-ari flex items-center gap-3">
                    <span
                        className="rounded-lg p-2 flex items-center justify-center "
                        style={{
                            background: `${iconColor}26`,
                        }}
                    >
                        <Icon strokeWidth={2} className="dark:bg-transparent  rounded-full w-7 h-7 text-black dark:text-white"/>
                    </span>
                    {title}
                </h2>
            </div>
            <div className="py-4 px-6">
                <div className="lg:hidden">
                    <Swiper
                        modules={[Autoplay, Pagination]}
                        spaceBetween={16}
                        slidesPerView={1}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: true,
                            pauseOnMouseEnter: true,
                        }}
                        pagination={{
                            clickable: true,
                        }}
                        className="buyer-swiper"
                    >
                        {isLoading
                            ? skeletonCards.map((card) => (
                                <SwiperSlide key={card.id} className="!w-full">
                                    <SkeletonCard showColors={showColors} index={card.index} />
                                </SwiperSlide>
                            ))
                            : buyers.map((buyer, i) => (
                                <SwiperSlide key={i} className="!w-full">
                                    <div
                                        className={clsx("rounded-xl flex flex-col  items-start gap-3 px-4 py-3 h-full")}
                                        style={{
                                            background: showColors ? buyerGradients[i] || defaultGradient : defaultGradient,
                                            border: `0.5px solid ${showColors ? buyerBorders[i] || defaultBorder : defaultBorder}`,
                                        }}
                                    >
                                        <div className="flex justify-between items-start w-full">
                                            <Image
                                                src={buyer.avatar || "/shopverse.png"}
                                                alt={buyer.adTitle || 'buyer image'}
                                                width={64}
                                                height={64}
                                                className="rounded-md object-cover"
                                            />

                                            {showColors && (
                                                <Image
                                                    className="mt-1"
                                                    src={buyerMedals[i] || "/shopverse.png"}
                                                    alt={buyer.displayName || 'buyer image'}
                                                    width={32}
                                                    height={51}
                                                />
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-lg font-sans underline">{buyer.displayName || 'Shopverse'}</div>
                                            <div className="text-light/60 font-sans text-sm">Bought: {buyer.purchaseArea || '404'}</div>
                                            <div className="text-light/60 font-sans text-sm">
                                                Position: {`((${buyer?.purchasePosition?.topLeft || '--,--'}), (${buyer?.purchasePosition?.bottomRight || '--,--'}))`}
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>
                </div>

                <div className="hidden lg:block">
                    <div className="grid grid-cols-5 gap-6">
                        {isLoading
                            ? skeletonCards.map((card) => (
                                <SkeletonCard key={card.id} showColors={showColors} index={card.index} />
                            ))
                            : buyers.map((buyer, i) => (
                                <div
                                    key={i}
                                    className={clsx("rounded-xl flex flex-col items-start gap-3 px-4 py-3")}
                                    style={{
                                        background: showColors ? buyerGradients[i] || defaultGradient : defaultGradient,
                                        border: `0.5px solid ${showColors ? buyerBorders[i] || defaultBorder : defaultBorder}`,
                                    }}
                                >
                                    <div className="flex justify-between items-start w-full">
                                        <Image
                                            src={buyer.avatar || "/shopverse.png"}
                                            alt={buyer.adTitle || 'buyer image'}
                                            width={64}
                                            height={64}
                                            className="rounded-md object-cover"
                                        />

                                        {showColors && (
                                            <Image
                                                className="mt-1"
                                                src={buyerMedals[i] || "/shopverse.png"}
                                                alt={buyer.displayName || 'buyer image'}
                                                width={32}
                                                height={51}
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold text-lg font-sans underline">{buyer?.displayName || 'User'}</div>
                                        <div className="dark:text-light/60 font-sans text-sm">Bought: {buyer?.purchaseArea || 0}</div>
                                        <div className="dark:text-light/60 font-sans text-sm">
                                            Position: {`((${buyer?.purchasePosition?.topLeft || '--,--'}), (${buyer?.purchasePosition?.bottomRight || '--,--'}))`}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}
