
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"
import { cn } from "@/lib/utils"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: "BƠ HỌC TOÁN - Bé Giỏi Toán Mỗi Ngày",
  description: "Nền tảng tạo đề toán tư duy thông minh - Number Garden Edition",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={cn(inter.variable, playfair.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="no-print flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border mx-2" />
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full flex items-center justify-center overflow-hidden border border-primary/20 bg-white">
                    <Image 
                      src="/logo.png" 
                      alt="Bơ Học Toán Logo" 
                      width={40} 
                      height={40}
                      className="object-contain p-0.5"
                    />
                 </div>
                 <h2 className="text-sm font-bold text-primary uppercase tracking-tight">Number Garden Edition</h2>
              </div>
            </header>
            <main className="flex flex-1 flex-col p-4 md:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  )
}
