
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calculator, 
  Settings,
  List,
  Scale,
  Columns2,
  ListOrdered,
  LayoutDashboard,
  BrainCircuit,
  Shapes,
  BoxSelect
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigation = {
  archimedes: {
    title: "Toán Archimedes",
    chapters: [
      { title: "Bộ trộn đề (Mixer)", url: "/archimedes", icon: List },
      { title: "CĐ1: Biểu thức 3 số", url: "/archimedes/chuyen-de-1", icon: Calculator },
      { title: "CĐ2: Phép nhân", url: "/archimedes/chuyen-de-2", icon: Calculator },
      { title: "CĐ3: So sánh biểu thức", url: "/archimedes/chuyen-de-3", icon: Scale },
      { title: "CĐ4: Tính hàng dọc", url: "/archimedes/chuyen-de-4", icon: Columns2 },
      { title: "CĐ5: Quy luật dãy số", url: "/archimedes/chuyen-de-5", icon: ListOrdered },
    ],
  },
  singapore: {
    title: "Toán Tư Duy Singapore",
    chapters: [
      { title: "CĐ1: Mô hình Bar Model", url: "/singapore/chuyen-de-1", icon: Shapes },
      { title: "CĐ2: Logic hình ảnh", url: "/singapore/chuyen-de-2", icon: BoxSelect },
    ],
  },
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-primary/10">
      <SidebarHeader className="border-b px-4 py-6 bg-primary/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden border-2 border-primary/20 shrink-0">
             <Image 
                src="/logo.png" 
                alt="Logo" 
                width={48} 
                height={48}
                className="object-contain p-0.5"
              />
          </div>
          <div className="flex flex-col gap-0.5 leading-none overflow-hidden">
            <span className="font-black text-lg text-primary tracking-tighter uppercase truncate">BƠ HỌC TOÁN</span>
            <span className="text-[8px] text-accent font-bold uppercase tracking-wider truncate">Number Garden Edition</span>
          </div>
        </Link>
      </SidebarHeader>
      
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"} className="hover:bg-primary/5 hover:text-primary">
                <Link href="/">
                  <Home className="size-4" />
                  <span className="font-bold">Trang chủ</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Toán Archimedes Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2">
            Hệ thống Archimedes
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.archimedes.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url} className="data-[active=true]:bg-primary data-[active=true]:text-white transition-all">
                    <Link href={chapter.url}>
                      <Icon className="size-4" />
                      <span className="font-semibold">{chapter.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* Toán Singapore Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-accent/60 uppercase tracking-[0.2em] mb-2">
            Toán Tư Duy Singapore
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.singapore.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url} className="data-[active=true]:bg-accent data-[active=true]:text-white transition-all">
                    <Link href={chapter.url}>
                      <Icon className="size-4" />
                      <span className="font-semibold">{chapter.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-6 bg-primary/5">
        <div className="flex items-center gap-3 text-[10px] text-primary/60 font-bold uppercase tracking-widest">
          <Settings className="size-4" />
          <span>V2.0 Core-Galaxy</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
