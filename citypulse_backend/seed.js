const mongoose = require('mongoose');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const trafficRecord = require('./models/trafficRecord');
const { timeStamp } = require('node:console');

const dbURI = 'mongodb+srv://rjay:3xgmQqU9W4oAPfXA@rjieee.gq24jso.mongodb.net/?appName=Rjieee';

const mmdaFullLedger = [
    { name: "Recto Ave Trunk", lat: 14.6036, lng: 120.9850, baseCount: 116153 },
    { name: "Mendoza Street Segment", lat: 14.5995, lng: 120.9842, baseCount: 98975 },
    { name: "Pres. Quirino Ave Artery", lat: 14.5786, lng: 120.9994, baseCount: 200135 },
    { name: "Araneta Ave Connector", lat: 14.6139, lng: 121.0117, baseCount: 136969 },
    { name: "EDSA Carousel Segment", lat: 14.5547, lng: 121.0244, baseCount: 421728 },
    { name: "C.P. Garcia / Katipunan / Tandang Sora Artery", lat: 14.6507, lng: 121.0744, baseCount: 225885 },
    { name: "Roxas Blvd Transit Line", lat: 14.5623, lng: 120.9880, baseCount: 203268 },
    { name: "Taft Ave Commuter Artery", lat: 14.5639, lng: 120.9947, baseCount: 155014 },
    { name: "South Superhighway (SSH) Trunk", lat: 14.5512, lng: 121.0135, baseCount: 269024 },
    { name: "Shaw Blvd Commercial Connector", lat: 14.5816, lng: 121.0536, baseCount: 149126 },
    { name: "Ortigas Ave Distribution Artery", lat: 14.5880, lng: 121.0645, baseCount: 208808 },
    { name: "Magsaysay Blvd Artery", lat: 14.6016, lng: 121.0061, baseCount: 161801 },
    { name: "Aurora Blvd Sector", lat: 14.6194, lng: 121.0371, baseCount: 147411 },
    { name: "Quezon Ave Major Trunk", lat: 14.6323, lng: 121.0201, baseCount: 256876 },
    { name: "Commonwealth Ave Express Highway", lat: 14.6760, lng: 121.0802, baseCount: 400644 },
    { name: "A. Bonifacio Main Sector", lat: 14.6402, lng: 120.9943, baseCount: 134649 },
    { name: "Rizal Ave Segment", lat: 14.6295, lng: 120.9832, baseCount: 117922 },
    { name: "Del Pan Bridge Bottleneck", lat: 14.5944, lng: 120.9664, baseCount: 117011 },
    { name: "Marcos Highway Eastern Artery", lat: 14.6256, lng: 121.1014, baseCount: 283423 },
    { name: "McArthur Highway Northern Trunk", lat: 14.6644, lng: 120.9698, baseCount: 134815 }
];

const levels = ['Low', 'Moderate', 'Heavy', 'Severe'];

async function seedDatabase() {
    try{
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB for seeding');

        await trafficRecord.deleteMany({});
        console.log('Cleared existing traffic records');
        
        const recordsToInsert = [];

        for (let i = 0; i< 1000; i++) {
            const road = mmdaFullLedger[Math.floor(Math.random() * mmdaFullLedger.length)];
            const randomLevel = levels[Math.floor(Math.random() * levels.length)];


            const hourlyAverage = Math.floor(road.baseCount / 24);
            const simulatedCount = Math.floor(hourlyAverage * (Math.random() * (1.6 - 0.4) + 0.4));

            const randomPastDate = new Date();
            randomPastDate.setDate(randomPastDate.getDate() - Math.floor(Math.random() * 1000)); 
            randomPastDate.setHours(Math.floor(Math.random() * 24));

            recordsToInsert.push({
                locationName: road.name,
                vehicleCount: simulatedCount,
                congestionLevel: randomLevel,
                latitude: road.lat,
                longitude: road.lng,
                timeStamp: randomPastDate
            });
        }
            await trafficRecord.insertMany(recordsToInsert);
            console.log('Database seeding completed successfully!');

            mongoose.connection.close();
    } catch (error) {
        console.error('Error during database seeding:', error);
    }
}

seedDatabase();
            