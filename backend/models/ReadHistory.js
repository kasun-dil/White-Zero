const mongoose = require('mongoose');

const ReadHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  articleTitle: { type: String, required: true },
  articleUrl: { type: String, required: true },
  category: { type: String, default: 'General' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReadHistory', ReadHistorySchema);
