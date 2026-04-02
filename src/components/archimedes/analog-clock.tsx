"use client"

import React from 'react';
import { cn } from "@/lib/utils";

interface AnalogClockProps {
  hour: number;
  minute: number;
  showHands?: boolean;
  size?: number;
  className?: string;
  showNumbers?: boolean;
  hourHandColor?: string;
  minuteHandColor?: string;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  hour,
  minute,
  showHands = true,
  size = 200,
  className,
  showNumbers = true,
  hourHandColor = "currentColor",
  minuteHandColor = "currentColor"
}) => {
  const radius = 90;
  const center = 100;
  
  // Calculate angles
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  // Minute hand: 6 degrees per minute
  const minuteAngle = minute * 6;

  const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        {/* Outer Circle */}
        <circle
          cx={center}
          cy={center}
          r={radius + 5}
          className="fill-white stroke-slate-900 stroke-[3]"
        />
        
        {/* Tick Marks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isHour = i % 5 === 0;
          const angle = (i * 6 * Math.PI) / 180;
          const x1 = center + (radius - (isHour ? 10 : 5)) * Math.sin(angle);
          const y1 = center - (radius - (isHour ? 10 : 5)) * Math.cos(angle);
          const x2 = center + radius * Math.sin(angle);
          const y2 = center - radius * Math.cos(angle);
          
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              className={cn(isHour ? "stroke-slate-900 stroke-[2]" : "stroke-slate-400 stroke-[1]")}
            />
          );
        })}

        {/* Numbers */}
        {showNumbers && numbers.map((n, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = center + (radius - 25) * Math.sin(angle);
          const y = center - (radius - 25) * Math.cos(angle);
          return (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[18px] font-black fill-slate-800 font-sans"
            >
              {n}
            </text>
          );
        })}

        {/* Hands */}
        {showHands && (
          <>
            {/* Hour Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + 50 * Math.sin((hourAngle * Math.PI) / 180)}
              y2={center - 50 * Math.cos((hourAngle * Math.PI) / 180)}
              stroke={hourHandColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Minute Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + 75 * Math.sin((minuteAngle * Math.PI) / 180)}
              y2={center - 75 * Math.cos((minuteAngle * Math.PI) / 180)}
              stroke={minuteHandColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Center Pin */}
        <circle cx={center} cy={center} r={4} className="fill-slate-900" />
      </svg>
    </div>
  );
};
