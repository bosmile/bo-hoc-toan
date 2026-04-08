// @ts-nocheck
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
  ChevronDown,
  Clock,
  BookOpen,
  LayoutDashboard,
  EyeOff,
  List
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { generateArchimedesMathProblems } from "@/ai/flows/generate-archimedes-math-problems"
import { generateMultiplicationProblems } from "@/ai/flows/generate-multiplication-problems"
import { generateComparisonProblems } from "@/ai/flows/generate-comparison-problems"
import { generateVerticalMathProblems } from "@/ai/flows/generate-vertical-math-problems"
import { generateSequenceProblems } from "@/ai/flows/generate-sequence-problems"
import { generateSudokuProblems } from "@/ai/flows/generate-sudoku-problems"
import { generateClockProblems } from "@/ai/flows/generate-clock-problems"
import { generateBalanceProblems } from "@/ai/flows/generate-balance-problems"
import { generateWordProblems } from "@/ai/flows/generate-word-problems"
import { generateAdvancedQuestions } from "@/app/archimedes/chuyen-de-8/page"
import { generateSingaporeMath } from "@/ai/flows/generate-singapore-math"
import { AnalogClock } from "@/components/archimedes/analog-clock"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { PrintHeader } from "@/components/print-header"
import { PrintFooter } from "@/components/print-footer"

type QuestionBatch = {
  id: string;
  topicId: number;
  topicTitle: string;
  count: number;
  settings: any;
  problems: any[];
};

const ComparisonBox = () => (
  <div className="size-8 bg-white border border-gray-400 rounded-md mx-2 shrink-0 relative flex items-center justify-center overflow-hidden">
  </div>
);

const SequenceBox = ({ value, isAnswer = false }: { value: string, isAnswer?: boolean }) => {
  const isBlank = value === '_';
  return (
    <div className={cn(
      "size-9 flex items-center justify-center border font-mono text-[15px] font-bold shadow-sm p-0 flex-shrink-0 leading-none",
      isBlank 
        ? "bg-white border-gray-400 rounded-md shadow-inner relative overflow-hidden" 
        : "bg-white border-gray-300 rounded-sm text-slate-700"
    )}>
      {isAnswer && isBlank ? (
        <span className="text-red-500 underline decoration-dotted decoration-red-200 underline-offset-2 font-black text-[15px]">?</span>
      ) : (isBlank ? "" : value)}
    </div>
  );
};

const DigitBox = ({ digit, isAnswer = false }: { digit: string, isAnswer?: boolean }) => {
  if (digit === '_') {
    return (
      <div className="size-9 bg-white border border-gray-400 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden leading-none">
        {isAnswer && <span className="text-red-500 font-black text-[15px]">?</span>}
      </div>
    );
  }
  return (
    <div className={cn(
      "size-9 flex items-center justify-center font-mono text-[15px] font-bold leading-none",
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
    <div className="flex flex-col items-center justify-center break-inside-avoid print:py-1">
      <div className="flex items-start gap-1 leading-none">
        <span className="text-blue-600 font-sans font-bold text-[15px] shrink-0 pt-3">{index}.</span>
        <div className="flex flex-col items-end gap-0.5 relative pt-1 pr-1">
          <span className="absolute left-[-18px] top-[42px] text-[15px] font-bold text-blue-500">{problem.operator}</span>
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
  if (topicId === 8) { // Logic Math
     return (
        <div className="col-span-full mb-4 print:mb-2 break-inside-avoid">
           <div className="flex items-start gap-1.5 w-full leading-tight">
              <span className="shrink-0 font-bold text-blue-600 text-[15px] mt-0.5 min-w-[20px] text-right">{index}.</span>
              <div className="flex-1">
                 <p className="text-[15px] font-bold text-slate-800 text-left whitespace-pre-wrap mb-0">
                    {problem.questionText || problem.story}
                 </p>
                 
                 {isAnswer ? (
                    <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 print:bg-white text-xs">
                       <span className="font-black text-[9px] uppercase text-blue-500 italic border-b border-slate-200 pb-1 mb-2 block tracking-widest">HƯỚNG DẪN GIẢI:</span>
                       <div className="text-[15px] font-bold text-slate-900 leading-tight">{problem.solution}</div>
                       <div className="mt-2 text-[12px] font-black text-blue-700">Đáp án: {problem.answer}</div>
                    </div>
                 ) : (
                    <div className="w-full mt-1 bg-white">
                       <div className="text-[10px] font-black italic text-blue-500 uppercase tracking-widest my-0.5">
                          BÀI GIẢI:
                       </div>
                       <div className="space-y-0 w-full mb-1">
                          <div className="border-b border-dotted border-slate-300 h-7 w-full" />
                          <div className="border-b border-dotted border-slate-300 h-7 w-full" />
                          <div className="border-b border-dotted border-slate-300 h-7 w-full" />
                       </div>
                       <div className="flex justify-end items-center gap-3 pr-2 mt-2">
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">ĐÁP SỐ:</span>
                          <div className="border border-slate-300 w-24 h-8 rounded-lg bg-white" />
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
     );
  }

  if (topicId === 7) { // Clock
     const isRead = problem.type === 'read';
     const showHands = isRead || isAnswer;
     return (
        <div className="col-span-1 flex flex-col items-center gap-2 py-4 border-b border-dashed border-slate-100/50 break-inside-avoid">
           <div className="flex items-center gap-2 w-full px-2">
              <span className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">{index}</span>
              <p className="text-[10px] font-bold text-slate-700 tracking-tight leading-none">
                {isRead ? "Đồng hồ chỉ mấy giờ?" : "Vẽ kim đồng hồ:"}
              </p>
           </div>
           <AnalogClock 
              hour={problem.hour} 
              minute={problem.minute} 
              showHands={showHands} 
              size={140}
              hourHandColor={isAnswer && !isRead ? "#ef4444" : "#1e293b"}
              minuteHandColor={isAnswer && !isRead ? "#ef4444" : "#1e293b"}
           />
           <div className="w-full flex justify-center mt-1">
              <div className={cn(
                "h-9 border-2 rounded-lg flex items-center justify-center font-mono text-[15px] font-bold",
                isRead ? (isAnswer ? "w-20 bg-green-50 text-green-700 border-green-200" : "w-20 bg-white border-slate-300") : "px-3 bg-primary/5 text-primary border-primary/20"
              )}>
                {isRead ? (isAnswer ? problem.displayTime : "") : problem.displayTime}
              </div>
           </div>
        </div>
     );
  }

  if (topicId === 6) { // Sudoku
      const n = problem.size;
      const gridData = isAnswer ? problem.solution : problem.grid;
      const is6x6 = n === 6;
      const is9x9 = n === 9;
      
      return (
         <div className="col-span-full flex flex-col items-center gap-2 py-4 border-b border-dashed border-slate-100/50 break-inside-avoid">
            <div className="flex items-center gap-2 w-full px-2 mb-2">
               <span className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">{index}</span>
               <p className="text-[12px] font-bold text-slate-700 tracking-tight leading-none uppercase">
                 Giải Sudoku ({n}x{n}):
               </p>
            </div>
            <div className={cn("grid border border-slate-800 bg-white", is9x9 ? "grid-cols-9" : (is6x6 ? "grid-cols-6" : "grid-cols-4"))}>
               {gridData.map((row: string[], rIdx: number) => 
                 row.map((cell: string, cIdx: number) => {
                   const isGiven = !isAnswer && cell !== "_";
                   const boxW = is6x6 ? 3 : Math.sqrt(n);
                   const boxH = is6x6 ? 2 : Math.sqrt(n);
                   const rightBorder = (cIdx + 1) % boxW === 0 && cIdx !== n - 1;
                   const bottomBorder = (rIdx + 1) % boxH === 0 && rIdx !== n - 1;
                   
                   return (
                     <div key={`${rIdx}-${cIdx}`} className={cn(
                       "flex items-center justify-center border border-slate-300",
                       n === 9 ? "size-6 text-[12px]" : (n === 6 ? "size-8 text-[14px]" : "size-10 text-[18px]"),
                       isGiven ? "font-black text-slate-800 bg-slate-100/50" : "font-medium text-blue-600",
                       isAnswer && problem.grid[rIdx][cIdx] === "_" && "text-red-500",
                       rightBorder && "border-r-2 border-r-slate-800 flex-shrink-0",
                       bottomBorder && "border-b-2 border-b-slate-800 flex-shrink-0"
                     )}>
                       {cell === "_" ? "" : cell}
                     </div>
                   );
                 })
               )}
            </div>
         </div>
      );
   }

  if (topicId === 5) { // Sequence
     const gridNumbers = problem.grid.filter((v: string) => v !== '_').map(Number);
     const knownNumbers = Array.from(new Set(gridNumbers));
     const missingNumber = problem.cycleNumbers.find((n: number) => !knownNumbers.includes(n));
     
     return (
        <div className="col-span-full space-y-2 py-2 border-b border-dashed border-blue-100 break-inside-avoid">
           <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 w-full">
                <span className="size-5 rounded-full bg-primary text-white flex items-center justify-center text-[9px] font-bold">Câu {index}</span>
                <p className="text-xs font-black text-primary tracking-tight uppercase">Quy luật chu kỳ</p>
              </div>
              <div className="flex flex-nowrap items-center justify-center gap-1 p-1 bg-slate-50/30 rounded-lg border border-slate-100/50 w-full overflow-hidden">
                {problem.grid.map((val: string, i: number) => (
                  <SequenceBox key={i} value={val} isAnswer={isAnswer} />
                ))}
              </div>
           </div>
           
           <div className="pt-0.5">
              <div className="flex items-center gap-1 text-[15px] font-medium text-slate-500 font-serif flex-wrap leading-tight">
                <span className="text-primary/60 not-italic font-black text-[9px] mr-1 uppercase">Tư duy:</span>
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
                {isAnswer && <span className="text-red-500 font-bold font-sans ml-1 not-italic underline decoration-dotted">{missingNumber}</span>}
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
      <div className="flex items-center gap-1 text-[15px] font-bold font-mono py-1.5 break-inside-avoid justify-start pl-4 border-b border-dashed border-slate-100/50 leading-none">
        <span className="text-blue-600 font-sans w-6 text-right shrink-0 text-[15px]">{index}.</span>
        <div className="flex items-center min-w-[124px]">
          <span className="text-slate-700 text-right min-w-[40px] text-[15px]">{parts[0].trim()}</span>
          <ComparisonBox />
          <span className="text-slate-700 text-left min-w-[40px] text-[15px]">{parts[1].trim()}</span>
        </div>
      </div>
    );
  }

  // Standard Horizontal
  const cleanStr = typeof probStr === 'string' ? probStr : JSON.stringify(probStr);
  const parts = cleanStr.replace(/([+\-x=])/g, ' $1 ').replace(/\s+/g, ' ').trim().split(' ');
  
  return (
    <div className="flex items-center gap-1 text-[15px] font-bold font-mono py-1.5 break-inside-avoid justify-start pl-4 border-b border-dashed border-slate-100/50 leading-none">
      <span className="text-blue-600 font-sans w-6 text-right shrink-0 text-[15px]">{index}.</span>
      <div className="flex items-center flex-wrap">
        {parts.map((part: string, i: number) => {
          if (part === '_') return <div key={i} className="size-9 bg-white border border-gray-400 rounded-md mx-1 shrink-0" />;
          if (part === '=') return <span key={i} className="mx-1 text-blue-600">=</span>;
          if (part === 'x') return <span key={i} className="mx-1 text-blue-400">×</span>;
          if (part === '+' || part === '-') return <span key={i} className="mx-1 text-primary">{part}</span>;
          return <span key={i} className={cn("mx-0.5 text-slate-700 text-[15px]", isAnswer && "text-red-500 underline decoration-dotted font-black")}>{part}</span>;
        })}
      </div>
    </div>
  );
};

const BalanceBox = ({ value, isAnswer = false }: { value: any, isAnswer?: boolean }) => {
  return (
    <div className={cn(
      "size-11 flex items-center justify-center border border-slate-400 rounded-md font-mono text-[16px] font-bold shadow-sm p-0 flex-shrink-0 leading-none squared-box-grid bg-white",
    )}>
      {isAnswer ? (
        <span className="text-red-500 font-black text-[16px]">{value}</span>
      ) : ""}
    </div>
  );
};

const BalanceProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  const nums = problem.numbers.join('; ');
  const parts = problem.equationTemplate.split(' ');
  
  return (
    <div className="col-span-full py-4 border-b border-dashed border-slate-100 break-inside-avoid">
       <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2">
             <span className="text-blue-600 font-sans font-bold text-[15px] shrink-0 mt-0.5">{index}.</span>
             <p className="text-[15px] font-bold text-slate-800"> Viết mỗi số <span className="text-blue-700 tracking-wider px-1">{nums}</span> vào một ô trống để được dãy phép tính đúng.</p>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-1">
             {parts.map((part: string, i: number) => {
                if (part === '_') {
                  const valIndex = parts.slice(0, i).filter((p: string) => p === '_').length;
                  return <BalanceBox key={i} value={problem.solution[valIndex]} isAnswer={isAnswer} />;
                }
                const isOp = ['+', '-', '='].includes(part);
                return (
                  <span key={i} className={cn(
                    "text-[18px] font-bold",
                    isOp ? "text-primary" : "text-slate-700"
                  )}>
                    {part}
                  </span>
                );
             })}
          </div>
       </div>
    </div>
  );
};

const MathGrid = ({ rows = 1, cols = 15, children }: { rows?: number, cols?: number, children?: React.ReactNode }) => {
  return (
    <div className="flex flex-col relative w-fit">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="size-6 border border-blue-200 squared-box-grid bg-white opacity-50 flex-shrink-0" />
          ))}
        </div>
      ))}
      <div className="absolute inset-0 flex items-center px-4 font-mono text-[14px]">
        {children}
      </div>
    </div>
  );
};

const WordProblemRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  return (
    <div className="col-span-full py-6 border-b border-dashed border-slate-100 break-inside-avoid">
      <div className="flex flex-col gap-4">
        {/* Problem Header */}
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-sans font-bold text-[15px] shrink-0 mt-0.5">{index}.</span>
          <p className="text-[15px] font-bold text-slate-800 leading-snug">{problem.problemText}</p>
        </div>

        {/* Content Body */}
        <div className="space-y-4 pl-6">
          {problem.solutionLine && (
             <p className="text-[14px] font-bold text-pink-600 italic">{problem.solutionLine}</p>
          )}

          <div className="flex items-center gap-2">
             <MathGrid rows={problem.templateId.includes('two_digit') ? 2 : 1}>
                {isAnswer && <span className="text-red-600 font-black tracking-widest">{problem.correctAnswer}</span>}
             </MathGrid>
             {problem.unit && <span className="text-[14px] font-bold text-pink-600">({problem.unit})</span>}
          </div>

          <div className="flex items-center gap-2">
             <p className="text-[14px] font-bold text-pink-600">{problem.answerPrefix}</p>
             <div className="size-8 border border-blue-300 rounded squared-box-grid flex items-center justify-center bg-white shadow-inner">
                {isAnswer && <span className="text-red-600 font-black text-[15px]">{problem.correctAnswer}</span>}
             </div>
             {problem.answerSuffix && <p className="text-[14px] font-bold text-pink-600">{problem.answerSuffix}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

const SampleClockComponent = () => (
  <div className="col-span-full flex flex-col items-center gap-2 p-4 border-2 border-dashed border-primary/30 rounded-3xl bg-primary/5 mb-4 break-inside-avoid no-print:shadow-sm">
    <div className="flex items-center gap-3 w-full justify-center">
      <div className="bg-primary text-white p-1.5 rounded-lg shadow-sm">
        <Clock className="size-4" />
      </div>
      <div>
        <h3 className="text-sm font-black text-primary uppercase italic leading-none">Hình mẫu: Cách xem phút</h3>
        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Vòng ngoài là số phút lẻ</p>
      </div>
    </div>
    <div className="bg-white p-2 rounded-full shadow-inner border border-slate-100">
      <AnalogClock 
        hour={10} 
        minute={10} 
        showHands={false} 
        size={160} 
        showMinuteLabels={true}
      />
    </div>
    <div className="flex items-center gap-3 text-center">
      <div className="px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">
        <p className="text-[8px] font-bold text-slate-600">Mỗi số =</p>
        <p className="text-xs font-black text-primary">+5 phút</p>
      </div>
      <div className="size-1 rounded-full bg-slate-300" />
      <div className="px-2 py-1 bg-white rounded-lg border border-slate-200 shadow-xs">
        <p className="text-[8px] font-bold text-slate-600">Vòng ngoài</p>
        <p className="text-xs font-black text-blue-600">Số phút</p>
      </div>
    </div>
  </div>
)

const SingaporeMathRow = ({ index, problem, isAnswer = false }: { index: number, problem: any, isAnswer?: boolean }) => {
  return (
    <div className="col-span-full py-6 border-b border-dashed border-slate-100 break-inside-avoid">
       <div className="flex flex-col gap-4">
         <div className="flex items-start gap-2">
           <span className="text-blue-600 font-sans font-bold text-[15px] shrink-0 mt-0.5">{index}.</span>
           <p className="text-[15px] font-bold text-slate-800 leading-snug">{problem.question_text}</p>
         </div>
         {isAnswer ? (
            <div className="ml-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-[14px] font-bold text-slate-700">{problem.step_by_step_explanation[0]}</p>
              <p className="text-[14px] font-black text-primary mt-2">Đáp án: {problem.correct_answer}</p>
            </div>
         ) : (
            <div className="ml-6 space-y-2">
               <div className="border-b border-dotted border-slate-300 h-8 w-full" />
               <div className="border-b border-dotted border-slate-300 h-8 w-full" />
               <div className="flex justify-between items-center mt-2">
                  <div className="text-[11px] font-medium text-blue-400 italic">Gợi ý: {problem.bar_model_hint?.unknown_variable}</div>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase">Đáp số:</span>
                     <div className="border border-slate-300 w-24 h-8 rounded-lg bg-white" />
                  </div>
               </div>
            </div>
         )}
       </div>
    </div>
  );
}

const TopicSection = ({ batch, batchIdx, startIndex, isAnswer = false }: { batch: QuestionBatch, batchIdx: number, startIndex: number, isAnswer?: boolean }) => {
  const getInstruction = (topicId: number) => {
    switch (topicId) {
      case 1: return "Thực hiện phép tính.";
      case 2: return "Thực hiện phép tính nhân.";
      case 3: return "Điền dấu >, <, = thích hợp vào ô trống.";
      case 4: return "Thực hiện phép tính hàng dọc.";
      case 5: return "Điền số thích hợp để hoàn thành dãy số.";
      case 6: return "Hoàn thành bảng Sudoku.";
      case 7: return "Đọc giờ hoặc vẽ kim đồng hồ tương ứng.";
      case 8: return "Giải các bài toán sau.";
      case 9: return "Điền số vào ô trống.";
      case 10: return "Toán có lời văn.";
      case 11: return "Giải toán Singapore AI.";
      default: return "Luyện tập toán tư duy.";
    }
  };

  const isVertical = batch.topicId === 4;
  const isSequence = batch.topicId === 5;
  const isClock = batch.topicId === 7;

  return (
    <div className="mb-3">
      <div className="topic-section-header mb-0 mt-4 leading-tight">
        <h3 className="text-[16px] font-bold text-slate-800 tracking-tight">
          BÀI {batchIdx + 1}: {getInstruction(batch.topicId)}
        </h3>
      </div>
      {isClock && batch.settings?.difficulty === 'five-minutes' && !isAnswer && (
        <SampleClockComponent />
      )}
      <div className={cn(
        "grid gap-x-4 gap-y-0",
        isVertical ? "grid-cols-5" : (isSequence ? "grid-cols-1" : (isClock ? "grid-cols-3" : "grid-cols-2"))
      )}>
        {batch.problems.map((prob, idx) => {
          if (batch.topicId === 9) return <BalanceProblemRow key={idx} index={startIndex + idx + 1} problem={prob} isAnswer={isAnswer} />;
          if (batch.topicId === 10) return <WordProblemRow key={idx} index={startIndex + idx + 1} problem={prob} isAnswer={isAnswer} />;
          if (batch.topicId === 11) return <SingaporeMathRow key={idx} index={startIndex + idx + 1} problem={prob} isAnswer={isAnswer} />;
          return <ProblemRow key={idx} index={startIndex + idx + 1} problem={prob} isAnswer={isAnswer} topicId={batch.topicId} />;
        })}
      </div>
    </div>
  );
};

export default function ArchimedesMixerPage() {
  const [mounted, setMounted] = React.useState(false)
  const [examVersions, setExamVersions] = React.useState<QuestionBatch[][]>([])
  const [numberOfVersions, setNumberOfVersions] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const [showAnswers, setShowAnswers] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
    
    // Load all settings from localStorage after mount
    const loadSetting = (key: string, setter: any, defaultValue: any) => {
      const saved = localStorage.getItem(key);
      if (saved) setter(JSON.parse(saved));
    };

    loadSetting('mixer_cd1', setCd1Settings, null);
    loadSetting('mixer_cd2', setCd2Settings, null);
    loadSetting('mixer_cd3', setCd3Settings, null);
    loadSetting('mixer_cd4', setCd4Settings, null);
    loadSetting('mixer_cd5', setCd5Settings, null);
    loadSetting('mixer_cd6', setCd6Settings, null);
    loadSetting('mixer_cd7', setCd7Settings, null);
    loadSetting('mixer_cd8', setCd8Settings, null);
    loadSetting('mixer_cd9', setCd9Settings, null);
    loadSetting('mixer_cd10', setCd10Settings, null);
    loadSetting('mixer_cd11', setCd11Settings, null);
    loadSetting('mixer_hidden_topics', setHiddenTopics, null);
  }, [])
  
  const cart = examVersions[0] || [];
  
  // Settings state with LocalStorage Persistence
  const [cd1Settings, setCd1Settings] = React.useState({ count: 5, unknownVariable: "D" as any, operationMode: "mixed" as any, maxRange: 20 })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd1', JSON.stringify(cd1Settings)) }, [cd1Settings, mounted])

  const [cd2Settings, setCd2Settings] = React.useState({ count: 5, tables: [2, 5, 10], unknownVariable: "C" as any, shuffle: true })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd2', JSON.stringify(cd2Settings)) }, [cd2Settings, mounted])

  const [cd3Settings, setCd3Settings] = React.useState({ count: 5, level: "1" as any, maxRange: 20, operationMode: "mixed" as any })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd3', JSON.stringify(cd3Settings)) }, [cd3Settings, mounted])

  const [cd4Settings, setCd4Settings] = React.useState({ 
    count: 5, operation: "plus" as any, digits: 2, hasCarry: false, hideTarget: "mixed" as any,
    rangeN1: { min: 10, max: 99 }, rangeN2: { min: 10, max: 99 }, rangeResult: { min: 0, max: 198 }
  })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd4', JSON.stringify(cd4Settings)) }, [cd4Settings, mounted])

  const [cd5Settings, setCd5Settings] = React.useState({ count: 2, cycleLength: 3, maxCycleSum: 30 })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd5', JSON.stringify(cd5Settings)) }, [cd5Settings, mounted])

  const [cd6Settings, setCd6Settings] = React.useState({ count: 2, size: "4" as any, difficulty: "easy" as any })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd6', JSON.stringify(cd6Settings)) }, [cd6Settings, mounted])

  const [cd7Settings, setCd7Settings] = React.useState({ count: 3, difficulty: "hours" as any, type: "read" as any })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd7', JSON.stringify(cd7Settings)) }, [cd7Settings, mounted])

  const [cd8Settings, setCd8Settings] = React.useState({ count: 2 })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd8', JSON.stringify(cd8Settings)) }, [cd8Settings, mounted])

  const [cd9Settings, setCd9Settings] = React.useState({ count: 2, maxSum: 20, type: "chain" as any, allowSubtraction: false })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd9', JSON.stringify(cd9Settings)) }, [cd9Settings, mounted])

  const [cd10Settings, setCd10Settings] = React.useState({ count: 1, maxSum: 100, difficulty: "easy" as any })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd10', JSON.stringify(cd10Settings)) }, [cd10Settings, mounted])

  const [cd11Settings, setCd11Settings] = React.useState({ count: 2, topic: "Lego", difficulty: "Trung bình" as any })
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_cd11', JSON.stringify(cd11Settings)) }, [cd11Settings, mounted])

  const [hiddenTopics, setHiddenTopics] = React.useState<number[]>([])
  React.useEffect(() => { if (mounted) localStorage.setItem('mixer_hidden_topics', JSON.stringify(hiddenTopics)) }, [hiddenTopics, mounted])

  const { toast } = useToast()
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  const handlePrint = useReactToPrint({ 
    contentRef,
    documentTitle: "BoHocToan_PhieuBaiTap",
  })

  const getBatchesWithIndices = React.useCallback((version: QuestionBatch[]) => {
    let currentIndex = 0;
    return version.map(batch => {
      const startIndex = currentIndex;
      currentIndex += batch.count;
      return { ...batch, startIndex };
    });
  }, []);

  const totalCount = cart.reduce((acc, batch) => acc + batch.count, 0)
  const densityPercent = Math.min((totalCount / 40) * 100, 100)


  const [isPresetOpen, setIsPresetOpen] = React.useState(false)
  const [presetCounts, setPresetCounts] = React.useState<Record<number, number>>({
    1: 4, 2: 4, 3: 4, 4: 4,
    5: 2, 6: 2, 7: 2, 8: 2,
    9: 2, 10: 2, 11: 2
  })
  
  
  const removeBatch = (id: string) => setExamVersions(prev => prev.map(v => v.filter(b => b.id !== id)))

  if (!mounted) return null;

  async function addToExam(topicId: number) {
    setIsLoading(true)
    try {
      const generatedVersions = [];
      const batchId = Math.random().toString(36).substr(2, 9);
      
      for (let i = 0; i < numberOfVersions; i++) {
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
          newBatch = { id: batchId, topicId: 1, topicTitle: "Biểu thức 3 số", count: cd1Settings.count, settings: { ...cd1Settings }, problems: res.problems }
        } else if (topicId === 2) {
          const res = await generateMultiplicationProblems({ tables: cd2Settings.tables, unknownVariable: cd2Settings.unknownVariable, numProblems: cd2Settings.count, shuffle: cd2Settings.shuffle })
          newBatch = { id: batchId, topicId: 2, topicTitle: "Phép nhân", count: cd2Settings.count, settings: { ...cd2Settings }, problems: res.problems }
        } else if (topicId === 3) {
          const res = await generateComparisonProblems({ level: cd3Settings.level, range: { min: 0, max: cd3Settings.maxRange }, operationMode: cd3Settings.operationMode, numProblems: cd3Settings.count })
          newBatch = { id: batchId, topicId: 3, topicTitle: "So sánh biểu thức", count: cd3Settings.count, settings: { ...cd3Settings }, problems: res.problems }
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
          newBatch = { id: batchId, topicId: 4, topicTitle: "Tính hàng dọc", count: cd4Settings.count, settings: { ...cd4Settings }, problems: res.problems }
        } else if (topicId === 5) {
          const res = await generateSequenceProblems({ cycleLength: cd5Settings.cycleLength, maxCycleSum: cd5Settings.maxCycleSum, numProblems: cd5Settings.count })
          newBatch = { id: batchId, topicId: 5, topicTitle: "Quy luật dãy số", count: cd5Settings.count, settings: { ...cd5Settings }, problems: res.problems }
        } else if (topicId === 6) {
          const res = await generateSudokuProblems({ size: cd6Settings.size, difficulty: cd6Settings.difficulty, numProblems: cd6Settings.count })
          newBatch = { id: batchId, topicId: 6, topicTitle: "Sudoku", count: cd6Settings.count, settings: { ...cd6Settings }, problems: res.problems }
        } else if (topicId === 7) {
          const res = await generateClockProblems({ difficulty: cd7Settings.difficulty, type: cd7Settings.type, numProblems: cd7Settings.count })
          newBatch = { id: batchId, topicId: 7, topicTitle: "Xem đồng hồ", count: cd7Settings.count, settings: { ...cd7Settings }, problems: res.problems }
        } else if (topicId === 8) {
          const problems = generateAdvancedQuestions(cd8Settings.count)
          newBatch = { id: batchId, topicId: 8, topicTitle: "Toán tư duy", count: cd8Settings.count, settings: { ...cd8Settings }, problems }
        } else if (topicId === 9) {
          const res = await generateBalanceProblems({ 
             maxSum: cd9Settings.maxSum, 
             type: cd9Settings.type,
             allowSubtraction: cd9Settings.allowSubtraction,
             numProblems: cd9Settings.count 
          })
          newBatch = { id: batchId, topicId: 9, topicTitle: "Cân bằng phép cộng", count: cd9Settings.count, settings: { ...cd9Settings }, problems: res.problems }
        } else if (topicId === 10) {
          const res = await generateWordProblems({ 
             maxSum: cd10Settings.maxSum, 
             numProblems: cd10Settings.count 
          })
          newBatch = { id: batchId, topicId: 10, topicTitle: "Toán có lời văn", count: cd10Settings.count, settings: { ...cd10Settings }, problems: res.problems }
        } else if (topicId === 11) {
          const res = await generateSingaporeMath({ 
             numProblems: cd11Settings.count,
             topic: cd11Settings.topic,
             difficulty: cd11Settings.difficulty
          })
          newBatch = { id: batchId, topicId: 11, topicTitle: "Toán Singapore AI", count: cd11Settings.count, settings: { ...cd11Settings }, problems: res.problems }
        } else {
          newBatch = { id: batchId, topicId: 0, topicTitle: "Unknown", count: 0, settings: {}, problems: [] }
        }
        generatedVersions.push(newBatch);
      }

      setExamVersions(prev => {
        const nextVersions = prev.length 
          ? prev.map(v => [...v]) 
          : Array.from({ length: numberOfVersions }, () => []);
        
        // Match the requested array size if it changed recently
        while (nextVersions.length < numberOfVersions) {
          nextVersions.push([]);
        }
        for (let i = 0; i < numberOfVersions; i++) {
          const genBatch = generatedVersions[i];
          const existingIdx = nextVersions[i].findIndex(b => b.topicId === genBatch.topicId);
          if (existingIdx >= 0) {
            const existingBatch = nextVersions[i][existingIdx];
            nextVersions[i][existingIdx] = {
              ...existingBatch,
              count: existingBatch.count + genBatch.count,
              problems: [...existingBatch.problems, ...genBatch.problems],
              settings: genBatch.settings,
            };
          } else {
            nextVersions[i].push(genBatch);
          }
        }
        return nextVersions;
      })
      toast({ title: "Thành công!", description: `Đã thêm ${generatedVersions[0].count} câu x ${numberOfVersions} bản.` })
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Lỗi AI", description: error.message || "Vui lòng thử lại sau." })
    } finally {
      setIsLoading(false)
    }
  }

  const createSmartExam = async () => {
    setIsLoading(true);
    setExamVersions([]);
    try {
      const batchId = Math.random().toString(36).substr(2, 9);
      const presets = Object.entries(presetCounts).map(([id, count]) => ({ id: Number(id), count }));

      const allVersions = Array.from({ length: numberOfVersions }, () => []);

      for (const p of presets) {
        for (let i = 0; i < numberOfVersions; i++) {
          let batch: QuestionBatch;
          if (p.id === 1) {
            const res = await generateArchimedesMathProblems({ ...cd1Settings, numProblems: p.count, rangeA: { min: 0, max: cd1Settings.maxRange }, rangeB: { min: 0, max: 10 }, rangeC: { min: 0, max: 10 }, rangeD: { min: 0, max: 100 } });
            batch = { id: batchId + p.id, topicId: 1, topicTitle: "Biểu thức 3 số", count: p.count, settings: { ...cd1Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 2) {
            const res = await generateMultiplicationProblems({ ...cd2Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 2, topicTitle: "Phép nhân", count: p.count, settings: { ...cd2Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 3) {
            const res = await generateComparisonProblems({ ...cd3Settings, range: { min: 0, max: cd3Settings.maxRange }, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 3, topicTitle: "So sánh biểu thức", count: p.count, settings: { ...cd3Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 4) {
            const res = await generateVerticalMathProblems({ ...cd4Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 4, topicTitle: "Tính hàng dọc", count: p.count, settings: { ...cd4Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 5) {
            const res = await generateSequenceProblems({ ...cd5Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 5, topicTitle: "Quy luật dãy số", count: p.count, settings: { ...cd5Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 6) {
            const res = await generateSudokuProblems({ ...cd6Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 6, topicTitle: "Sudoku", count: p.count, settings: { ...cd6Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 7) {
            const res = await generateClockProblems({ ...cd7Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 7, topicTitle: "Xem đồng hồ", count: p.count, settings: { ...cd7Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 8) {
            const probs = generateAdvancedQuestions(p.count);
            batch = { id: batchId + p.id, topicId: 8, topicTitle: "Toán tư duy", count: p.count, settings: { ...cd8Settings, count: p.count }, problems: probs };
          } else if (p.id === 9) {
            const res = await generateBalanceProblems({ ...cd9Settings, numProblems: p.count });
            batch = { id: batchId + p.id, topicId: 9, topicTitle: "Cân bằng phép cộng", count: p.count, settings: { ...cd9Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 10) {
            const res = await generateWordProblems({ numProblems: p.count, maxSum: cd10Settings.maxSum });
            batch = { id: batchId + p.id, topicId: 10, topicTitle: "Toán có lời văn", count: p.count, settings: { ...cd10Settings, count: p.count }, problems: res.problems };
          } else if (p.id === 11) {
            const res = await generateSingaporeMath({ numProblems: p.count, topic: cd11Settings.topic, difficulty: cd11Settings.difficulty });
            batch = { id: batchId + p.id, topicId: 11, topicTitle: "Toán Singapore AI", count: p.count, settings: { ...cd11Settings, count: p.count }, problems: res.problems };
          }
          allVersions[i].push(batch);
        }
      }
      setExamVersions(allVersions);
      toast({ title: "Đã tạo đề tổng hợp!", description: "Bao gồm 4x CĐ 1-4 và 2x CĐ 5-10." });
    } catch (e: any) {
      console.error(e);
      toast({ variant: "destructive", title: "Lỗi", description: e.message || "Không thể tạo đề bài mẫu." });
    } finally {
      setIsLoading(false);
      setIsPresetOpen(false);
    }
  }

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Configuration Header */}
      <div className="no-print flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-primary/10">
        <div className="space-y-4 flex-1">
          <div className="space-y-2">
            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 px-3 py-1 font-bold">BƠ HỌC TOÁN - Master Mixer</Badge>
            <h1 className="text-4xl font-black tracking-tight text-primary uppercase leading-none">Phiếu Bài tập Archimedes</h1>
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
          <div className="flex items-center justify-between px-2 bg-muted/20 p-2 rounded-lg border border-primary/10">
             <Label htmlFor="versions" className="text-[11px] font-black uppercase text-primary tracking-tight">Số bản in</Label>
             <Input type="number" id="versions" min={1} max={20} value={numberOfVersions} onChange={e => setNumberOfVersions(Number(e.target.value) || 1)} className="w-[60px] h-7 text-center font-bold" />
          </div>
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
          <Card className="border-none shadow-md overflow-hidden bg-white mb-6">
             <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-pink-500" />
             <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                   <h3 className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-tight">
                      <Sparkles className="size-4 animate-pulse text-accent" /> Thiết lập đề nhanh (Preset)
                   </h3>
                </div>
                <div className="grid grid-cols-1 gap-2">
                   <Dialog open={isPresetOpen} onOpenChange={setIsPresetOpen}>
                      <DialogTrigger asChild>
                         <Button disabled={isLoading} variant="outline" className="h-10 text-[10px] font-black border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary transition-all gap-2 justify-start px-4">
                            <div className="size-5 rounded bg-primary/10 flex items-center justify-center text-primary"><List className="size-3" /></div>
                            TẠO ĐỀ TỔNG HỢP 11 CHUYÊN ĐỀ
                         </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[400px] max-h-[85vh] overflow-y-auto">
                         <DialogHeader>
                            <DialogTitle className="text-xl font-black text-primary uppercase">Cấu hình Đề tổng hợp</DialogTitle>
                            <DialogDescription>Nhập số lượng câu hỏi cho mỗi chuyên đề.</DialogDescription>
                         </DialogHeader>
                         <div className="space-y-4 py-4">
                            {[
                               { id: 1, title: "CĐ1: Biểu thức 3 số" },
                               { id: 2, title: "CĐ2: Phép nhân" },
                               { id: 3, title: "CĐ3: So sánh biểu thức" },
                               { id: 4, title: "CĐ4: Tính hàng dọc" },
                               { id: 5, title: "CĐ5: Quy luật dãy số" },
                               { id: 6, title: "CĐ6: Sudoku" },
                               { id: 7, title: "CĐ7: Xem đồng hồ" },
                               { id: 8, title: "CĐ8: Toán tư duy" },
                               { id: 9, title: "CĐ9: Cân bằng phép cộng" },
                               { id: 10, title: "CĐ10: Toán có lời văn" },
                               { id: 11, title: "CĐ11: Toán Singapore AI" }
                            ].map((t) => (
                               <div key={t.id} className="flex items-center justify-between gap-4 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                  <Label className="text-xs font-bold text-slate-600">{t.title}</Label>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[10px] font-black text-slate-400 uppercase">Câu:</span>
                                     <Input 
                                        type="number" 
                                        min={0} 
                                        max={20} 
                                        className="w-16 h-8 text-center font-bold" 
                                        value={presetCounts[t.id]} 
                                        onChange={(e) => setPresetCounts(prev => ({ ...prev, [t.id]: parseInt(e.target.value) || 0 }))} 
                                     />
                                  </div>
                               </div>
                            ))}
                         </div>
                         <DialogFooter>
                            <Button onClick={createSmartExam} disabled={isLoading} className="w-full py-6 font-black uppercase text-lg shadow-lg">
                               {isLoading ? <Layers className="size-5 animate-spin mr-2" /> : <Sparkles className="size-5 mr-2" />}
                               Tạo đề bài ngay
                            </Button>
                         </DialogFooter>
                      </DialogContent>
                   </Dialog>
                </div>
             </CardContent>
          </Card>

          {hiddenTopics.length > 0 && (
             <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Đã ẩn {hiddenTopics.length} chủ đề ít dùng</p>
                <Button variant="link" size="sm" onClick={() => setHiddenTopics([])} className="h-4 text-[10px] font-bold p-0 text-primary">Hiện tất cả</Button>
             </div>
          )}
          {[
            { id: 1, title: "CĐ1: Biểu thức 3 số", color: "bg-primary", icon: Calculator, settings: cd1Settings, setter: setCd1Settings },
            { id: 2, title: "CĐ2: Phép nhân", color: "bg-accent", icon: Sparkles, settings: cd2Settings, setter: setCd2Settings },
            { id: 3, title: "CĐ3: So sánh biểu thức", color: "bg-blue-400", icon: Scale, settings: cd3Settings, setter: setCd3Settings },
            { id: 4, title: "CĐ4: Tính hàng dọc", color: "bg-orange-400", icon: Columns2, settings: cd4Settings, setter: setCd4Settings },
            { id: 5, title: "CĐ5: Quy luật dãy số", color: "bg-indigo-400", icon: ListOrdered, settings: cd5Settings, setter: setCd5Settings },
            { id: 6, title: "CĐ6: Sudoku", color: "bg-purple-400", icon: LayoutDashboard, settings: cd6Settings, setter: setCd6Settings },
            { id: 7, title: "CĐ7: Xem đồng hồ", color: "bg-pink-400", icon: Clock, settings: cd7Settings, setter: setCd7Settings },
            { id: 8, title: "CĐ8: Toán tư duy", color: "bg-emerald-400", icon: BookOpen, settings: cd8Settings, setter: setCd8Settings },
            { id: 9, title: "CĐ9: Cân bằng phép cộng", color: "bg-red-400", icon: PlusCircle, settings: cd9Settings, setter: setCd9Settings },
            { id: 10, title: "CĐ10: Toán có lời văn", color: "bg-orange-600", icon: FileText, settings: cd10Settings, setter: setCd10Settings },
            { id: 11, title: "CĐ11: Toán Singapore AI", color: "bg-indigo-600", icon: Sparkles, settings: cd11Settings, setter: setCd11Settings }
          ].filter(t => !hiddenTopics.includes(t.id)).map((topic) => (
            <Card key={topic.id} className="border-none shadow-md overflow-hidden bg-white group hover:shadow-lg transition-all duration-300">
              <div className={cn("h-1 w-full", topic.color)} />
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <topic.icon className="size-4 opacity-40"/> {topic.title}
                  </h3>
                  <div className="flex items-center gap-1.5 translate-x-2">
                    <div className="flex items-center gap-1 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => setHiddenTopics(p => [...p, topic.id])} className="size-6 text-slate-300 hover:text-blue-400 hover:bg-blue-50" title="Ẩn chuyên đề">
                        <EyeOff className="size-3.5" />
                      </Button>
                    </div>
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
                            <div className="space-y-2 mb-2">
                              <Label className="text-[10px] font-black text-primary/60 uppercase tracking-tighter">Thiết lập nhanh</Label>
                              <div className="flex flex-wrap gap-1.5">
                                 <Button variant="outline" size="sm" onClick={() => topic.setter((s: any) => ({ ...s, operation: "plus", digits: 2, hasCarry: false, hideTarget: "mixed" }))} className="h-7 text-[10px] font-bold">Dễ</Button>
                                 <Button variant="default" size="sm" onClick={() => topic.setter((s: any) => ({ ...s, operation: "mixed", digits: 2, hasCarry: true, hideTarget: "full-result" }))} className="h-7 text-[10px] font-black bg-blue-600 hover:bg-blue-700 shadow-sm">⚡ Tìm kết quả</Button>
                              </div>
                            </div>
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
                                  <SelectItem value="result">Khuyết một ô ở KQ</SelectItem>
                                  <SelectItem value="full-result">Toàn bộ kết quả</SelectItem>
                                  <SelectItem value="operands">Chỉ số hạng</SelectItem>
                                  <SelectItem value="mixed">Hỗn hợp</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
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

                        {/* Topic 6 Specific Settings */}
                        {topic.id === 6 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Kích thước</Label>
                              <Select value={topic.settings.size.toString()} onValueChange={(v) => topic.setter((s: any) => ({ ...s, size: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="4">4x4 (Mầm non - Lớp 1)</SelectItem>
                                  <SelectItem value="6">6x6 (Lớp 2 - Lớp 3)</SelectItem>
                                  <SelectItem value="9">9x9 (Lớp 4 - Lớp 5)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Mức độ khó</Label>
                              <Select value={topic.settings.difficulty} onValueChange={(v) => topic.setter((s: any) => ({ ...s, difficulty: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="easy">Dễ (Ẩn ít ô)</SelectItem>
                                  <SelectItem value="medium">Vừa (Vận dụng Logic)</SelectItem>
                                  <SelectItem value="hard">Khó (Thử thách)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}

                        {/* Topic 7 Specific Settings */}
                        {topic.id === 7 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Mức độ</Label>
                              <Select value={topic.settings.difficulty} onValueChange={(v) => topic.setter((s: any) => ({ ...s, difficulty: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hours">Giờ đúng</SelectItem>
                                  <SelectItem value="half-hours">Giờ rưỡi</SelectItem>
                                  <SelectItem value="quarter-hours">15 phút</SelectItem>
                                  <SelectItem value="five-minutes">5 phút</SelectItem>
                                  <SelectItem value="any-minutes">Bất kỳ</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Loại bài</Label>
                              <RadioGroup value={topic.settings.type} onValueChange={(v) => topic.setter((s: any) => ({ ...s, type: v }))} className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-1"><RadioGroupItem value="read" id="tr7"/><Label htmlFor="tr7" className="text-[10px]">Đọc giờ</Label></div>
                                <div className="flex items-center space-x-1"><RadioGroupItem value="draw" id="td7"/><Label htmlFor="td7" className="text-[10px]">Vẽ kim</Label></div>
                                <div className="flex items-center space-x-1 col-span-2"><RadioGroupItem value="mixed" id="tm7"/><Label htmlFor="tm7" className="text-[10px]">Trộn cả hai</Label></div>
                              </RadioGroup>
                            </div>
                          </div>
                        )}

                        {/* Topic 8 Specific Settings */}
                        {topic.id === 8 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold text-emerald-600">MATH LOGIC & IQ</Label>
                              <p className="text-[10px] text-muted-foreground italic">Bộ 7 template toán tư duy siêu trí tuệ.</p>
                            </div>
                          </div>
                        )}

                        {/* Topic 9 Specific Settings */}
                        {topic.id === 9 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Loại dãy tính</Label>
                              <Select value={topic.settings.type} onValueChange={(v) => topic.setter((s: any) => ({ ...s, type: v }))}>
                                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="chain">Chuỗi cân bằng (A+B=C+D=E)</SelectItem>
                                  <SelectItem value="expression">Biểu thức (A±B±C=D)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Phạm vi (Max Sum)</Label>
                              <Input type="number" value={topic.settings.maxSum} onChange={(e) => topic.setter((s: any) => ({ ...s, maxSum: parseInt(e.target.value) || 10 }))} className="h-8" />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-bold">Bao gồm phép trừ</Label>
                              <Switch checked={topic.settings.allowSubtraction} onCheckedChange={(c) => topic.setter((s: any) => ({ ...s, allowSubtraction: c }))} />
                            </div>
                          </div>
                        )}

                        {/* Topic 10 Specific Settings */}
                        {topic.id === 10 && (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label className="text-xs font-bold">Phạm vi số (Max / Kết quả)</Label>
                              <Input type="number" value={topic.settings.maxSum} onChange={(e) => topic.setter((s: any) => ({ ...s, maxSum: parseInt(e.target.value) || 100 }))} className="h-8" />
                            </div>
                          </div>
                        )}

                        {/* Topic 11 Specific Settings */}
                        {topic.id === 11 && (
                          <div className="space-y-4">
                             <div className="space-y-2">
                               <Label className="text-xs font-bold">Chủ đề (Lego, Táo...)</Label>
                               <Input value={topic.settings.topic} onChange={(e) => topic.setter((s: any) => ({ ...s, topic: e.target.value }))} className="h-8" />
                             </div>
                             <div className="space-y-2">
                                <Label className="text-xs font-bold">Độ khó</Label>
                                <Select value={topic.settings.difficulty} onValueChange={(v) => topic.setter((s: any) => ({ ...s, difficulty: v }))}>
                                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Dễ">Dễ</SelectItem>
                                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                                    <SelectItem value="Khó">Khó</SelectItem>
                                  </SelectContent>
                                </Select>
                             </div>
                          </div>
                        )}
                        
                      </div>

                    </PopoverContent>
                  </Popover>
                  <Button onClick={() => addToExam(topic.id)} disabled={isLoading} className={cn("flex-[2] h-7 text-[10px] font-bold gap-1 text-white shadow-sm hover:opacity-90 bg-primary")}>
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
              {cart.length > 0 && <Button variant="outline" size="icon" onClick={() => setExamVersions([])} className="size-8 rounded-full text-destructive"><Trash2 className="size-4" /></Button>}
            </CardHeader>
            <CardContent className="flex-1 p-0 relative">
              {cart.length > 0 ? (
                <div className="p-0">
                  <div ref={contentRef} className="print-container bg-white text-black font-sans relative">
                    {/* Watermark Overlay */}
                    <div className="watermark-overlay fixed inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none z-[-1] overflow-hidden">
                       <Image 
                        src="/logo.png" 
                        alt="Watermark" 
                        width={600} 
                        height={600}
                        className="object-contain"
                      />
                    </div>

                    {/* Versions Loop */}
                    {examVersions?.map((version, vIdx) => {
                      if (!version || version.length === 0) return null;
                      const versionBatches = getBatchesWithIndices(version);
                      return (
                        <div key={vIdx} className={cn(vIdx > 0 && "break-before-page")}>
                          {/* Header */}
                          <PrintHeader 
                            title="Phiếu Bài tập Archimedes" 
                            subtitle="Vũ trụ số học - Bứt phá tư duy"
                          />

                          {/* Content Section */}
                          <div className="flex-1">
                            {versionBatches.map((batch, idx) => (
                              <TopicSection 
                                key={batch.id} 
                                batch={batch} 
                                batchIdx={idx} 
                                startIndex={batch.startIndex} 
                              />
                            ))}
                          </div>

                          {/* Footer Signature */}
                          <PrintFooter />

                          {/* Answer Key (Optional) */}
                          {showAnswers && (
                            <div className="break-before-page pt-10 relative">
                              <div className="mb-6 border-b-4 border-destructive pb-4">
                                <h1 className="text-2xl font-black text-destructive uppercase text-center">Đáp Án Chi Tiết - Đề {vIdx + 1}</h1>
                              </div>
                              <div className="space-y-6">
                                {versionBatches.map((batch, idx) => (
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
                      );
                    })}
                  </div>

                  {/* On-screen Preview Footer (Buttons only) */}
                  <div className="no-print p-6 bg-slate-50/30">
                     <div className="text-center text-muted-foreground italic text-xs mb-4">
                       Bản xem trước nội dung trang in A4.
                     </div>
                     {getBatchesWithIndices(cart).map((batch, idx) => (
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
