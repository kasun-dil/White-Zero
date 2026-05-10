const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
  galleryImages: [{ type: String }],
  excerpt: { type: String, required: true },
  introBold: { type: String },
  content: { type: String, required: true },
  conclusion: { type: String },
  link: { type: String, default: '#' },
  author: { type: String, default: 'Admin' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorRole: { type: String, enum: ['admin', 'police'], default: 'admin' },
  isHidden: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true },
      userImage: { type: String },
      text: { type: String, required: true },
      isHidden: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
