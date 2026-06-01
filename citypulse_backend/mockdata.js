const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const mongoURI = 'mongodb+srv://rjay:3xgmQqU9W4oAPfXA@rjieee.gq24jso.mongodb.net/?appName=Rjieee';

const trafficSchema = new mongoose.Schema({
    location: String,
    latitude: Number,
    longitude: Number,
    severity: String,
    timestamp: {type: Date, default: Date.now},
});
 
const traffic = mongoose.models.Traffic || mongoose.model('Traffic', trafficSchema);

const choke = [
    { name: "EDSA - Kamuning SB", lat: 14.6349, lng: 121.0403 },
  { name: "C5 - Bagong Ilog NB", lat: 14.5678, lng: 121.0664 },
  { name: "España Blvd - Lerma", lat: 14.6062, lng: 120.9894 },
  { name: "Taft Avenue - Gil Puyat", lat: 14.5532, lng: 120.9961 },
  { name: "Katipunan Ave - Ateneo Flyover", lat: 14.6401, lng: 121.0747 },
  { name: "Roxas Blvd - Quirino Grandstand", lat: 14.5786, lng: 120.9764 }
];

async function seedDatabase() {
    try{
        console.log('Seeding database with mock traffic data...');
        await mongoose.connect(mongoURI);
        console.log("FLushing Data records...");

        await traffic.deleteMany({});

        console.log('Inserting mock traffic records...');

        const reports = [];

        for(let i = 0; i < 1000; i++){
            const point = choke[Math.floor(Math.random() * choke.length)];
      
      // 💡 THE SCATTER HACK: We inject subtle random variations to the coordinates.
      // This spreads the 1,000 pins slightly across the streets instead of stacking 
      // perfectly into 1 single block, making the map grid look beautiful and dense!
      const randomOffsetLat = (Math.random() - 0.5) * 0.015;
      const randomOffsetLng = (Math.random() - 0.5) * 0.015;

      const severities = ["HEAVY", "HEAVY", "MODERATE", "LIGHT"];
      const randomSeverity = severities[Math.floor(Math.random() * severities.length)];

      reports.push({
        location: point.name,
        latitude: point.lat + randomOffsetLat,
        longitude: point.lng + randomOffsetLng,
        severity: randomSeverity,
        // Spreads time records across the past 7 days (Crucial for showing future timeline charts!)
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
      });
        }

        await traffic.insertMany(reports);
        console.log("🎉 SUCCESS! 1,000 cloud-verified traffic nodes injected into your cluster!");
         await mongoose.disconnect();
        console.log("Safely disconnected from database storage nodes.");
    }catch(error){
        console.error('Error seeding database:', error);
    };
};

seedDatabase();