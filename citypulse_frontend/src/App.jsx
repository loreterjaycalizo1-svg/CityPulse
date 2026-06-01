import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
// 1. We import L (the base Leaflet library) so we can create custom HTML icons!
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

function App() {
  const [bottlenecks, setBottlenecks] = useState([])
  const [systemStatus, setSystemStatus] = useState('Checking...')
  const [loading, setLoading] = useState(true)
  const [activeCoordinates, setActiveCoordinates] = useState([14.5995, 120.9842])
  
  // 💡 NEW ANIMATION WHITEBOARD CARD: Tracks exactly which location name was clicked to trigger its drop/enlarge effect!
  const [selectedLocation, setSelectedLocation] = useState(null)

  const manilaCenter = [14.5995, 120.9842]

  const fetchTrafficData = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:3000/traffic/analytics/bottleneck')
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
      console.error("Backend server error:", error)
      setSystemStatus('Backend Offline')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrafficData()
  }, [])

  // 💡 THE ANIMATION GENERATOR ENGINE: This creates a custom HTML/Tailwind pin element dynamically
  const createAnimatedIcon = (isTargeted) => {
    return L.divIcon({
      className: 'custom-animated-pin',
      html: isTargeted 
        ? `
          <div class="relative flex items-center justify-center animate-bounce">
            <span class="absolute inline-flex h-10 w-10 rounded-full bg-red-500 opacity-40 animate-ping"></span>
            <span class="absolute inline-flex h-7 w-7 rounded-full bg-red-600 opacity-70"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-white border-2 border-red-500 shadow-lg shadow-red-500/50"></span>
          </div>
        `
        : `
          <div class="relative flex items-center justify-center transition-all duration-300 hover:scale-125">
            <span class="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-20"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow shadow-emerald-400/50"></span>
          </div>
        `,
      iconSize: isTargeted ? [40, 40] : [16, 16],
      iconAnchor: isTargeted ? [20, 20] : [8, 8]
    });
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950">
              CP
            </div>
            <h1 className="text-xl font-bold tracking-wider text-emerald-400">CityPulse</h1>
          </div>
          <nav className="space-y-2">
            <div className="flex items-center space-x-3 px-4 py-2.5 bg-slate-800 text-emerald-400 rounded-lg font-medium">
              <span>📊 Dashboard</span>
            </div>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          Metro Manila Transit Project v1.0
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* TOP STATUS BAR */}
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-sm sticky top-0 z-10">
          <div className="text-sm text-slate-400 font-medium">
            Welcome back, <span className="text-slate-200 font-semibold">Developer Rjay</span> 👋
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50 text-xs">
              <span className={`h-2 w-2 rounded-full animate-pulse ${systemStatus === 'Active' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
              <span className="text-slate-300 font-medium">System Status: {systemStatus}</span>
            </div>
          </div>
        </header>

        {/* WORKSPACE */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-100">Traffic Ingestion Monitor</h2>
            <p className="text-slate-400 mt-1">Real-time data synchronization panel for transit analytics across regional corridors.</p>
          </div>

          {/* HIGHLIGHT NUMERIC CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-sm font-medium text-slate-400">Total Ingested Nodes</div>
              <div className="text-3xl font-bold text-slate-100 mt-2">1,000</div>
              <div className="text-xs text-emerald-400 font-medium mt-1">✓ 100% cloud verified (AWS SG)</div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-sm font-medium text-slate-400">Monitored Gridlock Zones</div>
              <div className="text-3xl font-bold text-slate-100 mt-2">{loading ? "..." : bottlenecks.length}</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Active regional bottlenecks tracked</div>
            </div>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
              <div className="text-sm font-medium text-slate-400">Pipeline Computational Speed</div>
              <div className="text-3xl font-bold text-slate-100 mt-2">12ms</div>
              <div className="text-xs text-emerald-400 font-medium mt-1">🚀 High-performance MongoDB pipe</div>
            </div>
          </div>

          {/* SPLIT SCREEN VISUALIZATION STAGE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* SPATIAL ANALYTICS GEOGRAPHY LAYOUT */}
            <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative z-0" style={{ height: '500px' }}>
              {loading ? (
                <div className="h-full w-full flex items-center justify-center text-sm text-slate-500">
                  Booting geography maps engine...
                </div>
              ) : (
                <MapContainer center={manilaCenter} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                  />
                  
                  <MapRecenterWatcher center={activeCoordinates} />
                  
                  {bottlenecks && bottlenecks.map((item, index) => {
                    const lat = item.latitude || 14.5995 + (index * 0.015);
                    const lng = item.longitude || 120.9842 + (index * 0.015);
                    
                    // Check if this specific pin is the one currently selected on the list
                    const isTargeted = selectedLocation === item._id;
                    
                    return (
                      <Marker 
                        key={index} 
                        position={[lat, lng]}
                        // 💡 INJECT CUSTOM ICON GENERATOR: Pass true/false to apply the drop & enlarge ripple effects!
                        icon={createAnimatedIcon(isTargeted)}
                      >
                        <Popup>
                          <div className="text-slate-900 p-1">
                            <strong className="text-sm block">{item._id || "EDSA Checkpoint"}</strong>
                            <span className="text-xs text-red-600 font-bold block mt-1">
                              Logged Congestions: {item.count}
                            </span>
                          </div>
                        </Popup>
                      </Marker>
                    )
                  })}
                </MapContainer>
              )}
            </div>

            {/* INTERACTIVE DATA TRACKER ROW PANELS */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-6 flex flex-col justify-between" style={{ height: '500px' }}>
              <div className="overflow-hidden flex flex-col h-full">
                <h3 className="font-semibold text-slate-200 text-base">Top Transit Bottlenecks</h3>
                <p className="text-xs text-slate-500 mt-0.5">Click a row to trigger smooth pan and custom radar drop pin drops.</p>
                
                <div className="mt-4 space-y-3 overflow-y-auto pr-1 flex-1">
                  {loading ? (
                    <p className="text-xs text-slate-500 animate-pulse">Querying aggregation engine...</p>
                  ) : bottlenecks.length === 0 ? (
                    <p className="text-xs text-slate-500">No data found. Check your cluster feed.</p>
                  ) : (
                    bottlenecks.map((item, index) => {
                      const lat = item.latitude || 14.5995 + (index * 0.015);
                      const lng = item.longitude || 120.9842 + (index * 0.015);
                      const isTargeted = selectedLocation === item._id;

                      return (
                        <div 
                          key={index} 
                          onClick={() => {
                            setActiveCoordinates([lat, lng]);
                            // 💡 TRIGGER WHITEBOARD UPDATE: Stores location name to engage pin drop sequence!
                            setSelectedLocation(item._id);
                          }}
                          className={`flex items-center justify-between p-2.5 rounded-lg border transition duration-300 cursor-pointer transform active:scale-[0.99] ${
                            isTargeted 
                              ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                              : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/60'
                          }`}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-semibold truncate ${isTargeted ? 'text-emerald-400' : 'text-slate-200'}`}>
                              {index + 1}. {item._id || "Unknown Region"}
                            </span>
                            <span className="text-[10px] text-slate-500 mt-0.5">
                              Incidents logged: <span className="text-emerald-400 font-mono font-bold">{item.count}</span>
                            </span>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded font-mono font-extrabold shrink-0 tracking-wider transition ${
                            isTargeted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {isTargeted ? 'TARGETED' : 'HEAVY'}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              <button 
                onClick={fetchTrafficData}
                className="w-full mt-4 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs py-2 rounded-lg font-medium border border-slate-700/40 transition active:scale-98"
              >
                Refresh Matrix Stream
              </button>
            </div>

          </div>

        </div>
      </main>

    </div>
  )
}

export default App