import React from "react";
import { useEffect } from "react";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181",
  "#AA96DA", "#FCBAD3", "#A8D8EA", "#FF9F43", "#6C5CE7"
];

export default function RouletteWheel({ items, spinning, onSpin, rotation}) {
  const numItems = items.length;
  const anglePerSegment = 360 / numItems;

  const dots = Array.from({ length: 40 }, (_, i) => {
  const angle = (i / 40) * 2 * Math.PI;
  return {
    x: 50 + 48 * Math.cos(angle), // percentage positions
    y: 50 + 48 * Math.sin(angle),
  };
});


  const createSegmentPath = (index) => {
    const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);
    const radius = 150;
    const x1 = 150 + radius * Math.cos(startAngle);
    const y1 = 150 + radius * Math.sin(startAngle);
    const x2 = 150 + radius * Math.cos(endAngle);
    const y2 = 150 + radius * Math.sin(endAngle);
    const largeArc = anglePerSegment > 180 ? 1 : 0;
    return `M150,150 L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
  };

  const getTextPosition = (index) => {
    const angle = ((index + 0.5) * anglePerSegment - 90) * (Math.PI / 180);
    const radius = 95;
    return {
      x: 150 + radius * Math.cos(angle),
      y: 150 + radius * Math.sin(angle),
      rotation: (index + 0.5) * anglePerSegment
    };
  };

  return (
   <div className="relative flex flex-col items-center w-[80vw] max-w-[350px] sm:max-w-[420px]">



  {/* 🎡 FORTUNE WHEEL */}
  <svg
    viewBox="0 0 300 300"
    className="relative z-20 w-full h-auto drop-shadow-[0_0_25px_rgba(0,255,80,0.6)]"
    style={{
      transform: `rotate(${rotation}deg)`,
      transition: spinning
        ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)"
        : "none",
    }}
  >
    {items.map((item, index) => {
      const textPos = getTextPosition(index);
      return (
        <g key={index}>
          <path
            d={createSegmentPath(index)}
            fill={COLORS[index % COLORS.length]}
            stroke="#222"
            strokeWidth="2"
            className="drop-shadow-[0_0_8px_rgba(0,0,0,0.4)]"
          />

          <text
            x={textPos.x}
            y={textPos.y}
            fill="#fff"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
            className="drop-shadow-[1px_1px_2px_black]"
          >
            {item}
          </text>
        </g>
      );
    })}

  

    <defs>
      <radialGradient id="centerGradient">
        <stop offset="0%" stopColor="#00ff88" />
        <stop offset="100%" stopColor="#009944" />
      </radialGradient>
    </defs>
  </svg>

  {/* 🔻 POINTER */}
  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-30">
    <div className="
      w-0 h-0 
      border-l-[14px] border-r-[14px] 
      border-l-transparent border-r-transparent 
      border-t-[28px] border-t-red-600
      drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
    />
  </div>

  {/* 🎯 SPIN BUTTON */}
  <button
    onClick={onSpin}
    disabled={spinning}
    className={`mt-8 px-10 py-2 sm:px-16 sm:py-3 text-base sm:text-lg font-bold text-white rounded-full 
      transition-all duration-200 shadow-[0_0_20px_rgba(0,255,0,0.5)] 
      bg-gradient-to-b from-[#5CFF8A] to-[#0FBF41] 
      hover:brightness-110 active:scale-95
      ${spinning ? "opacity-60 cursor-not-allowed" : ""}`}
  >
    {spinning ? "Spinning..." : "SPIN!"}
  </button>
</div>

  );
}
