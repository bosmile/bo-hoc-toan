
"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Calculator, 
  Printer, 
  Settings2, 
  Trash2, 
  Layers, 
  Sparkles,
  FileText,
  QrCode,
  AlertCircle,
  PlusCircle,
  Scale,
  Columns2,
  ListOrdered,
  Infinity as InfinityIcon,
  Heart
} from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { generateMultiplicationProblems } from "@/ai/flows/generate-multiplication-problems"
import { generateComparisonProblems } from "@/ai/flows/generate-comparison-problems"
import { generateVerticalMathProblems } from "@/ai/flows/generate-vertical-math-problems"
import { generateSequenceProblems } from "@/ai/flows/generate-sequence-problems"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type QuestionBatch = {
  id: string;
  topicId: number;
  topicTitle: string;
  count: number;
  settings: any;
  problems: any[];
};

const ComparisonBox = () => (
  <div className="size-10 bg-blue-50 border-2 border-blue-200 rounded-md mx-3 shadow-inner shrink-0 relative flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none" 
      style={{ 
        backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
        backgroundSize: '10px 10px' 
      }} 
    />
  </div>
);

const SequenceBox = ({ value, isAnswer = false }: { value: string, isAnswer?: boolean }) => {
  const isBlank = value === '_';
  return (
    <div className={cn(
      "size-11 flex items-center justify-center border-2 font-mono text-xl font-bold shadow-sm",
      isBlank 
        ? "bg-blue-50/50 border-blue-200 rounded-lg shadow-inner relative overflow-hidden" 
        : "bg-white border-gray-300 rounded-md text-slate-700"
    )}>
      {isBlank && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '8px 8px' 
          }} 
        />
      )}
      {isAnswer && isBlank ? (
        <span className="text-red-500 underline decoration-dotted decoration-red-200 underline-offset-4 font-black">?</span>
      ) : (isBlank ? "" : value)}
    </div>
  );
};

const DigitBox = ({ digit, isAnswer = false }: { digit: string, isAnswer?: boolean }) => {
  if (digit === '_') {
    return (
      <div className="size-9 bg-blue-50 border border-blue-200 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden">
         <div className="absolute inset-0 opacity-10 pointer-events-none" 
          style={{ 
            backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
            backgroundSize: '8px 8px' 
          }} 
        />
        {isAnswer && <span className="text-red-500 font-black text-sm">?</span>}
      </div>
    );
  }
  return (
    <div className={cn(
      "size-9 flex items-center justify-center font-mono text-xl font-bold",
      isAnswer && "text-red-500 underline decoration-dotted"
    )}>
      {digit}
    </div>
  );
};

const VerticalProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  const topDigits = (isAnswer ? problem.fullEquation.split(' ')[0] : problem.top).split('');
  const bottomDigits = (isAnswer ? problem.fullEquation.split(' ')[2] : problem.bottom).split('');
  const resultDigits = (isAnswer ? problem.fullEquation.split(' ')[4] : problem.result).split('');

  return (
    <div className="flex items-start gap-2 break-inside-avoid">
      <span className="text-blue-600 font-sans font-bold text-[10px] shrink-0 pt-3">{index}.</span>
      <div className="flex flex-col items-end gap-1 relative pt-2 pr-2">
        <span className="absolute left-[-20px] top-[54px] text-xl font-bold text-blue-500">{problem.operator}</span>
        <div className="flex gap-1">
          {topDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.top[i] === '_' : false)} />)}
        </div>
        <div className="flex gap-1">
          {bottomDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.bottom[i] === '_' : false)} />)}
        </div>
        <div className="w-full h-[1.5px] bg-black my-0.5" />
        <div className="flex gap-1">
          {resultDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.result[i] === '_' : false)} />)}
        </div>
      </div>
    </div>
  );
};

const ProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  if (problem.grid) {
     const gridNumbers = problem.grid.filter((v: string) => v !== '_').map(Number);
     const knownNumbers = Array.from(new Set(gridNumbers));
     
     return (
        <div className="col-span-full space-y-6 py-8 border-b border-dashed border-blue-100 break-inside-avoid">
           <div className="space-y-1">
              <p className="text-xl font-black text-primary tracking-tight flex items-center gap-3">
                <span className="size-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">Câu {index}</span>
                Điền số theo quy luật chu kỳ
              </p>
              <p className="text-sm font-medium text-slate-600 italic">{problem.instruction}</p>
           </div>
           
           <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50/30 rounded-xl border border-slate-100/50">
              {problem.grid.map((val: string, i: number) => (
                 <SequenceBox key={i} value={val} isAnswer={isAnswer} />
              ))}
           </div>
           
           <div className="mt-6 pt-6 border-2 border-dashed border-blue-100 rounded-3xl p-6 bg-blue-50/5">
              <p className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] mb-8">✍️ Phần trình bày của em:</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-lg font-medium text-slate-500 italic font-serif">
                  <span>Ta có:</span>
                  {knownNumbers.map((num: any, idx: number) => (
                    <React.Fragment key={idx}>
                      <span className="text-slate-700 font-bold not-italic">{num}</span>
                      <span className="mx-1">+</span>
                    </React.Fragment>
                  ))}
                  <div className="size-8 border-2 border-dashed border-blue-200 rounded flex items-center justify-center bg-white shadow-sm shrink-0">
                    {isAnswer ? (
                      <span className="text-red-500 font-black text-sm">?</span>
                    ) : (
                      <span className="text-blue-100 text-xs">?</span>
                    )}
                  </div>
                  <span className="mx-1">=</span>
                  <span className="text-slate-700 font-bold not-italic">{problem.cycleSum}</span>
                  <span className="ml-2">nên số còn thiếu là:</span>
                  <span className={cn(
                    "min-w-[100px] border-b-2 border-dotted border-slate-400 pb-1 text-center font-bold font-sans",
                    isAnswer && "text-red-500 not-italic"
                  )}>
                    {isAnswer ? "XEM ĐÁP ÁN" : ""}
                  </span>
                </div>
                
                <div className="space-y-5 pb-2">
                  <div className="h-px w-full border-t border-dotted border-slate-300" />
                  <div className="h-px w-full border-t border-dotted border-slate-300" />
                </div>
              </div>
           </div>
        </div>
     );
  }

  if (problem.top && problem.bottom) {
     return <VerticalProblemRow index={index} problem={problem} isAnswer={isAnswer} />;
  }

  const probStr = isAnswer ? problem.answer : (problem.question || problem);

  if (typeof probStr === 'string' && probStr.includes('_')) {
    const parts = probStr.split('_');
    return (
      <div className="flex items-center gap-4 text-xl font-bold font-mono py-2 break-inside-avoid">
        <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
        <div className="flex items-center">
          <span className="whitespace-nowrap text-slate-700">{parts[0].trim()}</span>
          <ComparisonBox />
          <span className="whitespace-nowrap text-slate-700">{parts[1].trim()}</span>
        </div>
      </div>
    );
  }

  const cleanStr = typeof probStr === 'string' ? probStr : JSON.stringify(probStr);
  const parts = cleanStr.replace(/([+\-x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
  return (
    <div className="flex items-center gap-4 text-xl font-bold font-mono py-2 break-inside-avoid">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        {parts.map((part: string, i: number) => {
          if (part === '_') return <div key={i} className="w-14 h-10 bg-blue-50 border-2 border-blue-100 rounded-md mx-1 shadow-inner shrink-0" />;
          if (part === '=') return <span key={i} className="mx-2 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-2 text-blue-400">×</span>;
          if (part === '+' || part === '-') return <span key={i} className="mx-2 text-primary">{part}</span>;
          return <span key={i} className={cn("mx-1 text-slate-700", isAnswer && "text-red-500 underline decoration-dotted decoration-red-200 underline-offset-4 font-black")}>{part}</span>;
        })}
      </div>
    </div>
  );
};

const TopicSection = ({ batch, batchIdx, isAnswer = false }: { batch: QuestionBatch, batchIdx: number, isAnswer?: boolean }) => {
  const getInstruction = (topicId: number) => {
    switch (topicId) {
      case 1: return "Tính toán nhanh. (Em hãy điền số thích hợp vào chỗ trống để hoàn thành phép tính)";
      case 2: return "Bảng nhân thông minh. (Em hãy thực hiện các phép tính nhân sau đây)";
      case 3: return "So sánh số. (Em hãy điền dấu > ; < ; = vào ô trống)";
      case 4: return "Đặt tính rồi tính. (Em hãy thực hiện các phép tính hàng dọc sau đây)";
      case 5: return "Quy luật chu kỳ. (Em hãy nhận diện quy luật và điền số còn thiếu vào dãy số)";
      default: return "Luyện tập tư duy toán học.";
    }
  };

  const isVertical = batch.topicId === 4;
  const isSequence = batch.topicId === 5;

  return (
    <div className="mb-12 break-inside-avoid-page">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-primary uppercase tracking-tight">
          Bài {batchIdx + 1}: {batch.topicTitle}
        </h3>
        <p className="text-sm italic text-slate-600 font-medium font-serif mt-1">
          ({getInstruction(batch.topicId)})
        </p>
      </div>
      <div className={cn(
        "grid gap-x-12 gap-y-6",
        isVertical ? "grid-cols-5" : (isSequence ? "grid-cols-1" : "grid-cols-2")
      )}>
        {batch.problems.map((prob, idx) => (
          <ProblemRow key={idx} index={idx + 1} problem={prob} isAnswer={isAnswer} />
        ))}
      </div>
    </div>
  );
};

export default function ArchimedesMixerPage() {
  const [cart, setCart] = React.useState<QuestionBatch[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAnswers, setShowAnswers] = React.useState(false)
  
  const [cd1Settings, setCd1Settings] = React.useState({ count: 5, unknownVariable: "D" as any, operationMode: "mixed" as any, maxRange: 20 })
  const [cd2Settings, setCd2Settings] = React.useState({ count: 5, tables: [2, 5, 10], unknownVariable: "C" as any, shuffle: true })
  const [cd3Settings, setCd3Settings] = React.useState({ count: 5, level: "1" as any, maxRange: 20, operationMode: "mixed" as any })
  const [cd4Settings, setCd4Settings] = React.useState({ 
    count: 5, 
    operation: "plus" as any, 
    digits: 2, 
    hasCarry: false, 
    hideTarget: "mixed" as any,
    rangeN1: { min: 0, max: 99 },
    rangeN2: { min: 0, max: 99 },
    rangeResult: { min: 0, max: 99 }
  })
  const [cd5Settings, setCd5Settings] = React.useState({ count: 2, cycleLength: 3, maxCycleSum: 30 })

  const { toast } = useToast()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const totalCount = cart.reduce((acc, batch) => acc + batch.count, 0)
  const densityPercent = Math.min((totalCount / 20) * 100, 100)
  
  const getDensityColor = () => {
    if (totalCount === 20) return "bg-green-500";
    if (totalCount > 20) return "bg-destructive";
    return "bg-primary";
  }

  const removeBatch = (id: string) => setCart(prev => prev.filter(b => b.id !== id))

  async function addToExam(topicId: number) {
    setIsLoading(true)
    try {
      let newBatch: QuestionBatch;
      if (topicId === 1) {
        const res = await generateArchimedesMathProblems({
          unknownVariable: cd1Settings.unknownVariable,
          operationMode: cd1Settings.operationMode,
          numProblems: cd1Settings.count,
          rangeA: { min: 0, max: cd1Settings.maxRange },
          rangeB: { min: 0, max: Math.floor(cd1Settings.maxRange / 2) },
          rangeC: { min: 0, max: Math.floor(cd1Settings.maxRange / 2) },
          rangeD: { min: 0, max: cd1Settings.maxRange * 2 },
        })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 1, topicTitle: "Biểu thức 3 số", count: cd1Settings.count, settings: { ...cd1Settings }, problems: res.problems }
      } else if (topicId === 2) {
        const res = await generateMultiplicationProblems({ tables: cd2Settings.tables, unknownVariable: cd2Settings.unknownVariable, numProblems: cd2Settings.count, shuffle: cd2Settings.shuffle })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 2, topicTitle: "Phép nhân", count: cd2Settings.count, settings: { ...cd2Settings }, problems: res.problems }
      } else if (topicId === 3) {
        const res = await generateComparisonProblems({ level: cd3Settings.level, range: { min: 0, max: cd3Settings.maxRange }, operationMode: cd3Settings.operationMode, numProblems: cd3Settings.count })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 3, topicTitle: "So sánh biểu thức", count: cd3Settings.count, settings: { ...cd3Settings }, problems: res.problems }
      } else if (topicId === 4) {
        const res = await generateVerticalMathProblems({ 
          operation: cd4Settings.operation, 
          digits: cd4Settings.digits, 
          hasCarry: cd4Settings.hasCarry, 
          hideTarget: cd4Settings.hideTarget, 
          numProblems: cd4Settings.count,
          rangeN1: cd4Settings.rangeN1,
          rangeN2: cd4Settings.rangeN2,
          rangeResult: cd4Settings.rangeResult
        })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 4, topicTitle: "Tính hàng dọc", count: cd4Settings.count, settings: { ...cd4Settings }, problems: res.problems }
      } else {
        const res = await generateSequenceProblems({ cycleLength: cd5Settings.cycleLength, maxCycleSum: cd5Settings.maxCycleSum, numProblems: cd5Settings.count })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 5, topicTitle: "Quy luật dãy số", count: cd5Settings.count, settings: { ...cd5Settings }, problems: res.problems }
      }

      setCart(prev => [...prev, newBatch])
      toast({ title: "Thành công!", description: `Đã thêm ${newBatch.count} câu vào đề thi.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi AI", description: "Vui lòng thử lại sau." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-primary/10">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold">BƠ HỌC TOÁN - Master Mixer</Badge>
            <h1 className="text-4xl font-black tracking-tight text-primary uppercase leading-none">Bộ Trộn Đề Archimedes</h1>
            <p className="text-muted-foreground max-w-xl">Tái cấu trúc đề thi theo từng Bài học. Chuẩn nhận diện Number Garden Edition.</p>
          </div>
          <div className="max-w-md space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-primary">
              <span>Mật độ trang in (A4)</span>
              <span className={cn(totalCount > 20 && "text-destructive", totalCount === 20 && "text-green-600")}>{totalCount}/20 câu</span>
            </div>
            <Progress value={densityPercent} className="h-2" indicatorClassName={getDensityColor()} />
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[240px]">
          <div className="flex items-center justify-between px-2">
             <Label htmlFor="ans" className="text-xs font-bold uppercase text-muted-foreground">In kèm đáp án</Label>
             <Switch id="ans" checked={showAnswers} onCheckedChange={setShowAnswers} />
          </div>
          <Button size="lg" onClick={() => handlePrint()} disabled={cart.length === 0} className="w-full gap-2 font-black py-7 text-lg shadow-xl bg-primary hover:bg-primary/90">
            <Printer className="size-5" /> IN PHIẾU BÀI TẬP (A4)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6 no-print">
          {[
            { id: 1, title: "CĐ1: Biểu thức 3 số", color: "bg-primary", icon: Calculator, settings: cd1Settings, setter: setCd1Settings },
            { id: 2, title: "CĐ2: Phép nhân", color: "bg-accent", icon: Sparkles, settings: cd2Settings, setter: setCd2Settings },
            { id: 3, title: "CĐ3: So sánh biểu thức", color: "bg-blue-400", icon: Scale, settings: cd3Settings, setter: setCd3Settings },
            { id: 4, title: "CĐ4: Tính hàng dọc", color: "bg-orange-400", icon: Columns2, settings: cd4Settings, setter: setCd4Settings },
            { id: 5, title: "CĐ5: Quy luật dãy số", color: "bg-purple-400", icon: ListOrdered, settings: cd5Settings, setter: setCd5Settings }
          ].map((topic) => (
            <Card key={topic.id} className="border-none shadow-md overflow-hidden bg-white">
              <div className={cn("h-1.5 w-full", topic.color)} />
              <CardHeader className="p-5 pb-2"><CardTitle className="text-sm font-bold flex justify-between items-center">{topic.title} <topic.icon className="size-4 opacity-40"/></CardTitle></CardHeader>
              <CardContent className="p-5 pt-2 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-[10px] font-bold">SỐ CÂU:</Label>
                    <Input type="number" value={topic.settings.count} onChange={(e) => topic.setter((s: any) => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-14 h-8 text-center" />
                  </div>
                  <Popover>
                    <PopoverTrigger asChild><Button variant="ghost" size="sm" className="gap-2 text-primary font-bold"><Settings2 className="size-4" /> Cấu hình</Button></PopoverTrigger>
                    <PopoverContent className="w-64 p-4">
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Tùy chỉnh AI</p>
                        {topic.id === 2 && (
                           <div className="grid grid-cols-4 gap-2">
                              {[2,3,4,5,6,7,8,9].map(n => (
                                 <div key={n} className="flex items-center gap-1">
                                    <Checkbox checked={topic.settings.tables?.includes(n)} onCheckedChange={(c) => {
                                       const next = c ? [...topic.settings.tables, n] : topic.settings.tables.filter((x: any) => x !== n);
                                       topic.setter((s: any) => ({ ...s, tables: next }));
                                    }} />
                                    <span className="text-xs">{n}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <Button onClick={() => addToExam(topic.id)} disabled={isLoading} className={cn("w-full gap-2 font-bold", topic.id === 1 ? "bg-primary text-white" : "bg-muted text-foreground")}>
                  {isLoading ? <Layers className="size-4 animate-spin" /> : <PlusCircle className="size-4" />} Thêm vào đề thi
                </Button>
              </CardContent>
            </Card>
          ))}

          {cart.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm divide-y overflow-hidden">
               <div className="p-3 bg-muted/30 font-bold text-xs uppercase text-muted-foreground">Danh sách đã chọn</div>
              {cart.map((batch) => (
                <div key={batch.id} className="p-3 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2"><span className="text-sm font-bold text-primary">{batch.topicTitle}</span><Badge variant="secondary" className="text-[9px] h-4 bg-primary/5 text-primary">{batch.count} câu</Badge></div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeBatch(batch.id)} className="size-7 text-destructive hover:bg-destructive/10"><Trash2 className="size-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl min-h-[800px] flex flex-col bg-white overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div><CardTitle className="text-xl flex items-center gap-2 text-primary"><FileText className="size-5" /> Preview Phiếu Bài Tập</CardTitle></div>
              {cart.length > 0 && <Button variant="outline" size="icon" onClick={() => setCart([])} className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {cart.length > 0 ? (
                <div className="p-10 print:p-0" ref={contentRef}>
                  <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative overflow-hidden">
                    <div className="watermark">BƠ HỌC TOÁN</div>
                    <div className="absolute top-[40%] left-[20%] opacity-[0.03] pointer-events-none rotate-12">
                       <Heart className="size-[400px]" />
                    </div>

                    <div className="flex justify-between items-start mb-12 border-b-4 border-primary pb-8">
                      <div className="flex items-center gap-5">
                        <div className="size-24 rounded-full border-4 border-primary/20 flex items-center justify-center overflow-hidden bg-white shadow-sm">
                           <Image 
                            src="https://storage.googleapis.com/demos-pipeline-artifacts-0f3d548b-3061-46c7-9857-e696cc86535d/image_15.png" 
                            alt="Logo" 
                            width={96} 
                            height={96}
                            className="object-contain p-1"
                            data-ai-hint="bo math logo"
                          />
                        </div>
                        <div>
                          <h1 className="text-4xl font-black text-primary leading-none tracking-tighter">BƠ HỌC TOÁN</h1>
                          <p className="text-[12px] text-accent font-black uppercase tracking-[0.2em] mt-2">Number Garden Edition</p>
                        </div>
                      </div>
                      <div className="text-right space-y-4 pt-4">
                        <p className="text-sm font-bold border-b-2 border-primary/10 pb-1">Họ và tên: .....................................................</p>
                        <p className="text-sm font-bold border-b-2 border-primary/10 pb-1">Ngày: ...........................................................</p>
                      </div>
                    </div>
                    
                    <div className="mb-14 text-center">
                      <h2 className="text-5xl font-black text-primary mb-3 uppercase tracking-tighter italic">Phiếu Bài Tập Tổng Hợp</h2>
                      <p className="text-xl italic text-accent font-bold font-serif">Khai phá tiềm năng toán học trong vũ trụ số!</p>
                    </div>

                    <div className="space-y-16">
                      {cart.map((batch, idx) => (
                        <TopicSection key={batch.id} batch={batch} batchIdx={idx} />
                      ))}
                    </div>

                    <div className="absolute bottom-[10mm] left-[15mm] right-[15mm] border-t-2 border-primary/5 pt-6 flex justify-between items-end opacity-50">
                       <p className="text-[10px] font-bold text-primary">© 2024 BƠ HỌC TOÁN - NUMBER GARDEN EDITION</p>
                       <div className="flex items-center gap-2">
                          <Calculator className="size-4 text-primary" />
                          <Heart className="size-4 text-accent" />
                       </div>
                    </div>
                  </div>

                  {showAnswers && (
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative page-break overflow-hidden">
                       <div className="mb-12 border-b-4 border-destructive pb-8">
                          <h1 className="text-3xl font-black text-destructive uppercase italic">Chìa Khóa Vũ Trụ (Đáp Án)</h1>
                       </div>
                       <div className="space-y-16">
                          {cart.map((batch, idx) => (
                            <TopicSection key={batch.id} batch={batch} batchIdx={idx} isAnswer />
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="no-print space-y-16 p-10 bg-slate-50/30">
                     {cart.map((batch, idx) => (
                        <TopicSection key={batch.id} batch={batch} batchIdx={idx} />
                     ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[700px] text-muted-foreground gap-6">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center relative">
                      <Sparkles className="size-16 text-primary/20 animate-pulse" />
                      <div className="absolute -top-2 -right-2">
                         <InfinityIcon className="size-8 text-accent/30" />
                      </div>
                   </div>
                   <p className="font-black text-2xl text-primary/40 text-center uppercase tracking-widest">Khu vườn số học đang chờ bạn!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
