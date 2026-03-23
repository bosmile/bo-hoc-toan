
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "BƠ HỌC TOÁN - Bé Giỏi Toán Mỗi Ngày",
  description: "Ứng dụng tạo bài tập toán thông minh cho bé",
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="no-print flex h-16 shrink-0 items-center gap-2 px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
              <SidebarTrigger className="-ml-1" />
              <div className="h-4 w-px bg-border mx-2" />
              <div className="flex-1">
                 <h2 className="text-sm font-medium text-muted-foreground">Hệ thống bài tập thông minh</h2>
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
