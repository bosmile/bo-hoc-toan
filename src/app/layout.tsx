
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import Image from "next/image"

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
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="no-print flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border mx-2" />
              <div className="flex items-center gap-3">
                 <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                    <Image 
                      src="https://picsum.photos/seed/bo-logo/200/200" 
                      alt="Bơ Học Toán Logo" 
                      width={32} 
                      height={32}
                      className="object-cover"
                      data-ai-hint="child logo"
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
