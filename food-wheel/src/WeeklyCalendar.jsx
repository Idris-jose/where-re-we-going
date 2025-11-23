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
    <div style={{ marginTop: 40, width: "100%", maxWidth: 600 }}>
      <h2 className="text-xl font-semibold mb-2">Weekly Food History</h2>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {daysOfWeek.map((day, idx) => (
          <div key={idx} style={{ flex: 1, textAlign: "center", padding: 10, border: "1px solid #ccc", borderRadius: 8, margin: 2 }}>
            <div style={{ fontWeight: "bold" }}>{day}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              {maxByDay[idx].join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
