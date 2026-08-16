"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  Library,
  BookOpen,
  ChevronRight,
  BrainCircuit,
  Sparkles
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function HomePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto py-8">
      <div className="text-center space-y-4 mb-12">
        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 tracking-wider font-bold">ARC-MASTERY SYSTEM</Badge>
        <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Trung tâm tạo phiếu bài tập</h1>
        <p className="text-muted-foreground mt-2 font-medium max-w-xl mx-auto">
          Hệ thống thiết kế đề thi và phiếu bài tập tự động dành riêng cho học sinh tiểu học, phân vùng theo khối lớp chuyên sâu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Lớp 1 Card */}
        <Link href="/archimedes/lop-1" className="block group">
          <Card className="h-full border-2 border-border/50 hover:border-emerald-500/50 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 pb-4 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="size-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black group-hover:bg-emerald-500 group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 shadow-sm">
                  <Calculator className="size-8" />
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Khối Lớp 1</Badge>
              </div>
              <CardTitle className="text-3xl font-extrabold text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-tight mb-2">Number Garden</CardTitle>
              <CardDescription className="text-base text-slate-500 font-medium leading-relaxed">
                Nền tảng số học căn bản. Khám phá 11 chuyên đề từ phép cộng trừ có nhớ, so sánh biểu thức đến toán có lời văn và xem đồng hồ.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4">
              <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><Library className="size-4" /> 11 Chuyên đề</div>
                <div className="flex items-center gap-1.5"><Sparkles className="size-4" /> Mixer Tích hợp</div>
              </div>
              
              <div className="mt-8 flex items-center justify-between text-emerald-600 font-black group-hover:translate-x-2 transition-transform duration-300">
                <span>Vào không gian Lớp 1</span>
                <ChevronRight className="size-5" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Lớp 2 Card */}
        <Link href="/archimedes/lop-2" className="block group">
          <Card className="h-full border-2 border-border/50 hover:border-blue-600/50 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="p-8 pb-4 relative">
              <div className="flex justify-between items-start mb-6">
                <div className="size-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white group-hover:-translate-y-2 transition-all duration-300 shadow-sm">
                  <BrainCircuit className="size-8" />
                </div>
                <Badge className="bg-blue-600 hover:bg-blue-700">Khối Lớp 2</Badge>
              </div>
              <CardTitle className="text-3xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight mb-2">Logic Mastery</CardTitle>
              <CardDescription className="text-base text-slate-500 font-medium leading-relaxed">
                Tuyệt đỉnh tư duy logic. Chinh phục 6 chuyên đề nâng cao bao gồm tính ngược, toán sơ đồ đoạn thẳng, lưới logic và hình học chu vi.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 pt-4">
              <div className="flex items-center gap-4 text-sm font-bold text-slate-400">
                <div className="flex items-center gap-1.5"><Library className="size-4" /> 6 Chuyên đề</div>
                <div className="flex items-center gap-1.5"><Sparkles className="size-4" /> AI Generate</div>
              </div>
              
              <div className="mt-8 flex items-center justify-between text-blue-600 font-black group-hover:translate-x-2 transition-transform duration-300">
                <span>Vào không gian Lớp 2</span>
                <ChevronRight className="size-5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
