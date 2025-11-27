import localFont from "next/font/local"
import { ToastContainer } from "react-toastify";
import ThemeProvider from "@/components/ThemeProviders";
import AppProviders from "@/components/AppProviders";
import "./globals.css";

const ari = localFont({
    src: [
        {
            path: "./fonts/ari-w9500-condensed.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/ari-w9500-condensed-display.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "./fonts/ari-w9500-condensed-bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-ari",
})

export const metadata = {
    title: "Pixel Mint",
    description: "Digital Billboard",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
  <head>
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const savedTheme = localStorage.getItem('theme');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  </head>
  <body className={`${ari.variable} antialiased`}>
    <ThemeProvider>
      <AppProviders>{children}</AppProviders>
    </ThemeProvider>
  </body>
</html>

    );
}
