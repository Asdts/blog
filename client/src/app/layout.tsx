import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import { ThemeProvider } from "@/components/theme-provider"
import { NotificationContextProvider } from "@/components/notification"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A container-based blog platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange> */}
          <NotificationContextProvider>
            <div className="min-h-screen bg-background">
              <header className="border-b">
                <div className="container mx-auto py-4">
                  <Link href="/">
                    <h1 className="text-2xl font-bold">Blog Platform</h1>
                  </Link>
                </div>
              </header>
              {children}
            </div>
          </NotificationContextProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}

