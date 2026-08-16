"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Layers, FileText, Globe } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import Link from "next/link"
import { generateTimoProblems } from "@/ai/flows/generate-timo-problems"

const formSchema = z.object({
  category: z.enum(["All", "Logical Thinking", "Arithmetic", "Number Theory", "Geometry", "Combinatorics"]),
  numProblems: z.coerce.number().min(1).max(30),
})

const TimoProblemRow = ({ index, problem }: { index: number, problem: any }) => {
  return (
    <div className="flex flex-col gap-2 border-b border-dashed pb-4 mb-4 break-inside-avoid">
      <div className="flex gap-2">
        <span className="font-bold text-lg min-w-[28px]">{index}.</span>
        <div className="flex-1 space-y-1">
          <p className="font-bold text-[16px] text-slate-900 leading-snug">{problem.questionEn}</p>
          <p className="italic text-[14px] text-slate-600 leading-snug">({problem.questionVn})</p>
        </div>
      </div>
      <div className="flex justify-end mt-2">
        <div className="w-32 h-10 border-2 border-slate-400 rounded-md bg-slate-50 flex items-center justify-center">
          <span className="text-transparent print:text-transparent group-hover:text-slate-400">{problem.answer}</span>
        </div>
      </div>
    </div>
  );
};

export default function TimoGrade1Page() {
  const [problems, setProblems] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "All",
      numProblems: 25,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateTimoProblems(values)
      setProblems(result.problems)
      toast({
        title: "Thành công!",
        description: `Đã tạo ${result.problems.length} câu hỏi chuẩn cấu trúc TIMO.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo đề. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-red-600 border-red-600/20 bg-red-50">Luyện Thi Quốc Tế</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">TIMO Grade 1 (Vòng Quốc Gia)</h1>
          <p className="text-muted-foreground max-w-2xl">
            Ngân hàng đề thi tiếng Anh (kèm gợi ý tiếng Việt) dựa trên cấu trúc đề thi chính thức TIMO Kindergarten / Grade 1.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/archimedes/lop-1">
            Quay lại Lớp 1
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-red-600" />
                Thiết lập Đề thi
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField control={form.control} name="category" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chủ đề (Topic)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="All">Mix Random (Tất cả)</SelectItem>
                          <SelectItem value="Logical Thinking">Logical Thinking (Tư duy Logic)</SelectItem>
                          <SelectItem value="Arithmetic">Arithmetic (Số học)</SelectItem>
                          <SelectItem value="Number Theory">Number Theory (Lý thuyết số)</SelectItem>
                          <SelectItem value="Geometry">Geometry (Hình học)</SelectItem>
                          <SelectItem value="Combinatorics">Combinatorics (Tổ hợp)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="numProblems" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng câu hỏi (Đề chuẩn: 25 câu)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold bg-red-600 hover:bg-red-700" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Globe className="size-5" />}
                    Sinh Đề Chuẩn TIMO
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Trang in A4 Đề thi TIMO</CardTitle>
                <CardDescription>Bao gồm tiếng Anh gốc và chú thích tiếng Việt. Dành cho học sinh làm trực tiếp.</CardDescription>
              </div>
              {problems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => handlePrint()} className="gap-2 bg-red-600 hover:bg-red-700 text-white font-bold">
                    <Printer className="size-4" />
                    In đề toán
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setProblems([])} className="text-destructive">
                    <Trash2 className="size-5" />
                  </Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 p-0 relative bg-white">
              {problems.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef}>
                    <div className="w-[210mm] min-h-[297mm] mx-auto pt-[15mm] px-[15mm] pb-[10mm] bg-white text-black font-sans relative flex flex-col origin-top shadow-xl print:shadow-none print:transform-none" style={{ transform: 'scale(0.85)', marginBottom: '-10%' }}>                 
                      
                      <PrintHeader 
                        title="THAILAND INTERNATIONAL MATHEMATICAL OLYMPIAD" 
                        subtitle="KINDERGARTEN / GRADE 1 - HEAT ROUND" 
                      />

                      <div className="flex flex-col relative z-10 flex-1 px-8 pt-6">
                         {problems.map((prob, idx) => (
                            <TimoProblemRow key={idx} index={idx + 1} problem={prob} />
                         ))}
                      </div>

                      {/* Web Preview Answer Key (Hidden on Print) */}
                      <div className="hidden mt-8 p-4 bg-muted rounded-lg text-sm border">
                         <h4 className="font-bold mb-2">Đáp án (Không in ra giấy):</h4>
                         <div className="grid grid-cols-5 gap-2">
                           {problems.map((p, i) => (
                             <div key={i}><span className="font-bold">{i+1}.</span> {p.answer}</div>
                           ))}
                         </div>
                      </div>

                      <PrintFooter />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-red-50 flex items-center justify-center">
                      <Globe className="size-12 text-red-200" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa sinh đề thi nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
