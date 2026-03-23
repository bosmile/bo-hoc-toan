"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Layers, PlusCircle, CheckCircle2 } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"

const formSchema = z.object({
  unknownVariable: z.enum(["A", "B", "C", "D"]),
  operationMode: z.enum(["plus", "minus", "mixed"]),
  numProblems: z.coerce.number().min(1).max(50),
  rangeA: z.object({ min: z.coerce.number().min(0), max: z.coerce.number().min(0) }),
  rangeB: z.object({ min: z.coerce.number().min(0), max: z.coerce.number().min(0) }),
  rangeC: z.object({ min: z.coerce.number().min(0), max: z.coerce.number().min(0) }),
  rangeD: z.object({ min: z.coerce.number().min(0), max: z.coerce.number().min(0) }),
})

const ProblemRow = ({ index, problem }: { index: number, problem: string }) => {
  const parts = problem.replace(/([+\-=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
  return (
    <div className="flex items-center gap-4 text-[20px] font-bold font-mono">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        {parts.map((part, i) => {
          if (part === '_') {
            return (
              <div key={i} className="w-20 h-14 bg-white border-2 border-primary/20 rounded-md mx-1 shrink-0" />
            );
          }
          if (part === '=') {
            return <span key={i} className="mx-2 text-primary font-bold">=</span>;
          }
          return <span key={i} className="mx-1 text-[20px] font-black">{part}</span>;
        })}
      </div>
    </div>
  );
};

export default function ChuyenDe1Page() {
  const [problems, setProblems] = React.useState<{question: string, answer: string}[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [qrUrl, setQrUrl] = React.useState<string>("")
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })

  React.useEffect(() => {
    if (problems.length > 0 && typeof window !== 'undefined') {
      const answersList = problems.map(p => p.answer)
      
      // UTF-8 friendly base64 encoding
      const text = JSON.stringify(answersList)
      const bytes = new TextEncoder().encode(text)
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
      const base64Answers = btoa(binString)
      
      const targetUrl = `${window.location.origin}/answers?q=${base64Answers}`
      setQrUrl(targetUrl)
    }
  }, [problems])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unknownVariable: "D",
      operationMode: "mixed",
      numProblems: 20,
      rangeA: { min: 10, max: 20 },
      rangeB: { min: 1, max: 10 },
      rangeC: { min: 1, max: 10 },
      rangeD: { min: 0, max: 40 },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateArchimedesMathProblems(values)
      // The flow must return an array of {question, answer}
      setProblems(result.problems as any)
      toast({
        title: "Thành công!",
        description: `Đã tạo ${result.problems.length} câu hỏi mới.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo câu hỏi. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const applyRangePreset = (max: number) => {
    form.setValue("rangeA", { min: 0, max })
    form.setValue("rangeB", { min: 0, max: Math.floor(max / 2) })
    form.setValue("rangeC", { min: 0, max: Math.floor(max / 2) })
    form.setValue("rangeD", { min: 0, max: max * 2 })
  }

  const mid = Math.ceil(problems.length / 2);
  const leftCol = problems.slice(0, mid);
  const rightCol = problems.slice(mid);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Chuyên đề 1: Biểu thức ba số hạng</h1>
          <p className="text-muted-foreground max-w-2xl">
            Dạng toán $A \pm B \pm C = D$ giúp bé rèn luyện tư duy tính toán trung gian.
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
          <Card className="border-none shadow-xl bg-card overflow-hidden">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình đề bài
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* CONFIG FORM: ranges, etc */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phạm vi nhanh</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(10)}>Phạm vi 10</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(20)}>Phạm vi 20</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(100)}>Phạm vi 100</Button>
                    </div>
                  </div>

                  <FormField control={form.control} name="unknownVariable" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vị trí ẩn số</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="A">Vị trí A</SelectItem>
                          <SelectItem value="B">Vị trí B</SelectItem>
                          <SelectItem value="C">Vị trí C</SelectItem>
                          <SelectItem value="D">Vị trí D</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="operationMode" render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Loại phép tính</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-3 gap-2">
                          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                            <RadioGroupItem value="plus" id="p1" /><Label htmlFor="p1" className="text-xs">Cộng</Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                            <RadioGroupItem value="minus" id="m1" /><Label htmlFor="m1" className="text-xs">Trừ</Label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                            <RadioGroupItem value="mixed" id="x1" /><Label htmlFor="x1" className="text-xs">Trộn</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="numProblems" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng câu hỏi</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Layers className="size-5" />}
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
                <CardDescription>Giao diện có kèm tính năng Quét QR đáp án và Watermark.</CardDescription>
              </div>
              {problems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => handlePrint()} className="gap-2 bg-primary hover:bg-primary/90 text-white font-bold">
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
                    <div className="w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative flex flex-col shadow-xl">
                      
                      {/* WATERMARK */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                         <h1 className="text-[150px] font-black -rotate-45 text-primary whitespace-nowrap">BƠ HỌC TOÁN</h1>
                      </div>

                      {/* Header */}
                      <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary rounded-lg overflow-hidden flex items-center justify-center">
                            <Image src="/logo.png" alt="Logo" width={90} height={90} className="object-contain" />
                          </div>
                          <div>
                            <h1 className="text-4xl font-black text-primary leading-none uppercase tracking-tighter">BƠ HỌC TOÁN</h1>
                            <p className="text-[12px] text-accent font-bold uppercase tracking-[0.2em] mt-2">Number Garden Edition</p>
                          </div>
                        </div>
                        <div className="text-right space-y-4 pt-2">
                          <p className="text-lg font-bold">Họ tên: <span className="inline-block w-64 border-b-2 border-dotted border-gray-400"></span></p>
                          <p className="text-lg font-bold">Lớp: <span className="inline-block w-64 border-b-2 border-dotted border-gray-400"></span></p>
                        </div>
                        
                        {/* Auto-grading QR Code corner */}
                        {qrUrl && (
                          <div className="absolute right-0 top-[110px] text-center border-2 border-primary/20 p-2 rounded-xl bg-white shadow-sm flex flex-col items-center">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(qrUrl)}`} alt="QR" className="size-[90px]" />
                             <p className="text-[9px] font-black mt-2 text-primary tracking-wider">QUÉT XEM ĐÁP ÁN</p>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <div className="mb-14 text-center relative z-10 mt-6">
                        <h2 className="text-5xl font-black text-primary mb-4 uppercase drop-shadow-sm">Tìm số còn thiếu</h2>
                        <p className="text-xl italic text-accent font-bold">Thử thách điền số thích hợp vào chỗ trống nhé!</p>
                      </div>

                      {/* Problems Grid */}
                      <div className="grid grid-cols-2 gap-x-20 gap-y-12 relative z-10 flex-1 px-8">
                        <div className="space-y-12">
                          {leftCol.map((prob, idx) => (
                             <ProblemRow key={idx} index={idx + 1} problem={prob.question} />
                          ))}
                        </div>
                        <div className="space-y-12">
                          {rightCol.map((prob, idx) => (
                             <ProblemRow key={idx} index={idx + 1 + mid} problem={prob.question} />
                          ))}
                        </div>
                      </div>

                      {/* GRADING FOOTER */}
                      <div className="mt-auto border-t-2 border-primary/20 pt-8 flex justify-between items-end relative z-10 px-8 pb-4">
                         <div className="border-2 border-primary border-dashed rounded-2xl p-6 w-[350px] text-center bg-primary/5">
                            <p className="font-black text-lg text-primary uppercase mb-6 tracking-widest">KẾT QUẢ ĐÁNH GIÁ</p>
                            <div className="flex justify-center gap-6 text-primary/20">
                               <CheckCircle2 className="size-16 stroke-[1.5]" />
                               <CheckCircle2 className="size-16 stroke-[1.5]" />
                               <CheckCircle2 className="size-16 stroke-[1.5]" />
                            </div>
                         </div>
                         <div className="text-center pb-8 pr-8">
                            <p className="text-base font-black text-muted-foreground uppercase mb-16 tracking-widest">CHỮ KÝ PHỤ HUYNH</p>
                            <span className="inline-block border-b-2 border-dotted border-gray-400 w-64"></span>
                         </div>
                      </div>

                    </div>
                  </div>

                  {/* Web Preview List (Hidden on Print) */}
                  <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-8 p-6 mt-8 border-t">
                    <h3 className="md:col-span-2 font-bold mb-2">Bản nháp sinh trên web:</h3>
                    {problems.map((problem, index) => (
                      <div key={index} className="flex items-center gap-4 text-[20px] font-bold border-b border-dashed pb-4">
                        <span className="text-xs bg-primary/10 text-primary size-6 rounded-full flex items-center justify-center shrink-0">{index + 1}</span>
                        <div className="font-mono text-[20px]">{problem.question.replace('=', ' = ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi nào</p>
                   <Button onClick={() => form.handleSubmit(onSubmit)()} variant="outline">
                      Tạo mẫu nhanh ngay
                   </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
