"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, BookOpen, LayoutDashboard, Brain, Sparkles } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import { generateSingaporeMath, SingaporeMathProblem } from "@/ai/flows/generate-singapore-math"

const formSchema = z.object({
  numProblems: z.coerce.number().min(1).max(10),
  topic: z.string().min(1),
  difficulty: z.enum(['Dễ', 'Trung bình', 'Khó']),
})

const BarModelHint = ({ hint }: { hint: SingaporeMathProblem['bar_model_hint'] }) => (
  <div className="mt-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-2">
      <Brain className="size-3" /> Gợi ý Sơ đồ Bar Model ({hint.model_type})
    </div>
    <div className="flex flex-wrap gap-1 items-center mb-2">
      {Array.from({ length: Math.min(hint.number_of_blocks[0] || 1, 10) }).map((_, i) => (
        <div key={i} className="size-8 border-2 border-blue-400 bg-white rounded flex items-center justify-center font-bold text-blue-700 text-xs shadow-sm">
          {hint.value_per_block}
        </div>
      ))}
      <span className="text-xs font-bold text-blue-400 ml-1">...</span>
    </div>
    <p className="text-[11px] text-slate-500 italic font-medium">
      Tìm: <span className="text-blue-700 font-bold">{hint.unknown_variable}</span>
    </p>
  </div>
)

const SingaporeProblemComponent = ({ index, problem, isAnswer = false }: { index: number, problem: SingaporeMathProblem, isAnswer?: boolean }) => {
  return (
    <div className="flex flex-col bg-white break-inside-avoid mb-6 print:mb-4 text-slate-800">
      <div className="flex items-start gap-1.5 w-full leading-tight">
        <span className="shrink-0 font-bold text-primary text-[15px] mt-0.5 min-w-[24px] text-right">
          {index}.
        </span>
        
        <div className="flex-1 space-y-3">
          <p className="text-[16px] font-bold text-slate-800 text-left whitespace-pre-wrap leading-snug">
            {problem.question_text}
          </p>
          
          {!isAnswer && (
            <>
              <div className="space-y-1 w-full border-t border-dotted border-slate-200 pt-2">
                <div className="border-b border-dotted border-slate-300 h-8 w-full" />
                <div className="border-b border-dotted border-slate-300 h-8 w-full" />
                <div className="border-b border-dotted border-slate-300 h-8 w-full" />
              </div>
              <div className="flex justify-between items-center mt-2 px-2">
                 <div className="max-w-[60%]">
                    <BarModelHint hint={problem.bar_model_hint} />
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ĐÁP SỐ:</span>
                    <div className="border border-slate-300 w-28 h-10 rounded-xl bg-white shadow-inner" />
                 </div>
              </div>
            </>
          )}
          
          {isAnswer && (
            <div className="mt-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl space-y-3 print:bg-white text-xs">
               <div className="text-[10px] font-black text-primary uppercase italic tracking-widest border-b border-primary/10 pb-2 mb-2 block">
                  HƯỚNG DẪN GIẢI CHI TIẾT:
               </div>
               <div className="space-y-1.5">
                  {problem.step_by_step_explanation.map((step, i) => (
                    <p key={i} className="text-[14px] text-slate-700 leading-tight font-medium">• {step}</p>
                  ))}
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-primary/10 mt-3">
                  <span className="text-[14px] font-black text-primary uppercase italic">ĐÁP ÁN: <span className="bg-primary text-white px-3 py-1 rounded-lg not-italic ml-2">{problem.correct_answer}</span></span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SingaporeMathPage() {
  const [results, setResults] = React.useState<SingaporeMathProblem[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numProblems: 3,
      topic: "Lego",
      difficulty: "Trung bình"
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const res = await generateSingaporeMath(values);
      setResults(res.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${res.problems.length} bài toán Singapore.` })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi AI", description: error.message || "Không thể kết nối với Gemini API." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Singapore Math Method</Badge>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase leading-tight italic">CĐ11: GIẢI TOÁN TƯ DUY SINGAPORE</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            Sử dụng phương pháp CPA và Sơ đồ Bar Model (AI Powered). <Sparkles className="size-4 text-orange-500 fill-orange-500" />
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2 font-bold shadow-sm">
          <Link href="/archimedes">
            <LayoutDashboard className="size-4" /> Bảng điều khiển
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="no-print lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b bg-primary/5 p-6">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" /> Cấu hình AI Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Chủ đề bài toán</FormLabel>
                        <FormControl>
                          <Input placeholder="Lego, Khủng long, Táo, Kẹo..." {...field} className="h-12 font-bold bg-slate-50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-slate-700">Độ khó</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 font-bold bg-slate-50">
                                <SelectValue placeholder="Chọn độ khó" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dễ" className="font-bold text-green-600">Dễ</SelectItem>
                              <SelectItem value="Trung bình" className="font-bold text-orange-600">Trung bình</SelectItem>
                              <SelectItem value="Khó" className="font-bold text-red-600">Khó</SelectItem>
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
                          <FormLabel className="font-bold text-slate-700">Số lượng</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} className="h-12 font-bold bg-slate-50" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black bg-primary hover:bg-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <Sparkles className="size-6" />}
                    {isLoading ? "ĐANG TẠO..." : "TẠO TOÁN AI"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-slate-900 text-white p-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                   <Brain className="size-5" />
                </div>
                <h3 className="font-black text-lg uppercase italic tracking-tighter">Singapore AI</h3>
             </div>
             <p className="text-slate-400 text-xs leading-relaxed font-medium">
               Mô hình áp dụng phương pháp <strong>Bar Modeling</strong> giúp học sinh trực quan hóa các đại lượng toán học trước khi giải.
             </p>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8">
          <Card className="border-none shadow-2xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-slate-50/50 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Printer className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-800 uppercase italic">Preview Phiếu In</CardTitle>
                  <CardDescription className="font-medium">Chuyên đề 11: Giải toán có lời văn (CPA).</CardDescription>
                </div>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold h-11 px-6 shadow-md shadow-primary/20">
                  <Printer className="size-4" /> In phiếu ngay
                </Button>
              )}
            </CardHeader>

            <CardContent className="flex-1 p-0 relative bg-slate-100/30">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef} className="bg-white">
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <PrintHeader title="Phiếu Giải Toán Singapore" subtitle="Tư duy trực quan - Bar Modeling" />

                      <div className="mt-8 space-y-12">
                        {results.map((prob, idx) => (
                          <SingaporeProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <PrintFooter />

                      <div className="page-break pt-12 border-t-8 border-slate-100 mt-10">
                         <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-orange-500 uppercase italic leading-none">HƯỚNG DẪN GIẢI</h2>
                            <p className="text-slate-400 font-bold tracking-widest text-[10px] mt-2">CĐ11: Singapore Math Method</p>
                         </div>
                         <div className="space-y-8">
                            {results.map((prob, idx) => (
                              <SingaporeProblemComponent key={`ans-${prob.id}`} index={idx + 1} problem={prob} isAnswer />
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="no-print space-y-8">
                    {results.map((prob, idx) => (
                      <SingaporeProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-8 p-12">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center animate-bounce">
                      <BookOpen className="size-16 text-primary/30" />
                   </div>
                   <div className="text-center space-y-3">
                     <p className="font-black text-2xl text-slate-800 uppercase italic">Sẵn sàng sáng tạo!</p>
                     <p className="font-medium text-slate-500">Cung cấp chủ đề và nhấn <strong>Tạo Toán AI</strong> để bắt đầu.</p>
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
