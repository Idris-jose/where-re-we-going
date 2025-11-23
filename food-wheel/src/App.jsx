import { useState } from "react";
import RouletteWheel from "./RouletteWheel.jsx";

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [showWheel, setShowWheel] = useState(true);
  const [choice,setChoice] = useState("")
  const [history, setHistory] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const restaurants = [
    "Cresta",
    "Tasty Vine",
    "Tasty Delight",
    "your choice",
    "Marigold",
    "Eat and play",
  ];

  const anglePerSegment = 360 / restaurants.length;

  /**
   * Improved handleSpin to ensure unbiased selection of segments.
   * - Total rotations random between 5 and 7 full rotations.
   * - Instead of uniform 0-360 offset, pick a segment index randomly, then add a small random offset within that segment
   * - This ensures equal probability per segment.
   * - Calculate newRotation accordingly.
   * - After animation delay, calculate selectedIndex correctly considering -90deg offset.
   */
  
  const handleYes = () => {
  if (!selectedRestaurant) return;

  setHistory((prev) => [
    ...prev, 
    { 
      date: new Date().toISOString(), 
      restaurant: selectedRestaurant,
      went: true
    }
  ]);
  setShowWheel(true);
  setChoice("Yes");
};
  

  const handleNo = () => {
  setChoice("No");
  setShowWheel(true);

  // OPTIONAL: Add “went: false” to history if you want
  // setHistory((prev) => [...prev, { date: new Date(), restaurant: selectedRestaurant, went: false }]);
};

  function handleSpin() {
    if (spinning) return;
    setChoice("");
    setSpinning(true);
    setSelectedRestaurant("");

    // Random full rotations (5-7)
    const extraRotations = Math.floor(Math.random() * 3) + 5;

    // Randomly choose a segment index for final position to guarantee unbiased selection
    const randomSegmentIndex = Math.floor(Math.random() * restaurants.length);

    // Add small random offset within the chosen segment to avoid always stopping at same boundary
    const segmentOffset = Math.random() * anglePerSegment;

    // Calculate target angle for pointer at top (0deg) after rotation considering segments start at -90deg
    // Because the wheel rotates clockwise, total rotation moves the selected segment under the pointer at top
    // rotation needed is: full rotations + 360 degrees * full rotations + offset including -90 degrees offset
    const targetRotation = 360 * extraRotations + (randomSegmentIndex * anglePerSegment) + segmentOffset - 90;

    const newRotation = rotation + targetRotation;
    setRotation(newRotation);

    setTimeout(() => {
      setSpinning(false);

      // Normalize rotation angle (0 - 360)
      const normalizedRotation = newRotation % 360;

      // Adjust rotation to match pointer position considering clockwise rotation and -90deg segment offset
      // Calculate complementary angle relative to pointer (360 - normalizedRotation)
      // and add 90deg offset to align with segment start
      let adjustedRotation = (360 - normalizedRotation + 90) % 360;

      // Adjust for pointer-segment index offset: subtract 1.5 segments (each segment's angle)
      adjustedRotation = (adjustedRotation - 1.5 * anglePerSegment + 360) % 360;

      // Calculate raw segment index
      let rawIndex = adjustedRotation / anglePerSegment;

      // Calculate selected index using floor and modulo
      const selectedIndex = Math.floor(rawIndex) % restaurants.length;

      const selected = restaurants[selectedIndex];

      
      setSelectedRestaurant(selected);
      
       setShowWheel(false);
    }, 4000);
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Food Roulette</h1>
        <p className="text-gray-400">Can't decide? Let the wheel choose!</p>
      </div>

    {showWheel == true && (
      <>
      {/* Wheel */}
      <RouletteWheel
        items={restaurants}
        spinning={spinning}
        onSpin={handleSpin}
        rotation={rotation}
      />
      </>
    )}

      

     {selectedRestaurant && choice === "" && (
  <div className="mt-10 text-center text-white">

    {/* TITLE */}
    <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
      YOU'RE EATING AT:
    </h1>

    {/* RESTAURANT NAME (Neon Glow) */}
    <p className="text-5xl font-extrabold mt-3 
       text-[#6CFF90] drop-shadow-[0_0_15px_rgba(0,255,120,0.9)]">
      {selectedRestaurant}
    </p>

    {/* BUTTONS */}
    <div className="flex justify-center gap-6 mt-8">

      {/* YES BUTTON */}
      <button
        onClick={handleYes}
        className="px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2
        bg-gradient-to-b from-[#5CFF8A] to-[#0FBF41]
        shadow-[0_0_20px_rgba(0,255,120,0.6)]
        hover:brightness-110 active:scale-95 transition-all"
      >
        ✔ YES, we eat here
      </button>

      {/* NO BUTTON */}
      <button
        onClick={handleNo}
        className="px-6 py-3 rounded-full text-lg font-semibold flex items-center gap-2
        bg-gradient-to-b from-[#FF6B6B] to-[#D62828]
        shadow-[0_0_20px_rgba(255,90,90,0.5)]
        hover:brightness-110 active:scale-95 transition-all"
      >
        ✖ NO, pick again
      </button>

    </div>
  </div>
)}



      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 w-full max-w-sm bg-gray-800 rounded-xl p-4">
          <h3 className="text-white font-semibold mb-3">Recent Picks</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {[...history].reverse().slice(0, 5).map((entry, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg">
                <span className="text-white text-sm">{entry.restaurant}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}