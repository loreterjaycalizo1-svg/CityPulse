const mongoose = require('mongoose');

const trafficRecordSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: [true, 'Location name is required'],
        trim: true
    },
    vehicleCount: {
        type: Number,
        required: [true, 'Vehicle count is required'],
        min: [0, 'Vehicle count cannot be negative']
    },
    congestionLevel: {
        type: String,
        required: [true, 'Congestion level is required'],
        enum: ['Low', 'Moderate', 'Heavy', 'Severe'],
        default: 'Low'
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TrafficRecord', trafficRecordSchema);
