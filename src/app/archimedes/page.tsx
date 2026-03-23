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
  PlusCircle,
  Scale,
  Columns2,
  ListOrdered,
  Infinity as InfinityIcon,
  Heart,
  ChevronDown
} from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
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
  <div className="size-8 bg-blue-50 border-2 border-blue-200 rounded-md mx-2 shadow-inner shrink-0 relative flex items-center justify-center overflow-hidden">
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
      "size-9 flex items-center justify-center border-2 font-mono text-lg font-bold shadow-sm p-0.5",
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
        <span className="text-red-500 underline decoration-dotted decoration-red-200 underline-offset-2 font-black">?</span>
      ) : (isBlank ? "" : value)}
    </div>
  );
};

const DigitBox = ({ digit, isAnswer = false }: { digit: string, isAnswer?: boolean }) => {
  if (digit === '_') {
    return (
      <div className="size-8 bg-blue-50 border border-blue-200 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden">
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
      "size-8 flex items-center justify-center font-mono text-xl font-bold",
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
    <div className="flex flex-col items-center justify-center break-inside-avoid print:py-2">
      <div className="flex items-start gap-1">
        <span className="text-blue-600 font-sans font-bold text-[9px] shrink-0 pt-3">{index}.</span>
        <div className="flex flex-col items-end gap-0.5 relative pt-1 pr-1">
          <span className="absolute left-[-18px] top-[42px] text-lg font-bold text-blue-500">{problem.operator}</span>
          <div className="flex gap-0.5">
            {topDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.top[i] === '_' : false)} />)}
          </div>
          <div className="flex gap-0.5">
            {bottomDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.bottom[i] === '_' : false)} />)}
          </div>
          <div className="w-full h-[1.5px] bg-black my-0.5" />
          <div className="flex gap-0.5">
            {resultDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && (isAnswer ? problem.result[i] === '_' : false)} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProblemRow = ({ index, problem, isAnswer = false, topicId }: { index: number, problem: any, isAnswer?: boolean, topicId: number }) => {
  if (topicId === 5) { // Sequence
     const gridNumbers = problem.grid.filter((v: string) => v !== '_').map(Number);
     const knownNumbers = Array.from(new Set(gridNumbers));
     
     return (
        <div className="col-span-full space-y-2 py-3 border-b border-dashed border-blue-100 break-inside-avoid">
           <div className="flex items-center justify-between gap-4 flex-wrap">
              <p className="text-base font-black text-primary tracking-tight flex items-center gap-2">
                <span className="size-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px]">Câu {index}</span>
                Quy luật chu kỳ
              </p>
              <div className="flex flex-wrap gap-1 p-0.5 bg-slate-50/30 rounded-lg border border-slate-100/50">
                {problem.grid.map((val: string, i: number) => (
                  <SequenceBox key={i} value={val} isAnswer={isAnswer} />
                ))}
              </div>
           </div>
           
           <div className="pt-2 pl-8">
              <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 italic font-serif flex-wrap">
                <span className="text-blue-600/60 not-italic font-bold text-[10px] mr-1 uppercase">Tư duy:</span>
                <span>Ta có:</span>
                {knownNumbers.map((num: any, idx: number) => (
                  <React.Fragment key={idx}>
                    <span className="text-slate-800 font-bold not-italic">{num}</span>
                    <span className="mx-0.5">+</span>
                  </React.Fragment>
                ))}
                <span className="font-bold text-primary not-italic">?</span>
                <span className="mx-0.5">=</span>
                <span className="text-slate-800 font-bold not-italic">{problem.cycleSum}</span>
                <span className="ml-1">nên số còn thiếu là:</span>
                {isAnswer && <span className="text-red-500 font-bold font-sans ml-1 not-italic underline decoration-dotted">{problem.cycleNumbers.find((n: number) => !knownNumbers.includes(n))}</span>}
              </div>
           </div>
        </div>
     );
  }

  if (topicId === 4) { // Vertical
     return <VerticalProblemRow index={index} problem={problem} isAnswer={isAnswer} />;
  }

  const probStr = isAnswer ? problem.answer : (problem.question || problem);

  // Comparison
  if (topicId === 3 || (typeof probStr === 'string' && probStr.includes('_'))) {
    const parts = probStr.split('_');
    return (
      <div className="flex items-center gap-1 text-lg font-bold font-mono py-2 break-inside-avoid justify-start pl-4 border-b border-dashed border-slate-100/50">
        <span className="text-blue-600 font-sans w-6 text-right shrink-0 text-sm">{index}.</span>
        <div className="flex items-center min-w-[120px]">
          <span className="text-slate-700 text-right min-w-[40px]">{parts[0].trim()}</span>
          <ComparisonBox />
          <span className="text-slate-700 text-left min-w-[40px]">{parts[1].trim()}</span>
        </div>
      </div>
    );
  }

  // Standard Horizontal
  const cleanStr = typeof probStr === 'string' ? probStr : JSON.stringify(probStr);
  const parts = cleanStr.replace(/([+\-x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
  return (
    <div className="flex items-center gap-1 text-lg font-bold font-mono py-2 break-inside-avoid justify-start pl-4 border-b border-dashed border-slate-100/50">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0 text-sm">{index}.</span>
      <div className="flex items-center flex-wrap">
        {parts.map((part: string, i: number) => {
          if (part === '_') return <div key={i} className="w-10 h-8 bg-blue-50 border border-blue-100 rounded-md mx-1 shadow-inner shrink-0" />;
          if (part === '=') return <span key={i} className="mx-1 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-1 text-blue-400">×</span>;
          if (part === '+' || part === '-') return <span key={i} className="mx-1 text-primary">{part}</span>;
          return <span key={i} className={cn("mx-0.5 text-slate-700", isAnswer && "text-red-500 underline decoration-dotted font-black")}>{part}</span>;
        })}
      </div>
    </div>
  );
};

const TopicSection = ({ batch, batchIdx, startIndex, isAnswer = false }: { batch: QuestionBatch, batchIdx: number, startIndex: number, isAnswer?: boolean }) => {
  const getInstruction = (topicId: number) => {
    switch (topicId) {
      case 1: return "Tính toán nhanh. (Điền số thích hợp vào chỗ trống)";
      case 2: return "Bảng nhân thông minh. (Thực hiện phép tính nhân)";
      case 3: return "So sánh số. (Điền dấu > ; < ; = vào ô trống)";
      case 4: return "Đặt tính rồi tính. (Thực hiện phép tính hàng dọc)";
      case 5: return "Quy luật chu kỳ. (Nhận diện quy luật và hoàn thành dãy số)";
      default: return "Luyện tập tư duy toán học.";
    }
  };

  const isVertical = batch.topicId === 4;
  const isSequence = batch.topicId === 5;

  return (
    <div className="mb-4 break-inside-avoid-page">
      <div className="topic-section-header mb-1">
        <h3 className="text-base font-black text-primary uppercase tracking-tight">
          Bài {batchIdx + 1}: {batch.topicTitle}
        </h3>
        <p className="topic-instruction text-[10px] italic text-slate-600 font-medium font-serif">
          ({getInstruction(batch.topicId)})
        </p>
      </div>
      <div className={cn(
        "grid gap-x-4 gap-y-1",
        isVertical ? "grid-cols-5" : (isSequence ? "grid-cols-1" : "grid-cols-2")
      )}>
        {batch.problems.map((prob, idx) => (
          <ProblemRow key={idx} index={startIndex + idx + 1} problem={prob} isAnswer={isAnswer} topicId={batch.topicId} />
        ))}
      </div>
    </div>
  );
};

export default function ArchimedesMixerPage() {
  const [cart, setCart] = React.useState<QuestionBatch[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAnswers, setShowAnswers] = React.useState(false)
  
  // Settings for each topic
  const [cd1Settings, setCd1Settings] = React.useState({ count: 5, unknownVariable: "D" as any, operationMode: "mixed" as any, maxRange: 20 })
  const [cd2Settings, setCd2Settings] = React.useState({ count: 5, tables: [2, 5, 10], unknownVariable: "C" as any, shuffle: true })
  const [cd3Settings, setCd3Settings] = React.useState({ count: 5, level: "1" as any, maxRange: 20, operationMode: "mixed" as any })
  const [cd4Settings, setCd4Settings] = React.useState({ 
    count: 5, 
    operation: "plus" as any, 
    digits: 2, 
    hasCarry: false, 
    hideTarget: "mixed" as any,
    rangeN1: { min: 10, max: 99 },
    rangeN2: { min: 10, max: 99 },
    rangeResult: { min: 0, max: 198 }
  })
  const [cd5Settings, setCd5Settings] = React.useState({ count: 2, cycleLength: 3, maxCycleSum: 30 })

  const { toast } = useToast()
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({ 
    contentRef,
    documentTitle: "BoHocToan_PhieuBaiTap",
  })

  const batchesWithIndices = React.useMemo(() => {
    let currentIndex = 0;
    return cart.map(batch => {
      const startIndex = currentIndex;
      currentIndex += batch.count;
      return { ...batch, startIndex };
    });
  }, [cart]);

  const totalCount = cart.reduce((acc, batch) => acc + batch.count, 0)
  const densityPercent = Math.min((totalCount / 40) * 100, 100)
  
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
      {/* Configuration Header */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-primary/10">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold">BƠ HỌC TOÁN - Master Mixer</Badge>
            <h1 className="text-4xl font-black tracking-tight text-primary uppercase leading-none">Bộ Trộn Đề Archimedes</h1>
            <p className="text-muted-foreground max-w-xl">Tái cấu trúc đề thi theo từng Bài học. Tối ưu hóa trang in.</p>
          </div>
          <div className="max-w-md space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-primary">
              <span>Mật độ trang in (A4)</span>
              <span className={cn(totalCount > 40 && "text-destructive", totalCount === 40 && "text-green-600")}>{totalCount}/40 câu (Ước tính)</span>
            </div>
            <Progress value={densityPercent} className="h-2" indicatorClassName={totalCount > 40 ? "bg-destructive" : "bg-primary"} />
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
        {/* Left Column - Topic Cards */}
        <div className="lg:col-span-5 space-y-4 no-print">
          {[
            { id: 1, title: "CĐ1: Biểu thức 3 số", color: "bg-primary", icon: Calculator, settings: cd1Settings, setter: setCd1Settings },
            { id: 2, title: "CĐ2: Phép nhân", color: "bg-accent", icon: Sparkles, settings: cd2Settings, setter: setCd2Settings },
            { id: 3, title: "CĐ3: So sánh biểu thức", color: "bg-blue-400", icon: Scale, settings: cd3Settings, setter: setCd3Settings },
            { id: 4, title: "CĐ4: Tính hàng dọc", color: "bg-orange-400", icon: Columns2, settings: cd4Settings, setter: setCd4Settings },
            { id: 5, title: "CĐ5: Quy luật dãy số", color: "bg-purple-400", icon: ListOrdered, settings: cd5Settings, setter: setCd5Settings }
          ].map((topic) => (
            <Card key={topic.id} className="border-none shadow-md overflow-hidden bg-white">
              <div className={cn("h-1 w-full", topic.color)} />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <topic.icon className="size-4 opacity-40"/> {topic.title}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <Label className="text-[10px] font-bold">CÂU:</Label>
                    <Input type="number" value={topic.settings.count} onChange={(e) => topic.setter((s: any) => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-12 h-7 text-xs text-center p-0" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild><Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] font-bold gap-1"><Settings2 className="size-3" /> Cấu hình</Button></PopoverTrigger>
                    <PopoverContent className="w-80 p-6 overflow-y-auto max-h-[80vh]">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-2">
                          <p className="text-xs font-black text-primary uppercase tracking-widest">{topic.title}</p>
                          <Settings2 className="size-4 text-primary/40" />
                        </div>
                        
                        {/* Topic 1 Specific Settings */}
                        {topic.id === 1 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Phạm vi tối đa (Range)</Label>
                              <Input type="number" value={topic.settings.maxRange} onChange={(e) => topic.setter((s: any) => ({ ...s, maxRange: parseInt(e.target.value) }))} className="h-8" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Vị trí ẩn số</Label>
                              <Select value={topic.settings.unknownVariable} onValueChange={(v) => topic.setter((s: any) => ({ ...s, unknownVariable: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="A">Vị trí A</SelectItem>
                                  <SelectItem value="B">Vị trí B</SelectItem>
                                  <SelectItem value="C">Vị trí C</SelectItem>
                                  <SelectItem value="D">Vị trí D</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Loại phép tính</Label>
                              <RadioGroup value={topic.settings.operationMode} onValueChange={(v) => topic.setter((s: any) => ({ ...s, operationMode: v }))} className="grid grid-cols-3 gap-2">
                                <div className="flex items-center space-x-1"><RadioGroupItem value="plus" id="tp1"/><Label htmlFor="tp1" className="text-[10px]">Cộng</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="minus" id="tm1"/><Label htmlFor="tm1" className="text-[10px]">Trừ</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="mixed" id="tx1"/><Label htmlFor="tx1" className="text-[10px]">Trộn</Label></div>
                              </RadioGroup>
                            </div>
                          </div>
                        )}

                        {/* Topic 2 Specific Settings */}
                        {topic.id === 2 && (
                           <div className="space-y-4">
                              <Label className="text-xs font-bold">Bảng cửu chương</Label>
                              <div className="grid grid-cols-4 gap-2">
                                {[2,3,4,5,6,7,8,9].map(n => (
                                   <div key={n} className="flex items-center gap-1">
                                      <Checkbox id={`check-${n}`} checked={topic.settings.tables?.includes(n)} onCheckedChange={(c) => {
                                         const next = c ? [...topic.settings.tables, n] : topic.settings.tables.filter((x: any) => x !== n);
                                         topic.setter((s: any) => ({ ...s, tables: next }));
                                      }} />
                                      <Label htmlFor={`check-${n}`} className="text-[10px]">{n}</Label>
                                   </div>
                                ))}
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-bold">Vị trí ẩn số</Label>
                                <Select value={topic.settings.unknownVariable} onValueChange={(v) => topic.setter((s: any) => ({ ...s, unknownVariable: v }))}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="A">Thừa số 1 (A)</SelectItem>
                                    <SelectItem value="B">Thừa số 2 (B)</SelectItem>
                                    <SelectItem value="C">Tích số (C)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox id="t2-shuffle" checked={topic.settings.shuffle} onCheckedChange={(c) => topic.setter((s: any) => ({ ...s, shuffle: !!c }))} />
                                <Label htmlFor="t2-shuffle" className="text-xs font-bold">Xáo trộn</Label>
                              </div>
                           </div>
                        )}

                        {/* Topic 3 Specific Settings */}
                        {topic.id === 3 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Cấp độ</Label>
                              <Select value={topic.settings.level} onValueChange={(v) => topic.setter((s: any) => ({ ...s, level: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">CĐ 1: Biểu thức vs Số</SelectItem>
                                  <SelectItem value="2">CĐ 2: Cùng vế</SelectItem>
                                  <SelectItem value="3">CĐ 3: Hai vế khác nhau</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Phạm vi (Max)</Label>
                              <Input type="number" value={topic.settings.maxRange} onChange={(e) => topic.setter((s: any) => ({ ...s, maxRange: parseInt(e.target.value) }))} className="h-8" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Loại phép tính</Label>
                              <RadioGroup value={topic.settings.operationMode} onValueChange={(v) => topic.setter((s: any) => ({ ...s, operationMode: v }))} className="grid grid-cols-3 gap-2">
                                <div className="flex items-center space-x-1"><RadioGroupItem value="plus" id="tp3"/><Label htmlFor="tp3" className="text-[10px]">Cộng</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="minus" id="tm3"/><Label htmlFor="tm3" className="text-[10px]">Trừ</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="mixed" id="tx3"/><Label htmlFor="tx3" className="text-[10px]">Trộn</Label></div>
                              </RadioGroup>
                            </div>
                          </div>
                        )}

                        {/* Topic 4 Specific Settings */}
                        {topic.id === 4 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Loại phép tính</Label>
                              <RadioGroup value={topic.settings.operation} onValueChange={(v) => topic.setter((s: any) => ({ ...s, operation: v }))} className="grid grid-cols-3 gap-2">
                                <div className="flex items-center space-x-1"><RadioGroupItem value="plus" id="tp4"/><Label htmlFor="tp4" className="text-[10px]">Cộng</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="minus" id="tm4"/><Label htmlFor="tm4" className="text-[10px]">Trừ</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="mixed" id="tx4"/><Label htmlFor="tx4" className="text-[10px]">Trộn</Label></div>
                              </RadioGroup>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Số chữ số</Label>
                              <Select value={topic.settings.digits.toString()} onValueChange={(v) => topic.setter((s: any) => ({ ...s, digits: parseInt(v) }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 chữ số</SelectItem>
                                  <SelectItem value="2">2 chữ số</SelectItem>
                                  <SelectItem value="3">3 chữ số</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold">Có nhớ / Mượn</Label>
                              <Switch checked={topic.settings.hasCarry} onCheckedChange={(c) => topic.setter((s: any) => ({ ...s, hasCarry: c }))} />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Vị trí ẩn</Label>
                              <Select value={topic.settings.hideTarget} onValueChange={(v) => topic.setter((s: any) => ({ ...s, hideTarget: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="result">Chỉ kết quả</SelectItem>
                                  <SelectItem value="operands">Chỉ số hạng</SelectItem>
                                  <SelectItem value="mixed">Hỗn hợp</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Detailed Range Settings for Topic 4 */}
                            <div className="space-y-3 p-3 rounded-lg border bg-muted/5">
                              <Label className="text-[10px] font-bold uppercase text-muted-foreground">Phạm vi số hạng</Label>
                              <div className="space-y-2">
                                <Label className="text-[10px]">N1 (Min - Max)</Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" value={topic.settings.rangeN1.min} onChange={(e) => topic.setter((s: any) => ({ ...s, rangeN1: { ...s.rangeN1, min: parseInt(e.target.value) } }))} className="h-7 text-xs" />
                                  <Input type="number" value={topic.settings.rangeN1.max} onChange={(e) => topic.setter((s: any) => ({ ...s, rangeN1: { ...s.rangeN1, max: parseInt(e.target.value) } }))} className="h-7 text-xs" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-[10px]">Result (Min - Max)</Label>
                                <div className="flex items-center gap-2">
                                  <Input type="number" value={topic.settings.rangeResult.min} onChange={(e) => topic.setter((s: any) => ({ ...s, rangeResult: { ...s.rangeResult, min: parseInt(e.target.value) } }))} className="h-7 text-xs" />
                                  <Input type="number" value={topic.settings.rangeResult.max} onChange={(e) => topic.setter((s: any) => ({ ...s, rangeResult: { ...s.rangeResult, max: parseInt(e.target.value) } }))} className="h-7 text-xs" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Topic 5 Specific Settings */}
                        {topic.id === 5 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Độ dài chu kỳ</Label>
                              <Select value={topic.settings.cycleLength.toString()} onValueChange={(v) => topic.setter((s: any) => ({ ...s, cycleLength: parseInt(v) }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3">Chu kỳ 3</SelectItem>
                                  <SelectItem value="4">Chu kỳ 4</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Tổng chu kỳ (Max)</Label>
                              <Input type="number" value={topic.settings.maxCycleSum} onChange={(e) => topic.setter((s: any) => ({ ...s, maxCycleSum: parseInt(e.target.value) }))} className="h-8" />
                            </div>
                          </div>
                        )}
                        
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => addToExam(topic.id)} disabled={isLoading} className={cn("flex-[2] h-7 text-[10px] font-bold gap-1", topic.id === 1 ? "bg-primary text-white" : "bg-muted text-foreground hover:bg-muted/80")}>
                    {isLoading ? <Layers className="size-3 animate-spin" /> : <PlusCircle className="size-3" />} Thêm đề
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Cart View */}
          {cart.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm divide-y overflow-hidden">
               <div className="p-2 bg-muted/30 font-bold text-[10px] uppercase text-muted-foreground flex justify-between items-center">
                 <span>Giỏ hàng bài tập</span>
                 <Badge variant="outline" className="text-[9px] bg-white">{cart.length} nhóm</Badge>
               </div>
              {cart.map((batch) => (
                <div key={batch.id} className="p-2 flex items-center justify-between hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary truncate max-w-[120px]">{batch.topicTitle}</span>
                    <Badge variant="secondary" className="text-[8px] h-4 bg-primary/5 text-primary px-1">{batch.count} câu</Badge>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeBatch(batch.id)} className="size-6 text-destructive hover:bg-destructive/10"><Trash2 className="size-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Print Preview */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl min-h-[800px] flex flex-col bg-white overflow-hidden ring-1 ring-primary/5">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between p-4">
              <div><CardTitle className="text-base flex items-center gap-2 text-primary"><FileText className="size-4" /> Xem trước trang in A4</CardTitle></div>
              {cart.length > 0 && <Button variant="outline" size="icon" onClick={() => setCart([])} className="size-8 rounded-full text-destructive"><Trash2 className="size-4" /></Button>}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {cart.length > 0 ? (
                <div className="p-0">
                  <div ref={contentRef} className="print-container bg-white text-black font-sans relative">
                    {/* Watermark Overlay */}
                    <div className="watermark-overlay fixed inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-[-1] overflow-hidden">
                       <Image 
                        src="https://storage.googleapis.com/demos-pipeline-artifacts-0f3d548b-3061-46c7-9857-e696cc86535d/image_15.png" 
                        alt="Watermark" 
                        width={800} 
                        height={800}
                        className="object-contain"
                      />
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b-4 border-primary pb-4">
                      <div className="flex items-center gap-4 shrink-0">
                        <Image 
                          src="https://storage.googleapis.com/demos-pipeline-artifacts-0f3d548b-3061-46c7-9857-e696cc86535d/image_15.png" 
                          alt="Logo" 
                          width={60} 
                          height={60} 
                          className="object-contain" 
                        />
                      </div>
                      <div className="text-center flex-1 px-4">
                        <h1 className="text-2xl font-black text-primary tracking-tighter uppercase leading-tight italic">Phiếu Bài Tập Tổng Hợp</h1>
                        <p className="text-[10px] italic text-accent font-bold font-serif">Number Garden - Vũ trụ số học cho bé</p>
                      </div>
                      <div className="text-right space-y-1 pt-1 shrink-0 w-[160px]">
                        <p className="text-[10px] font-bold border-b border-primary/20 pb-0.5">Họ tên: .............................</p>
                        <p className="text-[10px] font-bold border-b border-primary/20 pb-0.5">Ngày: ..................................</p>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      {batchesWithIndices.map((batch, idx) => (
                        <TopicSection 
                          key={batch.id} 
                          batch={batch} 
                          batchIdx={idx} 
                          startIndex={batch.startIndex} 
                        />
                      ))}
                    </div>

                    {/* Answer Key (Optional) */}
                    {showAnswers && (
                      <div className="page-break pt-10 relative">
                        <div className="mb-6 border-b-4 border-destructive pb-4">
                          <h1 className="text-2xl font-black text-destructive uppercase italic text-center">Đáp Án Chi Tiết</h1>
                        </div>
                        <div className="space-y-6">
                          {batchesWithIndices.map((batch, idx) => (
                            <TopicSection 
                              key={batch.id} 
                              batch={batch} 
                              batchIdx={idx} 
                              startIndex={batch.startIndex} 
                              isAnswer 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* On-screen Preview Footer (Buttons only) */}
                  <div className="no-print p-6 bg-slate-50/30">
                     <div className="text-center text-muted-foreground italic text-xs mb-4">
                       Bản xem trước nội dung trang in A4.
                     </div>
                     {batchesWithIndices.map((batch, idx) => (
                        <TopicSection key={batch.id} batch={batch} batchIdx={idx} startIndex={batch.startIndex} />
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
                   <p className="font-black text-xl text-primary/40 text-center uppercase tracking-widest">Sẵn sàng tạo đề rồi!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
