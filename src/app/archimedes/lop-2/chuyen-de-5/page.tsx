"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Layers, FileText, CheckCircle2, ChevronDown, Wand2 } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

const formSchema = z.object({
  fewShotExample: z.string().min(10, "Cần cung cấp ít nhất một bài mẫu ngắn gọn."),
  numProblems: z.coerce.number().min(1).max(10),
  difficulty: z.enum(["easy", "hard"]),
})

const WordProblemRowLop2 = ({ index, problem }: { index: number, problem: any }) => {
  return (
    <div className="col-span-full py-6 border-b border-dashed border-slate-300 break-inside-avoid print:py-8">
      <div className="flex flex-col gap-4">
        {/* Problem Header */}
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-sans font-bold text-[18px] shrink-0 mt-0.5 whitespace-nowrap">Bài {index}:</span>
          <p className="text-[18px] font-bold text-slate-800 leading-snug">{problem.question}</p>
        </div>

        {/* Content Body */}
        <div className="space-y-4 pt-4 pr-12">
           <div className="w-full relative bg-white">
              <div className="space-y-0 w-full mb-1">
                 <div className="border-b border-transparent h-7 w-full flex items-center">
                    <span className="text-[16px] font-black italic text-blue-600 tracking-wider">
                       BÀI GIẢI:
                    </span>
                 </div>
              </div>
              
              <div className="flex flex-col gap-8 w-full mt-4">
                 <div className="border-b-2 border-dotted border-slate-400 h-8 w-full" />
                 <div className="border-b-2 border-dotted border-slate-400 h-8 w-full" />
                 <div className="border-b-2 border-dotted border-slate-400 h-8 w-full" />
                 <div className="border-b-2 border-dotted border-slate-400 h-8 w-full" />
              </div>
              <div className="flex justify-end items-center gap-4 mt-8">
                 <span className="text-[16px] font-black text-blue-600 uppercase tracking-tighter">ĐÁP SỐ:</span>
                 <div className="border-2 border-slate-400 w-32 h-10 rounded-lg bg-white" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

export default function Grade2WordProblemPage() {
  const [problems, setProblems] = React.useState<{question: string, answer: string}[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fewShotExample: "Lớp 2A có 30 học sinh. Lớp 2B có nhiều hơn lớp 2A 5 học sinh. Hỏi lớp 2B có bao nhiêu học sinh?",
      numProblems: 4,
      difficulty: "easy",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Simulate API response for now until AI flow is fully integrated
      await new Promise(r => setTimeout(r, 2000))
      
      const mockResult = Array.from({ length: values.numProblems }).map((_, i) => ({
         question: `Ngày thứ ${i+1}, Mai gấp được ${20 + i*5} ngôi sao. Ngày thứ ${i+2}, Mai gấp được nhiều hơn ngày thứ ${i+1} là ${3 + i} ngôi sao. Hỏi ngày thứ ${i+2} Mai gấp được bao nhiêu ngôi sao?`,
         answer: "..."
      }))
      
      setProblems(mockResult)
      toast({
        title: "Thành công!",
        description: `Đã tạo ${values.numProblems} bài toán đố dựa theo bài mẫu.`,
      })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo bài tập" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-blue-600 border-blue-600/20 bg-blue-50">Toán Lớp 2</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-blue-600">CĐ 5: Toán Lời Văn (Sơ đồ đoạn thẳng)</h1>
          <p className="text-muted-foreground max-w-2xl">
            Sinh cấu trúc bài toán Nhiều hơn/Ít hơn. In kèm khu vực trống để học sinh vẽ sơ đồ.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/archimedes/lop-2">
            Quay lại Lớp 2
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
             
             {/* HƯỚNG DẪN TƯ DUY */}
             <div className="bg-blue-600 p-4 text-white">
                <div className="flex items-center gap-2 font-black mb-1">
                   <BrainCircuit className="size-5" /> Hướng dẫn tư duy
                </div>
                <p className="text-sm font-medium text-blue-100">
                   Với bài toán "Nhiều hơn/Ít hơn", hãy rèn cho bé thói quen: Gạch chân từ khóa - Vẽ sơ đồ đoạn thẳng - Tính toán. Cần xác định đối tượng làm chuẩn trước khi vẽ đồ thị.
                </p>
             </div>

            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-blue-600" />
                Cấu hình Few-Shot
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField control={form.control} name="fewShotExample" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bài toán mẫu (Few-Shot Prompt)</FormLabel>
                      <FormControl>
                         <textarea
                            {...field}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Nhập mẫu bài toán có lời văn, AI sẽ nhận diện các thực thể (tên, số lượng) và đảo biến thể..."
                         />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="numProblems" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng (Khuyên dùng: 4 bài/trang)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Wand2 className="size-5" />}
                    Tạo đề bài bằng AI
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
                <CardTitle className="text-lg">Trang in A4 (Sơ đồ đoạn thẳng)</CardTitle>
              </div>
              {problems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => handlePrint()} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold">
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
                      
                      {/* WATERMARK BẢN_IN LỚP 2 */}
                      <div className="absolute inset-x-0 inset-y-0 pointer-events-none z-0 flex flex-col items-center justify-center gap-[150px] opacity-[0.03]">
                         <h1 className="text-[50px] font-black whitespace-nowrap pt-32">VẼ SƠ ĐỒ ĐOẠN THẲNG TẠI ĐÂY</h1>
                         <h1 className="text-[50px] font-black whitespace-nowrap">VẼ SƠ ĐỒ ĐOẠN THẲNG TẠI ĐÂY</h1>
                         <h1 className="text-[50px] font-black whitespace-nowrap">VẼ SƠ ĐỒ ĐOẠN THẲNG TẠI ĐÂY</h1>
                      </div>

                      <PrintHeader 
                        title="GIẢI TOÁN CÓ LỜI VĂN" 
                        subtitle="Em hãy đọc kỹ đề, tóm tắt bằng sơ đồ đoạn thẳng và trình bày bài giải!" 
                      />

                      <div className="flex flex-col relative z-10 flex-1 px-4 divide-y divide-dashed divide-slate-300">
                         {problems.map((prob, idx) => (
                            <WordProblemRowLop2 key={idx} index={idx + 1} problem={prob} />
                         ))}
                      </div>

                      <PrintFooter />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <FileText className="size-12 text-blue-200" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa nhập bài mẫu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
