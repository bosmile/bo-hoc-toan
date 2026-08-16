"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, Trash2, Layers, CheckCircle2, Wand2, Grid3X3, BrainCircuit } from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/text-area"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import Link from "next/link"

const formSchema = z.object({
  fewShotExample: z.string().min(10, "Cần cung cấp ít nhất một bài mẫu."),
  numProblems: z.coerce.number().min(1).max(10),
  categories: z.string().default("Tên, Màu Sắc, Môn Học"),
})

const LogicGridRow = ({ index, problem }: { index: number, problem: any }) => {
  const elements = [
    { name: "Hoa", cols: ["Đỏ", "Xanh", "Vàng"] },
    { name: "Cúc", cols: ["", "", ""] },
    { name: "Mai", cols: ["", "", ""] },
  ];
  
  return (
    <div className="col-span-full py-8 border-b border-dashed border-slate-300 break-inside-avoid print:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-sans font-bold text-[18px] shrink-0 mt-0.5 whitespace-nowrap">Bài {index}:</span>
          <p className="text-[18px] font-bold text-slate-800 leading-relaxed text-justify">{problem.question}</p>
        </div>

        <div className="flex justify-center w-full mt-4">
           {/* LOGIC TABLE SKELETON */}
           <table className="w-[80%] border-collapse text-center table-fixed border-4 border-slate-800">
             <thead>
               <tr>
                 <th className="border-4 border-slate-800 w-1/4 bg-slate-100/50"></th>
                 <th className="border-4 border-slate-800 text-[18px] font-black py-4 uppercase">Màu Đỏ</th>
                 <th className="border-4 border-slate-800 text-[18px] font-black py-4 uppercase">Màu Xanh</th>
                 <th className="border-4 border-slate-800 text-[18px] font-black py-4 uppercase">Màu Vàng</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td className="border-4 border-slate-800 text-[18px] font-black py-5 uppercase bg-slate-100/50">Bạn Hoa</td>
                 <td className="border-4 border-slate-800 h-[60px]"></td>
                 <td className="border-4 border-slate-800"></td>
                 <td className="border-4 border-slate-800"></td>
               </tr>
               <tr>
                 <td className="border-4 border-slate-800 text-[18px] font-black py-5 uppercase bg-slate-100/50">Bạn Cúc</td>
                 <td className="border-4 border-slate-800 h-[60px]"></td>
                 <td className="border-4 border-slate-800"></td>
                 <td className="border-4 border-slate-800"></td>
               </tr>
               <tr>
                 <td className="border-4 border-slate-800 text-[18px] font-black py-5 uppercase bg-slate-100/50">Bạn Mai</td>
                 <td className="border-4 border-slate-800 h-[60px]"></td>
                 <td className="border-4 border-slate-800"></td>
                 <td className="border-4 border-slate-800"></td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

export default function Grade2LogicGridPage() {
  const [problems, setProblems] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fewShotExample: "Ba bạn Hoa, Cúc, Mai mặc 3 chiếc váy: Đỏ, Xanh, Vàng. Hoa không thích màu vàng. Cúc mặc váy xanh. Hỏi Mai mặc váy màu gì?",
      numProblems: 2,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await new Promise(r => setTimeout(r, 2000))
      
      const mockResult = Array.from({ length: values.numProblems }).map((_, i) => ({
         question: `Trong một buổi liên hoan có 3 món đồ chơi là Xe ô tô, Máy bay và Tàu hoả. Ba bạn Nam, Sơn, Tùng mỗi bạn được tặng một món. Tùng không nhận Tàu hoả. Sơn được tặng Xe ô tô. Hỏi Nam nhận đồ chơi nào?`,
      }))
      
      setProblems(mockResult)
      toast({ title: "Thành công!", description: `Đã tạo ${values.numProblems} bài toán mới.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Lỗi tạo đề." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-blue-600 border-blue-600/20 bg-blue-50">Toán Lớp 2</Badge>
          <h1 className="text-3xl font-bold tracking-tight text-blue-600">CĐ 6: Thống kê & Logic Grid</h1>
          <p className="text-muted-foreground max-w-2xl">
             In kèm bảng loại trừ (Table lưới) để học sinh điền dấu Tick (V) hoặc Chéo (X).
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/archimedes/lop-2">Quay lại Lớp 2</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="no-print space-y-6">
          <Card className="border-none shadow-xl bg-card overflow-hidden">
             {/* HƯỚNG DẪN TƯ DUY */}
             <div className="bg-blue-600 p-4 text-white">
                <div className="flex items-center gap-2 font-black mb-1">
                   <BrainCircuit className="size-5" /> Hướng dẫn tư duy
                </div>
                <p className="text-sm font-medium text-blue-100">
                   Hãy điền dấu (x) vào ô không thể xảy ra và dấu (v) vào ô chắc chắn xảy ra. Khi hàng dọc hoặc ngang có 1 dấu (v) thì các ô còn lại trong hàng/cột tương ứng phải đánh dấu (x).
                </p>
             </div>

            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-blue-600" />
                Cấu hình Few-Shot
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField control={form.control} name="fewShotExample" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bài toán mẫu (Few-Shot)</FormLabel>
                      <FormControl>
                         <textarea
                            {...field}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                         />
                      </FormControl>
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="numProblems" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng bài in (Nên để 2 bài/trang)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )} />

                  <Button type="submit" className="w-full gap-2 py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-5 animate-spin" /> : <Wand2 className="size-5" />}
                    Sinh ma trận Logic (AI)
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div><CardTitle className="text-lg">Trang in A4 (Table Logic)</CardTitle></div>
              {problems.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => handlePrint()} className="gap-2 bg-blue-600 text-white font-bold hover:bg-blue-700">
                    <Printer className="size-4" /> In đề toán
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setProblems([])} className="text-destructive"><Trash2 className="size-5" /></Button>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 p-0 relative bg-white">
              {problems.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef}>
                    <div className="w-[210mm] min-h-[297mm] mx-auto pt-[15mm] px-[15mm] pb-[10mm] bg-white text-black font-sans relative flex flex-col origin-top shadow-xl print:shadow-none print:transform-none" style={{ transform: 'scale(0.85)', marginBottom: '-10%' }}>                 
                      <PrintHeader title="GIẢI TOÁN BẰNG MA TRẬN LOGIC" subtitle="Em hãy đánh dấu V (Đúng) hoặc X (Sai) vào bảng để tìm đáp án nhé." />
                      <div className="flex flex-col relative z-10 flex-1 px-4 divide-y divide-dashed divide-slate-300">
                         {problems.map((prob, idx) => (
                            <LogicGridRow key={idx} index={idx + 1} problem={prob} />
                         ))}
                      </div>
                      <PrintFooter />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-6 p-12">
                   <div className="size-24 rounded-full bg-blue-50 flex items-center justify-center">
                      <Grid3X3 className="size-12 text-blue-200" />
                   </div>
                   <p className="font-bold text-xl text-foreground">Bạn chưa sinh bảng mẫu</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

