import { UploadIcon } from "lucide-react";
import React, { useRef, useState } from "react";

export default function ImageUploadBox({ onUpload, label = "Upload Image" }) {
    const fileInputRef = useRef();
    const [previewUrl, setPreviewUrl] = useState(null);

    function handleDrop(e) {
        e.preventDefault();
        if (e.dataTransfer?.files?.length) {
            const file = e.dataTransfer.files[0];
            onUpload?.(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleFileChange(e) {
        if (e.target.files?.length) {
            const file = e.target.files[0];
            onUpload?.(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    }

    function triggerFileInput() {
        fileInputRef.current?.click();
    }

    function handleRemove() {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        onUpload?.(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    // Clean up object URLs to avoid memory leaks
    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    return (
        <div>
            <label className="block text-light mb-1 ">{label}</label>
            <div
                className="border border-dashed dark:border-light rounded-lg bg-transparent flex flex-col items-center justify-center py-8 cursor-pointer hover:border-green-300 transition relative"
                style={{ minHeight: "70px" }}
                onClick={triggerFileInput}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileChange}
                />
                <div className="flex flex-col items-center pointer-events-none">

                    {previewUrl ? (
                        <div className="mt-4 flex flex-col items-center relative">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 bg-black bg-opacity-60 text-white rounded-full px-2 py-1 cursor-pointer z-10"
                                aria-label="Remove image"
                                style={{
                                    transform: "translate(50%, -50%)",
                                }}
                            >
                                &times;
                            </button>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-32 object-contain rounded"
                            />
                        </div>
                    ) :
                        <>
                            <UploadIcon />
                            <span className="mt-2 dark:text-light font-aria text-lg">Upload Image</span>
                        </>
                    }
                </div>
            </div>
        </div>
    );
}
