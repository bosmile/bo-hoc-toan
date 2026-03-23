
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BookOpen, 
  ChevronRight, 
  Home, 
  LayoutDashboard, 
  Calculator, 
  BrainCircuit,
  Settings
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navigation = {
  archimedes: {
    title: "Toán Archimedes",
    icon: Calculator,
    chapters: [
      { title: "Chuyên đề 1: A ± B ± C = D", url: "/archimedes/chuyen-de-1" },
      { title: "Chuyên đề 2", url: "/archimedes/chuyen-de-2" },
      { title: "Chuyên đề 3", url: "/archimedes/chuyen-de-3" },
    ],
  },
  singapore: {
    title: "Toán Singapore",
    icon: BrainCircuit,
    chapters: [
      { title: "Chuyên đề 1", url: "/singapore/chuyen-de-1" },
      { title: "Chuyên đề 2", url: "/singapore/chuyen-de-2" },
      { title: "Chuyên đề 3", url: "/singapore/chuyen-de-3" },
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
            {navigation.archimedes.chapters.map((chapter) => (
              <SidebarMenuItem key={chapter.url}>
                <SidebarMenuButton asChild isActive={pathname === chapter.url}>
                  <Link href={chapter.url}>
                    <Calculator className="size-4" />
                    <span>{chapter.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {navigation.singapore.title}
          </SidebarGroupLabel>
          <SidebarMenu>
            {navigation.singapore.chapters.map((chapter) => (
              <SidebarMenuItem key={chapter.url}>
                <SidebarMenuButton asChild isActive={pathname === chapter.url}>
                  <Link href={chapter.url}>
                    <BrainCircuit className="size-4" />
                    <span>{chapter.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Settings className="size-4" />
          <span>V1.0.0 Stable</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
