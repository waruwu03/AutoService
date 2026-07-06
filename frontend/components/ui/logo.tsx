import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
  subtitle?: string
  variant?: 'default' | 'white' | 'dark'
}

export function Logo({
  className,
  iconSize = 24,
  textSize = "text-xl",
  subtitle,
  variant = 'default'
}: LogoProps) {
  const isWhite = variant === 'white'

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        <img 
          src="/Logo1.png" 
          alt="Logo" 
          className="object-contain"
          style={{ width: iconSize * 1.4, height: iconSize * 1.4 }}
        />
      </div>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden select-none">
        <div className={cn(
          "font-black tracking-tighter leading-tight whitespace-nowrap flex items-center",
          textSize,
          variant === 'white' ? "text-white" : "text-slate-900 dark:text-white"
        )}>
          <span className="opacity-90">AUTO</span>
          <span className="text-primary -ml-0.5">SERVIS</span>
        </div>
        {subtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-[1px] w-3 bg-primary/40" />
            <span className={cn(
              "text-[9px] font-black tracking-[0.3em] uppercase leading-none whitespace-nowrap",
              variant === 'white' ? "text-white/50" : "text-slate-500 dark:text-zinc-500"
            )}>
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
