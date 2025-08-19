import { mdiFood } from "@mdi/js";
import React from "react";
import type { JSX } from 'react';

interface MenuIconProps {
    name: string;
    className?: string;
}
const iconMap: Record<string, (className?: string) => JSX.Element> = {
    home: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M3 12L12 3L21 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5 10V21H19V10" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    profile: (className) => (
        <svg width="20" height="20" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="7" r="4" strokeWidth="1.5" />
            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    tick: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M5 13l4 4L19 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    document: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14 2v6h6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    cross: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M6 6l12 12M6 18L18 6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    bulb: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M9 18h6M10 21h4M12 2a7 7 0 0 0-7 7c0 2.4 1.2 4.5 3 5.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3c1.8-1.2 3-3.3 3-5.7a7 7 0 0 0-7-7z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    sideArrow: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M9 5l7 7-7 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),

    camera: (className) => (
        <svg
            width="20"
            height="20"
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M3 7h3l2-3h8l2 3h3v13H3V7z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="4" strokeWidth="1.5" />
        </svg>
    ),
    "order-history": (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M8 3H16C16.5523 3 17 3.44772 17 4V20L14.5 18.5L12 20L9.5 18.5L7 20V4C7 3.44772 7.44772 3 8 3Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="12"
                cy="10"
                r="3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12 9V11L13 12"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    rs: (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {/* Horizontal lines */}
            <path d="M6 4H18" />
            <path d="M6 8H18" />

            {/* Vertical curve for ₹ */}
            <path d="M6 4C11 4 14 6 14 10C14 13.3137 11.3137 16 8 16H6L17 20" />
        </svg>
    ),

    settings: (className) => (
        <svg
            width="20"
            className={className}
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c0 .7.4 1.3 1 1.51H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    ),
    "restaurant-profile": (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            {/* Map pin outline */}
            <path
                d="M12 21C12 21 5 14.5 5 9.5C5 6.46243 7.46243 4 10.5 4C13.5376 4 16 6.46243 16 9.5C16 14.5 12 21 12 21Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Fork */}
            <path
                d="M10 7V10"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M9.5 7V10"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            <path
                d="M10.5 7V10"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Knife */}
            <path
                d="M13 7V10C13 10.5523 12.5523 11 12 11"
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    ),


    restaurant: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M4 3h16v2H4V3zm1 4h14l-1.5 13.5H6.5L5 7zm4 2v9m6-9v9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    order: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    time: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 7v5l3 3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    team: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="9" cy="7" r="4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path
                d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    add: (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    edit: (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M12.3 6.09998L17.9 11.7L8.59998 21H3V15.4L12.3 6.09998Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M14.8 3.59998C15.2 3.19998 15.8 3.19998 16.2 3.59998L18.4 5.79998C18.8 6.19998 18.8 6.79998 18.4 7.19998L16.7 8.89998L14.1 6.29998L14.8 3.59998Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    delete: (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
        >
            <path
                d="M3 6H5H21"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <line x1="10" y1="11" x2="10" y2="17" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="11" x2="14" y2="17" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    offers: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M4 7V5C4 3.89543 4.89543 3 6 3H8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 13L13 21L3 11V3H11L21 13Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="8" y1="16" x2="16" y2="8" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="9" cy="9" r="1" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" />
        </svg>
    ),

    dashboard: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    allDays: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 10h18" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 2v4M16 2v4" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 17h4l-1.5 1.5M12 17l1.5 1.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),

    specificDays: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M3 10h18" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 2v4M16 2v4" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="14" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="14" r="1" fill="currentColor" />
        </svg>
    ),
    food: (className) => (
        <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            className={className}
            fill="currentColor"
        >
            <path d={mdiFood} />
        </svg>
    ),



    outlet: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M3 9.5L4.5 4h15L21 9.5M3 9.5V20h18V9.5M3 9.5h18"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M9 20V14h6v6"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    manage: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="1.5" />
            <path d="M19.4 15a8 8 0 00-1.4-2.2M4.6 9a8 8 0 011.4-2.2M9 4.6A8 8 0 0112 4a8 8 0 013 .6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    logout: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    rating: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
            <path d="M12 17.27L18.18 21 16.54 13.97 
             22 9.24l-7.19-.61L12 2 9.19 8.63 
             2 9.24l5.46 4.73L5.82 21z" />
        </svg>
    ),
    noData: (className?: string) => (
        <svg width="20" height="20" className={className} xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" fill="currentColor">
            <path d="m23.707,22.293l-5.963-5.963c1.412-1.725,2.262-3.927,2.262-6.324C20.006,4.492,15.52.006,10.006.006S.006,4.492.006,10.006s4.486,10,10,10c2.398,0,4.6-.85,6.324-2.262l5.963,5.963c.195.195.451.293.707.293s.512-.098.707-.293c.391-.391.391-1.023,0-1.414Zm-13.701-4.287c-4.411,0-8-3.589-8-8S5.595,2.006,10.006,2.006s8,3.589,8,8-3.589,8-8,8Zm3.701-10.299l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Z" />
        </svg>
    ),
    payment: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="currentColor" stroke="none">
            <path d="M2 4C1.45 4 1 4.45 1 5V19C1 19.55 1.45 20 2 20H22C22.55 20 23 19.55 23 19V5C23 4.45 22.55 4 22 4H2ZM21 8H3V6H21V8ZM3 18V10H21V18H3ZM5 14H7V16H5V14ZM9 14H11V16H9V14Z" />
        </svg>
    ),

    close: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M18 6L6 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6l12 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),

    dropdown: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    view: (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="12" r="3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    new: (className) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M3 4h18M3 10h18M3 16h12"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    cooking: (className) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M4 10h16M5 10v10a1 1 0 001 1h12a1 1 0 001-1V10M9 10V5a3 3 0 016 0v5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    packing: (className) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M3 7l9-4 9 4v10l-9 4-9-4V7z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3 7l9 5 9-5"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    ready: (className) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path
                d="M5 13l4 4L19 7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    ),
    all: (className) => (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    ),
    "dropdown-up": (className) => (
        <svg width="20" height="20" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor">
            <path d="M18 15l-6-6-6 6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    veg: (className?: string) => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="1"
                y="1"
                width="14"
                height="14"
                rx="2"
                stroke="#16a34a" // Tailwind green-600
                strokeWidth="2"
                fill="none"
            />
            <circle cx="8" cy="8" r="3" fill="#16a34a" />
        </svg>
    ),

    // ✅ Non-Veg icon as SVG (Red triangle inside square)
    nonVeg: (className?: string) => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="1"
                y="1"
                width="14"
                height="14"
                rx="2"
                stroke="#dc2626" // Tailwind red-600
                strokeWidth="2"
                fill="none"
            />
            <polygon points="8,4 12,11 4,11" fill="#dc2626" />
        </svg>
    ),
    default: (className) => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            className={className}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
        </svg>
    ),

};

const MenuIcon: React.FC<MenuIconProps> = ({ name, className }) => {
    const renderIcon = iconMap[name] || iconMap.default;
    return renderIcon(className);
};

export default MenuIcon;
