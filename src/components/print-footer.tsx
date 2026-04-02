import { Heart } from "lucide-react"

export const PrintFooter = () => {
  return (
    <div className="mt-auto pt-4 border-t border-dashed border-primary/20 flex justify-between items-center opacity-40">
      <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
        © BƠ HỌC TOÁN - NUMBER GARDEN EDITION
      </p>
      <div className="flex items-center gap-2">
        <Heart className="size-3 text-destructive fill-destructive" />
        <span className="text-[9px] font-medium text-slate-600">
          Học toán thật vui cùng bé!
        </span>
      </div>
    </div>
  )
}
