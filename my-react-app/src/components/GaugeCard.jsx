import React from 'react';

const GaugeCard = ({ label, value, total, color }) => {
  const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const strokeDash = (percent / 100) * circumference;

  const colorMap = {
    teal: { stroke: '#0d9488', text: 'text-teal-600', bg: 'bg-teal-50' },
    orange: { stroke: '#f97316', text: 'text-orange-600', bg: 'bg-orange-50' },
    cyan: { stroke: '#0891b2', text: 'text-cyan-600', bg: 'bg-cyan-50' },
  };
  const c = colorMap[color] || colorMap.teal;

  return (
    <div className={`${c.bg} rounded-2xl p-5 flex flex-col items-center`}>
      <p className={`text-sm font-semibold ${c.text} mb-2`}>{label}</p>
      <div className="relative w-32 h-16 overflow-hidden">
        <svg viewBox="0 0 120 60" className="w-full h-full">
          {/* Background arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Value arc */}
          <path
            d="M 10 60 A 50 50 0 0 1 110 60"
            fill="none"
            stroke={c.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${(percent / 100) * 157} 157`}
          />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className={`text-lg font-bold ${c.text}`}>
            ₹{value?.toLocaleString('en-IN') || 0}
          </span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{Math.round(percent)}% of total</p>
      <p className="text-xs text-gray-400">This Month data</p>
    </div>
  );
};

export default GaugeCard;
