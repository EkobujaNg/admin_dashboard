import "./globals.css";
import Head from "next/head";
import localFont from "next/font/local";
import AppLayout from "@/AppLayout";

const geist = localFont({
  src: [
    {
      path: "../../public/fonts/Geist-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-geist",
  display: "swap",
});

const raleway = localFont({
  src: [
    {
      path: "../../public/fonts/Raleway-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata = {
  title: "EkoBuja | Accessible Real Estate Investments",
  description:
    "EkoBuja is Nigeria’s trusted real estate investment platform. Start building wealth through fractional ownership of high-income properties. Accessible, transparent, and tailored for everyone.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.title} />
        <meta name="twitter:description" content={metadata.description} />
        <meta name="twitter:image" content="/images/og-image.jpg" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className={`${geist.variable} ${raleway.variable} antialiased`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
