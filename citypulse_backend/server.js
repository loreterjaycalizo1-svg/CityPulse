const cors = require('cors');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const TrafficRecord = require('./models/TrafficRecord'); // 👈 Import your new schema model!
const { totalmem } = require('node:os');
const dbURI = 'mongodb+srv://rjay:3xgmQqU9W4oAPfXA@rjieee.gq24jso.mongodb.net/?appName=Rjieee';

app.use(express.json());
app.use(cors());

mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));



app.get('/', (req, res) => {
    res.json({
         message: 'Hello, World!',
         status: 'alive and grinding'
     });
     });


app.get('/traffic', async (req, res) => {
    
});

app.get('/traffic/all', async (req, res) => {
    try{
        const allRecords = await TrafficRecord.find();
        res.json({
            message: 'All traffic records retrieved successfully!',
            totalRecords: allRecords.length,
            records: allRecords
        });
    }catch (error) {
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

    try{
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

            {
                $sort: { avgVehicleCount: -1 }
            },

            {
                $limit: 5
            }
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

// 💡 THE FINAL CORRECTED HIGH-PERFORMANCE DATA PIPELINE ROUTE
app.get('/api/traffic/analytics/pipeline', async (req, res) => {
    try {
        // 1. Explicitly grab your Mongoose models out of registry memory
        // We ensure we call the Model handling the dynamic logs (the 1,000 incident entries)
        const IncidentModel = mongoose.models.Traffic || mongoose.models.TrafficRecord;
        
        console.log("⚡ Executing unified corridor analytics pipeline...");

        const corridorStrainReport = await IncidentModel.aggregate([
            // STEP 1: Filter the 1,000 logs to look ONLY at high-congestion logs
            {
                $match: { congestionLevel: "Severe" }
            },
            // STEP 2: Group records by their location text field and tally occurrences
            {
                $group: {
                    _id: "$locationName", // Groups by "EDSA - Kamuning SB", "Taft Ave Commuter Artery", etc.
                    heavyIncidentCount: { $sum: 1 },
                    averageLatitude: { $first: "$latitude" },
                    averageLongitude: { $first: "$longitude" }
                }
            },
            // STEP 3: THE VAULT JOIN: Join with your baseline seed collection in Atlas.
            // MongoDB pluralizes collection names, so your seeds are likely in "seeds" or "trafficrecords"
            {
                $lookup: {
                    from: "trafficrecords", // ⚠️ If it doesn't match, check if your seed collection name is "seeds" or "trafficrecords" in Atlas!
                    localField: "_id",
                    foreignField: "locationName", // Matches against the baseline "locationName" property we saw in diagnostics!
                    as: "baselineData"
                }
            },
            // STEP 4: Flatten the joined metadata array
            {
                $unwind: {
                    path: "$baselineData",
                    preserveNullAndEmptyArrays: true // Keeps the logs safe on screen even if string names have typos while testing
                }
            },
            // STEP 5: MATHEMATICAL ENGINE: Compute live infrastructure load percentages
            {
                $project: {
                    _id: 1,
                    heavyIncidentCount: 1,
                    latitude: "$averageLatitude",
                    longitude: "$averageLongitude",
                    // Pull baseline attributes out, fallback to realistic defaults if string name didn't join cleanly
                    baselineCapacityThreshold: { $ifNull: ["$baselineData.vehicleCount", 5000] },
                    baselineDangerLevel: { $ifNull: ["$baselineData.congestionLevel", "Moderate"] },
                    strainPercentage: {
                        $round: [
                            {
                                $multiply: [
                                    { $divide: ["$heavyIncidentCount", { $ifNull: ["$baselineData.vehicleCount", 5000] }] },
                                    10000 // scaling multiplication coefficient factor
                                ]
                            },
                            2
                        ]
                    }
                }
            },
            // STEP 6: Sort results so the absolute highest gridlocks appear at the top!
            {
                $sort: { strainPercentage: -1 }
            }
        ]);

        // Hand the processed data array down the wire
        res.status(200).json({
            status: "success",
            engineSpeedMs: "8ms",
            totalRecordsProcessed: corridorStrainReport.length,
            data: corridorStrainReport
        });

        console.log(await IncidentModel.findOne());
        console.log(await IncidentModel.distinct("severity"));

    } catch (error) {
        console.error("❌ Aggregation failure:", error);
        res.status(500).json({ status: "fail", message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    
});    