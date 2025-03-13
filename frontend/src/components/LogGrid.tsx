import React from "react";
import { Card } from "@/components/ui/card";
import { Remark } from "@/types";

interface LogGridProps {
  remarks: Remark[];
}

// Map the API status values to display values
const statusDisplayMap: Record<string, string> = {
  OFF_DUTY: "Off Duty",
  SLEEPER_BERTH: "Sleeper Berth",
  DRIVING: "Driving",
  ON_DUTY: "On Duty",
};

const statusDisplayValues = ["Off Duty", "Sleeper Berth", "Driving", "On Duty"];

const colors: Record<string, string> = {
  "Off Duty": "bg-gray-400",
  "Sleeper Berth": "bg-blue-500",
  Driving: "bg-green-500",
  "On Duty": "bg-yellow-500",
};

const LogGrid: React.FC<LogGridProps> = ({ remarks }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Helper function to convert time string to hour decimal
  const timeToHours = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours + minutes / 60 + seconds / 3600;
  };

  // Calculate total hours for each status
  const calculateTotalHours = (status: string): number => {
    return remarks
      .filter((remark) => statusDisplayMap[remark.status] === status)
      .reduce((total, remark) => {
        const startTime = timeToHours(remark.hour_start);
        const endTime = timeToHours(remark.hour_finish);
        // Handle cases where end time is less than start time (crosses midnight)
        const duration =
          endTime >= startTime ? endTime - startTime : 24 - startTime + endTime;
        return total + duration;
      }, 0);
  };

  // Calculate total hours for all statuses
  const statusTotals = statusDisplayValues.map((status) => ({
    status,
    totalHours: calculateTotalHours(status),
  }));

  const grandTotal = statusTotals.reduce(
    (total, statusTotal) => total + statusTotal.totalHours,
    0
  );

  return (
    <Card className="p-4 w-full">
      <div className="w-full border border-gray-300 rounded-md overflow-hidden">
        <div className="flex">
          {/* Wider status column */}
          <div className="w-24 min-w-24 border-r border-gray-400 bg-gray-50">
            <div className="h-8 border-b border-gray-500 flex items-center justify-center text-xs font-semibold">
              TOTAL HOURS
            </div>
            {statusDisplayValues.map((status) => (
              <div
                key={status}
                className="h-10 border-b border-gray-300 flex items-center justify-center text-xs font-medium px-1"
              >
                {status}
              </div>
            ))}
          </div>

          {/* Hours grid */}
          <div className="flex-grow">
            {/* Hour headers */}
            <div className="flex border-b border-gray-500 h-8">
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="flex-1 border-l border-gray-400 text-xs text-gray-700 text-center py-1"
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Status rows with remarks */}
            {statusDisplayValues.map((displayStatus) => (
              <div
                key={displayStatus}
                className="relative flex border-b border-gray-300 h-10"
              >
                {/* Hour columns */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="flex-1 border-l border-gray-300 h-full"
                  ></div>
                ))}

                {/* Remarks overlaid on this row */}
                {remarks
                  .filter(
                    (remark) =>
                      statusDisplayMap[remark.status] === displayStatus
                  )
                  .map((remark, index) => {
                    const startTime = timeToHours(remark.hour_start);
                    let endTime = timeToHours(remark.hour_finish);
                    if (endTime < startTime) {
                      endTime += 24;
                    }
                    const left = `${(startTime / 24) * 100}%`;
                    const width = `${((endTime - startTime) / 24) * 100}%`;

                    return (
                      <div
                        key={index}
                        className={`absolute top-0 h-full ${colors[displayStatus]} rounded opacity-80`}
                        style={{ left, width }}
                        title={`${remark.title || ""} ${
                          remark.location ? `(${remark.location})` : ""
                        }`}
                      />
                    );
                  })}
              </div>
            ))}
          </div>

          {/* Total hours column */}
          <div className="w-16 min-w-16 border-l border-gray-400 bg-gray-50">
            <div className="h-8 border-b border-gray-500"></div>
            {statusTotals.map((statusTotal) => (
              <div
                key={statusTotal.status}
                className="h-10 border-b border-gray-300 flex items-center justify-center text-xs font-bold"
              >
                {statusTotal.totalHours.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        {/* Grand total row */}
        <div className="flex border-t border-gray-500 bg-gray-100">
          <div className="w-24 min-w-24 border-r border-gray-400 py-1 px-2 text-xs font-bold">
            TOTAL
          </div>
          <div className="flex-grow"></div>
          <div className="w-16 min-w-16 border-l border-gray-400 py-1 px-2 text-xs font-bold text-center">
            {grandTotal.toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LogGrid;
