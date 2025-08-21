import { UploadCloud, UploadCloudIcon, UploadIcon } from "lucide-react";
import React, { useRef } from "react";

export default function ImageUploadBox({ onUpload, label = "Upload Image" }) {
    const fileInputRef = useRef();

    function handleDrop(e) {
        e.preventDefault();
        if (e.dataTransfer?.files?.length) {
            onUpload?.(e.dataTransfer.files[0]);
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleFileChange(e) {
        if (e.target.files?.length) {
            onUpload?.(e.target.files[0]);
        }
    }

    function triggerFileInput() {
        fileInputRef.current?.click();
    }

    return (
        <div>
            <label className="block text-light mb-1 ">{label}</label>
            <div
                className="border border-dashed border-light rounded-lg bg-transparent flex flex-col items-center justify-center py-8 cursor-pointer hover:border-green-300 transition relative"
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
                    <UploadIcon />
                    <span className="mt-2 text-light font-aria text-lg">Upload Image</span>
                </div>
            </div>
        </div>
    );
}
