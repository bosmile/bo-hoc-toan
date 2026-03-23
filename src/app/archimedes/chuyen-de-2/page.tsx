"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Calculator, Sparkles, CheckCircle2 } from "lucide-react"
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
import { generateMultiplicationProblems } from "@/ai/flows/generate-multiplication-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  tables: z.array(z.number()),
  unknownVariable: z.enum(["A", "B", "C"]),
  numProblems: z.coerce.number().min(1).max(50),
  shuffle: z.boolean().default(true),
})

const ProblemRow = ({ index, problem }: { index: number, problem: string }) => {
  const parts = problem.replace(/([x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
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
          if (part === '=') return <span key={i} className="mx-2 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-2 text-blue-400">×</span>;
          return <span key={i} className="mx-1">{part}</span>;
        })}
      </div>
    </div>
  );
};

export default function ChuyenDe2Page() {
  const [results, setResults] = React.useState<{question: string, answer: string}[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tables: [2, 5, 10],
      unknownVariable: "C",
      numProblems: 20,
      shuffle: true,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateMultiplicationProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu hỏi nhân.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo câu hỏi." })
    } finally {
      setIsLoading(false)
    }
  }

  const applyPreset = (type: 'easy' | 'medium' | 'hard') => {
    if (type === 'easy') form.setValue("tables", [2, 5, 10]);
    if (type === 'medium') form.setValue("tables", [3, 4, 6]);
    if (type === 'hard') form.setValue("tables", [7, 8, 9]);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary uppercase">Chuyên đề 2: Phép nhân cơ bản</h1>
          <p className="text-muted-foreground max-w-2xl">
            Luyện tập bảng cửu chương và tìm thừa số chưa biết.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình Phép nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Độ khó nhanh</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => applyPreset('easy')}>Dễ (2,5,10)</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyPreset('medium')}>Trung bình (3,4,6)</Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => applyPreset('hard')}>Khó (7,8,9)</Button>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="tables"
                    render={() => (
                      <FormItem>
                        <FormLabel>Chọn bảng cửu chương</FormLabel>
                        <div className="grid grid-cols-4 gap-2">
                          {[2,3,4,5,6,7,8,9].map((num) => (
                            <FormField
                              key={num}
                              control={form.control}
                              name="tables"
                              render={({ field }) => (
                                <FormItem key={num} className="flex flex-row items-start space-x-2 space-y-0">
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(num)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, num])
                                          : field.onChange(field.value?.filter((value) => value !== num))
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-xs font-normal">{num}</FormLabel>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unknownVariable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí ẩn số</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="A">Thừa số 1 (A)</SelectItem>
                            <SelectItem value="B">Thừa số 2 (B)</SelectItem>
                            <SelectItem value="C">Tích số (C)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shuffle"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <Label className="text-sm font-medium">Xáo trộn câu hỏi</Label>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
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
                <CardDescription>Bảng nhân MathLab chuẩn.</CardDescription>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold">
                  <Printer className="size-4" />
                  In đề toán
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-8">
              {results.length > 0 ? (
                <div ref={contentRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {results.map((item, idx) => (
                    <ProblemRow key={idx} index={idx + 1} problem={item.question} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi nhân nào</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
