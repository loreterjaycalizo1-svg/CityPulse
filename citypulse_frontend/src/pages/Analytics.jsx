import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, CartesianGrid } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        // 📡 Streaming fresh metrics from your verified backend aggregation route
       // 🔄 DISCONNECT LOCAL FEEDS — CONNECT THE GLOBAL PRODUCTION PIPELINE!

// Swap out your old endpoints for the live ones:
const response = await axios.get('https://YOUR-VERCEL-BACKEND-URL.vercel.app/api/traffic/analytics/pipeline');
        
        if (response.data && Array.isArray(response.data.data)) {
          
          // 🛠️ THE DATA NORMALIZATION LAYER: Formats the data so Recharts reads the keys perfectly!
          const formattedData = response.data.data.slice(0, 10).map((item) => ({
            // If locationName doesn't exist, safely fall back to using the MongoDB _id string!
            locationName: item.locationName || item._id || "Unknown Corridor",
            strainPercentage: item.strainPercentage || 0,
            heavyIncidentCount: item.heavyIncidentCount || 0
          }));

          console.log("📊 Chart Normalized Dataset:", formattedData); // Check your browser console to see this!
          setData(formattedData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to stream analytical vectors:", error);
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 text-slate-400 h-screen w-full">
        <p className="animate-pulse text-sm font-mono tracking-wider">⚡ Compiling regional telemetry graphs...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 min-h-screen text-slate-100 p-8 overflow-y-auto font-sans w-full">
      
      {/* HEADER ROW SECTION */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-100">Macro Data Visualization Space</h2>
        <p className="text-slate-400 mt-1">Cross-sectional analysis of vehicle limits and infrastructure stress vectors across Metro Manila corridors.</p>
      </div>

      {/* RECHARTS INFRASTRUCTURE SHIELD GRID CONTAINER */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* GRAPH PANEL 1: INFRASTRUCTURE OVERLOAD STRAIN MATRIX */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-200 text-base">Top 10 Infrastructure Overload Strain Ratios</h3>
            <p className="text-xs text-slate-500 mt-0.5">Calculated as (Heavy Incidents / Baseline Vehicle Capacity Coefficient) * 10,000.</p>
          </div>
          <div className="h-80 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="locationName" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                <Bar dataKey="strainPercentage" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Strain Index %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPH PANEL 2: RAW DENSITY GRAPH MATRIX */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-slate-200 text-base">Incident Volumetric Density Profiling</h3>
            <p className="text-xs text-slate-500 mt-0.5">Isolating total critical logs matching 'HEAVY' congestion profiles inside the database cluster.</p>
          </div>
          <div className="h-80 w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncident" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="locationName" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area type="monotone" dataKey="heavyIncidentCount" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorIncident)" name="Heavy Incident Count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;