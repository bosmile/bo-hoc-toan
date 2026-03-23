
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, ListOrdered, PlusCircle, QrCode } from "lucide-react"
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
import { generateSequenceProblems } from "@/ai/flows/generate-sequence-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  cycleLength: z.coerce.number().min(3).max(4),
  maxCycleSum: z.coerce.number().min(10).max(100),
  numProblems: z.coerce.number().min(1).max(5),
})

const SequenceBox = ({ value }: { value: string }) => {
  const isBlank = value === '_';
  return (
    <div className={cn(
      "size-8 flex items-center justify-center border font-mono text-[13px] font-bold shadow-sm transition-all p-0",
      isBlank 
        ? "bg-white border-gray-400 rounded-md shadow-inner relative overflow-hidden" 
        : "bg-white border-gray-300 rounded-md text-slate-700"
    )}>
      {isBlank ? "" : value}
    </div>
  );
};

const SequenceProblem = ({ index, problem }: { index: number, problem: any }) => {
  const gridNumbers = problem.grid.filter((v: string) => v !== '_').map(Number);
  const knownNumbers = Array.from(new Set(gridNumbers));
  
  return (
    <div className="space-y-4 break-inside-avoid py-4">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-blue-700 tracking-tight flex items-center gap-3">
          <span className="size-7 rounded-full bg-blue-700 text-white flex items-center justify-center text-[9px]">Bài {index}</span>
          Điền số theo quy luật chu kỳ
        </h3>
        <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
          {problem.instruction}
        </p>
      </div>

      <div className="flex flex-nowrap items-center justify-center gap-0.5 p-1 bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden w-full">
        {problem.grid.map((val: string, i: number) => (
          <SequenceBox key={i} value={val} />
        ))}
      </div>

      <div className="mt-2 pt-2 bg-blue-50/5">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          Phần trình bày của em:
        </p>
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 italic font-serif flex-wrap">
            <span>Ta có:</span>
            {knownNumbers.map((num: any, idx: number) => (
              <React.Fragment key={idx}>
                <span className="text-slate-700 font-bold not-italic">{num}</span>
                <span className="mx-0.5">+</span>
              </React.Fragment>
            ))}
            <span className="font-bold text-primary not-italic">?</span>
            <span className="mx-0.5">=</span>
            <span className="text-slate-700 font-bold not-italic">{problem.cycleSum}</span>
            <span className="ml-1">nên số còn thiếu là:</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ChuyenDe5Page() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cycleLength: 3,
      maxCycleSum: 30,
      numProblems: 2,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateSequenceProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu quy luật chu kỳ.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo câu hỏi." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary uppercase">Chuyên đề 5: Quy luật dãy số chu kỳ</h1>
          <p className="text-muted-foreground max-w-2xl">
            Sử dụng tính chất tổng không đổi của chu kỳ để tìm các số còn thiếu lẩn trốn trong dãy.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild className="gap-2">
            <Link href="/archimedes">
              <PlusCircle className="size-4" />
              Bộ trộn đề
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình Dãy số
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="cycleLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Độ dài chu kỳ (N)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="3">Chu kỳ 3 số</SelectItem>
                            <SelectItem value="4">Chu kỳ 4 số</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxCycleSum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tổng một chu kỳ (S)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng câu hỏi</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <ListOrdered className="size-5" />}
                    Tạo đề ngay
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
                <CardTitle className="text-lg">Xem trước bài tập</CardTitle>
                <CardDescription>Mẫu quy luật chuẩn BƠ HỌC TOÁN.</CardDescription>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold">
                  <Printer className="size-4" />
                  In đề toán
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef}>
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
                             <Image 
                              src="https://storage.googleapis.com/demos-pipeline-artifacts-0f3d548b-3061-46c7-9857-e696cc86535d/image_15.png" 
                              alt="Logo" 
                              width={40} 
                              height={40}
                              className="object-contain"
                            />
                          </div>
                          <div>
                            <h1 className="text-3xl font-black text-primary leading-none uppercase">BƠ HỌC TOÁN</h1>
                            <p className="text-[10px] text-accent font-bold uppercase tracking-wider mt-1">Number Garden Edition</p>
                          </div>
                        </div>
                        <div className="text-right space-y-3 pt-2">
                          <p className="text-sm font-medium">Họ và tên: .....................................................</p>
                          <p className="text-sm font-medium">Ngày: ...........................................................</p>
                        </div>
                      </div>

                      <div className="mb-12 text-center">
                        <h2 className="text-4xl font-black text-primary mb-2 uppercase tracking-tight italic">Quy luật chu kỳ</h2>
                        <p className="text-lg italic text-accent font-medium font-serif">Tìm các con số đang lẩn trốn trong dãy số nhé!</p>
                      </div>

                      <div className="space-y-8">
                        {results.map((prob, idx) => (
                           <SequenceProblem key={idx} index={idx + 1} problem={prob} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="no-print space-y-12 p-6">
                    {results.map((prob, idx) => (
                       <SequenceProblem key={idx} index={idx + 1} problem={prob} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi quy luật nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
