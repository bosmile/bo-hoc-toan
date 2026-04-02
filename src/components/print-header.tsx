import Image from "next/image"

export const PrintHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  return (
    <div className="w-full">
      {/* Upper Header (Mixer Style) */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-primary pb-4">
        <div className="flex items-center gap-3 shrink-0">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={60} 
            height={60} 
            className="object-contain" 
          />
          <h1 className="text-xl font-black text-primary tracking-tighter uppercase leading-tight">BƠ HỌC TOÁN</h1>
        </div>
        <div className="text-right space-y-1 pt-1 shrink-0 w-[240px]">
          <p className="text-[14px] font-bold border-b border-primary/20 pb-0.5 text-slate-800">
            Họ tên: <span className="font-extrabold text-black">Trần Phương Thảo</span>
          </p>
          <p className="text-[12px] font-bold border-b border-primary/20 pb-0.5 text-slate-800">Ngày: ...........................................</p>
        </div>
      </div>
    </div>
  )
}

