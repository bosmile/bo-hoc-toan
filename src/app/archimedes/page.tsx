
"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight, 
  Star, 
  Clock, 
  Target,
  Trophy
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const archimedesTopics = [
  {
    id: 1,
    title: "Chuyên đề 1: Biểu thức ba số hạng",
    formula: "A ± B ± C = D",
    description: "Rèn luyện tư duy tính toán trung gian. Bé học cách xử lý các phép tính nối tiếp nhau một cách logic.",
    difficulty: "Cơ bản",
    estimatedTime: "15-20 phút",
    url: "/archimedes/chuyen-de-1",
    status: "Sẵn sàng"
  },
  {
    id: 2,
    title: "Chuyên đề 2: Tìm x trong biểu thức",
    formula: "A + x = B / x - A = B",
    description: "Làm quen với khái niệm ẩn số. Giúp bé hiểu bản chất của phép cộng và phép trừ ngược.",
    difficulty: "Trung bình",
    estimatedTime: "20-25 phút",
    url: "/archimedes/chuyen-de-2",
    status: "Sắp ra mắt"
  },
  {
    id: 3,
    title: "Chuyên đề 3: Toán đố logic số học",
    formula: "Lời giải & Phép tính",
    description: "Áp dụng toán học vào các tình huống thực tế đời thường, phát triển ngôn ngữ và tư duy.",
    difficulty: "Nâng cao",
    estimatedTime: "30 phút",
    url: "/archimedes/chuyen-de-3",
    status: "Sắp ra mắt"
  }
]

export default function ArchimedesDirectoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">Hệ thống Archimedes</Badge>
            <Badge className="bg-accent text-accent-foreground border-none">Phổ biến nhất</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-primary mt-2">THƯ MỤC TOÁN ARCHIMEDES</h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Tổng hợp các dạng bài tập tư duy theo chương trình toán Archimedes, giúp bé phát triển trí thông minh và khả năng tính toán nhanh.
          </p>
        </div>
        <div className="hidden md:block">
           <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center rotate-3 border-2 border-primary/20">
              <Calculator className="size-10 text-primary" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {archimedesTopics.map((topic) => (
          <Card key={topic.id} className={`border-none shadow-xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden ${topic.status === "Sẵn sàng" ? "bg-white" : "bg-muted/30 grayscale-[0.5] opacity-80"}`}>
            <div className={`h-2 w-full ${topic.id === 1 ? "bg-primary" : topic.id === 2 ? "bg-blue-400" : "bg-orange-400"}`} />
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${topic.status === "Sẵn sàng" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <Target className="size-5" />
                </div>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold">{topic.difficulty}</Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">{topic.title}</CardTitle>
              <CardDescription className="font-mono text-sm bg-muted/50 p-1 px-2 rounded inline-block mt-2">
                Dạng: {topic.formula}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {topic.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {topic.estimatedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3 text-yellow-500 fill-yellow-500" />
                  {topic.id === 1 ? "4.9" : "N/A"}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t mt-4 bg-muted/5 p-4">
              {topic.status === "Sẵn sàng" ? (
                <Button asChild className="w-full font-bold group">
                  <Link href={topic.url}>
                    Vào ôn luyện ngay
                    <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button disabled variant="outline" className="w-full font-bold">
                  Sắp ra mắt
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Motivation Section */}
      <Card className="bg-primary text-primary-foreground border-none shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-48 bg-white/10 rounded-full blur-3xl" />
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
              <Trophy className="size-8 text-accent" />
              Lộ trình học tập thông minh
            </h3>
            <p className="opacity-90 max-w-lg">
              Các bài tập được thiết kế theo cấp độ tăng dần, giúp bé xây dựng nền tảng vững chắc trước khi tiếp cận các dạng toán nâng cao của kỳ thi Archimedes.
            </p>
          </div>
          <Button size="lg" variant="secondary" className="font-bold px-8 py-6 text-lg">
            Bắt đầu bài kiểm tra tổng hợp
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
