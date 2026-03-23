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
import Link from "next/link"

const formSchema = z.object({
  cycleLength: z.coerce.number().min(3).max(4),
  maxCycleSum: z.coerce.number().min(10).max(100),
  numProblems: z.coerce.number().min(1).max(5),
})

const SequenceBox = ({ value }: { value: string }) => {
  const isBlank = value === '_';
  return (
    <div className={`size-12 flex items-center justify-center border-2 font-mono text-xl font-bold shadow-sm ${
      isBlank 
        ? "bg-blue-50 border-blue-200 rounded-lg shadow-inner" 
        : "bg-white border-gray-200 rounded-md"
    }`}>
      {isBlank ? "" : value}
    </div>
  );
};

const SequenceProblem = ({ index, problem }: { index: number, problem: any }) => {
  return (
    <div className="space-y-6 break-inside-avoid py-4">
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-blue-700">
          Bài {index}: {problem.instruction}
        </h3>
        <p className="text-sm italic text-gray-600">Em hãy hoàn thiện bảng dãy số sau:</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {problem.grid.map((val: string, i: number) => (
          <SequenceBox key={i} value={val} />
        ))}
      </div>

      <div className="pt-4 border-2 border-dashed border-gray-100 rounded-xl p-6 bg-gray-50/30">
        <p className="text-sm font-bold text-gray-400 italic mb-10 flex items-center gap-2">
          <span className="text-xl">✍️</span> Lời giải của em:
        </p>
        <div className="space-y-4">
          <div className="h-px bg-gray-200 w-full border-t border-dotted border-gray-400" />
          <div className="h-px bg-gray-200 w-full border-t border-dotted border-gray-400" />
          <div className="h-px bg-gray-200 w-full border-t border-dotted border-gray-400" />
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
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu quy luật.` })
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
            Điền số vào dãy dựa trên tính chất tổng của các số hạng liên tiếp.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/archimedes">
            <PlusCircle className="size-4" />
            Vào Bộ trộn đề
          </Link>
        </Button>
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
                        <FormLabel>Độ dài chu kỳ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="3">3 số liên tiếp</SelectItem>
                            <SelectItem value="4">4 số liên tiếp</SelectItem>
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
                        <FormLabel>Tổng một chu kỳ (Max)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng câu hỏi (Max 2 trang/lần)</FormLabel>
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
                <CardDescription>Mẫu quy luật MathLab.</CardDescription>
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
                      <div className="flex justify-between items-start mb-10 border-b-2 border-blue-600 pb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg"><Settings2 className="size-8 text-white" /></div>
                          <div><h1 className="text-3xl font-black text-blue-600 leading-none">MathLab</h1><p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Number Garden Edition</p></div>
                        </div>
                        <div className="text-right space-y-3 pt-2">
                          <p className="text-sm font-medium">Họ và tên: .....................................................</p>
                          <p className="text-sm font-medium">Ngày: ...........................................................</p>
                        </div>
                      </div>

                      <div className="mb-12 text-center">
                        <h2 className="text-4xl font-black text-blue-600 mb-2 uppercase tracking-tight">Quy luật chu kỳ</h2>
                        <p className="text-lg italic text-blue-400 font-medium">Tìm các con số đang lẩn trốn trong dãy số nhé!</p>
                      </div>

                      <div className="space-y-16">
                        {results.map((prob, idx) => (
                           <SequenceProblem key={idx} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <div className="absolute bottom-[15mm] left-[15mm] right-[15mm] flex justify-between items-end border-t border-gray-100 pt-8">
                         <p className="text-[10px] text-gray-400">© 2024 MathLab Educational Tools.</p>
                         <QrCode className="size-10 text-gray-200" />
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
