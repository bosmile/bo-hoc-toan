
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, PlusCircle, FileText, Sparkles, Trash2 } from "lucide-react"
import { useReactToPrint } from "react-to-print"

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
import { generateWordProblems } from "@/ai/flows/generate-word-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import Link from "next/link"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  maxSum: z.coerce.number().min(10).max(1000),
  numProblems: z.coerce.number().min(1).max(20),
})

const MathGrid = ({ rows = 1, cols = 15, children }: { rows?: number, cols?: number, children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative w-fit">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="size-7 border border-blue-200 squared-box-grid bg-white opacity-50 flex-shrink-0" />
          ))}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center px-4 font-mono text-[16px]">
        {children}
      </div>
    </div>
  );
};

const WordProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  return (
    <div className="col-span-full py-8 border-b border-dashed border-slate-200 break-inside-avoid">
      <div className="flex flex-col gap-6">
        {/* Problem Header */}
        <div className="flex items-start gap-3">
          <span className="text-blue-600 font-sans font-bold text-[18px] shrink-0 mt-0.5">Bài {index}.</span>
          <p className="text-[18px] font-bold text-slate-800 leading-relaxed tracking-tight">{problem.problemText}</p>
        </div>

        {/* Content Body */}
        <div className="space-y-6 pl-10">
          {problem.solutionLine && (
             <p className="text-[16px] font-bold text-pink-600 italic">{problem.solutionLine}</p>
          )}

          <div className="flex items-center gap-3">
             <MathGrid rows={problem.templateId.includes('two_digit') ? 2 : 1} cols={20}>
                {isAnswer && <span className="text-red-600 font-black tracking-[0.5em] text-[18px]">{problem.correctAnswer}</span>}
             </MathGrid>
             {problem.unit && <span className="text-[16px] font-bold text-pink-600">({problem.unit})</span>}
          </div>

          <div className="flex items-center gap-3">
             <p className="text-[16px] font-bold text-pink-600">{problem.answerPrefix}</p>
             <div className="size-10 border-2 border-blue-300 rounded-md squared-box-grid flex items-center justify-center bg-white shadow-inner">
                {isAnswer && <span className="text-red-600 font-black text-[18px]">{problem.correctAnswer}</span>}
             </div>
             {problem.answerSuffix && <p className="text-[16px] font-bold text-pink-600">{problem.answerSuffix}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChuyenDe10Page() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxSum: 100,
      numProblems: 5,
    },
  })

  // Persistence
  const formValues = form.watch()
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('archimedes_cd10_settings')
      if (saved) {
        try {
          form.reset(JSON.parse(saved))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [form])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('archimedes_cd10_settings', JSON.stringify(formValues))
    }
  }, [formValues])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const { generateAllLibraryWordProblems } = await import("@/ai/flows/generate-word-problems")
      const result = await generateAllLibraryWordProblems(values.maxSum)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã hiển thị ${result.problems.length} dạng bài mẫu trong thư viện.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tải kho đề mẫu." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 pt-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase leading-tight">Chuyên đề 10: Toán có lời văn</h1>
          <p className="text-muted-foreground max-w-2xl font-medium">
             Tự động sinh các bài toán đố dựa trên mẫu có sẵn, giữ nguyên lời văn và thay đổi số liệu.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2 font-bold shadow-sm">
          <Link href="/archimedes">
            <PlusCircle className="size-4" />
            Vào Bộ trộn đề
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="no-print lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
             <div className="h-1.5 w-full bg-orange-600" />
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg flex items-center gap-2 font-black text-primary uppercase tracking-tight">
                <Settings2 className="size-5" />
                Kho lưu trữ mẫu bài tập
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 px-6 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="maxSum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Độ khó số liệu (Max)</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} className="h-12 font-bold focus-visible:ring-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Số lượng câu (Tối đa 20)</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} className="h-12 font-bold focus-visible:ring-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black uppercase shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <FileText className="size-6" />}
                    Hiển thị tất cả 14 dạng bài
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl min-h-[700px] flex flex-col bg-white overflow-hidden ring-1 ring-black/5">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase">Xem trước bản in A4</CardTitle>
                <CardDescription className="font-medium italic text-orange-600">Mô phỏng trình bày trong sách giáo khoa.</CardDescription>
              </div>
              <div className="flex gap-2">
                {results.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={() => setResults([])} className="size-12 text-destructive"><Trash2 className="size-6" /></Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-white">
              {results.length > 0 ? (
                <div className="p-0">
                    <div className="flex-1 pt-6 px-4">
                      <div className="grid grid-cols-1">
                        {results.map((item, idx) => (
                          <WordProblemRow key={idx} index={idx + 1} problem={item} />
                        ))}
                      </div>
                    </div>

                    <div className="pt-10 px-8 border-t-4 border-double border-primary/20 mt-20">
                       <h2 className="text-2xl font-black text-primary border-b-2 border-primary mb-8 pb-3 text-center uppercase tracking-widest italic font-playfair">Gợi ý cách giải (Thư viện)</h2>
                        <div className="grid grid-cols-1">
                          {results.map((item, idx) => (
                            <WordProblemRow key={idx} index={idx + 1} problem={item} isAnswer />
                          ))}
                        </div>
                    </div>

                  <div className="no-print p-8 space-y-4">
                     <h3 className="font-black text-xs text-muted-foreground uppercase tracking-widest border-b pb-2">Bản nháp sinh trên web:</h3>
                    {results.map((item, idx) => (
                      <WordProblemRow key={idx} index={idx + 1} problem={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-muted-foreground gap-8 p-12">
                   <div className="size-40 rounded-full bg-orange-50 flex items-center justify-center relative">
                      <FileText className="size-20 text-orange-200" />
                      <div className="absolute inset-0 border-4 border-dashed border-orange-200 rounded-full animate-[spin_15s_linear_infinite]" />
                   </div>
                   <div className="text-center space-y-2">
                      <p className="font-black text-3xl text-orange-200 uppercase tracking-tighter">Sẵn sàng tạo đề</p>
                      <p className="text-lg font-medium text-slate-400">Hãy nhấn nút "Tạo đề bài" để bắt đầu thiết kế bài tập đố.</p>
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
