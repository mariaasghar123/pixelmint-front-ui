"use client";

export default function AdContentDisplay({ ad }) {
  const adTitle = ad?.adTitle || "No Title";
  const adImageUrl = ad?.adImageUrl;
  const websiteUrl = ad?.websiteUrl || "-";

  return (
    <div className="bg-dark-700 rounded-xl p-6 mb-7">
      <h3 className="font-bold text-lg mb-5">Ad Content</h3>
      <div className="flex flex-col items-center justify-center border border-[#208A54] rounded-lg p-6 mb-6">
        {adImageUrl ? (
          <img
            src={adImageUrl}
            alt={adTitle}
            className="w-24 h-24 object-contain mb-4"
          />
        ) : (
          <>
            <div className="w-24 h-24 flex items-center justify-center bg-dark-800 rounded mb-4">
              <svg width="40" height="40" fill="none">
                <rect width="40" height="40" rx="8" fill="#1E894B" />
                <path
                  d="M12 28v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"
                  stroke="#5DD075"
                  strokeWidth="2"
                />
                <circle
                  cx="20"
                  cy="16"
                  r="4"
                  stroke="#5DD075"
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="text-error text-center font-bold mb-4">
              This ad has already been removed by the admin.
            </div>
          </>
        )}
        <div className="text-xl font-bold mb-2 text-center">{adTitle}</div>
        <div className="text-light/60 text-center">
          {adTitle}
        </div>
      </div>
      <div className="mb-4">
        <div className="font-bold mb-1">Title</div>
        <div className="text-light/90">{adTitle}</div>
      </div>
      <div>
        <div className="font-bold mb-1">Target URL</div>
        <div className="text-light/90">{websiteUrl}</div>
      </div>
    </div>
  );
}
