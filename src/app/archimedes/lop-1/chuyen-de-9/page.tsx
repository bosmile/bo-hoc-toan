
"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, PlusCircle, Calculator, Sparkles } from "lucide-react"
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
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateBalanceProblems } from "@/ai/flows/generate-balance-problems"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"
import Link from "next/link"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  maxSum: z.coerce.number().min(5).max(1000),
  type: z.enum(["chain", "expression"]),
  allowSubtraction: z.boolean(),
  numProblems: z.coerce.number().min(1).max(50),
})

const BalanceBox = ({ value, isAnswer = false }: { value: any, isAnswer?: boolean }) => {
  return (
    <div className={cn(
      "size-12 flex items-center justify-center border border-slate-400 rounded-md font-mono text-[18px] font-bold shadow-sm p-0 flex-shrink-0 leading-none squared-box-grid bg-white",
    )}>
      {isAnswer ? (
        <span className="text-red-500 font-black text-[18px]">{value}</span>
      ) : ""}
    </div>
  );
};

const BalanceProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  const nums = problem.numbers.join('; ');
  const parts = problem.equationTemplate.split(' ');
  
  return (
    <div className="col-span-full py-6 border-b border-dashed border-slate-100 break-inside-avoid">
       <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
             <span className="text-blue-600 font-sans font-bold text-[18px] shrink-0 mt-0.5">{index}.</span>
             <p className="text-[18px] font-bold text-slate-800 leading-tight"> Viết mỗi số <span className="text-blue-700 tracking-wider px-2 font-black">{nums}</span> vào một ô trống để được dãy phép tính đúng.</p>
          </div>
          
          <div className="flex items-center justify-center gap-3 mt-2">
             {parts.map((part: string, i: number) => {
                if (part === '_') {
                  const valIndex = parts.slice(0, i).filter((p: string) => p === '_').length;
                  return <BalanceBox key={i} value={problem.solution[valIndex]} isAnswer={isAnswer} />;
                }
                const isOp = ['+', '-', '='].includes(part);
                return (
                  <span key={i} className={cn(
                    "text-[22px] font-bold",
                    isOp ? "text-primary" : "text-slate-700"
                  )}>
                    {part === '*' ? '×' : part}
                  </span>
                );
             })}
          </div>
       </div>
    </div>
  );
};

export default function ChuyenDe9Page() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxSum: 20,
      type: "chain",
      allowSubtraction: false,
      numProblems: 10,
    },
  })

  // Persistent settings
  const formValues = form.watch()
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('archimedes_cd9_settings')
      if (saved) {
        try {
          form.reset(JSON.parse(saved))
        } catch (e) {
          console.error("Failed to load settings", e)
        }
      }
    }
  }, [form])

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('archimedes_cd9_settings', JSON.stringify(formValues))
    }
  }, [formValues])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      const result = await generateBalanceProblems(values)
      setResults(result.problems)
      toast({ title: "Thành công!", description: `Đã tạo ${result.problems.length} câu hỏi cân bằng.` })
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo câu hỏi." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4 px-4 pt-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-3xl font-black tracking-tight text-primary uppercase">Chuyên đề 9: Cân bằng phép cộng</h1>
          <p className="text-muted-foreground max-w-2xl font-medium">
             Sử dụng một bộ số cho trước để điền vào dãy phép tính sao cho mọi vế đều bằng nhau.
          </p>
        </div>
        <Button variant="outline" asChild className="gap-2 font-bold shadow-sm">
          <Link href="/archimedes">
            <PlusCircle className="size-4" />
            Vào Bộ trộn đề
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4">
        <div className="no-print lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
             <div className="h-1.5 w-full bg-primary" />
            <CardHeader className="border-b bg-muted/10">
              <CardTitle className="text-lg flex items-center gap-2 font-black text-primary uppercase tracking-tight">
                <Settings2 className="size-5" />
                Cấu hình Đề bài
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-8 px-6 pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Loại dãy tính</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger className="h-12 font-bold"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="chain" className="font-bold">Chuỗi cân bằng (A + B = C + D = E)</SelectItem>
                            <SelectItem value="expression" className="font-bold">Biểu thức (A ± B ± C = D)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxSum"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Phạm vi số (Max Sum / Kết quả)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-12 font-bold focus-visible:ring-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowSubtraction"
                    render={({ field }) => (
                      <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-dashed border-primary/20">
                        <Label className="font-bold text-sm">Bao gồm phép trừ (-)</Label>
                        <FormControl>
                          <Switch id="sub" checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </div>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Số lượng câu (Mặc định: 10)</FormLabel>
                        <FormControl>
                           <Input type="number" {...field} className="h-12 font-bold focus-visible:ring-primary/20" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black uppercase shadow-lg shadow-primary/20" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <Sparkles className="size-6" />}
                    Tạo đề logic ngay
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl min-h-[700px] flex flex-col bg-white overflow-hidden ring-1 ring-black/5">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between p-6">
              <div>
                <CardTitle className="text-xl font-black text-primary uppercase">Xem trước bản in A4</CardTitle>
                <CardDescription className="font-medium italic">Tất cả các bài tập sẽ hiển thị tại đây.</CardDescription>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-black shadow-lg hover:bg-primary/90 px-6 py-6 text-lg">
                  <Printer className="size-5" />
                  IN PHIẾU PDF
                </Button>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative bg-white">
              {results.length > 0 ? (
                <div className="p-0">
                  <div ref={contentRef} className="print-container bg-white text-black font-sans relative p-[15mm]">
                    
                    <PrintHeader 
                      title="Chuyên đề 9: Cân bằng phép cộng" 
                      subtitle="Điền các số cho trước vào ô trống để tạo dãy đẳng thức đúng nhé!" 
                    />

                    <div className="flex-1 pt-4">
                      <div className="grid grid-cols-1 gap-y-2">
                        {results.map((item, idx) => (
                          <BalanceProblemRow key={idx} index={idx + 1} problem={item} />
                        ))}
                      </div>
                    </div>

                    <div className="break-before-page pt-10">
                       <h2 className="text-2xl font-black text-primary border-b-2 border-primary mb-6 pb-2 text-center uppercase">Đáp án chi tiết</h2>
                        <div className="grid grid-cols-1 gap-y-2">
                          {results.map((item, idx) => (
                            <BalanceProblemRow key={idx} index={idx + 1} problem={item} isAnswer />
                          ))}
                        </div>
                    </div>

                    <PrintFooter />
                  </div>

                  <div className="no-print p-8 space-y-4">
                     <h3 className="font-black text-xs text-muted-foreground uppercase tracking-widest border-b pb-2">Bản xem trước trên màn hình:</h3>
                    {results.map((item, idx) => (
                      <BalanceProblemRow key={idx} index={idx + 1} problem={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[600px] text-muted-foreground gap-8 p-12">
                   <div className="size-40 rounded-full bg-primary/5 flex items-center justify-center relative">
                      <Calculator className="size-20 text-primary/10" />
                      <div className="absolute inset-0 border-4 border-dashed border-primary/10 rounded-full animate-[spin_10s_linear_infinite]" />
                   </div>
                   <div className="text-center space-y-2">
                      <p className="font-black text-3xl text-primary/30 uppercase tracking-tighter">Chưa có dữ liệu</p>
                      <p className="text-lg font-medium text-slate-400">Hãy nhấn nút "Tạo đề logic" để bắt đầu thiết kế bài tập.</p>
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
