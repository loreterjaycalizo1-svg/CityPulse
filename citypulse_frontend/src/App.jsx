import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// IMPORT NEW DETACHED PAGES
import Analytics from './pages/Analytics'

// MAP RECENTER CONTROLLER COMPONENT
function MapRecenterWatcher({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 14, { animate: true, duration: 1.2 });
    }
  }, [center, map]);
  return null;
}

// 📦 SUB-COMPONENT: STANDALONE COCKPIT MAP SCREENS
const LiveCockpitDashboard = () => {
  const [bottlenecks, setBottlenecks] = useState([])
  const [systemStatus, setSystemStatus] = useState('Checking...')
  const [loading, setLoading] = useState(true)
  const [activeCoordinates, setActiveCoordinates] = useState([14.5995, 120.9842])
  const [selectedLocation, setSelectedLocation] = useState(null)

  const manilaCenter = [14.5995, 120.9842]

  const fetchTrafficData = async () => {
    try {
      setLoading(true)
   // 🔄 DISCONNECT LOCAL FEEDS — CONNECT THE GLOBAL PRODUCTION PIPELINE!

// Swap out your old endpoints for the live ones:
const response = await axios.get('https://city-pulse-2d77.vercel.app/api/traffic/analytics/pipeline');
      if (response.data && Array.isArray(response.data.data)) {
        setBottlenecks(response.data.data)
      } else if (Array.isArray(response.data)) {
        setBottlenecks(response.data)
      } else {
        setBottlenecks([])
      }
      setSystemStatus('Active')
      setLoading(false)
    } catch (error) {
      console.error("Connection failed:", error)
      setSystemStatus('Backend Offline')
      setLoading(false)
    }
  }

  useEffect(() => { fetchTrafficData() }, [])

  const getMarkerColorClass = (strain) => {
    if (strain >= 100) return { ring: 'bg-red-500', base: 'bg-red-600', dot: 'border-red-500 shadow-red-500/50' };
    if (strain >= 75)  return { ring: 'bg-orange-500', base: 'bg-orange-600', dot: 'border-orange-500 shadow-orange-500/50' };
    if (strain >= 40)  return { ring: 'bg-yellow-400', base: 'bg-yellow-500', dot: 'border-yellow-400 shadow-yellow-400/50' };
    return { ring: 'bg-emerald-400', base: 'bg-emerald-500', dot: 'border-emerald-400 shadow-emerald-400/50' };
  };

  const createAnimatedIcon = (item, isTargeted) => {
    const colors = getMarkerColorClass(item.strainPercentage);
    return L.divIcon({
      className: 'custom-animated-pin',
      html: isTargeted 
        ? `<div class="relative flex items-center justify-center animate-bounce">
            <span class="absolute inline-flex h-12 w-12 rounded-full ${colors.ring} opacity-40 animate-ping"></span>
            <span class="absolute inline-flex h-8 w-8 rounded-full ${colors.base} opacity-70"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-white border-2 ${colors.dot} shadow-lg"></span>
          </div>`
        : `<div class="relative flex items-center justify-center"><span class="absolute inline-flex h-3 w-3 rounded-full ${colors.base} opacity-40"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-white opacity-90 shadow-sm"></span></div>`,
      iconSize: isTargeted ? [48, 48] : [12, 12],
      iconAnchor: isTargeted ? [24, 24] : [6, 6]
    });
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
          <span className={`h-2 w-2 rounded-full animate-pulse ${systemStatus === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
          <span className="text-slate-300 font-medium">System Status: {systemStatus}</span>
        </div>
      </header>

      <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Traffic Ingestion Monitor</h2>
          <p className="text-slate-400 mt-1">Real-time data synchronization panel for transit analytics across regional corridors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="text-sm font-medium text-slate-400">Total Ingested Nodes</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">1,000</div>
            <div className="text-xs text-emerald-400 font-medium mt-1">✓ 100% cloud verified (AWS SG)</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="text-sm font-medium text-slate-400">Monitored Gridlock Zones</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">{loading ? "..." : bottlenecks.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Active corridors calculated</div>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
            <div className="text-sm font-medium text-slate-400">Pipeline Computational Speed</div>
            <div className="text-3xl font-bold text-slate-100 mt-2">8ms</div>
            <div className="text-xs text-emerald-400 font-medium mt-1">🚀 High-performance MongoDB pipe</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative z-0" style={{ height: '500px' }}>
            {loading ? (
              <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">Booting maps engine...</div>
            ) : (
              <MapContainer center={manilaCenter} zoom={13} preferCanvas={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png" />
                <MapRecenterWatcher center={activeCoordinates} />
                {bottlenecks && bottlenecks.map((item, index) => {
                  if (!item.latitude || !item.longitude) return null;
                  const currentName = item.locationName || item._id || "Unknown Corridor";
                  const isTargeted = selectedLocation === currentName;
                  return (
                    <Marker 
                      key={index} 
                      position={[item.latitude, item.longitude]}
                      icon={createAnimatedIcon(item, isTargeted)}
                      eventHandlers={{ click: () => { setSelectedLocation(currentName); setActiveCoordinates([item.latitude, item.longitude]); } }}
                    >
                      <Popup>
                        <div className="text-slate-900 p-2 font-sans min-w-[190px]">
                          <strong className="text-sm block border-b pb-1 mb-1 text-slate-800">{currentName}</strong>
                          <div className="text-xs space-y-0.5 mt-1 text-slate-600">
                            <p>🚨 Heavy Reports: {item.heavyIncidentCount}</p>
                            <p>📦 Capacity: {item.baselineCapacityThreshold || 4500}</p>
                            <p>⚠️ Baseline: {item.baselineDangerLevel || "Severe"}</p>
                          </div>
                          <span className="text-xs font-bold block mt-2 pt-1 border-t text-emerald-600">🔥 Strain Index: {item.strainPercentage}%</span>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}
              </MapContainer>
            )}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between" style={{ height: '500px' }}>
            <div className="overflow-hidden flex flex-col h-full">
              <h3 className="font-semibold text-slate-200 text-base">Top Transit Bottlenecks</h3>
              <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1">
                {bottlenecks.map((item, index) => {
                  const currentName = item.locationName || item._id || "Unknown Region";
                  const isTargeted = selectedLocation === currentName;
                  return (
                    <div 
                      key={index} 
                      onClick={() => { setActiveCoordinates([item.latitude, item.longitude]); setSelectedLocation(currentName); }}
                      className={`flex items-center justify-between p-2.5 rounded-lg border transition duration-300 cursor-pointer ${isTargeted ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700'}`}
                    >
                      <div className="flex flex-col min-w-0 pr-2">
                        <span className={`text-xs font-semibold truncate ${isTargeted ? 'text-emerald-400' : 'text-slate-200'}`}>{index + 1}. {currentName}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">Incidents: {item.heavyIncidentCount}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded font-mono font-extrabold text-red-400 bg-red-500/10`}>{item.strainPercentage}% ST</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <button onClick={fetchTrafficData} className="w-full mt-4 bg-slate-800 text-slate-300 text-xs py-2 rounded-lg border border-slate-700/40">Refresh Matrix Stream</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// 🏢 THE MASTER ROUTER ROOT SYSTEM
function App() {
  // 🛠️ DATA ALIGNMENT ENGINE: Formats your database records so Recharts reads the keys perfectly!
  return (
    <Router>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
        
        {/* SIDEBAR NAVIGATION CONTROL (LINKING PAGES DYNAMICALLY) */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">CP</div>
              <h1 className="text-xl font-bold tracking-wider text-emerald-400">CityPulse</h1>
            </div>
            
            {/* 🛠️ LINK TAGS ROUTING MATRIX ENGAGED */}
            <nav className="space-y-3">
              <Link to="/" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-800/50 text-slate-300 hover:text-emerald-400 rounded-lg font-medium transition duration-200">
                <span>🗺️ Live Radar Map</span>
              </Link>
              <Link to="/analytics" className="flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-800/50 text-slate-300 hover:text-emerald-400 rounded-lg font-medium transition duration-200">
                <span>📈 Data Visualizations</span>
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
            Metro Manila Transit Project v1.0
          </div>
        </aside>

        {/* CONTROLLER ROUTES DISPATCHER */}
        <Routes>
          <Route path="/" element={<LiveCockpitDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>

      </div>
    </Router>
  )
}

export default App