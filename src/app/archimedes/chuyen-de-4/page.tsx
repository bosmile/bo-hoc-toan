"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Columns2, PlusCircle, QrCode } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
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
import { generateVerticalMathProblems } from "@/ai/flows/generate-vertical-math-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { cn } from "@/lib/utils"

const rangeSchema = z.object({
  min: z.coerce.number().min(0),
  max: z.coerce.number().min(0),
})

const formSchema = z.object({
  operation: z.enum(["plus", "minus", "mixed"]),
  digits: z.coerce.number().min(1).max(3),
  hasCarry: z.boolean(),
  hideTarget: z.enum(["result", "operands", "mixed"]),
  numProblems: z.coerce.number().min(1).max(50),
  rangeN1: rangeSchema,
  rangeN2: rangeSchema,
  rangeResult: rangeSchema,
})

const DigitBox = ({ digit }: { digit: string }) => {
  if (digit === '_') {
    return (
      <div className="size-10 bg-blue-50 border-2 border-blue-200 rounded-md shadow-inner flex items-center justify-center" />
    );
  }
  return <div className="size-10 flex items-center justify-center font-mono text-2xl font-bold">{digit}</div>;
};

const VerticalProblem = ({ index, problem }: { index: number, problem: any }) => {
  const topDigits = problem.top.split('');
  const bottomDigits = problem.bottom.split('');
  const resultDigits = problem.result.split('');

  return (
    <div className="flex items-start gap-4">
      <span className="text-blue-600 font-sans font-bold text-sm shrink-0 pt-2">{index}.</span>
      <div className="flex flex-col items-end gap-1 relative pt-2">
        <div className="flex gap-1">
          {topDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} />)}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-blue-500 mr-2">{problem.operator}</span>
          <div className="flex gap-1">
            {bottomDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} />)}
          </div>
        </div>
        <div className="w-full h-1 bg-black rounded-full my-1" />
        <div className="flex gap-1">
          {resultDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} />)}
        </div>
      </div>
    </div>
  );
};

export default function ChuyenDe4Page() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ 
    contentRef,
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      operation: "plus",
      digits: 2,
      hasCarry: false,
      hideTarget: "mixed",
      numProblems: 20,
      rangeN1: { min: 0, max: 99 },
      rangeN2: { min: 0, max: 99 },
      rangeResult: { min: 0, max: 99 },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateVerticalMathProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu tính hàng dọc.` })
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
          <h1 className="text-3xl font-bold tracking-tight text-primary uppercase">Chuyên đề 4: Phép tính hàng dọc khuyết số</h1>
          <p className="text-muted-foreground max-w-2xl">
            Điền chữ số thích hợp vào các ô trống trong phép tính hàng dọc.
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
                Cấu hình Hàng dọc
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Phạm vi số học nâng cao */}
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      Ràng buộc phạm vi số học
                    </Label>
                    
                    <div className="space-y-3 p-3 rounded-lg border bg-muted/5">
                      <div className="space-y-2">
                        <Label className="text-[11px]">Số hạng 1 (Min - Max)</Label>
                        <div className="flex items-center gap-2">
                          <FormField control={form.control} name="rangeN1.min" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                          <span className="text-muted-foreground">-</span>
                          <FormField control={form.control} name="rangeN1.max" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[11px]">Số hạng 2 (Min - Max)</Label>
                        <div className="flex items-center gap-2">
                          <FormField control={form.control} name="rangeN2.min" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                          <span className="text-muted-foreground">-</span>
                          <FormField control={form.control} name="rangeN2.max" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[11px]">Kết quả (Min - Max)</Label>
                        <div className="flex items-center gap-2">
                          <FormField control={form.control} name="rangeResult.min" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                          <span className="text-muted-foreground">-</span>
                          <FormField control={form.control} name="rangeResult.max" render={({ field }) => (
                            <FormControl><Input type="number" className="h-8" {...field} /></FormControl>
                          )} />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">
                        * Ví dụ: Để tạo phép cộng phạm vi 30, đặt Kết quả Max = 30.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="operation"
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
                              <Label htmlFor="p1" className="text-xs">Cộng (+)</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50">
                              <RadioGroupItem value="minus" id="m1" />
                              <Label htmlFor="m1" className="text-xs">Trừ (-)</Label>
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
                    name="digits"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số chữ số</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 chữ số</SelectItem>
                            <SelectItem value="2">2 chữ số</SelectItem>
                            <SelectItem value="3">3 chữ số</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hasCarry"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Có nhớ / Có mượn</FormLabel>
                          <FormDescription className="text-[10px]">
                            Bật để tạo các phép tính đòi hỏi kỹ thuật nhớ/mượn.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hideTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí ô trống</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="result">Chỉ ở kết quả</SelectItem>
                            <SelectItem value="operands">Chỉ ở số hạng</SelectItem>
                            <SelectItem value="mixed">Hỗn hợp ngẫu nhiên</SelectItem>
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
                        <FormLabel>Số lượng câu hỏi</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Columns2 className="size-5" />}
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
                <CardDescription>Mẫu hàng dọc MathLab Number Garden.</CardDescription>
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
                        <h2 className="text-4xl font-black text-blue-600 mb-2 uppercase">Thử thách hàng dọc</h2>
                        <p className="text-lg italic text-blue-400 font-medium">Tìm các chữ số còn thiếu để hoàn thành phép tính nhé!</p>
                      </div>

                      <div className="grid grid-cols-4 gap-y-12 gap-x-8">
                        {results.map((prob, idx) => (
                           <VerticalProblem key={idx} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <div className="absolute bottom-[15mm] left-[15mm] right-[15mm]">
                        <div className="flex justify-between items-end border-t border-gray-100 pt-8">
                           <div className="space-y-4">
                              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold text-sm">
                                 <span className="text-lg">🏆</span>
                                 Cố lên, bạn làm được mà!
                              </div>
                              <p className="text-[10px] text-gray-400">
                                 © 2024 MathLab Educational Tools.
                              </p>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                              <QrCode className="size-10 text-gray-200" />
                              <span className="text-[8px] text-gray-400 font-bold uppercase">Quét để xem đáp án</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="no-print grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 p-6">
                    {results.map((prob, idx) => (
                       <VerticalProblem key={idx} index={idx + 1} problem={prob} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi hàng dọc nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
