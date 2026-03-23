"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  BrainCircuit, 
  FilePlus, 
  ArrowRight, 
  Download,
  BookOpen,
  Sparkles,
  Award
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function HomePage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12 md:py-24">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 size-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-2xl space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-1 text-sm backdrop-blur-sm">
            Học toán cùng Bơ 🥑
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            BƠ HỌC TOÁN
          </h1>
          <p className="text-lg text-primary-foreground/90 sm:text-xl">
            Nền tảng tạo đề toán tư duy thông minh cho trẻ em. Cá nhân hóa bài tập, xuất file chuẩn in ấn.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="secondary" asChild className="font-bold">
              <Link href="/archimedes/chuyen-de-1">
                Bắt đầu ngay
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Main Stats / Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
         {[
           { label: "Tổng bài tập đã tạo", value: "1,250+", icon: FilePlus, color: "text-blue-500" },
           { label: "Số lượng chuyên đề", value: "6", icon: BookOpen, color: "text-green-500" },
           { label: "Đánh giá từ phụ huynh", value: "4.9/5", icon: Sparkles, color: "text-yellow-500" },
           { label: "Thứ hạng của bé", value: "Vàng", icon: Award, color: "text-orange-500" },
         ].map((stat, i) => (
           <Card key={i} className="border-none shadow-md hover:shadow-lg transition-shadow bg-white">
             <CardContent className="flex items-center p-6">
               <div className={`mr-4 rounded-xl bg-muted p-3 ${stat.color}`}>
                 <stat.icon className="size-6" />
               </div>
               <div>
                 <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                 <p className="text-2xl font-bold">{stat.value}</p>
               </div>
             </CardContent>
           </Card>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Test Builder Concept */}
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Download className="size-5" />
              Tạo bộ đề tổng hợp
            </CardTitle>
            <CardDescription>Chọn số lượng câu hỏi từ mỗi chuyên đề để tạo bộ đề tổng hợp.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Chuyên đề 1 - Archimedes</span>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={5} className="w-16 h-8 text-center" />
                  <span className="text-sm text-muted-foreground">câu</span>
                </div>
              </div>
              <Progress value={25} className="h-1.5" />

              <div className="flex items-center justify-between">
                <span className="font-medium">Chuyên đề 2 - Archimedes</span>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={10} className="w-16 h-8 text-center" />
                  <span className="text-sm text-muted-foreground">câu</span>
                </div>
              </div>
              <Progress value={50} className="h-1.5" />

              <div className="flex items-center justify-between">
                <span className="font-medium">Toán Singapore - Tư duy</span>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={5} className="w-16 h-8 text-center" />
                  <span className="text-sm text-muted-foreground">câu</span>
                </div>
              </div>
              <Progress value={25} className="h-1.5" />
            </div>

            <div className="rounded-xl bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">20 câu hỏi</span>
              </div>
              <p className="text-xs text-muted-foreground">Phù hợp cho bé luyện tập trong 30-45 phút.</p>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 p-4 border-t">
            <Button className="w-full gap-2 font-bold py-6">
              <Sparkles className="size-4" />
              Tạo và Xuất PDF
            </Button>
          </CardFooter>
        </Card>

        {/* Categories Explorer */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <BookOpen className="size-5" />
            Khám phá chuyên đề
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="group hover:border-primary/50 transition-colors cursor-pointer border-none shadow-md bg-white">
              <CardHeader className="p-4">
                <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Calculator className="size-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Toán Archimedes</CardTitle>
                <CardDescription>Tập trung vào tính toán nhanh và logic số học.</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" className="p-0 text-primary hover:bg-transparent hover:underline" asChild>
                  <Link href="/archimedes/chuyen-de-1">Xem chi tiết <ArrowRight className="ml-1 size-3"/></Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="group hover:border-accent/50 transition-colors cursor-pointer border-none shadow-md bg-white">
              <CardHeader className="p-4">
                <div className="size-10 rounded-lg bg-accent/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="size-6 text-accent-foreground" />
                </div>
                <CardTitle className="text-lg">Toán Singapore</CardTitle>
                <CardDescription>Phương pháp mô hình khối giúp bé hiểu bản chất toán.</CardDescription>
              </CardHeader>
              <CardFooter className="p-4 pt-0">
                <Button variant="ghost" className="p-0 text-accent-foreground hover:bg-transparent hover:underline" asChild>
                  <Link href="/singapore/chuyen-de-1">Xem chi tiết <ArrowRight className="ml-1 size-3"/></Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="border-none shadow-lg bg-accent text-accent-foreground">
             <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-bold text-lg">Mẹo nhỏ cho phụ huynh</p>
                  <p className="text-sm opacity-90">Hãy bắt đầu với 5-10 câu mỗi ngày để bé không bị áp lực.</p>
                </div>
                <div className="size-16 hidden sm:flex items-center justify-center rounded-full bg-white/20">
                   <Sparkles className="size-8" />
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}