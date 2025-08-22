import Image from "next/image";
import clsx from "clsx";
import { FaCrown } from "react-icons/fa";

const buyerGradients = [
    "linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0.2) 6%, rgba(255, 215, 0, 0.05) 100%)", // Gold
    "linear-gradient(90deg, rgba(192, 192, 192, 0.3) 0%, rgba(192, 192, 192, 0.3) 6%, rgba(192, 192, 192, 0.05) 100%)", // Silver
    "linear-gradient(90deg, rgba(205, 127, 50, 0.3) 0%, rgba(205, 127, 50, 0.3) 6%, rgba(205, 127, 50, 0.05) 100%)", // Bronze
];

const buyerBorders = [
    "rgba(255, 215, 0, 0.3)",
    "rgba(192, 192, 192, 0.3)",
    "rgba(205, 127, 50, 0.3)",
];

const buyerMedals = [
    "/1st.png",
    "/2nd.png",
    "/3rd.png"
]

const defaultGradient = "linear-gradient(90deg, rgba(192, 192, 192, 0.1) 0%, rgba(192, 192, 192, 0.05) 100%)";
const defaultBorder = "rgba(192, 192, 192, 0.3)";

export default function BuyerList({
    title = "Recent buyers",
    buyers,
    showCrown = false,
    showColors = true
}) {
    return (
        <section className="w-full rounded-lg overflow-hidden" style={{ border: `0.5px solid ${defaultBorder}` }}>
            <div className="bg-dark-800 p-4 flex items-center gap-2">
                <h2 className="text-light text-2xl font-semibold font-ari flex items-center gap-3">
                    {showCrown && (
                        <span
                            className="rounded-lg p-2 flex items-center justify-center"
                            style={{
                                background: "#FF990026",
                            }}
                        >
                            <FaCrown
                                size={24}
                                color="#FF9900"
                                strokeWidth={2}
                                fill="#FF9900"
                                style={{ background: "transparent", borderRadius: "50%" }}
                            />
                        </span>
                    )}
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-5 gap-6 py-4 px-6">
                {buyers.map((buyer, i) => (
                    <div
                        key={i}
                        className={clsx(
                            "rounded-xl flex flex-col items-start gap-3 px-4 py-3 min-w-[150px]"
                        )}
                        style={{
                            background: showColors
                                ? (buyerGradients[i] || defaultGradient)
                                : defaultGradient,
                            border: `0.5px solid ${showColors ? (buyerBorders[i] || defaultBorder) : defaultBorder}`,
                        }}
                    >
                        <div className="flex justify-between items-start w-full">
                            <Image
                                src={buyer.avatar}
                                alt={buyer.name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                            />

                            {(i < 3 && showColors) &&
                                <Image
                                    className="mt-1"
                                    src={buyerMedals[i]}
                                    alt={buyer.name}
                                    width={32}
                                    height={51}
                                />
                            }
                        </div>
                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-lg font-sans underline">{buyer.name}</div>
                            <div className="text-light/60 font-sans text-sm">
                                Bought: {buyer.bought}
                            </div>
                            <div className="text-light/60 font-sans text-sm">
                                Position: {buyer.position}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
