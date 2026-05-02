const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  referenceId: {
    type: String,
    required: true,
    unique: true
  },
  victimName: String,
  platform: String,
  incidentType: String,
  targetAccount: String,
  description: String,
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Generated'
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
