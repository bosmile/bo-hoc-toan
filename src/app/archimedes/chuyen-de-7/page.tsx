"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Clock, LayoutDashboard, Brain, CheckCircle2 } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { generateClockProblems } from "@/ai/flows/generate-clock-problems"
import { AnalogClock } from "@/components/archimedes/analog-clock"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"

const formSchema = z.object({
  difficulty: z.enum(['hours', 'half-hours', 'quarter-hours', 'five-minutes', 'any-minutes']),
  type: z.enum(['read', 'draw', 'mixed']),
  numProblems: z.coerce.number().min(1).max(20),
})

const ClockProblemComponent = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  const isRead = problem.type === 'read';
  const showHands = isRead || isAnswer;

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-2xl bg-white shadow-sm break-inside-avoid print:shadow-none print:border-none">
      <div className="flex items-center gap-3 w-full">
        <span className="shrink-0 size-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
          {index}
        </span>
        <p className="text-sm font-bold text-slate-700 leading-tight">
          {isRead ? "Đồng hồ chỉ mấy giờ?" : "Hãy vẽ kim đồng hồ cho đúng:"}
        </p>
      </div>

      <div className="relative py-2">
         <AnalogClock 
            hour={problem.hour} 
            minute={problem.minute} 
            showHands={showHands} 
            size={130}
            hourHandColor={isAnswer && !isRead ? "#ef4444" : "#1e293b"}
            minuteHandColor={isAnswer && !isRead ? "#ef4444" : "#1e293b"}
         />
      </div>

      <div className="w-full flex justify-center pt-2">
        {isRead ? (
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-24 h-10 border-2 border-slate-300 rounded-lg flex items-center justify-center text-xl font-black font-mono",
              isAnswer ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50"
            )}>
              {isAnswer ? problem.displayTime : ""}
            </div>
          </div>
        ) : (
          <div className={cn(
            "px-6 py-2 border-2 rounded-xl text-3xl font-black font-mono tracking-wider",
            isAnswer ? "bg-slate-50 text-slate-400 border-slate-200" : "bg-primary/5 text-primary border-primary/20"
          )}>
            {problem.displayTime}
          </div>
        )}
      </div>
    </div>
  );
};

const SampleClockComponent = () => (
  <div className="flex flex-row items-center justify-center gap-8 p-4 border-2 border-dashed border-primary/30 rounded-3xl bg-primary/5 mb-6 break-inside-avoid no-print:shadow-sm">
    <div className="bg-white p-3 rounded-full shadow-inner border border-slate-100 shrink-0">
      <AnalogClock 
        hour={10} 
        minute={10} 
        showHands={false} 
        size={180} 
        showMinuteLabels={true}
      />
    </div>

    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-primary text-white p-2.5 rounded-xl shadow-md">
          <Clock className="size-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-primary uppercase italic leading-none">Hình mẫu: Cách xem phút</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Ghi nhớ các mốc 5 phút ở vòng ngoài</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-2 rounded-full bg-primary" />
          <p className="text-xs font-bold text-slate-600">Mỗi số trên đồng hồ tương ứng <span className="text-primary font-black">+5 phút</span></p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="size-2 rounded-full bg-blue-600" />
          <p className="text-xs font-bold text-slate-600">Vòng ngoài hiển thị <span className="text-blue-600 font-black">Số phút lẻ</span></p>
        </div>
      </div>
    </div>
  </div>
)

export default function ClockSpecialTopicPage() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      difficulty: 'hours',
      type: 'read',
      numProblems: 4,
    },
  })

  const currentDifficulty = form.watch('difficulty');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateClockProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} bài tập về đồng hồ.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo bài tập." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header section (No Print) */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">CĐ7: Thời Gian & Đồng Hồ</h1>
          <p className="text-muted-foreground max-w-2xl font-medium">
            Khám phá quy luật thời gian qua các thử thách xem đồng hồ analog và vẽ kim chính xác.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild className="gap-2 font-bold shadow-sm">
            <Link href="/archimedes">
              <LayoutDashboard className="size-4" /> Bảng điều khiển
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Column */}
        <div className="no-print lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" /> Cấu hình bài tập
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Mức độ (Intervals)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-primary/20 font-semibold text-primary bg-slate-50">
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="hours" className="font-medium">Chỉ xem giờ đúng (1:00, 2:00...)</SelectItem>
                            <SelectItem value="half-hours" className="font-medium">Giờ rưỡi (1:30, 2:30...)</SelectItem>
                            <SelectItem value="quarter-hours" className="font-medium">Khoảng 15 phút (1:15, 1:45...)</SelectItem>
                            <SelectItem value="five-minutes" className="font-medium">Khoảng 5 phút</SelectItem>
                            <SelectItem value="any-minutes" className="font-medium">Phút bất kỳ (Nâng cao)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Hình thức bài tập</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-primary/20 font-semibold text-primary bg-slate-50">
                              <SelectValue placeholder="Chọn hình thức" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="read">Đọc giờ (Nhìn đồng hồ viết số)</SelectItem>
                            <SelectItem value="draw">Vẽ kim (Nhìn số vẽ kim)</SelectItem>
                            <SelectItem value="mixed">Trộn cả hai loại</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Số lượng bài (Max 20)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-12 font-bold text-lg bg-slate-50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:scale-[1.01]" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <Clock className="size-6" />}
                    TẠO BÀI TẬP
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-slate-900 text-white overflow-hidden">
             <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Brain className="size-5 text-accent" />
                   </div>
                   <h3 className="font-black text-lg uppercase tracking-tighter">Mẹo học tập</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Trẻ nhỏ nên bắt đầu với <span className="text-white font-bold">Giờ đúng</span> trước khi chuyển sang <span className="text-white font-bold">Giờ rưỡi</span>. Hãy khuyến khích trẻ quan sát cả kim ngắn (giờ) và kim dài (phút).
                </p>
             </div>
          </Card>
        </div>

        {/* Preview & Print Column */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-slate-50/50 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Printer className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-800">Xem trước Phiếu</CardTitle>
                  <CardDescription className="font-medium">Thiết kế tối ưu cho in ấn đen trắng.</CardDescription>
                </div>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold h-11 px-6 shadow-md shadow-primary/20">
                  <Printer className="size-4" /> In phiếu ngay
                </Button>
              )}
            </CardHeader>

            <CardContent className="flex-1 p-0 relative bg-slate-50/30">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef} className="bg-white">
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <PrintHeader 
                        title="Phiếu Học Tập: Xem Đồng Hồ" 
                        subtitle="Thời gian là vàng - Cùng Bơ chinh phục từng giây phút!" 
                      />

                      {currentDifficulty === 'five-minutes' && (
                        <div className="mt-6">
                          <SampleClockComponent />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-x-8 gap-y-8 mt-4">
                        {results.map((prob, idx) => (
                          <ClockProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <PrintFooter />

                      {/* Answer Key Page */}
                      <div className="page-break pt-12 border-t-4 border-dashed border-slate-200 mt-12">
                         <div className="mb-8 text-center">
                            <h2 className="text-3xl font-black text-primary uppercase">ĐÁP ÁN CHI TIẾT</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">CĐ7: Thời Gian & Đồng Hồ</p>
                         </div>
                         <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                            {results.map((prob, idx) => (
                              <ClockProblemComponent key={`ans-${prob.id}`} index={idx + 1} problem={prob} isAnswer />
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* On-screen Preview */}
                  <div className="no-print p-4">
                    {currentDifficulty === 'five-minutes' && <SampleClockComponent />}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.map((prob, idx) => (
                        <ClockProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-8 p-12">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                      <Clock className="size-16 text-primary/20" />
                   </div>
                   <div className="text-center space-y-2">
                     <p className="font-black text-2xl text-slate-800 uppercase">Chưa có bài tập!</p>
                     <p className="font-medium text-slate-500 max-w-xs">Chọn mức độ và nhấn nút để bắt đầu hành trình chinh phục thời gian.</p>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
