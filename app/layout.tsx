import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const iconPath = `${basePath}/images/logo.jpeg`;

export const metadata: Metadata = {
  title: "Tortas Kelita | Repostería artesanal",
  description:
    "Tortas, alfajores y detalles artesanales hechos con recetas de familia para cada celebración.",
  icons: {
    icon: iconPath,
    shortcut: iconPath,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
