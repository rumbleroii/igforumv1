const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },

    degree:{
        type: String,
        required: true
    },

    branch: {
        type: String,
        required: true
    },

    year: {
        type: Number,
        required: true
    },

    rollno: {
        type: Number,
        required: true,
        unique: false
    },

    regno: {
        type: Number,
        required: true,
    },

    // skills : [{
    //   type: String;
    // }],

    // clubs: [{
    //     clubName: {
    //         type: String,
    //         required: true
    //     },
    //     position: {
    //         type: String,
    //         required: true
    //     }
    // }],

    hostel: {
        type: String,
    },

    linkedin: {
        type: String
    },

    githubusername: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
