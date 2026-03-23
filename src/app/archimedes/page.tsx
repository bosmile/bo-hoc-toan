"use client"

import * as React from "react"
import Link from "next/link"
import { 
  Calculator, 
  Printer, 
  Settings2, 
  Trash2, 
  Plus, 
  Minus, 
  Layers, 
  Sparkles,
  ArrowRight,
  FileText,
  QrCode,
  AlertCircle,
  X,
  PlusCircle,
  CheckCircle2,
  Scale,
  Columns2
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

const DigitBox = ({ digit, isAnswer = false }: { digit: string, isAnswer?: boolean }) => {
  if (digit === '_') {
    return (
      <div className="size-10 bg-blue-50 border-2 border-blue-200 rounded-md shadow-inner flex items-center justify-center" />
    );
  }
  return (
    <div className={cn(
      "size-10 flex items-center justify-center font-mono text-2xl font-bold",
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
    <div className="flex items-start gap-4">
      <span className="text-blue-600 font-sans font-bold text-sm shrink-0 pt-2">{index}.</span>
      <div className="flex flex-col items-end gap-1 relative pt-2">
        <div className="flex gap-1">
          {topDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && problem.top[i] === '_'} />)}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-blue-500 mr-2">{problem.operator}</span>
          <div className="flex gap-1">
            {bottomDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && problem.bottom[i] === '_'} />)}
          </div>
        </div>
        <div className="w-full h-1 bg-black rounded-full my-1" />
        <div className="flex gap-1">
          {resultDigits.map((d: string, i: number) => <DigitBox key={i} digit={d} isAnswer={isAnswer && problem.result[i] === '_'} />)}
        </div>
      </div>
    </div>
  );
};

const ProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  // Check if it's a vertical problem (object format or question field as object)
  if (problem.question && typeof problem.question === 'object') {
     return <VerticalProblemRow index={index} problem={isAnswer ? problem : problem.question} isAnswer={isAnswer} />;
  }

  const probStr = isAnswer ? problem.answer : problem.question;

  // Check if it's a comparison problem
  if (probStr.includes('_')) {
    const parts = probStr.split('_');
    return (
      <div className="flex items-center gap-4 text-xl font-bold font-mono py-2">
        <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
        <div className="flex items-center">
          <span className="whitespace-nowrap">{parts[0].trim()}</span>
          <ComparisonBox />
          <span className="whitespace-nowrap">{parts[1].trim()}</span>
        </div>
      </div>
    );
  }

  const parts = probStr.replace(/([+\-x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  return (
    <div className="flex items-center gap-4 text-xl font-bold font-mono py-2">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        {parts.map((part: string, i: number) => {
          if (part === '_') return <div key={i} className="w-14 h-10 bg-blue-50 border-2 border-blue-100 rounded-md mx-1 shadow-inner shrink-0" />;
          if (part === '=') return <span key={i} className="mx-2 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-2 text-blue-400">×</span>;
          if (part === '+' || part === '-') return <span key={i} className="mx-2 text-primary">{part}</span>;
          return <span key={i} className={cn("mx-1", isAnswer && probStr.includes('_') === false && "text-red-500 underline decoration-dotted")}>{part}</span>;
        })}
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
  const [cd4Settings, setCd4Settings] = React.useState({ count: 5, operation: "plus" as any, digits: 2, hasCarry: false, hideTarget: "mixed" as any })

  const { toast } = useToast()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const totalCount = cart.reduce((acc, batch) => acc + batch.count, 0)
  const densityPercent = Math.min((totalCount / 20) * 100, 150)
  
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
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 1, topicTitle: "Biểu thức 3 số", count: cd1Settings.count, settings: { ...cd1Settings }, problems: res.problems.map(p => ({ question: p, answer: p })) }
      } else if (topicId === 2) {
        const res = await generateMultiplicationProblems({ tables: cd2Settings.tables, unknownVariable: cd2Settings.unknownVariable, numProblems: cd2Settings.count, shuffle: cd2Settings.shuffle })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 2, topicTitle: "Phép nhân", count: cd2Settings.count, settings: { ...cd2Settings }, problems: res.problems }
      } else if (topicId === 3) {
        const res = await generateComparisonProblems({ level: cd3Settings.level, range: { min: 0, max: cd3Settings.maxRange }, operationMode: cd3Settings.operationMode, numProblems: cd3Settings.count })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 3, topicTitle: "So sánh biểu thức", count: cd3Settings.count, settings: { ...cd3Settings }, problems: res.problems }
      } else {
        const res = await generateVerticalMathProblems({ 
          operation: cd4Settings.operation, 
          digits: cd4Settings.digits, 
          hasCarry: cd4Settings.hasCarry, 
          hideTarget: cd4Settings.hideTarget, 
          numProblems: cd4Settings.count 
        })
        newBatch = { id: Math.random().toString(36).substr(2, 9), topicId: 4, topicTitle: "Tính hàng dọc", count: cd4Settings.count, settings: { ...cd4Settings }, problems: res.problems.map(p => ({ question: p, answer: p })) }
      }

      setCart(prev => [...prev, newBatch])
      toast({ title: "Thành công!", description: `Đã thêm ${newBatch.count} câu vào đề thi.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi AI", description: "Vui lòng thử lại sau." })
    } finally {
      setIsLoading(false)
    }
  }

  const allProblems = cart.flatMap(batch => batch.problems)
  const mid = Math.ceil(allProblems.length / 2);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">Archimedes Mixer v2.5</Badge>
            <h1 className="text-4xl font-black tracking-tight text-primary uppercase">Bộ Trộn Đề Archimedes</h1>
            <p className="text-muted-foreground max-w-xl">Chọn cấu hình từ các chuyên đề và "Thêm vào đề thi". Tổng 20 câu để tối ưu A4.</p>
          </div>
          <div className="max-w-md space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>Mật độ trang in (A4)</span>
              <span className={cn(totalCount > 20 && "text-destructive", totalCount === 20 && "text-green-600")}>{totalCount}/20 câu</span>
            </div>
            <Progress value={densityPercent} className="h-2" indicatorClassName={getDensityColor()} />
            {totalCount % 2 !== 0 && (
               <div className="flex items-center gap-1 text-[10px] text-orange-500 font-bold">
                  <AlertCircle className="size-3" /> Cảnh báo: Số câu lẻ sẽ làm lệch bố cục 2 cột.
               </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 min-w-[240px]">
          <div className="flex items-center justify-between px-2">
             <Label htmlFor="ans" className="text-xs font-bold uppercase text-muted-foreground">In kèm đáp án</Label>
             <Switch id="ans" checked={showAnswers} onCheckedChange={setShowAnswers} />
          </div>
          <Button size="lg" onClick={() => handlePrint()} disabled={allProblems.length === 0} className="w-full gap-2 font-black py-7 text-lg shadow-xl bg-primary">
            <Printer className="size-5" /> IN ĐỀ TOÁN (A4)
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6 no-print">
          {/* CD1 */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <div className="h-1.5 w-full bg-primary" />
            <CardHeader className="p-5 pb-2"><CardTitle className="text-sm font-bold">CĐ1: Biểu thức 3 số</CardTitle></CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold">SỐ CÂU:</Label>
                  <Input type="number" value={cd1Settings.count} onChange={(e) => setCd1Settings(s => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-14 h-8 text-center" />
                </div>
                <Popover>
                  <PopoverTrigger asChild><Button variant="ghost" size="sm" className="gap-2 text-primary font-bold"><Settings2 className="size-4" /> Cấu hình</Button></PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                    <div className="space-y-4">
                       <Select value={cd1Settings.maxRange.toString()} onValueChange={(v) => setCd1Settings(s => ({ ...s, maxRange: parseInt(v) }))}>
                         <SelectTrigger className="h-8"><SelectValue placeholder="Phạm vi" /></SelectTrigger>
                         <SelectContent><SelectItem value="10">Phạm vi 10</SelectItem><SelectItem value="20">Phạm vi 20</SelectItem><SelectItem value="50">Phạm vi 50</SelectItem></SelectContent>
                       </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => addToExam(1)} disabled={isLoading} className="w-full gap-2 font-bold bg-primary/10 text-primary hover:bg-primary/20">
                {isLoading ? <Layers className="size-4 animate-spin" /> : <PlusCircle className="size-4" />} Thêm vào đề thi
              </Button>
            </CardContent>
          </Card>

          {/* CD2 */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <div className="h-1.5 w-full bg-accent" />
            <CardHeader className="p-5 pb-2"><CardTitle className="text-sm font-bold">CĐ2: Phép nhân</CardTitle></CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold">SỐ CÂU:</Label>
                  <Input type="number" value={cd2Settings.count} onChange={(e) => setCd2Settings(s => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-14 h-8 text-center" />
                </div>
                <Popover>
                  <PopoverTrigger asChild><Button variant="ghost" size="sm" className="gap-2 text-primary font-bold"><Settings2 className="size-4" /> Cấu hình</Button></PopoverTrigger>
                  <PopoverContent className="w-64 p-4">
                     <div className="grid grid-cols-4 gap-2">
                        {[2,3,4,5,6,7,8,9].map(n => (
                           <div key={n} className="flex items-center gap-1">
                              <Checkbox checked={cd2Settings.tables.includes(n)} onCheckedChange={(c) => {
                                 const next = c ? [...cd2Settings.tables, n] : cd2Settings.tables.filter(x => x !== n);
                                 setCd2Settings(s => ({ ...s, tables: next }));
                              }} />
                              <span className="text-xs">{n}</span>
                           </div>
                        ))}
                     </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => addToExam(2)} disabled={isLoading} className="w-full gap-2 font-bold bg-accent/10 text-accent-foreground hover:bg-accent/20">
                {isLoading ? <Layers className="size-4 animate-spin" /> : <PlusCircle className="size-4" />} Thêm vào đề thi
              </Button>
            </CardContent>
          </Card>

          {/* CD3 */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <div className="h-1.5 w-full bg-blue-400" />
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex justify-between items-center">
                CĐ3: So sánh biểu thức
                <Scale className="size-4 text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold">SỐ CÂU:</Label>
                  <Input type="number" value={cd3Settings.count} onChange={(e) => setCd3Settings(s => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-14 h-8 text-center" />
                </div>
                <Popover>
                  <PopoverTrigger asChild><Button variant="ghost" size="sm" className="gap-2 text-primary font-bold"><Settings2 className="size-4" /> Cấu hình</Button></PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <Select value={cd3Settings.level} onValueChange={(v) => setCd3Settings(s => ({ ...s, level: v }))}>
                      <SelectTrigger className="h-8"><SelectValue placeholder="Cấp độ" /></SelectTrigger>
                      <SelectContent><SelectItem value="1">Cấp độ 1</SelectItem><SelectItem value="2">Cấp độ 2</SelectItem><SelectItem value="3">Cấp độ 3</SelectItem></SelectContent>
                    </Select>
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => addToExam(3)} disabled={isLoading} className="w-full gap-2 font-bold bg-blue-50 text-blue-600 hover:bg-blue-100">
                {isLoading ? <Layers className="size-4 animate-spin" /> : <PlusCircle className="size-4" />} Thêm vào đề thi
              </Button>
            </CardContent>
          </Card>

          {/* CD4 */}
          <Card className="border-none shadow-md overflow-hidden bg-white">
            <div className="h-1.5 w-full bg-orange-400" />
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-bold flex justify-between items-center">
                CĐ4: Tính hàng dọc
                <Columns2 className="size-4 text-orange-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-bold">SỐ CÂU:</Label>
                  <Input type="number" value={cd4Settings.count} onChange={(e) => setCd4Settings(s => ({ ...s, count: parseInt(e.target.value) || 0 }))} className="w-14 h-8 text-center" />
                </div>
                <Popover>
                  <PopoverTrigger asChild><Button variant="ghost" size="sm" className="gap-2 text-primary font-bold"><Settings2 className="size-4" /> Cấu hình</Button></PopoverTrigger>
                  <PopoverContent className="w-64 p-4 space-y-4">
                    <div className="space-y-3">
                      <Label className="text-xs">Số chữ số</Label>
                      <Select value={cd4Settings.digits.toString()} onValueChange={(v) => setCd4Settings(s => ({ ...s, digits: parseInt(v) }))}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 chữ số</SelectItem>
                          <SelectItem value="2">2 chữ số</SelectItem>
                          <SelectItem value="3">3 chữ số</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs">Phép tính</Label>
                      <Select value={cd4Settings.operation} onValueChange={(v) => setCd4Settings(s => ({ ...s, operation: v }))}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="plus">Cộng (+)</SelectItem>
                          <SelectItem value="minus">Trừ (-)</SelectItem>
                          <SelectItem value="mixed">Trộn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Có nhớ/mượn</Label>
                      <Switch checked={cd4Settings.hasCarry} onCheckedChange={(v) => setCd4Settings(s => ({ ...s, hasCarry: v }))} />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-xs">Vị trí ô trống</Label>
                      <Select value={cd4Settings.hideTarget} onValueChange={(v) => setCd4Settings(s => ({ ...s, hideTarget: v }))}>
                        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="result">Kết quả</SelectItem>
                          <SelectItem value="operands">Số hạng</SelectItem>
                          <SelectItem value="mixed">Hỗn hợp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={() => addToExam(4)} disabled={isLoading} className="w-full gap-2 font-bold bg-orange-50 text-orange-600 hover:bg-orange-100">
                {isLoading ? <Layers className="size-4 animate-spin" /> : <PlusCircle className="size-4" />} Thêm vào đề thi
              </Button>
            </CardContent>
          </Card>

          {cart.length > 0 && (
            <div className="bg-white rounded-xl border shadow-sm divide-y">
              {cart.map((batch) => (
                <div key={batch.id} className="p-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2"><span className="text-sm font-bold">{batch.topicTitle}</span><Badge variant="secondary" className="text-[9px] h-4">{batch.count} câu</Badge></div>
                    <p className="text-[9px] text-muted-foreground truncate max-w-[200px]">Cấu hình: {batch.topicId === 4 ? `${batch.settings.digits} số, ${batch.settings.hasCarry ? 'có nhớ' : 'ko nhớ'}` : 'Chuẩn'}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeBatch(batch.id)} className="size-7 text-destructive"><Trash2 className="size-3" /></Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl min-h-[700px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div><CardTitle className="text-xl flex items-center gap-2"><FileText className="size-5 text-primary" /> Xem trước đề thi</CardTitle></div>
              {allProblems.length > 0 && <Button variant="outline" size="icon" onClick={() => setCart([])} className="rounded-full text-destructive"><Trash2 className="size-4" /></Button>}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {allProblems.length > 0 ? (
                <div className="p-10 print:p-0" ref={contentRef}>
                  <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                    <div className="flex justify-between items-start mb-10 border-b-2 border-blue-600 pb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg"><Settings2 className="size-8 text-white" /></div>
                        <div><h1 className="text-3xl font-black text-blue-600 leading-none">MathLab</h1><p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Number Garden Edition</p></div>
                      </div>
                      <div className="text-right space-y-3 pt-2">
                        <p className="text-sm font-medium">Họ và tên: .....................................................</p>
                        <p className="text-sm font-medium">Ngày: ...........................................................</p>
                      </div>
                    </div>
                    <div className="mb-12 text-center">
                      <h2 className="text-4xl font-black text-blue-600 mb-2 uppercase">Phiếu Bài Tập Tổng Hợp</h2>
                      <p className="text-lg italic text-blue-400 font-medium">Thử thách vượt qua các bài toán tư duy nhé!</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                      <div className="space-y-10">{allProblems.slice(0, mid).map((res, idx) => <ProblemRow key={idx} index={idx + 1} problem={res} />)}</div>
                      <div className="space-y-10">{allProblems.slice(mid).map((res, idx) => <ProblemRow key={idx} index={idx + 1 + mid} problem={res} />)}</div>
                    </div>
                    <div className="absolute bottom-[15mm] left-[15mm] right-[15mm]">
                      <div className="flex justify-between items-end border-t border-gray-100 pt-8">
                         <div className="space-y-4"><div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold text-sm">🏆 Cố lên, bạn làm được mà!</div><p className="text-[10px] text-gray-400">© 2024 MathLab Educational Tools.</p></div>
                         <div className="flex flex-col items-center gap-1"><QrCode className="size-10 text-gray-200" /><span className="text-[8px] text-gray-400 font-bold uppercase">Quét để xem đáp án</span></div>
                      </div>
                    </div>
                  </div>
                  {showAnswers && (
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative page-break">
                       <div className="mb-10 border-b-2 border-red-600 pb-6"><h1 className="text-2xl font-black text-red-600 uppercase">Đáp Án Chi Tiết</h1></div>
                       <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                          <div className="space-y-10">{allProblems.slice(0, mid).map((res, idx) => <ProblemRow key={idx} index={idx + 1} problem={res} isAnswer />)}</div>
                          <div className="space-y-10">{allProblems.slice(mid).map((res, idx) => <ProblemRow key={idx} index={idx + 1 + mid} problem={res} isAnswer />)}</div>
                       </div>
                    </div>
                  )}
                  <div className="no-print space-y-4 p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {allProblems.map((res, index) => (
                           <div key={index} className="flex items-center gap-4 border-b border-dashed pb-8">
                              <ProblemRow index={index + 1} problem={res} />
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-muted-foreground gap-6">
                   <Sparkles className="size-16 text-primary/30 animate-pulse" /><p className="font-black text-2xl text-foreground text-center">Giỏ hàng đang trống!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
