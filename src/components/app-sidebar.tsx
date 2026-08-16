
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
  BoxSelect,
  Grid3X3,
  Clock,
  BookOpen,
  PlusCircle,
  FileText
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
  lop1: {
    title: "Toán Lớp 1 (Number Garden)",
    chapters: [
      { title: "Bộ trộn đề (Mixer)", url: "/archimedes/lop-1/mixer", icon: List },
      { title: "CĐ1: Biểu thức 3 số", url: "/archimedes/lop-1/chuyen-de-1", icon: Calculator },
      { title: "CĐ2: Phép nhân", url: "/archimedes/lop-1/chuyen-de-2", icon: Calculator },
      { title: "CĐ3: So sánh biểu thức", url: "/archimedes/lop-1/chuyen-de-3", icon: Scale },
      { title: "CĐ4: Tính hàng dọc", url: "/archimedes/lop-1/chuyen-de-4", icon: Columns2 },
      { title: "CĐ5: Quy luật dãy số", url: "/archimedes/lop-1/chuyen-de-5", icon: ListOrdered },
      { title: "CĐ6: Thử thách Sudoku", url: "/archimedes/lop-1/chuyen-de-6", icon: Grid3X3 },
      { title: "CĐ7: Xem đồng hồ", url: "/archimedes/lop-1/chuyen-de-7", icon: Clock },
      { title: "CĐ8: Toán tư duy", url: "/archimedes/lop-1/chuyen-de-8", icon: BookOpen },
      { title: "CĐ9: Cân bằng phép cộng", url: "/archimedes/lop-1/chuyen-de-9", icon: PlusCircle },
      { title: "CĐ10: Toán có lời văn", url: "/archimedes/lop-1/chuyen-de-10", icon: FileText },
      { title: "CĐ11: Ôn thi TIMO", url: "/archimedes/lop-1/chuyen-de-timo", icon: FileText },
    ],
  },
  lop2: {
    title: "Toán Lớp 2 (Logic Mastery)",
    chapters: [
      { title: "Bộ trộn đề (Mixer)", url: "/archimedes/lop-2/mixer", icon: List },
      { title: "CĐ1: Số học & Phép tính", url: "/archimedes/lop-2/chuyen-de-1", icon: Calculator },
      { title: "CĐ2: Đại lượng Đo lường", url: "/archimedes/lop-2/chuyen-de-2", icon: Scale },
      { title: "CĐ3: Hình học & Chu vi", url: "/archimedes/lop-2/chuyen-de-3", icon: Shapes },
      { title: "CĐ4: Phân số trực quan", url: "/archimedes/lop-2/chuyen-de-4", icon: BoxSelect },
      { title: "CĐ5: Toán có lời văn", url: "/archimedes/lop-2/chuyen-de-5", icon: FileText },
      { title: "CĐ6: Logic Grid", url: "/archimedes/lop-2/chuyen-de-6", icon: BrainCircuit },
    ],
  }
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
            <span className="text-[8px] text-accent font-bold uppercase tracking-wider truncate">Archimedes Edition</span>
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

        {/* Toán Lớp 1 Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2 bg-emerald-50 py-1 mx-2 rounded-md justify-center">
            {navigation.lop1.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.lop1.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url} className="data-[active=true]:bg-emerald-500 data-[active=true]:text-white transition-all">
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

        {/* Toán Lớp 2 Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 bg-blue-50 py-1 mx-2 rounded-md justify-center mt-2">
            {navigation.lop2.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.lop2.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url} className="data-[active=true]:bg-blue-600 data-[active=true]:text-white transition-all">
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
