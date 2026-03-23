"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  FilePlus, 
  Settings2,
  BookOpen,
  Library,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const archimedesModules = [
  { id: 1, title: "CĐ1: Biểu thức 3 số", query: "A ± B ± C = D", link: "/archimedes/chuyen-de-1", desc: "Tùy chỉnh phạm vi, vị trí ẩn số, chỉ định phép cộng/trừ/trộn." },
  { id: 2, title: "CĐ2: Phép nhân căn bản", query: "A x B = C", link: "/archimedes/chuyen-de-2", desc: "Chọn bảng cửu chương, xáo trộn, tìm tích số hoặc thừa số." },
  { id: 3, title: "CĐ3: So sánh biểu thức", query: "A ± B [?,<,>] C ± D", link: "/archimedes/chuyen-de-3", desc: "So sánh 2 vế logic, định cấu hình độ phức tạp biểu thức." },
  { id: 4, title: "CĐ4: Đặt tính hàng dọc", query: "+ / - có nhớ", link: "/archimedes/chuyen-de-4", desc: "Giới hạn số chữ số, ẩn một chữ số bất kì, bắt buộc có/không nhớ." },
  { id: 5, title: "CĐ5: Dãy số chu kỳ", query: "[A, B, C, _]", link: "/archimedes/chuyen-de-5", desc: "Tạo dãy số chu kỳ lặp lại, học sinh tìm số thiếu dựa vào tổng chu kỳ." },
  { id: 6, title: "CĐ6: Tháp tính (Pyramids)", query: "A + B = C", link: "/archimedes/chuyen-de-6", desc: "Dạng toán tháp khối hộp. Quy luật phân nhánh cộng dồn. In cực đẹp." },
]

export default function HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 mb-2 rounded-sm rounded-tr-xl tracking-wider font-bold">TEACHER DASHBOARD</Badge>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Trung tâm tạo phiếu in</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Hệ thống thiết kế đề thi và phiếu bài tập tự động dành riêng cho giáo viên.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 bg-primary font-bold shadow-lg shadow-primary/20">
          <Link href="/archimedes">
             <Library className="size-5" />
             Bộ trộn đề tổng hợp (Mixer)
          </Link>
        </Button>
      </div>

      {/* Quick Templates & Global Config */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-md bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base flex items-center gap-2">
              <FilePlus className="size-4 text-primary" />
              Tạo Nhanh Phiếu Bài Tập (Mẫu phổ biến)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="border border-dashed border-primary/30 rounded-lg p-5 hover:border-primary hover:bg-primary/5 transition cursor-pointer group flex flex-col h-full bg-white">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-primary group-hover:underline">Phiếu Phép nhân (Lớp 2-3)</h3>
                  <Badge className="ml-auto bg-primary/10 text-primary" variant="secondary">20 câu</Badge>
               </div>
               <p className="text-xs text-muted-foreground mb-6 flex-1">Ôn tập các bảng cửu chương căn bản: 2, 3, 4, 5. Xáo trộn ngẫu nhiên để luyện phản xạ.</p>
               <Button variant="secondary" size="sm" className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white" asChild>
                 <Link href="/archimedes/chuyen-de-2">Đến máy tạo & In ngay</Link>
               </Button>
             </div>
             
             <div className="border border-dashed border-accent/30 rounded-lg p-5 hover:border-accent hover:bg-accent/5 transition cursor-pointer group flex flex-col h-full bg-white">
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-accent-foreground group-hover:underline">Đặt tính hàng dọc (Lớp 1-2)</h3>
                  <Badge className="ml-auto bg-accent/10 text-accent-foreground" variant="secondary">20 câu</Badge>
               </div>
               <p className="text-xs text-muted-foreground mb-6 flex-1">Ôn tập cộng trừ 2 chữ số, có nhớ, tự động ẩn vị trí bất kỳ để rèn tư duy ngược.</p>
               <Button variant="secondary" size="sm" className="w-full bg-accent/10 text-accent-foreground hover:bg-accent hover:text-white" asChild>
                 <Link href="/archimedes/chuyen-de-4">Đến máy tạo & In ngay</Link>
               </Button>
             </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings2 className="size-4 text-accent-foreground" />
              Header Tiêu chuẩn
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-5 flex-1">
             <div className="space-y-2">
               <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tên trường / Cơ sở</Label>
               <Input placeholder="VD: Trung tâm Bơ Toán" defaultValue="BƠ HỌC TOÁN" className="text-sm font-medium border-primary/20 focus-visible:ring-primary/20" />
             </div>
             <div className="space-y-2">
               <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chương trình / Buổi học</Label>
               <Input placeholder="VD: Khóa luyện tư duy" defaultValue="Number Garden Edition" className="text-sm font-medium border-primary/20 focus-visible:ring-primary/20" />
             </div>
             <p className="text-[11px] text-muted-foreground italic leading-relaxed">
               *Cấu hình này tự động đồng bộ vào mục Header của tất cả các phiếu PDF được xuất ra từ hệ thống.
             </p>
          </CardContent>
          <div className="p-4 bg-muted/20 border-t mt-auto">
             <Button variant="outline" className="w-full text-xs h-9 font-bold hover:bg-primary hover:text-white transition-colors">Lưu thiết lập in ấn</Button>
          </div>
        </Card>
      </div>

      {/* Tools Library */}
      <h2 className="text-xl font-black flex items-center gap-2 pt-6 border-t uppercase text-primary">
        <BookOpen className="size-6 text-primary" />
        Bảng Điều Khiển Sinh Đề Chuyên Sâu
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {archimedesModules.map((mod) => (
          <Link href={mod.link} key={mod.id} className="block group">
            <Card className="h-full border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
              <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start">
                  <div className="size-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black mb-4 group-hover:bg-primary group-hover:text-white group-hover:-translate-y-1 transition-all">
                    <Calculator className="size-6" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] bg-muted/30 border-dashed">{mod.query}</Badge>
                </div>
                <CardTitle className="text-sm font-extrabold group-hover:text-primary transition-colors uppercase tracking-tight">{mod.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-4">
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                  {mod.desc}
                </p>
              </CardContent>
              <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                <div className="text-[11px] font-bold text-primary flex items-center group-hover:translate-x-1 transition-transform">
                  Mở công cụ cài đặt <ChevronRight className="size-3 ml-1" />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}