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
  AlertCircle
} from "lucide-react"
import { useReactToPrint } from "react-to-print"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { generateMultiplicationProblems } from "@/ai/flows/generate-multiplication-problems"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

type TopicConfig = {
  id: number;
  title: string;
  formula: string;
  count: number;
  settings: any;
  enabled: boolean;
};

const initialTopics: TopicConfig[] = [
  {
    id: 1,
    title: "Chuyên đề 1: Biểu thức ba số hạng",
    formula: "A ± B ± C = D",
    count: 10,
    settings: {
      unknownVariable: "D",
      operationMode: "mixed",
      maxRange: 20,
    },
    enabled: true,
  },
  {
    id: 2,
    title: "Chuyên đề 2: Phép nhân cơ bản",
    formula: "A x B = C",
    count: 10,
    settings: {
      tables: [2, 5, 10],
      unknownVariable: "C",
      shuffle: true,
    },
    enabled: true,
  }
];

const ProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: string, isAnswer?: boolean }) => {
  const parts = problem.replace(/([+\-x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
  return (
    <div className="flex items-center gap-4 text-xl font-bold font-mono">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0">{index}.</span>
      <div className="flex items-center">
        {parts.map((part, i) => {
          if (part === '=') return <span key={i} className="mx-2 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-2 text-blue-400">×</span>;
          if (part === '+' || part === '-') return <span key={i} className="mx-2 text-primary">{part}</span>;
          
          // Logic to identify if this was an underscore in the question
          // For simplicity, we assume the question had '_' at unknownVariable position.
          // In the mixed preview, we highlight the answer if isAnswer is true.
          return <span key={i} className={cn("mx-1", isAnswer && "text-red-500 underline decoration-dotted")}>{part}</span>;
        })}
      </div>
    </div>
  );
};

export default function ArchimedesMixerPage() {
  const [topics, setTopics] = React.useState<TopicConfig[]>(initialTopics)
  const [mixedResults, setMixedResults] = React.useState<{question: string, answer: string}[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAnswers, setShowAnswers] = React.useState(false)
  const { toast } = useToast()

  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  const updateTopicCount = (id: number, count: number) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, count: Math.max(0, count) } : t))
  }

  const updateTopicSetting = (id: number, key: string, value: any) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, settings: { ...t.settings, [key]: value } } : t))
  }

  const totalCount = topics.reduce((acc, t) => acc + (t.enabled ? t.count : 0), 0)
  const densityPercent = Math.min((totalCount / 20) * 100, 150)
  
  const getDensityColor = () => {
    if (totalCount === 20) return "bg-green-500";
    if (totalCount > 20) return "bg-destructive";
    return "bg-primary";
  }

  async function handleGenerateMixedTest() {
    if (totalCount === 0) {
      toast({ title: "Lỗi", description: "Vui lòng chọn ít nhất 1 câu hỏi.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      const allProblems: {question: string, answer: string}[] = [];
      
      // Handle Chuyên đề 1
      const cd1 = topics.find(t => t.id === 1 && t.enabled && t.count > 0)
      if (cd1) {
        const res = await generateArchimedesMathProblems({
          ...cd1.settings,
          numProblems: cd1.count,
          rangeA: { min: 0, max: cd1.settings.maxRange },
          rangeB: { min: 0, max: Math.floor(cd1.settings.maxRange / 2) },
          rangeC: { min: 0, max: Math.floor(cd1.settings.maxRange / 2) },
          rangeD: { min: 0, max: cd1.settings.maxRange * 2 },
        })
        // Chuyên đề 1 currently returns array of strings, we map them
        // Note: For CD1 to have answers, we'd need to update its flow. 
        // For now, we simulate answers by replacing '_' with the calculation.
        allProblems.push(...res.problems.map(p => ({ question: p, answer: p.replace('_', '??') })))
      }

      // Handle Chuyên đề 2
      const cd2 = topics.find(t => t.id === 2 && t.enabled && t.count > 0)
      if (cd2) {
        const res = await generateMultiplicationProblems({
          ...cd2.settings,
          numProblems: cd2.count,
        })
        allProblems.push(...res.problems)
      }

      setMixedResults(allProblems)
      toast({ title: "Thành công!", description: `Đã tạo đề tổng hợp gồm ${allProblems.length} câu.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể kết nối với AI." })
    } finally {
      setIsLoading(false)
    }
  }

  const mid = Math.ceil(mixedResults.length / 2);

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
              Archimedes Mixer v1.5
            </Badge>
            <h1 className="text-4xl font-black tracking-tight text-primary">BỘ ĐIỀU PHỐI ĐỀ THI</h1>
            <p className="text-muted-foreground max-w-xl">
              Tùy chỉnh và trộn các chuyên đề. Khuyến nghị: 20 câu để tối ưu trang in A4.
            </p>
          </div>
          
          <div className="max-w-md space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span>Mật độ trang in (A4)</span>
              <span className={cn(totalCount > 20 && "text-destructive", totalCount === 20 && "text-green-600")}>
                {totalCount}/20 câu
              </span>
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
          <Button 
            size="lg" 
            onClick={handleGenerateMixedTest} 
            disabled={isLoading || totalCount === 0}
            className="w-full gap-2 font-black py-7 text-lg shadow-xl"
          >
            {isLoading ? <Layers className="animate-spin" /> : <Sparkles />}
            {isLoading ? "ĐANG TRỘN ĐỀ..." : "TẠO ĐỀ TỔNG HỢP"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4 no-print">
          <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-primary/80">
            <Settings2 className="size-5" />
            Cấu hình Chuyên đề
          </h3>
          {topics.map((topic) => (
            <Card key={topic.id} className={cn("border-none shadow-md overflow-hidden transition-all", !topic.enabled && "opacity-60 grayscale-[0.5]")}>
              <div className={cn("h-1.5 w-full", topic.id === 1 ? "bg-primary" : "bg-accent")} />
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <CardDescription className="font-mono text-[10px] mt-1">{topic.formula}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Label className="text-xs font-bold text-muted-foreground">SỐ CÂU:</Label>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="size-8 rounded-full"
                      onClick={() => updateTopicCount(topic.id, topic.count - 1)}
                      disabled={!topic.enabled || topic.count <= 0}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <Input 
                      type="number" 
                      value={topic.count} 
                      onChange={(e) => updateTopicCount(topic.id, parseInt(e.target.value) || 0)}
                      className="w-14 h-8 text-center font-bold"
                      disabled={!topic.enabled}
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="size-8 rounded-full"
                      onClick={() => updateTopicCount(topic.id, topic.count + 1)}
                      disabled={!topic.enabled}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>

                {topic.enabled && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 text-primary font-bold">
                        <Settings2 className="size-4" />
                        Cấu hình
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 space-y-4 p-6 shadow-2xl">
                       {topic.id === 1 ? (
                         <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-bold">Phạm vi số (Max)</Label>
                            <Select 
                              value={topic.settings.maxRange?.toString()} 
                              onValueChange={(v) => updateTopicSetting(topic.id, "maxRange", parseInt(v))}
                            >
                              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                       ) : (
                         <div className="space-y-3">
                            <Label className="text-[10px] uppercase font-bold">Bảng cửu chương</Label>
                            <div className="grid grid-cols-4 gap-2">
                               {[2,3,4,5,6,7,8,9].map(n => (
                                 <div key={n} className="flex items-center gap-1">
                                    <Checkbox 
                                      checked={topic.settings.tables?.includes(n)}
                                      onCheckedChange={(c) => {
                                        const curr = topic.settings.tables || [];
                                        const next = c ? [...curr, n] : curr.filter((x: number) => x !== n);
                                        updateTopicSetting(topic.id, "tables", next);
                                      }}
                                    />
                                    <span className="text-xs">{n}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                       )}
                    </PopoverContent>
                  </Popover>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl min-h-[700px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Xem trước đề thi
                </CardTitle>
                <CardDescription>Mật độ hiện tại: {totalCount}/20 câu.</CardDescription>
              </div>
              {mixedResults.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button onClick={() => handlePrint()} className="gap-2 bg-primary text-white font-bold">
                    <Printer className="size-4" />
                    In đề toán
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => setMixedResults([])} className="rounded-full">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {mixedResults.length > 0 ? (
                <div className="p-10 print:p-0">
                  <div ref={contentRef}>
                    {/* Page 1: Worksheet */}
                    <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative">
                      <div className="flex justify-between items-start mb-10 border-b-2 border-blue-600 pb-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <Settings2 className="size-8 text-white" />
                          </div>
                          <div>
                            <h1 className="text-3xl font-black text-blue-600 leading-none">MathLab</h1>
                            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-1">Number Garden Edition</p>
                          </div>
                        </div>
                        <div className="text-right space-y-3 pt-2">
                          <p className="text-sm font-medium">Họ và tên: .....................................................</p>
                          <p className="text-sm font-medium">Ngày: ...........................................................</p>
                        </div>
                      </div>

                      <div className="mb-12 text-center">
                        <h2 className="text-4xl font-black text-blue-600 mb-2 uppercase">Phiếu Bài Tập Tổng Hợp</h2>
                        <p className="text-lg italic text-blue-400 font-medium">Thử thách điền số thích hợp vào chỗ trống nhé!</p>
                      </div>

                      <div className="grid grid-cols-2 gap-x-16 gap-y-10">
                        <div className="space-y-10">
                          {mixedResults.slice(0, mid).map((res, idx) => (
                             <ProblemRow key={idx} index={idx + 1} problem={res.question} />
                          ))}
                        </div>
                        <div className="space-y-10">
                          {mixedResults.slice(mid).map((res, idx) => (
                             <ProblemRow key={idx} index={idx + 1 + mid} problem={res.question} />
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-[15mm] left-[15mm] right-[15mm]">
                        <div className="flex justify-between items-end border-t border-gray-100 pt-8">
                           <div className="space-y-4">
                              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold text-sm">
                                 <span className="text-lg">🏆</span> Cố lên, bạn làm được mà!
                              </div>
                              <p className="text-[10px] text-gray-400">© 2024 MathLab Educational Tools.</p>
                           </div>
                           <div className="flex flex-col items-center gap-1">
                              <QrCode className="size-10 text-gray-200" />
                              <span className="text-[8px] text-gray-400 font-bold uppercase">Quét để xem đáp án</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Page 2: Answer Key (Conditional) */}
                    {showAnswers && (
                      <div className="print-only w-[210mm] min-h-[297mm] mx-auto p-[15mm] bg-white text-black font-sans relative page-break">
                         <div className="mb-10 border-b-2 border-red-600 pb-6">
                            <h1 className="text-2xl font-black text-red-600 uppercase">Đáp Án Chi Tiết</h1>
                         </div>
                         <div className="grid grid-cols-2 gap-x-16 gap-y-8">
                            <div className="space-y-6">
                              {mixedResults.slice(0, mid).map((res, idx) => (
                                <ProblemRow key={idx} index={idx + 1} problem={res.answer} isAnswer />
                              ))}
                            </div>
                            <div className="space-y-6">
                              {mixedResults.slice(mid).map((res, idx) => (
                                <ProblemRow key={idx} index={idx + 1 + mid} problem={res.answer} isAnswer />
                              ))}
                            </div>
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Browser Preview */}
                  <div className="no-print space-y-4 p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {mixedResults.map((res, index) => (
                           <div key={index} className="flex items-center gap-4 text-xl font-bold border-b border-dashed pb-4">
                              <span className="text-xs bg-primary/10 text-primary size-6 rounded-full flex items-center justify-center shrink-0">{index + 1}</span>
                              <div className="font-mono">{showAnswers ? res.answer : res.question}</div>
                           </div>
                        ))}
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-muted-foreground gap-6">
                   <Sparkles className="size-16 text-primary/30 animate-pulse" />
                   <p className="font-black text-2xl text-foreground">Sẵn sàng để "Trộn Đề"?</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
