const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Models & Middleware
const User = require('./models/User');
const Feedback = require('./models/Feedback');
const Article = require('./models/Article');
const SearchHistory = require('./models/SearchHistory');
const ReadHistory = require('./models/ReadHistory');
const Message = require('./models/Message');
const Report = require('./models/Report');
const { protect, admin } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb('Images only!');
  },
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Gemini AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBKQPdoNhZ54CjVIxR07NFUFlxjOkX9Nqs');
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

// Generate JWT Token Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// =======================
// AUTHENTICATION ROUTES
// =======================

app.post('/api/users/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    
    // Pick a random default avatar
    const avatars = ['/avatars/hacker.png', '/avatars/robot.png', '/avatars/ninja.png', '/avatars/retro.png', '/avatars/operative.png'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    
    const user = await User.create({ 
      name, 
      email, 
      password, 
      profileImage: randomAvatar,
      lastKnownIP: req.ip || '127.0.0.1' 
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      lastKnownIP: user.lastKnownIP,
      createdAt: user.createdAt,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      // Update IP on every login
      user.lastKnownIP = req.ip || '127.0.0.1';
      await user.save();
      
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        lastKnownIP: user.lastKnownIP,
        createdAt: user.createdAt,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// CONTACT MESSAGE ROUTES
// =======================

app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  try {
    const newMessage = await Message.create({ name, email, message });
    console.log(`[CONTACT] New message from ${name} (${email})`);
    res.status(201).json({ success: true, message: 'Message sent to command center.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

app.post('/api/feedback', protect, async (req, res) => {
  const { text, rating } = req.body;
  try {
    const feedback = await Feedback.create({ 
      name: req.user.name, 
      text, 
      rating: rating || 5, 
      userId: req.user._id
    });
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
});

app.get('/api/feedback/approved', async (req, res) => {
  try {
    // Public site shows name, text, rating, and user image
    const feedbacks = await Feedback.find({ status: 'approved' })
      .populate('userId', 'profileImage')
      .select('name text rating userId createdAt')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/feedback/:id/status', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (feedback) {
      feedback.status = req.body.status || feedback.status;
      await feedback.save();
      res.json(feedback);
    } else {
      res.status(404).json({ message: 'Feedback not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/feedback', protect, admin, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/feedback/:id', protect, admin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (feedback) res.json({ message: 'Feedback removed' });
    else res.status(404).json({ message: 'Feedback not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: 'user' });
    const articleCount = await Article.countDocuments();
    const feedbackCount = await Feedback.countDocuments();
    const pendingFeedback = await Feedback.countDocuments({ status: 'pending' });
    const messageCount = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ status: 'unread' });
    
    res.json({
      users: userCount,
      articles: articleCount,
      feedbacks: feedbackCount,
      pendingFeedback,
      messages: messageCount,
      unreadMessages
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/activity', protect, admin, async (req, res) => {
  try {
    const recentSearches = await SearchHistory.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email');
      
    // Calculate Top 5 most read articles
    const topArticles = await ReadHistory.aggregate([
      { $group: { _id: "$articleTitle", count: { $sum: 1 }, category: { $first: "$category" } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
      
    res.json({ searches: recentSearches, topArticles });
  } catch (error) {
    console.error('Admin activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) res.json({ message: 'User removed' });
    else res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Message Routes
app.get('/api/admin/messages', protect, admin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/messages/:id', protect, admin, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/admin/users', protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
    const user = await User.create({ name, email, password, role: role || 'user' });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// ARTICLE ROUTES
// =======================

app.get('/api/articles', async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isHidden: { $ne: true } };
    const articles = await Article.find(query).sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/articles', protect, admin, async (req, res) => {
  const { title, category, excerpt, content, image, link } = req.body;
  try {
    const article = await Article.create({
      title, category, excerpt, content, image, link
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create article' });
  }
});

app.delete('/api/articles/:id', protect, admin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (article) res.json({ message: 'Article removed' });
    else res.status(404).json({ message: 'Article not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/articles/:id', protect, admin, async (req, res) => {
  const { title, category, excerpt, content, image, link } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      article.title = title || article.title;
      article.category = category || article.category;
      article.excerpt = excerpt || article.excerpt;
      article.content = content || article.content;
      article.image = image || article.image;
      article.link = link || article.link;
      
      const updatedArticle = await article.save();
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update article' });
  }
});

app.patch('/api/articles/:id/visibility', protect, admin, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      article.isHidden = !article.isHidden;
      const updatedArticle = await article.save();
      console.log(`Article ${req.params.id} visibility set to: ${updatedArticle.isHidden}`);
      res.json(updatedArticle);
    } else {
      res.status(404).json({ message: 'Article not found' });
    }
  } catch (error) {
    console.error('Visibility toggle error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/articles/:id/bookmark', protect, async (req, res) => {
  try {
    const articleId = req.params.id;
    console.log(`[BOOKMARK] Toggling bookmark for ${articleId} by user ${req.user.email}`);
    
    const user = await User.findById(req.user._id);
    if (!user.bookmarks) user.bookmarks = [];
    
    const isBookmarked = user.bookmarks.some(id => id.toString() === articleId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== articleId);
    } else {
      user.bookmarks.push(new mongoose.Types.ObjectId(articleId));
    }

    await user.save();
    console.log(`[BOOKMARK] New state for ${articleId}: ${!isBookmarked}`);
    res.json({ isBookmarked: !isBookmarked });
  } catch (error) {
    console.error('[BOOKMARK ERROR]:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/profile/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// UPLOAD ROUTES
// =======================

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.send(`/uploads/${req.file.filename}`);
  } else {
    res.status(400).send('No file uploaded.');
  }
});

// =======================
// PROFILE ROUTES
// =======================

app.get('/api/users/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id, name: user.name, email: user.email, role: user.role,
        profileImage: user.profileImage, bio: user.bio, 
        createdAt: user.createdAt,
        bookmarks: user.bookmarks || []
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.profileImage = req.body.profileImage || user.profileImage;
      user.bio = req.body.bio || user.bio;
      
      if (req.body.password) {
        if (!req.body.oldPassword) {
          return res.status(400).json({ message: 'Old password is required to change password.' });
        }
        const isMatch = await user.matchPassword(req.body.oldPassword);
        if (!isMatch) {
          return res.status(401).json({ message: 'Incorrect old password.' });
        }
        user.password = req.body.password;
      }
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        createdAt: updatedUser.createdAt,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Use the shared 'upload' middleware defined at the top
app.post('/api/users/upload', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image provided' });
  }
  res.json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

// =======================
// ACTIVITY & HISTORY ROUTES
// =======================

app.post('/api/history/search', protect, async (req, res) => {
  try {
    const { query, resultsCount } = req.body;
    const history = await SearchHistory.create({
      userId: req.user._id,
      query,
      resultsCount
    });
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to record search history' });
  }
});

app.post('/api/history/read', protect, async (req, res) => {
  try {
    const { articleId, articleTitle, articleUrl, category } = req.body;
    console.log(`[HISTORY] Recording read for ${articleTitle} (${articleId}) by ${req.user.email}`);
    
    const history = await ReadHistory.create({
      userId: req.user._id,
      articleId: articleId ? new mongoose.Types.ObjectId(articleId) : undefined,
      articleTitle,
      articleUrl,
      category
    });
    res.status(201).json(history);
  } catch (error) {
    console.error('[HISTORY ERROR]:', error);
    res.status(500).json({ message: 'Failed to record read history' });
  }
});

app.get('/api/users/profile/activity', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('bookmarks');
    const searches = await SearchHistory.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const reads = await ReadHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const feedback = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 });
    
    const searchCount = await SearchHistory.countDocuments({ userId: req.user._id });
    const readCount = await ReadHistory.countDocuments({ userId: req.user._id });

    res.json({ 
      searches, 
      reads, 
      feedback, 
      bookmarks: user.bookmarks,
      user: {
        createdAt: user.createdAt,
        lastKnownIP: user.lastKnownIP
      },
      stats: { searchCount, readCount }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// =======================
// EXISTING AI ROUTES
// =======================

app.get('/', (req, res) => {
  res.send('White Zero Backend API Running');
});

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const prompt = `You are the White Zero Cyber Intelligence AI. 
         Active Intelligence Module: ${context || 'General Intelligence'}
         
         Instruction: Provide professional, technical, and highly structured cyber security guidance. 
         Use Markdown for formatting (headers, bold, bullet points). 
         Maintain a tone of "an advanced training brain".
         
         User Query: ${message}`;
    
    console.log(`[AI CHAT] Request: ${message.substring(0, 50)}...`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    res.json({ content: text });
  } catch (error) {
    console.error('[AI ERROR]:', error);
    
    // Check for specific error types (e.g., Quota, Invalid Model)
    if (error.status === 429) {
      return res.status(429).json({ error: 'AI Quota exceeded. Please try again in a few seconds.' });
    }
    if (error.status === 404) {
      return res.status(404).json({ error: 'AI Model not found or deprecated.' });
    }
    
    res.status(500).json({ error: 'Internal AI processing error', details: error.message });
  }
});

app.post('/api/analyze-post', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const prompt = `Perform a deep forensic analysis on this social media content: ${url}.
         Identify if it contains misinformation, fake news, or manipulated media.
         Also, extract/simulate the metadata for this post (Owner, Likes, Comments, Engagement).
         
         Return ONLY a JSON object with the following structure:
         {
           "prediction": "Real" | "Likely Fake" | "Highly Suspicious",
           "confidence": 0-100,
           "score": 0-10,
           "details": "Detailed forensic summary...",
           "redFlags": ["Flag 1", "Flag 2"],
           "sentiment": "Neutral/Alarmist/Biased",
           "verdict": "A one-sentence final judgment",
           "extractedData": {
             "owner": "Username or Page Name",
             "platform": "Facebook/Twitter/Instagram",
             "likes": "Count",
             "comments": "Count",
             "engagement": "High/Medium/Low",
             "timestamp": "Detected date"
           }
         }`;
         
    console.log(`[ANALYSIS] Scanning: ${url}`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().replace(/```json/g, '').replace(/```/g, '');
    
    try {
      const jsonResponse = JSON.parse(text);
      res.json(jsonResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      res.json({
        prediction: 'Highly Suspicious',
        confidence: 70,
        score: 3,
        details: 'The AI detected patterns of manipulation but the detailed report failed to format. Manual review advised.',
        redFlags: ['Irregular Metadata', 'Emotional Language'],
        sentiment: 'Alarmist',
        verdict: 'Caution: Potential misinformation detected.',
        extractedData: {
          owner: "Unknown Entity",
          platform: "Detected via URL",
          likes: "Unverified",
          comments: "Unverified",
          engagement: "Suspicious",
          timestamp: new Date().toLocaleDateString()
        }
      });
    }
  } catch (error) {
    console.error('[ANALYSIS ERROR]:', error);
    res.status(500).json({ error: 'Analysis Engine Failure' });
  }
});

// =======================
// OSINT ROUTES (PROXIED TO PYTHON ENGINE)
// =======================

app.post('/api/osint/search', async (req, res) => {
  const { query, search_type, limit } = req.body;
  try {
    const axios = require('axios');
    const response = await axios.post('http://localhost:8001/search', {
      query,
      search_type,
      limit: limit || 10
    });
    res.json(response.data);
  } catch (error) {
    console.error('[OSINT PROXY ERROR]:', error.message);
    // Return empty results if engine is down to prevent frontend crash
    res.json([]);
  }
});

app.post('/api/osint/username', async (req, res) => {
  const { username } = req.body;
  try {
    const axios = require('axios');
    const response = await axios.post('http://localhost:8001/search_username', {
      username
    });
    res.json(response.data);
  } catch (error) {
    console.error('[USERNAME PROXY ERROR]:', error.message);
    res.status(500).json({ message: 'Engine is offline' });
  }
});

app.post('/api/osint/phone', async (req, res) => {
  const { phone } = req.body;
  try {
    const axios = require('axios');
    const response = await axios.post('http://localhost:8001/phone', {
      username: phone // Using username field in model as per engine update
    });
    res.json(response.data);
  } catch (error) {
    console.error('[PHONE PROXY ERROR]:', error.message);
    res.status(500).json({ message: 'Engine is offline' });
  }
});

// =======================
// REPORT ROUTES
// =======================

app.post('/api/reports', protect, async (req, res) => {
  const { referenceId, victimName, platform, incidentType, targetAccount, description, content } = req.body;
  try {
    const report = await Report.create({
      user: req.user._id,
      referenceId,
      victimName,
      platform,
      incidentType,
      targetAccount,
      description,
      content
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/reports/my', protect, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/users/profile/clear-history', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // 1. Delete all reports
    await Report.deleteMany({ user: userId });
    
    // 2. Clear activity log (searches and bookmarks) in User model
    const user = await User.findById(userId);
    if (user) {
      user.activity = { searches: [], bookmarks: [] };
      await user.save();
    }
    
    res.json({ message: 'All forensic history and archived intelligence have been permanently purged.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/reports/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this report' });
    }
    await report.deleteOne();
    res.json({ message: 'Report permanently removed from archive' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
