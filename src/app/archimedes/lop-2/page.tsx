"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  Library,
  ChevronRight,
  BrainCircuit,
  Shapes,
  BoxSelect,
  FileText,
  Scale
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const archimedesModulesLop2 = [
  { id: 1, title: "CĐ1: Số học & Phép tính", query: "Cộng, Trừ, Nhân", link: "/archimedes/lop-2/chuyen-de-1", desc: "Biến đổi tổng thành nhân, ưu tiên phép tính và bài toán tìm thành phần chưa biết.", icon: Calculator },
  { id: 2, title: "CĐ2: Đại lượng Đo lường", query: "km, m, dm, cm, mm", link: "/archimedes/lop-2/chuyen-de-2", desc: "Quy đổi đa đơn vị và thực hiện các phép tính so sánh giá trị.", icon: Scale },
  { id: 3, title: "CĐ3: Hình học & Chu vi", query: "P = a + b + c", link: "/archimedes/lop-2/chuyen-de-3", desc: "Hình thành khái niệm chu vi đa giác, đường gấp khúc chu kỳ.", icon: Shapes },
  { id: 4, title: "CĐ4: Phân số trực quan", query: "1/n phần", link: "/archimedes/lop-2/chuyen-de-4", desc: "Chia hình thành n phần bằng nhau, toán đố tìm một phần mấy.", icon: BoxSelect },
  { id: 5, title: "CĐ5: Toán có lời văn", query: "Sơ đồ đoạn thẳng", link: "/archimedes/lop-2/chuyen-de-5", desc: "Phương pháp giải toán sơ đồ 2-3 bước và luồng tính ngược.", icon: FileText },
  { id: 6, title: "CĐ6: Logic Grid", query: "Xác suất & Bảng chéo", link: "/archimedes/lop-2/chuyen-de-6", desc: "Tư duy loại suy bằng dấu tick/chéo trống, suy luận trường hợp xấu nhất.", icon: BrainCircuit },
]

export default function Grade2HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
           <Link href="/">
              <Badge variant="outline" className="text-blue-600 border-blue-600/20 bg-blue-50 mb-2 rounded-sm rounded-tr-xl tracking-wider font-bold hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-1">
                 <ChevronRight className="size-3 rotate-180" /> QUAY LẠI MODULE SELECTION
              </Badge>
           </Link>
          <h1 className="text-3xl font-black tracking-tight text-blue-600 uppercase">Toán Lớp 2 - Logic Mastery</h1>
          <p className="text-muted-foreground mt-1 font-medium">
            Phân hệ mở rộng chuyên sâu với yêu cầu đồ thị, logic loại trừ trống và cấu trúc tư duy phức hợp.
          </p>
        </div>
        <Button asChild size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700 font-bold shadow-lg shadow-blue-600/20">
          <Link href="/archimedes/lop-2/mixer">
             <Library className="size-5" />
             Bộ trộn đề tổng hợp (Mixer) Lớp 2
          </Link>
        </Button>
      </div>

      <h2 className="text-xl font-black flex items-center gap-2 pt-6 border-t uppercase text-blue-600">
        <BrainCircuit className="size-6 text-blue-600" />
        Hệ Thống 6 Chuyên Đề
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {archimedesModulesLop2.map((mod) => {
          const Icon = mod.icon
          return (
            <Link href={mod.link} key={mod.id} className="block group">
              <Card className="h-full border border-border/50 hover:border-blue-600/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-white">
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-start">
                    <div className="size-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black mb-4 group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-1 transition-all">
                      <Icon className="size-6" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] bg-muted/30 border-dashed">{mod.query}</Badge>
                  </div>
                  <CardTitle className="text-sm font-extrabold group-hover:text-blue-600 transition-colors uppercase tracking-tight">{mod.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-4">
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                    {mod.desc}
                  </p>
                </CardContent>
                <CardFooter className="px-5 pb-5 pt-0 mt-auto">
                  <div className="text-[11px] font-bold text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                    Mở công cụ cài đặt <ChevronRight className="size-3 ml-1" />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
