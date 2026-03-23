"use client"

import * as React from "react"
import { Printer, RefreshCw, Trash2, MountainSnow, CheckCircle2 } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

type Pyramid = {
  id: number;
  F: number; D: number; E: number; A: number; B: number; C: number;
  hide: string[];
}

export default function ChuyenDe6Page() {
  const [problems, setProblems] = React.useState<Pyramid[]>([])
  const [qrUrl, setQrUrl] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()
  
  const contentRef = React.useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({ contentRef })

  React.useEffect(() => {
    if (problems.length > 0) {
      const answersList = problems.map(p => `A=${p.A}, B=${p.B}, C=${p.C}, D=${p.D}, E=${p.E}, F=${p.F}`)
      const text = JSON.stringify(answersList)
      const bytes = new TextEncoder().encode(text)
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("")
      const targetUrl = `${window.location.origin}/answers?q=${btoa(binString)}`
      setQrUrl(targetUrl)
    }
  }, [problems])

  const generatePyramids = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newProbs: Pyramid[] = []
      for(let i=0; i<8; i++) { // Generate 8 pyramids per page
        const A = Math.floor(Math.random() * 20) + 1
        const B = Math.floor(Math.random() * 20) + 1
        const C = Math.floor(Math.random() * 20) + 1
        const D = A + B
        const E = B + C
        const F = D + E
        
        // Pick hiding pattern to ensure solvable
        // P1: hide C, D, F -> known A, B, E
        // P2: hide A, C, F -> known D, E, B
        // P3: hide B, C, E -> known F, A, D
        const patterns = [
          ['C', 'D', 'F'],
          ['A', 'C', 'F'],
          ['B', 'C', 'E'],
          ['A', 'E', 'D']
        ]
        const hide = patterns[Math.floor(Math.random() * patterns.length)]
        newProbs.push({ id: i+1, A, B, C, D, E, F, hide })
      }
      setProblems(newProbs)
      setIsLoading(false)
      toast({ title: "Đã tạo 8 Kim tự tháp toán học!" })
    }, 500)
  }

  const renderBlock = (p: Pyramid, key: keyof Pyramid) => {
    const isHidden = p.hide.includes(key as string)
    return (
      <div className={`w-28 h-16 flex items-center justify-center border-4 border-primary rounded-xl font-black text-3xl shadow-sm ${isHidden ? 'bg-white text-transparent' : 'bg-primary/5 text-primary'}`}>
        {isHidden ? "" : p[key]}
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-start gap-4">
        <div>
          <Badge className="mb-2">Toán Hình Học Áp Dụng</Badge>
          <h1 className="text-3xl font-bold text-primary">Kim Tự Tháp Toán Học</h1>
          <p className="text-muted-foreground">Phát triển tư duy logic ngược qua thử thách Kim Tự Tháp.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="border-b bg-muted/20 flex flex-row items-center justify-between">
            <CardTitle>Bản in A4 thực tế</CardTitle>
            <div className="flex gap-2">
              <Button onClick={generatePyramids} disabled={isLoading} variant="outline" className="gap-2">
                <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} /> Tạo đề mới
              </Button>
              {problems.length > 0 && (
                <Button onClick={() => handlePrint()} className="gap-2 font-bold">
                  <Printer className="size-4" /> In PDF
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0 bg-gray-50 flex justify-center py-10 overflow-auto">
             {problems.length > 0 ? (
               <div ref={contentRef} className="w-[210mm] min-h-[297mm] bg-white text-black font-sans relative flex flex-col p-[15mm] shadow-2xl mx-auto origin-top" style={{ transform: 'scale(0.8)' }}>
                 
                 {/* WATERMARK */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                    <h1 className="text-[140px] font-black -rotate-45 text-primary whitespace-nowrap">KIM TỰ THÁP</h1>
                 </div>

                 {/* HEADER */}
                 <div className="flex justify-between items-start mb-10 border-b-2 border-primary pb-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary rounded-lg">
                        <MountainSnow className="size-16 text-white" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-black text-primary uppercase">BƠ HỌC TOÁN</h1>
                        <p className="text-[12px] font-bold mt-2">THỬ THÁCH KIM TỰ THÁP (CẤP 2)</p>
                      </div>
                    </div>
                    <div className="text-right space-y-4 pt-2">
                      <p className="text-lg font-bold">Họ tên: <span className="inline-block w-64 border-b-2 border-dotted border-gray-400"></span></p>
                      <p className="text-lg font-bold">Lớp: <span className="inline-block w-64 border-b-2 border-dotted border-gray-400"></span></p>
                    </div>
                    {qrUrl && (
                      <div className="absolute right-0 top-[110px] text-center border-2 border-primary/20 p-2 rounded-xl bg-white">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(qrUrl)}`} alt="QR" className="size-[90px]" />
                         <p className="text-[9px] font-black mt-2 text-primary">ĐÁP ÁN NHANH</p>
                      </div>
                    )}
                 </div>

                 <div className="mb-14 text-center relative z-10 mt-6">
                    <h2 className="text-5xl font-black text-primary mb-4 uppercase">Giữ Vững Đỉnh Tháp</h2>
                    <p className="text-xl italic text-accent font-bold">Quy luật: Hai viên đá kề nhau cộng lại sẽ ra viên đá nằm ngay phía trên chúng.</p>
                 </div>

                 {/* PYRAMIDS */}
                 <div className="grid grid-cols-2 gap-x-20 gap-y-16 relative z-10 px-10 flex-1">
                    {problems.map((p) => (
                      <div key={p.id} className="flex flex-col items-center">
                         <span className="text-primary font-black text-2xl mb-4 mr-auto border-b-4 border-primary pb-1">#{p.id}</span>
                         <div className="flex justify-center mb-[-4px]">
                            {renderBlock(p, 'F')}
                         </div>
                         <div className="flex justify-center gap-3 mb-[-4px]">
                            {renderBlock(p, 'D')}
                            {renderBlock(p, 'E')}
                         </div>
                         <div className="flex justify-center gap-3">
                            {renderBlock(p, 'A')}
                            {renderBlock(p, 'B')}
                            {renderBlock(p, 'C')}
                         </div>
                      </div>
                    ))}
                 </div>

                 {/* GRADING FOOTER */}
                 <div className="mt-auto border-t-2 border-primary/20 pt-8 flex justify-between items-end relative z-10 px-8 pb-4">
                    <div className="border-2 border-primary border-dashed rounded-2xl p-6 w-[350px] text-center bg-primary/5">
                       <p className="font-black text-lg text-primary uppercase mb-6 tracking-widest">KẾT QUẢ ĐÁNH GIÁ</p>
                       <div className="flex justify-center gap-6 text-primary/20">
                          <CheckCircle2 className="size-16 stroke-[1.5]" />
                          <CheckCircle2 className="size-16 stroke-[1.5]" />
                          <CheckCircle2 className="size-16 stroke-[1.5]" />
                       </div>
                    </div>
                 </div>

               </div>
             ) : (
               <div className="flex flex-col items-center justify-center p-20 text-muted-foreground">
                  <MountainSnow className="size-20 opacity-20 mb-6" />
                  <p className="font-bold text-xl">Bấm "Tạo đề mới" để sinh bài tập.</p>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
