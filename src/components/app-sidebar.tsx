"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calculator, 
  BrainCircuit,
  Settings,
  List,
  Scale,
  Columns2
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
      { title: "Mục lục chính", url: "/archimedes", icon: List },
      { title: "CĐ1: Biểu thức 3 số", url: "/archimedes/chuyen-de-1", icon: Calculator },
      { title: "CĐ2: Phép nhân", url: "/archimedes/chuyen-de-2", icon: Calculator },
      { title: "CĐ3: So sánh biểu thức", url: "/archimedes/chuyen-de-3", icon: Scale },
      { title: "CĐ4: Tính hàng dọc", url: "/archimedes/chuyen-de-4", icon: Columns2 },
    ],
  },
  singapore: {
    title: "Toán Singapore",
    chapters: [
      { title: "Mục lục chính", url: "/singapore", icon: List },
      { title: "Chuyên đề 1", url: "/singapore/chuyen-de-1", icon: BrainCircuit },
    ],
  },
}

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="size-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-bold text-lg text-primary tracking-tight">BƠ HỌC TOÁN</span>
            <span className="text-xs text-muted-foreground">The Master Blueprint</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link href="/">
                  <Home className="size-4" />
                  <span>Trang chủ</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {navigation.archimedes.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.archimedes.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url}>
                    <Link href={chapter.url}>
                      <Icon className="size-4" />
                      <span>{chapter.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {navigation.singapore.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.singapore.chapters.map((chapter) => {
              const Icon = chapter.icon
              return (
                <SidebarMenuItem key={chapter.url}>
                  <SidebarMenuButton asChild isActive={pathname === chapter.url}>
                    <Link href={chapter.url}>
                      <Icon className="size-4" />
                      <span>{chapter.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Settings className="size-4" />
          <span>V1.5.0 Stable</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
