const cors = require('cors');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const app = express();
const port = 3000;
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});    