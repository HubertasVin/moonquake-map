import React, { useState } from 'react';
import { moonquake_data } from './moonquakes';
import Button from './QuakeListButton';

interface Quake {
  latitude: number;
  longitude: number;
  magnitude: number;
  date: string;
}

export let quake_lines: Quake[] = [];

function select_onclick(magnitude: number, latitude: number, longitude: number) {
  const index = quake_lines.findIndex(
    (quake) =>
      quake.magnitude === magnitude &&
      quake.latitude === latitude &&
      quake.longitude === longitude
  );

  if (index !== -1) {
    quake_lines.splice(index, 1);
  } else {
    quake_lines.push({ magnitude, latitude, longitude, date: '' });
  }
}

function QuakeList() {
  // Group the moonquakes by year
  const groupedMoonquakes: { [year: string]: Quake[] } = {};
  moonquake_data.forEach((moonquake) => {
    const year = moonquake.date.split('-')[0];
    if (!groupedMoonquakes[year]) {
      groupedMoonquakes[year] = [];
    }
    groupedMoonquakes[year].push({
      latitude: moonquake.lat,
      longitude: moonquake.lng,
      magnitude: moonquake.magnitude,
      date: moonquake.date,
    });
  });

  // State to track which dropdowns are open
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Toggle dropdown visibility
  const toggleDropdown = (year: string) => {
    if (openDropdowns.includes(year)) {
      setOpenDropdowns(openDropdowns.filter((item) => item !== year));
    } else {
      setOpenDropdowns([...openDropdowns, year]);
    }
  };

  return (
    <div className="absolute right-2 bg-gray-500 text-white font-bold py-2 px-4 rounded w-64 h-full overflow-y-auto overflow-x-hidden flex flex-col gap-2 select-none">
      {Object.keys(groupedMoonquakes).map((year) => (
        <div key={year}>
          <button
            onClick={() => toggleDropdown(year)}
            className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded w-full"
          >
            {year} ({groupedMoonquakes[year].length})
          </button>
          {openDropdowns.includes(year) && (
            <div className="flex flex-col gap-2">
              {groupedMoonquakes[year].map((moonquake, index) => (
                <Button
                  key={index}
                  itemKey={index}
                  onclick={() =>
                    select_onclick(
                      moonquake.magnitude,
                      moonquake.latitude,
                      moonquake.longitude
                    )
                  }
                  name={moonquake.date}
                ></Button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuakeList;