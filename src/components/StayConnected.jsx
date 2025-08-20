import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"

export default function StayConnected() {
    return (
        <section className="w-full rounded-lg bg-dark-800 px-6 py-6 flex flex-col items-center">
            <h2 className="text-semibold text-xl font-semibold mb-4">Stay Connected</h2>
            <div className="flex gap-4">
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-6 py-2 border border-[rgba(192,192,192,0.3)] bg-transparent text-light transition hover:bg-[rgba(192,192,192,0.06)]"
                    style={{ borderWidth: "0.5px" }}
                >
                    <FaXTwitter />
                    <span className="font-aria text-lg">Twitter</span>
                </a>
                <a
                    href="https://telegram.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg px-6 py-2 border border-[rgba(192,192,192,0.3)] bg-transparent text-light transition hover:bg-[rgba(192,192,192,0.06)]"
                    style={{ borderWidth: "0.5px" }}
                >
                    {/* SVG for Telegram */}
                    <FaTelegramPlane />
                    <span className="font-aria text-lg">Telegram</span>
                </a>
            </div>
        </section>
    );
}
