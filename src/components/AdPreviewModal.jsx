"use client";
import { X } from "lucide-react";
import AdContentDisplay from "./Panel/AdContentDisplay";

export default function AdPreviewModal({ isOpen, onClose, ad }) {
  if (!isOpen || !ad) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="dark:bg-dark-800 bg-dark-300 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto font-pixel border border-[#208A54]">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-3xl font-semibold font-ari ">
            Advertisement
          </h2>
          <button
            onClick={onClose}
            className="hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <AdContentDisplay ad={ad} />

        <div className="flex gap-4 justify-end mt-7">
          <button
            onClick={onClose}
            className="dark:bg-dark-600 bg-dark-100 dark:hover:bg-dark-500 hover:bg-dark-200 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
          {ad?.websiteUrl && ad.websiteUrl !== "-" && (
            <button
              onClick={() => {
                window.open(ad.websiteUrl, "_blank");
                onClose();
              }}
              className="dark:bg-green-600 bg-green-400 dark:hover:bg-green-700 hover:bg-green-500 font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Visit Website
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
