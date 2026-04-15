import React from 'react';

const AttendanceCirc = ({ attendance }) => {
  // Use first subject as main overall or calculate average.
  // For demo, we just calculate average percentage.
  if (!attendance || attendance.length === 0) return <div>No data</div>;

  const total = attendance.reduce((acc, curr) => acc + curr.totalClasses, 0);
  const attended = attendance.reduce((acc, curr) => acc + curr.attendedClasses, 0);
  const percentage = total === 0 ? 0 : Math.round((attended / total) * 100);

  let colorClass = 'text-emerald-500';
  let strokeColor = '#10b981'; // emerald-500
  if (percentage < 50) {
    colorClass = 'text-rose-500';
    strokeColor = '#f43f5e'; // rose-500
  } else if (percentage <= 75) {
    colorClass = 'text-amber-500';
    strokeColor = '#f59e0b'; // amber-500
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card flex flex-col items-center justify-center">
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white self-start mb-4">Overall Attendance</h3>
      
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-slate-100 dark:text-white/5"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex flex-col items-center justify-center z-10">
          <span className={`text-3xl font-bold ${colorClass}`}>{percentage}%</span>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between w-full text-sm">
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Conducted</p>
          <p className="font-bold text-slate-800 dark:text-slate-200">{total}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 font-medium">Attended</p>
          <p className="font-bold text-slate-800 dark:text-slate-200">{attended}</p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCirc;
