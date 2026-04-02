"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Grid3X3, PlusCircle, LayoutDashboard, Brain } from "lucide-react"
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
import { generateSudokuProblems } from "@/ai/flows/generate-sudoku-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"

const formSchema = z.object({
  size: z.enum(['4', '6', '9']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numProblems: z.coerce.number().min(1).max(5),
})

const SudokuCell = ({ value, size }: { value: string, size: number }) => {
  const isBlank = value === '_';
  const isLarge = size === 9;
  return (
    <div className={cn(
      "aspect-square flex items-center justify-center border border-slate-300 font-bold transition-all p-0",
      isBlank ? "bg-white" : "bg-slate-50 text-primary",
      isLarge ? "text-base sm:text-xl" : "text-2xl sm:text-3xl"
    )}>
      {isBlank ? "" : value}
    </div>
  );
};

const SudokuGrid = ({ grid, size }: { grid: string[][], size: number }) => {
  const cols = size;
  const boxW = size === 6 ? 3 : Math.sqrt(size);
  const boxH = size === 6 ? 2 : Math.sqrt(size);

  return (
    <div 
      className="grid border-2 border-slate-900 shadow-xl mx-auto overflow-hidden" 
      style={{ 
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        width: 'fit-content',
        minWidth: size === 9 ? '280px' : '200px',
        maxWidth: '100%'
      }}
    >
      {grid.map((row, rIdx) => (
        row.map((val, cIdx) => (
          <div 
            key={`${rIdx}-${cIdx}`}
            className={cn(
               "border-slate-300",
               (cIdx + 1) % boxW === 0 && cIdx !== size - 1 ? "border-r-2 border-r-slate-900" : "border-r",
               (rIdx + 1) % boxH === 0 && rIdx !== size - 1 ? "border-b-2 border-b-slate-900" : "border-b"
            )}
          >
            <SudokuCell value={val} size={size} />
          </div>
        ))
      ))}
    </div>
  );
};

const SudokuProblem = ({ index, problem }: { index: number, problem: any }) => {
  return (
    <div className="space-y-4 break-inside-avoid py-4">
      <div className="space-y-1">
        <h3 className="text-lg font-black text-primary tracking-tight flex items-center gap-3">
          <span className="size-7 rounded-full bg-primary text-white flex items-center justify-center text-[9px]">Bài {index}</span>
          Điền số Sudoku {problem.size}x{problem.size}
        </h3>
        <p className="text-[15px] font-medium text-slate-600 leading-relaxed font-body">
          Hãy điền các số từ 1 đến {problem.size} vào các ô trống sao cho mỗi hàng, mỗi cột và mỗi khối nhỏ không lặp lại số nào.
        </p>
      </div>

      <div className="flex justify-center">
        <SudokuGrid grid={problem.grid} size={problem.size} />
      </div>

      <div className="mt-8 no-print p-4 bg-slate-50 rounded-xl border border-slate-200">
        <details className="cursor-pointer group">
          <summary className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 group-open:mb-4">
            <span className="group-open:hidden">Xem đáp án</span>
            <span className="hidden group-open:inline">Đóng đáp án</span>
          </summary>
          <div className="flex justify-center transition-all animate-in fade-in slide-in-from-top-2">
             <div className="scale-75 origin-top">
                <SudokuGrid grid={problem.solution} size={problem.size} />
             </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default function SudokuPage() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      size: '4',
      difficulty: 'easy',
      numProblems: 2,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateSudokuProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} bảng Sudoku.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo bảng Sudoku." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase">CĐ6: Thử thách Sudoku Tư Duy</h1>
          <p className="text-muted-foreground max-w-2xl font-medium">
            Rèn luyện khả năng quan sát và logic loại trừ qua các bảng số Sudoku đa dạng kích thước.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild className="gap-2 font-bold">
            <Link href="/archimedes">
              <LayoutDashboard className="size-4" />
              Bảng điều khiển
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-2xl bg-white overflow-hidden">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" />
                Cấu hình Sudoku
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Kích thước lưới</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-primary/20 bg-primary/5 font-semibold text-primary">
                              <SelectValue placeholder="Chọn kích thước" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="4" className="font-semibold text-green-600">Mini Sudoku 4x4 (Dễ)</SelectItem>
                            <SelectItem value="6" className="font-semibold text-blue-600">Medium Sudoku 6x6</SelectItem>
                            <SelectItem value="9" className="font-semibold text-red-600">Classic Sudoku 9x9</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Mức độ thử thách</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-primary/20 bg-primary/5 font-semibold text-primary">
                              <SelectValue placeholder="Chọn mức độ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="easy" className="font-semibold">Bắt đầu (Nhiều gợi ý)</SelectItem>
                            <SelectItem value="medium" className="font-semibold text-orange-600">Thử thách (Vừa phải)</SelectItem>
                            <SelectItem value="hard" className="font-semibold text-red-700">Thiên tài (Ít gợi ý)</SelectItem>
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
                        <FormLabel className="font-bold text-slate-700">Số lượng bảng</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-12 font-bold text-lg" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black bg-primary hover:bg-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <Grid3X3 className="size-6" />}
                    TẠO Sudoku
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-2xl min-h-[600px] flex flex-col bg-white overflow-hidden">
             <CardHeader className="no-print border-b bg-slate-50/50 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Brain className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-800">Preview Phiếu Bài Tập</CardTitle>
                  <CardDescription className="font-medium">Sudoku chuẩn giáo dục BƠ HỌC TOÁN.</CardDescription>
                </div>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold h-11 px-6 shadow-md shadow-primary/20">
                  <Printer className="size-4" />
                  In phiếu ngay
                </Button>
              )}
            </CardHeader>

            <CardContent className="flex-1 p-0 relative">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef}>
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <PrintHeader 
                        title="Thử Thách Sudoku" 
                        subtitle="Rèn luyện logic - Bứt phá tư duy cùng Bơ Học Toán!" 
                      />

                      <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                        {results.map((prob, idx) => (
                           <SudokuProblem key={idx} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <PrintFooter />
                    </div>
                  </div>

                  <div className="no-print grid grid-cols-1 gap-8">
                    {results.map((prob, idx) => (
                       <SudokuProblem key={idx} index={idx + 1} problem={prob} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-8 p-12">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center animate-bounce">
                      <Grid3X3 className="size-16 text-primary/20" />
                   </div>
                   <div className="text-center space-y-2">
                     <p className="font-black text-2xl text-slate-800 uppercase">Sudoku chưa sẵn sàng!</p>
                     <p className="font-medium text-slate-500">Hãy cấu hình mức độ và nhấn nút TẠO Sudoku.</p>
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
