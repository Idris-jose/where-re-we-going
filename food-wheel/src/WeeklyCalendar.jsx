import React from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeeklyCalendar({ history }) {
  // history: Array of objects { date: string (ISO), restaurant: string }
  // Calculate frequency of each restaurant per day

  // Create a map: day (0-6) -> {restaurant: count}
  const freqByDay = {};

  for (let i = 0; i < 7; i++) {
    freqByDay[i] = {};
  }

  history.forEach(({ date, restaurant }) => {
    const d = new Date(date);
    const day = d.getDay();
    if (!freqByDay[day][restaurant]) {
      freqByDay[day][restaurant] = 0;
    }
    freqByDay[day][restaurant]++;
  });

  // For each day, find the restaurant(s) with max frequency
  const maxByDay = {};
  for (let i = 0; i < 7; i++) {
    const restaurants = freqByDay[i];
    let maxCount = 0;
    let maxRestaurants = [];
    for (const r in restaurants) {
      if (restaurants[r] > maxCount) {
        maxCount = restaurants[r];
        maxRestaurants = [r];
      } else if (restaurants[r] === maxCount) {
        maxRestaurants.push(r);
      }
    }
    maxByDay[i] = maxRestaurants.length > 0 ? maxRestaurants : ["-"];
  }

  return (
    <div className="mt-10 w-full max-w-lg mx-auto px-2 sm:px-0">
      <h2 className="text-xl font-semibold mb-2">Weekly Food History</h2>
      <div className="flex justify-between">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className="flex-1 text-center p-2 border border-gray-300 rounded-lg mx-0.5">
            <div className="font-bold">{day}</div>
            <div className="text-xs text-gray-600">
              {maxByDay[idx].join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
