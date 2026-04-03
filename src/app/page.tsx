"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  FilePlus, 
  Settings2,
  BookOpen,
  Library,
  ChevronRight,
  Clock
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
  { id: 6, title: "CĐ6: Thử thách Sudoku", query: "Bảng 4x4, 6x6, 9x9", link: "/archimedes/chuyen-de-6", desc: "Rèn luyện logic loại trừ với các bảng Sudoku từ dễ đến khó." },
  { id: 7, title: "CĐ7: Xem đồng hồ", query: "Analog & Digital", link: "/archimedes/chuyen-de-7", desc: "Học cách đọc giờ đúng, giờ rưỡi và vẽ kim đồng hồ tương ứng." },
  { id: 8, title: "CĐ8: Toán Tư Duy", query: "Logic & IQ Math", link: "/archimedes/chuyen-de-8", desc: "Bộ 7 template toán tư duy siêu trí tuệ, tự động sinh đáp án dựa trên logic." },
  { id: 9, title: "CĐ9: Cân bằng phép cộng", query: "[ ] + [ ] = [ ] + [ ] = [ ]", link: "/archimedes/chuyen-de-9", desc: "Thử thách điền các số cho trước vào dãy các phép cộng có tính chất bắc cầu." },
  { id: 10, title: "CĐ10: Toán có lời văn", query: "Bài toán đố", link: "/archimedes/chuyen-de-10", desc: "Tự động sinh các bài toán đố dựa trên mẫu có sẵn, giữ nguyên lời văn và thay đổi số liệu." },
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
                    {mod.id === 7 ? <Clock className="size-6" /> : mod.id === 8 ? <BookOpen className="size-6" /> : <Calculator className="size-6" />}
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