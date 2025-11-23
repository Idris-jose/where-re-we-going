import React from "react";
import { useEffect } from "react";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181",
  "#AA96DA", "#FCBAD3", "#A8D8EA", "#FF9F43", "#6C5CE7"
];

export default function RouletteWheel({ items, spinning, onSpin, rotation}) {
  const numItems = items.length;
  const anglePerSegment = 360 / numItems;


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
    <div className="relative flex flex-col items-center">
      {/* Outer ring */}
      <div 
        className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-xl"
        style={{ top: '-10px' }}
      >
        {[...Array(24)].map((_, i) => {
          const angle = (i * 15) * (Math.PI / 180);
          const x = 160 + 148 * Math.cos(angle);
          const y = 160 + 148 * Math.sin(angle);
          return (
            <div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-white shadow-inner"
              style={{ left: `${x - 6}px`, top: `${y - 6}px` }}
            />
          );
        })}
      </div>

      {/* Wheel */}
      <svg
        width="300"
        height="300"
        className="relative z-10"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
        }}
      >
        {items.map((item, index) => {
          const textPos = getTextPosition(index);
          return (
            <g key={index}>
              <path
                d={createSegmentPath(index)}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={textPos.x}
                y={textPos.y}
                fill="#fff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
              >
                {item}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx="150" cy="150" r="25" fill="#ffd700" stroke="#fff" strokeWidth="3"/>
      </svg>

      {/* Pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
        <div 
          className="w-0 h-0 border-l-8 border-r-8 border-l-transparent border-r-transparent border-t-red-600"
          style={{ borderTopWidth: '24px' }}
        />
      </div>

      {/* Spin button */}
            <button
        onClick={onSpin}
        disabled={spinning}
        className={`mt-8 px-16 py-3 text-lg font-bold text-white rounded-full 
          transition-all duration-200 shadow-[0_0_20px_rgba(0,255,0,0.5)] 
          bg-linear-to-b from-[#5CFF8A] to-[#0FBF41] 
          hover:brightness-110 active:scale-95 glow-green
          ${spinning ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {spinning ? "Spinning..." : "SPIN!"}
      </button>
    </div>
  );
}
