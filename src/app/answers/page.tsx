"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ShieldCheck, Printer } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

function AnswersContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  const [answers, setAnswers] = React.useState<string[]>([])
  
  React.useEffect(() => {
    if (q) {
      try {
        // Decode base64
        const decoded = atob(q)
        const parsed = JSON.parse(decoded)
        if (Array.isArray(parsed)) {
          setAnswers(parsed)
        }
      } catch (e) {
        console.error("Invalid QR code data", e)
      }
    }
  }, [q])

  if (!q) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-xl font-bold text-muted-foreground">Không tìm thấy dữ liệu đáp án.</h1>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 animate-in fade-in duration-500">
      <Card className="border-none shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center bg-primary/5 pb-8">
           <div className="mx-auto size-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <ShieldCheck className="size-8 text-primary" />
           </div>
           <Badge className="mx-auto mb-2 bg-primary/20 text-primary hover:bg-primary/30">HỆ THỐNG GIÁO VIÊN</Badge>
           <CardTitle className="text-3xl font-black uppercase tracking-tight text-primary">Phiếu Đáp Án Chi Tiết</CardTitle>
           <CardDescription className="text-base mt-2">
              Bản quét QR bảo mật từ hệ thống Bơ Học Toán.
           </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
           <div className="grid grid-cols-2 gap-x-8 gap-y-4">
             {answers.map((ans, idx) => (
                <div key={idx} className="flex gap-3 text-lg border-b border-dashed pb-2">
                  <span className="font-bold text-muted-foreground w-8 text-right bg-muted rounded px-1">{idx + 1}.</span>
                  <span className="font-mono font-bold text-primary">{ans}</span>
                </div>
             ))}
           </div>
        </CardContent>
        <div className="p-6 bg-muted/20 border-t flex justify-center">
           <Button className="font-bold print:hidden" onClick={() => window.print()}>
             <Printer className="size-4 mr-2" />
             Lưu PDF Bản Đáp Án
           </Button>
        </div>
      </Card>
    </div>
  )
}

export default function AnswersPage() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <AnswersContent />
    </React.Suspense>
  )
}

