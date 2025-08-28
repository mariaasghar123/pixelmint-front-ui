"use client";
import React from "react";
import clsx from "clsx";

export default function Button({ className, children, onClick = () => { }, ...props }) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "px-4 py-2 rounded transition-all ease-in duration-300 focus:outline-none bg-green-100 font-ari font-semibold text-dark-800 cursor-pointer border border-4 border-green-100",
                "hover:-translate-y-2 hover:shadow-[0_16px_0_0_#000] hover:shadow-black hover:bg-light hover:text-green-100",
                "shadow-none",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
