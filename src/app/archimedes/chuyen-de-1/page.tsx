"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Send, Settings2, Trash2, Calculator, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
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

export default function ChuyenDe1Page() {
  const [problems, setProblems] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Chuyên đề 1: Biểu thức ba số hạng</h1>
          <p className="text-muted-foreground max-w-2xl">
            Dạng toán $A \pm B \pm C = D$ giúp bé rèn luyện tư duy tính toán trung gian. Thuật toán đảm bảo mọi bước tính đều không ra kết quả âm.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {problems.length > 0 && (
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="size-4" />
              In bài tập (PDF)
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Section */}
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình đề bài
              </CardTitle>
              <CardDescription>
                Tùy chỉnh thông minh cho bộ câu hỏi.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Presets */}
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
                        <FormLabel>Vị trí ẩn số (Ô trống)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vị trí ẩn số" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Vị trí A (_ ± B ± C = D)</SelectItem>
                            <SelectItem value="B">Vị trí B (A ± _ ± C = D)</SelectItem>
                            <SelectItem value="C">Vị trí C (A ± B ± _ = D)</SelectItem>
                            <SelectItem value="D">Vị trí D (A ± B ± C = _)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
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
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="plus" id="plus" />
                              <Label htmlFor="plus" className="text-xs cursor-pointer">Chỉ +</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="minus" id="minus" />
                              <Label htmlFor="minus" className="text-xs cursor-pointer">Chỉ -</Label>
                            </div>
                            <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-muted/50 cursor-pointer">
                              <RadioGroupItem value="mixed" id="mixed" />
                              <Label htmlFor="mixed" className="text-xs cursor-pointer">Hỗn hợp</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số lượng câu hỏi ({field.value})</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-primary/70">Phạm vi A (Số đầu)</Label>
                      <FormField control={form.control} name="rangeA.min" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Min" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeA.max" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Max" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-primary/70">Phạm vi D (Kết quả)</Label>
                      <FormField control={form.control} name="rangeD.min" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Min" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeD.max" render={({ field }) => (
                        <FormItem><FormControl><Input type="number" placeholder="Max" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold shadow-lg" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Layers className="size-5" />}
                    {isLoading ? "Đang tạo đề..." : "Tạo bộ đề mới"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Xem trước bài tập</CardTitle>
                  <CardDescription>Bộ đề sẽ được trình bày chuyên nghiệp khi in ấn.</CardDescription>
                </div>
                {problems.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={() => setProblems([])} className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="size-5" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
              {problems.length > 0 ? (
                <div className="p-8 print:p-0">
                  {/* Print Header */}
                  <div className="print-only mb-8 text-center border-b-4 border-primary pb-6">
                    <h1 className="text-3xl font-black text-primary uppercase tracking-widest">BƠ HỌC TOÁN - PHIẾU BÀI TẬP TỰ LUYỆN</h1>
                    <div className="mt-4 text-base flex justify-center gap-16 font-medium">
                      <span>Họ và tên: .............................................................</span>
                      <span>Lớp: .................</span>
                    </div>
                    <div className="mt-4 bg-primary/10 inline-block px-6 py-1 rounded-full text-primary font-bold">
                      Chuyên đề 1: Biểu thức ba số hạng ($A \pm B \pm C = D$)
                    </div>
                  </div>

                  {/* Problems Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-16 gap-y-10">
                    {problems.map((problem, index) => (
                      <div key={index} className="flex items-center gap-4 text-2xl font-semibold border-b-2 border-dashed border-muted pb-4 transition-all hover:border-primary/50 group">
                        <span className="text-sm font-black text-primary/30 group-hover:text-primary min-w-[2.5rem] bg-muted/50 rounded-md py-1 text-center">
                          {index + 1}
                        </span>
                        <div className="flex-1 tracking-[0.2em] font-mono">
                          {problem.replace('=', ' = ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print Footer */}
                  <div className="print-only mt-20 text-center space-y-2">
                    <div className="h-0.5 bg-muted w-full" />
                    <p className="text-sm italic text-muted-foreground font-medium">
                      "Kiên trì mỗi ngày, bé sẽ thành tài" - Website: bohoctoan.vn
                    </p>
                    <div className="flex justify-between text-[10px] text-muted-foreground/50 mt-4">
                       <span>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</span>
                       <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-primary/5 flex items-center justify-center animate-pulse">
                      <Calculator className="size-12 text-primary/20" />
                   </div>
                   <div className="text-center space-y-2">
                     <p className="font-bold text-xl text-foreground">Bạn chưa tạo câu hỏi nào</p>
                     <p className="text-sm max-w-xs mx-auto">Sử dụng bảng cấu hình bên trái để thiết lập phạm vi số và loại phép tính cho bé.</p>
                   </div>
                   <Button onClick={() => form.handleSubmit(onSubmit)()} variant="outline" className="border-primary text-primary hover:bg-primary/10">
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
