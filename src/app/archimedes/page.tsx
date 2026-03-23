
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
  Clock,
  ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { useToast } from "@/hooks/use-toast"

type TopicConfig = {
  id: number;
  title: string;
  formula: string;
  count: number;
  settings: {
    unknownVariable: "A" | "B" | "C" | "D";
    operationMode: "plus" | "minus" | "mixed";
    maxRange: number;
  };
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
    title: "Chuyên đề 2: Tìm x cơ bản",
    formula: "A + x = B",
    count: 5,
    settings: {
      unknownVariable: "B",
      operationMode: "plus",
      maxRange: 10,
    },
    enabled: false, // Sắp ra mắt
  }
];

export default function ArchimedesMixerPage() {
  const [topics, setTopics] = React.useState<TopicConfig[]>(initialTopics)
  const [mixedProblems, setMixedProblems] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const updateTopicCount = (id: number, count: number) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, count: Math.max(0, count) } : t))
  }

  const updateTopicSetting = (id: number, key: string, value: any) => {
    setTopics(prev => prev.map(t => t.id === id ? { ...t, settings: { ...t.settings, [key]: value } } : t))
  }

  const totalCount = topics.reduce((acc, t) => acc + (t.enabled ? t.count : 0), 0)

  async function handleGenerateMixedTest() {
    if (totalCount === 0) {
      toast({ title: "Lỗi", description: "Vui lòng chọn ít nhất 1 câu hỏi.", variant: "destructive" })
      return
    }

    setIsLoading(true)
    try {
      // Hiện tại chỉ CĐ1 có flow AI, chúng ta sẽ gọi flow này với số lượng yêu cầu
      const activeTopic = topics.find(t => t.id === 1 && t.enabled)
      if (activeTopic) {
        const result = await generateArchimedesMathProblems({
          unknownVariable: activeTopic.settings.unknownVariable,
          operationMode: activeTopic.settings.operationMode,
          numProblems: activeTopic.count,
          rangeA: { min: 0, max: activeTopic.settings.maxRange },
          rangeB: { min: 0, max: Math.floor(activeTopic.settings.maxRange / 2) },
          rangeC: { min: 0, max: Math.floor(activeTopic.settings.maxRange / 2) },
          rangeD: { min: 0, max: activeTopic.settings.maxRange * 2 },
        })
        setMixedProblems(result.problems)
        toast({ title: "Thành công!", description: `Đã tạo đề tổng hợp gồm ${result.problems.length} câu.` })
      } else {
        toast({ title: "Thông báo", description: "Các chuyên đề khác đang được cập nhật AI." })
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Lỗi", description: "Không thể kết nối với AI." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border">
        <div className="space-y-2">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1">
            Archimedes Mixer v1.0
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-primary">BỘ ĐIỀU PHỐI ĐỀ THI</h1>
          <p className="text-muted-foreground max-w-xl">
            Tùy chỉnh số lượng và độ khó từng chuyên đề để tạo ra một bài kiểm tra tổng hợp hoàn hảo cho bé.
          </p>
        </div>
        <div className="flex flex-col gap-3 min-w-[200px]">
          <div className="bg-muted/50 rounded-2xl p-4 border border-dashed text-center">
            <span className="block text-3xl font-black text-primary">{totalCount}</span>
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Tổng số câu hỏi</span>
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
        {/* Left: Topic Management */}
        <div className="lg:col-span-5 space-y-4 no-print">
          <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-primary/80">
            <Settings2 className="size-5" />
            Cấu hình Chuyên đề
          </h3>
          {topics.map((topic) => (
            <Card key={topic.id} className={`border-none shadow-md overflow-hidden transition-all ${!topic.enabled && "opacity-60 grayscale-[0.5]"}`}>
              <div className={`h-1.5 w-full ${topic.id === 1 ? "bg-primary" : "bg-blue-400"}`} />
              <CardHeader className="p-5 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <CardDescription className="font-mono text-[10px] mt-1">{topic.formula}</CardDescription>
                  </div>
                  {!topic.enabled && <Badge variant="secondary" className="text-[10px]">COMING SOON</Badge>}
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
                      <div className="space-y-2">
                        <h4 className="font-bold leading-none text-primary">Cấu hình nhanh CĐ{topic.id}</h4>
                        <p className="text-xs text-muted-foreground">Thiết lập tham số cho AI sinh đề.</p>
                      </div>
                      <div className="space-y-3 pt-2">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Phạm vi số (Max)</Label>
                          <Select 
                            value={topic.settings.maxRange.toString()} 
                            onValueChange={(v) => updateTopicSetting(topic.id, "maxRange", parseInt(v))}
                          >
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="10">Phạm vi 10</SelectItem>
                              <SelectItem value="20">Phạm vi 20</SelectItem>
                              <SelectItem value="50">Phạm vi 50</SelectItem>
                              <SelectItem value="100">Phạm vi 100</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Vị trí ẩn số</Label>
                          <Select 
                            value={topic.settings.unknownVariable} 
                            onValueChange={(v) => updateTopicSetting(topic.id, "unknownVariable", v)}
                          >
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">Vị trí A</SelectItem>
                              <SelectItem value="B">Vị trí B</SelectItem>
                              <SelectItem value="C">Vị trí C</SelectItem>
                              <SelectItem value="D">Kết quả D</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase font-bold">Phép tính</Label>
                          <RadioGroup 
                            defaultValue={topic.settings.operationMode}
                            onValueChange={(v) => updateTopicSetting(topic.id, "operationMode", v)}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="plus" id="p1" /><Label htmlFor="p1" className="text-xs">Chỉ +</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="minus" id="m1" /><Label htmlFor="m1" className="text-xs">Chỉ -</Label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <RadioGroupItem value="mixed" id="x1" /><Label htmlFor="x1" className="text-xs">Trộn</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" asChild className="w-full border-dashed py-10 rounded-2xl">
             <Link href="/archimedes/chuyen-de-1" className="flex flex-col gap-1">
                <span className="font-bold flex items-center gap-2">
                   Xem chi tiết Chuyên đề 1 <ArrowRight className="size-4" />
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Dành cho tùy chỉnh nâng cao</span>
             </Link>
          </Button>
        </div>

        {/* Right: Preview & Print */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-none shadow-2xl min-h-[700px] flex flex-col bg-white overflow-hidden">
            <CardHeader className="no-print border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <FileText className="size-5 text-primary" />
                  Xem trước đề thi
                </CardTitle>
                <CardDescription>Phiếu bài tập tổng hợp chuẩn A4.</CardDescription>
              </div>
              {mixedProblems.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="destructive" size="icon" onClick={() => setMixedProblems([])} className="rounded-full">
                    <Trash2 className="size-4" />
                  </Button>
                  <Button onClick={() => window.print()} className="gap-2 rounded-full font-bold">
                    <Printer className="size-4" />
                    In đề (PDF)
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {mixedProblems.length > 0 ? (
                <div className="p-10 print:p-0">
                  {/* Print Header */}
                  <div className="print-only mb-10 text-center border-b-2 border-black pb-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <p className="text-xs font-bold">Website: BOHOCTOAN.VN</p>
                        <p className="text-[10px] italic">Học toán cùng Bơ 🥑</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold uppercase">Ngày: {new Date().toLocaleDateString('vi-VN')}</p>
                        <p className="text-[10px]">Mã đề: ARCH-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <h1 className="text-3xl font-black uppercase tracking-[0.2em] border-y-2 border-black py-2">
                      PHIẾU BÀI TẬP TOÁN TƯ DUY
                    </h1>

                    <div className="grid grid-cols-3 gap-4 text-sm font-medium pt-2">
                      <div className="text-left">Họ và tên: .......................................</div>
                      <div>Lớp: ...................</div>
                      <div className="text-right">Thời gian: 45 phút</div>
                    </div>
                  </div>

                  {/* Problems Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-12 gap-y-8">
                    {mixedProblems.map((problem, index) => (
                      <div key={index} className="flex items-center gap-4 text-xl font-bold border-b border-dashed border-muted pb-4">
                        <span className="text-xs font-black bg-primary/10 text-primary size-6 rounded flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <div className="tracking-[0.15em] font-mono">
                          {problem.replace('=', ' = ')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Print Footer */}
                  <div className="print-only mt-20 text-center border-t border-muted pt-4">
                    <p className="text-xs italic text-muted-foreground">
                      "Kiên trì mỗi ngày, bé sẽ thành tài"
                    </p>
                    <div className="mt-8 flex justify-around text-sm font-bold opacity-30">
                       <div className="flex flex-col gap-10"><span>Chữ ký phụ huynh</span><div className="h-px w-32 bg-black" /></div>
                       <div className="flex flex-col gap-10"><span>Nhận xét của thầy cô</span><div className="h-px w-32 bg-black" /></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[600px] text-muted-foreground gap-6 p-12">
                   <div className="size-32 rounded-full bg-primary/5 flex items-center justify-center border-4 border-dashed border-primary/20 animate-pulse">
                      <Sparkles className="size-16 text-primary/30" />
                   </div>
                   <div className="text-center space-y-2">
                     <p className="font-black text-2xl text-foreground">Sẵn sàng để "Trộn Đề"?</p>
                     <p className="text-sm max-w-xs mx-auto">Chọn số lượng câu từ các chuyên đề bên trái và bấm nút "Tạo đề tổng hợp" để bắt đầu.</p>
                   </div>
                   <Button 
                    variant="outline" 
                    onClick={handleGenerateMixedTest}
                    className="border-primary text-primary hover:bg-primary/5 py-6 px-8 font-bold rounded-2xl"
                   >
                     Tạo đề mẫu 15 câu ngay
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
