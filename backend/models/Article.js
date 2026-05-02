const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, default: '#' },
  author: { type: String, default: 'Admin' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
