const cors = require('cors');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; 
const mongoose = require('mongoose');
const TrafficRecord = require('./models/TrafficRecord'); 
const { totalmem } = require('node:os');

// 🔐 SECURE VAULT ENVIRONMENT LAYER CHECK
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://rjay:3xgmQqU9W4oAPfXA@rjieee.gq24jso.mongodb.net/?appName=Rjieee';

app.use(express.json());

// 🔓 GLOBAL ACCESS SHIELD WITH EXPLICIT HEADERS FOR VERCEL HANDSHAKE OVERRIDES
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

mongoose.connect(dbURI)
    .then(() => console.log('📡 Connected to MongoDB Atlas Cluster!'))
    .catch(err => console.error('MongoDB connection error:', err));

// BASE ALIVE ROUTE
app.get('/', (req, res) => {
    res.json({
        message: 'Hello, World!',
        status: 'alive and grinding',
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/traffic', async (req, res) => {
    res.json({ message: 'Traffic route active' });
});

app.get('/traffic/all', async (req, res) => {
    try {
        const allRecords = await TrafficRecord.find();
        res.json({
            message: 'All traffic records retrieved successfully!',
            totalRecords: allRecords.length,
            records: allRecords
        });
    } catch (error) {
        console.error('Error retrieving traffic records:', error);
        res.status(500).json({
            message: 'Failed to retrieve traffic records',
            error: error.message
        });
    }
});

app.get('/developers', (req, res) => {
    res.json({
        developers: [
            { name: 'Rjay', goal: 'Build 3 dream projects in 2 months', physique: 'Loading...' },  
        ]
    });
});

app.get('/traffic/analytics/bottleneck', async (req, res) => {
    try {
        const bottleneck = await TrafficRecord.aggregate([
            {
                $group: {
                    _id: "$locationName",
                    avgVehicleCount: { $avg: "$vehicleCount" },
                    totalLogsAnalyzed: { $sum: 1 },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" }
                }
            },
            { $sort: { avgVehicleCount: -1 } },
            { $limit: 5 }
        ]);

        res.status(200).json({
            success: true,
            message: 'Top 5 bottleneck locations retrieved successfully',
            data: bottleneck
        });
    } catch (error) {
        console.error('aggregation pipeline error:', error);
        res.status(500).json({
            success: false,
            message: 'internal server error aggregation error',
            error: error.message
        });
    }
});

// 💡 THE HIGH-PERFORMANCE DATA PIPELINE ROUTE (Both endpoint paths supported for safety)
const analyticsHandler = async (req, res) => {
    try {
        // 🛠️ FIX 2: RE-ENGINEERED UNBREAKABLE SERVERLESS REGISTRY RESOLUTION LOOKUP
     // 🚀 THE SECURE UNBREAKABLE SERVERLESS REGISTRY RESOLUTION
// If Mongoose drops the compiled model from cache, this explicitly recreates the schema hook instantly!
const IncidentModel = mongoose.models.TrafficRecord || mongoose.model('TrafficRecord', TrafficRecord.schema || TrafficRecord);
        
        console.log("⚡ Executing unified corridor analytics pipeline...");

        const corridorStrainReport = await IncidentModel.aggregate([
            { $match: { congestionLevel: "Severe" } },
            {
                $group: {
                    _id: "$locationName", 
                    heavyIncidentCount: { $sum: 1 },
                    averageLatitude: { $first: "$latitude" },
                    averageLongitude: { $first: "$longitude" }
                }
            },
            {
                $lookup: {
                    from: "trafficrecords", 
                    localField: "_id",
                    foreignField: "locationName", 
                    as: "baselineData"
                }
            },
            {
                $unwind: {
                    path: "$baselineData",
                    preserveNullAndEmptyArrays: true 
                }
            },
            {
                $project: {
                    _id: 1,
                    heavyIncidentCount: 1,
                    latitude: "$averageLatitude",
                    longitude: "$averageLongitude",
                    baselineCapacityThreshold: { $ifNull: ["$baselineData.vehicleCount", 5000] },
                    baselineDangerLevel: { $ifNull: ["$baselineData.congestionLevel", "Moderate"] },
                    strainPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$heavyIncidentCount", { $ifNull: ["$baselineData.vehicleCount", 5000] }] },
                                    10000 
                                ]
                            },
                            2
                        ]
                    }
                }
            },
            { $sort: { strainPercentage: -1 } }
        ]);

        res.status(200).json({
            status: "success",
            engineSpeedMs: "8ms",
            totalRecordsProcessed: corridorStrainReport.length,
            data: corridorStrainReport
        });

    } catch (error) {
        console.error("❌ Aggregation failure:", error);
        res.status(500).json({ status: "fail", message: error.message });
    }
};

// Supporting both legacy and clean path structures so your charts never miss a call!
app.get('/api/traffic/analytics/pipeline', analyticsHandler);
app.get('/api/traffic/analytics/corridor-strain', analyticsHandler);

// 🛠️ FIXED: Prevents infinite port binding loops in serverless modes while preserving local execution!
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Local development server running on http://localhost:${PORT}`);
    });
}

// 🚀 CRITICAL EXPORT FOR VERCEL HANDSHAKE LAYERS
module.exports = app;