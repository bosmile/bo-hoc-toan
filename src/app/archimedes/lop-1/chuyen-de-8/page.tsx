"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Printer, RefreshCw, Settings2, BookOpen, LayoutDashboard, Brain } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"

// 1. Dictionaries
const names = ['Bơ', 'Nam', 'Lan', 'Hoa', 'Minh', 'Hải', 'Mai', 'Tuấn', 'Dũng', 'Nhung', 'An', 'Bình', 'Chi', 'Đức'];
const items = ['quả táo', 'cái kẹo', 'quyển vở', 'bông hoa', 'viên bi', 'chiếc bút', 'quyển truyện', 'quả bóng', 'cái bánh', 'đồ chơi'];

// 2. 7 Advanced Templates
export const advancedTemplates = [
  { type: 'Xếp hàng', text: "{name1} đang xếp hàng mua vé. Phía trước {name1} có {A} người, phía sau {name1} có {B} người. Hỏi hàng đó có tất cả bao nhiêu người?", calculateAnswer: (A: number, B: number) => A + B + 1 },
  { type: 'Xếp hạng', text: "Trong cuộc thi chạy, {name1} xếp thứ {A} từ trên xuống và xếp thứ {B} từ dưới lên. Hỏi có tất cả bao nhiêu bạn tham gia cuộc thi?", calculateAnswer: (A: number, B: number) => A + B - 1 },
  { type: 'Tuổi tác', text: "Năm nay anh {name1} {A} tuổi, em {name2} {B} tuổi. Hỏi {C} năm nữa, anh {name1} hơn em {name2} bao nhiêu tuổi?", calculateAnswer: (A: number, B: number, C: number) => A - B },
  { type: 'Ngày tháng', text: "Hôm nay là thứ Hai, ngày {A} của tháng. Hỏi thứ Hai tuần sau là ngày bao nhiêu?", calculateAnswer: (A: number) => A + 7 },
  { type: 'Cưa gỗ', text: "Bác thợ mộc cần cưa một khúc gỗ thành {A} đoạn ngắn. Hỏi bác thợ mộc phải cưa bao nhiêu lần?", calculateAnswer: (A: number) => A - 1 },
  { type: 'Thêm bớt liên hoàn', text: "Lúc đầu {name1} có {A} {item}. {name1} cho em {B} {item}, sau đó mẹ lại thưởng cho {name1} thêm {C} {item}. Hỏi bây giờ {name1} có bao nhiêu {item}?", calculateAnswer: (A: number, B: number, C: number) => A - B + C },
  { type: 'Tổng 2 bước', text: "{name1} có {A} {item}. {name2} có ít hơn {name1} {B} {item}. Hỏi cả hai bạn có tất cả bao nhiêu {item}?", calculateAnswer: (A: number, B: number) => A + (A - B) }
];

const formSchema = z.object({
  numProblems: z.coerce.number().min(1).max(20),
})

const SolutionLines = () => (
  <div className="w-full mt-1 bg-white">
    <div className="text-[10px] font-black italic text-blue-500 uppercase tracking-widest my-0.5">
      BÀI GIẢI:
    </div>
    <div className="space-y-0 w-full mb-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div 
          key={i} 
          className="border-b border-dotted border-slate-300 h-7 w-full" 
        />
      ))}
    </div>
    <div className="flex justify-end items-center gap-3 pr-2 mt-2">
       <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">ĐÁP SỐ:</span>
       <div className="border border-slate-300 w-24 h-8 rounded-lg bg-white" />
    </div>
  </div>
);

const WordProblemComponent = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  return (
    <div className="flex flex-col bg-white break-inside-avoid mb-4 print:mb-2 text-slate-800">
      <div className="flex items-start gap-1.5 w-full leading-tight">
        <span className="shrink-0 font-bold text-blue-600 text-[14px] mt-0.5 min-w-[20px] text-right">
          {index}.
        </span>
        
        <div className="flex-1">
          <p className="text-[14px] font-bold text-slate-800 text-left whitespace-pre-wrap mb-0">
            {problem.story}
          </p>
          
          {!isAnswer && <SolutionLines />}
          
          {isAnswer && (
            <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 print:bg-white text-xs">
               <div className="text-[10px] font-black text-blue-500 uppercase italic tracking-widest my-0.5">
                  HƯỚNG DẪN GIẢI:
               </div>
               <p className="text-[14px] text-slate-900 leading-tight font-bold">{problem.solution}</p>
               <div className="flex items-center justify-between pt-2 border-t border-slate-200 mt-2">
                  <span className="text-[12px] font-black text-blue-700">Đáp án: {problem.answer}</span>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const generateAdvancedQuestions = (count: number) => {
  const problems: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const tpl = advancedTemplates[Math.floor(Math.random() * advancedTemplates.length)];
    
    // Random identities
    const name1 = names[Math.floor(Math.random() * names.length)];
    let name2 = names[Math.floor(Math.random() * names.length)];
    while (name1 === name2) {
      name2 = names[Math.floor(Math.random() * names.length)];
    }
    const finalN1 = (i === 0) ? 'Bơ' : name1;
    const finalN2 = (finalN1 === name2) ? names.find(n => n !== 'Bơ') || 'Đức' : name2;
    const itemName = items[Math.floor(Math.random() * items.length)];

    let A = 0, B = 0, C = Math.floor(Math.random() * 5) + 1;
    
    if (tpl.type === 'Ngày tháng') {
      A = Math.floor(Math.random() * 21) + 1; 
    } else if (tpl.type === 'Tuổi tác' || tpl.type === 'Tổng 2 bước' || tpl.type === 'Thêm bớt liên hoàn') {
      A = Math.floor(Math.random() * 10) + 10; 
      B = Math.floor(Math.random() * (A - 2)) + 2; 
    } else {
      A = Math.floor(Math.random() * 8) + 2;
      B = Math.floor(Math.random() * 8) + 2;
    }

    const answer = tpl.calculateAnswer(A, B, C);

    let story = tpl.text
      .replace(/{name1}/g, finalN1)
      .replace(/{name2}/g, finalN2)
      .replace(/{item}/g, itemName)
      .replace(/{A}/g, A.toString())
      .replace(/{B}/g, B.toString())
      .replace(/{C}/g, C.toString());

    problems.push({
      id: Math.random().toString(36).substr(2, 9),
      category: 8,
      type: 'loi-van',
      story: story, // For local page
      questionText: story, // For Mixer
      answer: answer,
      calculation: "Tư duy Logic",
      solution: `Đáp số đúng là: ${answer}.`,
      templateType: tpl.type
    });
  }
  return problems;
};

export default function AdvancedLogicMathPage() {
  const [results, setResults] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numProblems: 3,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600)); // UX delay
    try {
      const generatedProblems = generateAdvancedQuestions(values.numProblems);
      setResults(generatedProblems)
      toast({ title: "Thành công!", description: `Đã tạo ${generatedProblems.length} bài toán tư duy.` })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể tạo bài tập." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">Toán Archimedes</Badge>
          <h1 className="text-4xl font-black tracking-tight text-primary uppercase leading-tight italic">CĐ8: Toán Tư Duy Nâng Cao</h1>
          <p className="text-muted-foreground font-medium">
            Rèn luyện tư duy logic qua 7 dạng toán nâng cao kinh điển.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" asChild className="gap-2 font-bold shadow-sm">
            <Link href="/archimedes">
              <LayoutDashboard className="size-4" /> Bảng điều khiển
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="no-print lg:col-span-4 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings2 className="size-5 text-primary" /> Cấu hình đề bài
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="numProblems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-slate-700">Số lượng bài</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} className="h-12 font-bold text-lg bg-slate-50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full gap-2 py-8 text-xl font-black bg-primary hover:bg-primary shadow-lg shadow-primary/30 transition-all hover:scale-[1.02]" disabled={isLoading}>
                    {isLoading ? <RefreshCw className="size-6 animate-spin" /> : <BookOpen className="size-6" />}
                    TẠO TOÁN TƯ DUY
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-slate-900 text-white p-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                   <Brain className="size-5" />
                </div>
                <h3 className="font-black text-lg uppercase italic tracking-tighter">Logic Math</h3>
             </div>
             <p className="text-slate-400 text-xs leading-relaxed">
               Hệ thống tương thích 7 template toán tư duy siêu trí tuệ, tự động sinh đáp án dựa trên logic.
             </p>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-2xl min-h-[600px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-slate-50/50 flex flex-row items-center justify-between p-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Printer className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black text-slate-800">Preview Trang In</CardTitle>
                  <CardDescription className="font-medium">Chuyên đề 8: Toán tư duy nâng cao.</CardDescription>
                </div>
              </div>
              {results.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold h-11 px-6 shadow-md shadow-primary/20">
                  <Printer className="size-4" /> In phiếu ngay
                </Button>
              )}
            </CardHeader>

            <CardContent className="flex-1 p-0 relative bg-slate-100/30">
              {results.length > 0 ? (
                <div className="p-8 print:p-0">
                  <div ref={contentRef} className="bg-white">
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <PrintHeader 
                        title="Phiếu Toán Tư Duy Nâng Cao" 
                        subtitle="IQ Math - Bứt phá giới hạn" 
                      />

                      <div className="mt-8 space-y-12">
                        {results.map((prob, idx) => (
                          <WordProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                        ))}
                      </div>

                      <PrintFooter />

                      <div className="page-break pt-12 border-t-8 border-slate-100">
                         <div className="mb-10 text-center">
                            <h2 className="text-3xl font-black text-orange-500 uppercase italic">HƯỚNG DẪN GIẢI CHI TIẾT</h2>
                            <p className="text-slate-400 font-bold tracking-widest text-[10px]">CĐ8: Toán Tư Duy</p>
                         </div>
                         <div className="space-y-8">
                            {results.map((prob, idx) => (
                              <WordProblemComponent key={`ans-${prob.id}`} index={idx + 1} problem={prob} isAnswer />
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="no-print space-y-8">
                    {results.map((prob, idx) => (
                      <WordProblemComponent key={prob.id} index={idx + 1} problem={prob} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground gap-8 p-12">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center animate-bounce">
                      <BookOpen className="size-16 text-primary/20" />
                   </div>
                   <div className="text-center space-y-2">
                     <p className="font-black text-2xl text-slate-800 uppercase">Sẵn sàng thử thách!</p>
                     <p className="font-medium text-slate-500">Nhấn Tạo Toán Tư Duy để bắt đầu.</p>
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
