"use client";
import React from "react";
import clsx from "clsx";


export default function Button({ className, children, onClick = () => { }, ...props }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "px-4 py-2 rounded transition-colors ease-in duration-300 focus:outline-none bg-green-100 hover:bg-light font-ari font-semibold text-dark-800 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
