
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Scale, PlusCircle, CheckCircle2 } from "lucide-react"
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
import { generateComparisonProblems } from "@/ai/flows/generate-comparison-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import Link from "next/link"

const formSchema = z.object({
  level: z.enum(["1", "2", "3"]),
  operationMode: z.enum(["plus", "minus", "mixed"]),
  numProblems: z.coerce.number().min(1).max(50),
  range: z.object({ min: z.coerce.number().min(0), max: z.coerce.number().min(0) }),
})

const ComparisonBox = () => (
  <div className="size-10 bg-white border border-gray-400 rounded-md mx-3 shadow-inner shrink-0 relative flex items-center justify-center overflow-hidden">
  </div>
);

const ProblemRow = ({ index, problem }: { index: number, problem: string }) => {
  const parts = problem.split('_');
  
  return (
    <div className="flex items-center gap-4 text-[20px] font-bold font-mono py-2">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        <span className="whitespace-nowrap">{parts[0].trim()}</span>
        <ComparisonBox />
        <span className="whitespace-nowrap">{parts[1].trim()}</span>
      </div>
    </div>
  );
};

export default function ChuyenDe3Page() {
  const [results, setResults] = React.useState<{question: string, answer: string}[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "1",
      operationMode: "mixed",
      numProblems: 20,
      range: { min: 0, max: 20 },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateComparisonProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu hỏi so sánh.` })
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
          <h1 className="text-3xl font-bold tracking-tight text-primary uppercase">Chuyên đề 3: So sánh biểu thức</h1>
          <p className="text-muted-foreground max-w-2xl">
            Điền dấu thích hợp (&lt;, &gt;, =) vào ô trống giữa hai vế.
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
                Cấu hình So sánh
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cấp độ thử thách</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="1">Cấp độ 1: Vế vs Số</SelectItem>
                            <SelectItem value="2">Cấp độ 2: Cùng số hạng</SelectItem>
                            <SelectItem value="3">Cấp độ 3: Hai vế khác nhau</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="range.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phạm vi số (Tối đa)</FormLabel>
                        <Select onValueChange={(v) => field.onChange(parseInt(v))} defaultValue={field.value.toString()}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="10">Phạm vi 10</SelectItem>
                            <SelectItem value="20">Phạm vi 20</SelectItem>
                            <SelectItem value="50">Phạm vi 50</SelectItem>
                            <SelectItem value="100">Phạm vi 100</SelectItem>
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
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Scale className="size-5" />}
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
                <CardDescription>Mẫu so sánh MathLab.</CardDescription>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold">
                  <Printer className="size-4" />
                  In đề toán
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-white">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef}>
                    <div className="w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative flex flex-col shadow-xl origin-top" style={{ transform: 'scale(0.85)', marginBottom: '-10%' }}>
                      
                      <PrintHeader 
                        title="So sánh biểu thức" 
                        subtitle="Điền dấu thích hợp (<, >, =) vào ô trống giữa hai vế nhé!" 
                      />

                      <div className="grid grid-cols-2 gap-x-12 gap-y-12 relative z-10 flex-1 px-8 pt-6">
                        {results.map((item, idx) => (
                          <ProblemRow key={idx} index={idx + 1} problem={item.question} />
                        ))}
                      </div>

                      <PrintFooter />
                    </div>
                  </div>

                  <div className="no-print grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 p-12">
                    {results.map((item, idx) => (
                      <ProblemRow key={idx} index={idx + 1} problem={item.question} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi so sánh nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
