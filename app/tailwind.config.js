/** @type {import('tailwindcss').Config} */

const spacing = {
    "auto": "auto",
    "px": "1px",
    "0.5": "2px",
    "0.75": "3px",
    "1": "4px",
    "1.5": "6px",
    "2": "8px",
    "2.5": "10px",
    "3": "12px",
    "3.5": "14px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "7": "28px",
    "8": "32px",
    "9": "36px",
    "10": "40px",
    "11": "44px",
    "12": "48px",
    "14": "56px",
    "16": "64px",
    "20": "80px",
    "24": "96px",
    "28": "112px",
    "32": "128px",
    "36": "144px",
    "40": "160px",
    "44": "176px",
    "48": "192px",
    "52": "208px",
    "56": "224px",
    "60": "240px",
    "64": "256px",
    "72": "288px",
    "80": "320px",
    "96": "384px",
};

module.exports = {
    safelist: ['outline-gray-900/[.07]', 'popup-fade-enter-active', 'popup-fade-leave-active'],
    content: ["./src/**/*.{html,vue}"], theme: {
        boxShadow: {
            main: "0 1.5px 1.5px 0 #1a1f260f",
            popup: "0 6px 30px 0 #0000000f"
        },
        borderRadius: {
            sm: '2px',
            DEFAULT: '4px',
            "2": '5px',
            md: '6px',
            lg: '8px',
            "lg-2": "10px",
            "xl": "12px",
            "2xl": "16px",
            "3xl": "24px",
        },
        space: spacing,
        padding: spacing,
        margin: spacing,
        gap: spacing,
        fontFamily: {
            sans: ["Euclid", "sans-serif"],
            mono: ["DMMono", "mono"]
        }, fontSize: {
            xxs: ["0.625rem", { lineHeight: "0.5rem", },],
            xs: ["0.6875rem", { lineHeight: "0.75rem", },],
            sm: ["0.75rem", { lineHeight: "1rem", },],
            base: ["0.875rem", { lineHeight: "1.5rem", },],
            lg: ["1rem", { lineHeight: "1.5rem", },],
            xl: ["1.25rem", { lineHeight: "1.75rem", },],
            "2xl": ["1.5rem", { lineHeight: "2rem", },],
            "3xl": ["1.75rem", { lineHeight: "2rem", },],
            "body": ["16px", { lineHeight: "28px" }],
            "subtitle": ["18px", { lineHeight: "28px" }],
            "small": ["14px", { lineHeight: "24px" }],
            "extra-small": ["12px", { lineHeight: "20px" }],
            "tiny": ["10px", { lineHeight: "16px" }],
            "label": ["12px", { lineHeight: "18px" }]
        }, extend: {
            letterSpacing: {
                "label": "0.15em",
            },
            screens: {
                xxl: { raw: "(min-width: 1400px)" },
            },
            colors: {
                gray: {
                    50: "#f5f6f7",
                    100: "#F3F4F6",
                    200: "#E5E7EB",
                    300: "#d3d6db",
                    400: "#a7acb4",
                    500: "#7c838D",
                    600: "#525963",
                    700: "#404752",
                    800: "#282e38",
                    900: "#1a1f26",
                },
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" }, "100%": { opacity: "100" },
                }, fadeOutDelay: {
                    "0%": { opacity: "100" }, "85%": { opacity: "100" }, "100%": { opacity: "0" },
                },
            },
            animation: {
                fadeInSlow: "fadeIn 0.25s ease-out",
                fadeInSlower: "fadeIn 0.4s ease-out",
                fadeIn1s: "fadeIn 1.0s ease-out",
                fadeInFast: "fadeIn 0.15s ease-out",
                hideAfterDelay: "fadeOutDelay 2.0s ease-out",
            },
        },
    }, variants: {
        extend: {
            display: ["group-hover"],
        },
    }, plugins: [],
}

