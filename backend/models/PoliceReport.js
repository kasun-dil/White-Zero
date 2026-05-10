const mongoose = require('mongoose');

const policeReportSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  victimName: { type: String, required: true },
  victimEmail: { type: String, required: true },
  victimMobile: { type: String },
  contactVerified: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  platform: { type: String },
  otherPlatform: { type: String },
  incidentDate: { type: Date },
  platformDetails: { type: String },
  evidenceLinks: [String],
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  responses: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['user', 'police', 'admin'] },
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  isClosed: { type: Boolean, default: false },
  conclusion: { type: String },
  isReadByUser: { type: Boolean, default: true },
  isReadByPolice: { type: Boolean, default: true },
  referenceId: { type: String, unique: true }
}, {
  timestamps: true
});

const PoliceReport = mongoose.model('PoliceReport', policeReportSchema);

module.exports = PoliceReport;
