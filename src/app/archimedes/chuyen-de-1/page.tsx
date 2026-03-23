
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Send, Settings2, Trash2, CheckCircle2 } from "lucide-react"

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
import { generateArchimedesMathProblems, type GenerateArchimedesMathProblemsOutput } from "@/ai/flows/generate-archimedes-math-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  unknownVariable: z.enum(["A", "B", "C", "D"]),
  numProblems: z.coerce.number().min(1).max(50),
  rangeA: z.object({ min: z.coerce.number(), max: z.coerce.number() }),
  rangeB: z.object({ min: z.coerce.number(), max: z.coerce.number() }),
  rangeC: z.object({ min: z.coerce.number(), max: z.coerce.number() }),
  rangeD: z.object({ min: z.coerce.number(), max: z.coerce.number() }),
})

export default function ChuyenDe1Page() {
  const [problems, setProblems] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unknownVariable: "D",
      numProblems: 10,
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
        description: `Đã tạo ${result.problems.length} câu hỏi cho bé.`,
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Chuyên đề 1: Biểu thức ba số hạng</h1>
          <p className="text-muted-foreground">
            Dạng toán $A \pm B \pm C = D$ giúp bé rèn luyện tính toán trung gian.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {problems.length > 0 && (
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="size-4" />
              In bài tập (PDF)
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Section */}
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card">
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình đề bài
              </CardTitle>
              <CardDescription>
                Tùy chỉnh các thông số cho bộ câu hỏi.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="unknownVariable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí ẩn số</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn biến muốn tìm" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A">Vị trí A (Số hạng 1)</SelectItem>
                            <SelectItem value="B">Vị trí B (Số hạng 2)</SelectItem>
                            <SelectItem value="C">Vị trí C (Số hạng 3)</SelectItem>
                            <SelectItem value="D">Vị trí D (Kết quả)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Vị trí này sẽ hiển thị là dấu gạch dưới "_"
                        </FormDescription>
                        <FormMessage />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Phạm vi A</h4>
                      <FormField control={form.control} name="rangeA.min" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeA.max" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Phạm vi B</h4>
                      <FormField control={form.control} name="rangeB.min" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeB.max" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Phạm vi C</h4>
                      <FormField control={form.control} name="rangeC.min" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeC.max" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-semibold text-primary">Phạm vi D</h4>
                      <FormField control={form.control} name="rangeD.min" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                      <FormField control={form.control} name="rangeD.max" render={({ field }) => (
                        <FormItem><FormLabel className="text-xs">Max</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                      )} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2 py-6" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Send className="size-5" />}
                    {isLoading ? "Đang tạo..." : "Tạo bộ đề mới"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Display Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl min-h-[600px] flex flex-col bg-white">
            <CardHeader className="no-print border-b bg-muted/20 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Danh sách câu hỏi</CardTitle>
                  <CardDescription>Kết quả sẽ hiển thị tại đây.</CardDescription>
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
                  <div className="print-only mb-8 text-center border-b-2 border-primary pb-4">
                    <h1 className="text-2xl font-bold text-primary uppercase">BƠ HỌC TOÁN - BÀI TẬP TỰ LUYỆN</h1>
                    <div className="mt-2 text-sm flex justify-center gap-12">
                      <span>Họ và tên: .............................................................</span>
                      <span>Lớp: .................</span>
                    </div>
                    <div className="mt-4 font-semibold">Chuyên đề: Biểu thức ba số hạng ($A \pm B \pm C = D$)</div>
                  </div>

                  {/* Problems Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-12 gap-y-6">
                    {problems.map((problem, index) => (
                      <div key={index} className="flex items-center gap-4 text-xl font-medium border-b border-dashed pb-2 group">
                        <span className="text-sm font-bold text-primary/40 group-hover:text-primary transition-colors min-w-[2rem]">{index + 1}.</span>
                        <div className="flex-1 tracking-widest">{problem.replace('=', ' = ')}</div>
                      </div>
                    ))}
                  </div>

                  {/* Print Footer */}
                  <div className="print-only mt-12 text-center text-xs italic text-muted-foreground border-t pt-4">
                    "Học toán mỗi ngày - Bé giỏi mê say" - Website: bohoctoan.vn
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4 p-12">
                   <div className="size-20 rounded-full bg-muted flex items-center justify-center">
                      <Calculator className="size-10 opacity-20" />
                   </div>
                   <div className="text-center">
                     <p className="font-semibold text-lg">Chưa có câu hỏi nào</p>
                     <p className="text-sm">Hãy nhấn nút "Tạo bộ đề mới" ở bảng bên trái để bắt đầu.</p>
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
