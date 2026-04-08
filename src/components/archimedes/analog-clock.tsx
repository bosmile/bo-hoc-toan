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
  showMinuteLabels?: boolean;
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
  showMinuteLabels = false,
  hourHandColor = "currentColor",
  minuteHandColor = "currentColor"
}) => {
  const center = 100;
  const radius = showMinuteLabels ? 70 : 90;
  
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

        {/* Numbers (1-12) */}
        {showNumbers && numbers.map((n, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = center + (radius - 18) * Math.sin(angle);
          const y = center - (radius - 18) * Math.cos(angle);
          return (
            <text
              key={n}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={cn(
                "font-black fill-slate-800 font-sans",
                showMinuteLabels ? "text-[14px]" : "text-[18px]"
              )}
            >
              {n}
            </text>
          );
        })}

        {/* Minute Labels (5, 10, 15...) */}
        {showMinuteLabels && Array.from({ length: 12 }).map((_, i) => {
          const minuteVal = (i === 0 ? 0 : i * 5);
          const angle = (i * 30 * Math.PI) / 180;
          const dist = radius + 20;
          const x = center + dist * Math.sin(angle);
          const y = center - dist * Math.cos(angle);
          
          return (
            <g key={`min-${i}`}>
               <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[12px] font-bold fill-blue-600 font-sans"
              >
                {minuteVal === 0 ? "60" : minuteVal}
              </text>
              {/* Optional pointer or line to the minute mark */}
              <line 
                x1={center + (radius + 8) * Math.sin(angle)}
                y1={center - (radius + 8) * Math.cos(angle)}
                x2={center + (radius + 12) * Math.sin(angle)}
                y2={center - (radius + 12) * Math.cos(angle)}
                className="stroke-blue-400 stroke-[1]"
              />
            </g>
          );
        })}

        {/* Hands */}
        {showHands && (
          <>
            {/* Hour Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + (radius * 0.55) * Math.sin((hourAngle * Math.PI) / 180)}
              y2={center - (radius * 0.55) * Math.cos((hourAngle * Math.PI) / 180)}
              stroke={hourHandColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Minute Hand */}
            <line
              x1={center}
              y1={center}
              x2={center + (radius * 0.85) * Math.sin((minuteAngle * Math.PI) / 180)}
              y2={center - (radius * 0.85) * Math.cos((minuteAngle * Math.PI) / 180)}
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
