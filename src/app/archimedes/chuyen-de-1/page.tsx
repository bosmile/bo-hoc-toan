
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Layers, QrCode } from "lucide-react"
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
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
    <div className="flex items-center gap-4 text-xl font-bold font-mono">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        {parts.map((part, i) => {
          if (part === '_') {
            return (
              <div key={i} className="w-14 h-10 bg-blue-50 border-2 border-blue-100 rounded-md mx-1 shadow-inner shrink-0" />
            );
          }
          if (part === '=') {
            return <span key={i} className="mx-2 text-blue-600">=</span>;
          }
          return <span key={i} className="mx-1">{part}</span>;
        })}
      </div>
    </div>
  );
};

export default function ChuyenDe1Page() {
  const [problems, setProblems] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef,
  })

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
      setProblems(result.problems)
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
      {problems.length > 0 && (
        <Button 
          onClick={() => handlePrint()} 
          className="no-print fixed right-6 top-[55%] -translate-y-1/2 z-50 gap-3 rounded-full shadow-2xl px-6 py-7 bg-primary hover:bg-primary/90 text-white font-black text-sm transition-all hover:scale-105 active:scale-95"
        >
          <Printer className="size-5" />
          In trang này
        </Button>
      )}

      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Chuyên đề 1: Biểu thức ba số hạng</h1>
          <p className="text-muted-foreground max-w-2xl">
            Dạng toán $A \pm B \pm C = D$ giúp bé rèn luyện tư duy tính toán trung gian.
          </p>
        </div>
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
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phạm vi nhanh</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(10)}>Phạm vi 10</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(20)}>Phạm vi 20</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyRangePreset(100)}>Phạm vi 100</Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="unknownVariable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí ẩn số</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Vị trí A</SelectItem>
                            <SelectItem value="B">Vị trí B</SelectItem>
                            <SelectItem value="C">Vị trí C</SelectItem>
                            <SelectItem value="D">Vị trí D</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="operationMode"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Loại phép tính</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-3 gap-2"
                          >
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                              <RadioGroupItem value="plus" id="p1" />
                              <Label htmlFor="p1" className="text-xs">Cộng</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                              <RadioGroupItem value="minus" id="m1" />
                              <Label htmlFor="m1" className="text-xs">Trừ</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                              <RadioGroupItem value="mixed" id="x1" />
                              <Label htmlFor="x1" className="text-xs">Trộn</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng câu hỏi</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

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
                <CardDescription>Bản thiết kế MathLab Number Garden.</CardDescription>
              </div>
              {problems.length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => setProblems([])} className="text-destructive">
                  <Trash2 className="size-5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {problems.length > 0 ? (
                <div className="p-8 print:p-0">
                  {/* Container for Printing via react-to-print */}
                  <div ref={contentRef}>
                    <div className="print-only w-[210mm] h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <div className="flex justify-between items-start mb-10 border-b-2 border-blue-600 pb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Settings2 className="size-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-black text-blue-600 leading-none">MathLab</h1>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Number Garden Edition</p>
                          </div>
                        </div>
                        <div className="text-right space-y-3 pt-2">
                          <p className="text-sm font-medium">Họ và tên: .....................................................</p>
                          <p className="text-sm font-medium">Ngày: ...........................................................</p>
                        </div>
                      </div>

                      <div className="mb-12 text-center">
                        <h2 className="text-4xl font-black text-blue-600 mb-2">Tìm số còn thiếu</h2>
                        <p className="text-lg italic text-blue-400 font-medium">Thử thách điền số thích hợp vào chỗ trống nhé!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                        <div className="space-y-10">
                          {leftCol.map((prob, idx) => (
                             <ProblemRow key={idx} index={idx + 1} problem={prob} />
                          ))}
                        </div>
                        <div className="space-y-10">
                          {rightCol.map((prob, idx) => (
                             <ProblemRow key={idx} index={idx + 1 + mid} problem={prob} />
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-[15mm] left-[15mm] right-[15mm]">
                        <div className="flex justify-between items-end border-t border-gray-100 pt-8">
                           <div className="space-y-4">
                              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold text-sm">
                                 <span className="text-lg">🏆</span>
                                 Cố lên, bạn làm được mà!
                              </div>
                              <p className="text-[10px] text-gray-400">
                                 © 2024 MathLab Educational Tools. Bản quyền thuộc về MathLab.
                              </p>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                              <div className="size-16 border-2 border-gray-100 rounded-lg flex items-center justify-center">
                                 <QrCode className="size-10 text-gray-200" />
                              </div>
                              <span className="text-[8px] text-gray-400 font-bold uppercase">Quét để xem đáp án</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Browser Preview (No-Print) */}
                  <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                    {problems.map((problem, index) => (
                      <div key={index} className="flex items-center gap-4 text-xl font-bold border-b border-dashed pb-4">
                        <span className="text-xs bg-primary/10 text-primary size-6 rounded-full flex items-center justify-center shrink-0">{index + 1}</span>
                        <div className="font-mono">{problem.replace('=', ' = ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 p-12">
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
