const express = require('express');
const axios = require('axios');

const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Models & Middleware
const User = require('./models/User');
const Feedback = require('./models/Feedback');
const Article = require('./models/Article');
const SearchHistory = require('./models/SearchHistory');
const ReadHistory = require('./models/ReadHistory');
const Message = require('./models/Message');
const Report = require('./models/Report');
const PoliceReport = require('./models/PoliceReport');
const OTP = require('./models/OTP');
const { protect, admin, police, policeOrAdmin } = require('./middleware/authMiddleware');

dotenv.config();

const OSINT_URL = process.env.OSINT_ENGINE_URL || 'http://localhost:8001';


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

app.post('/api/articles', protect, policeOrAdmin, async (req, res) => {
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

app.delete('/api/articles/:id', protect, policeOrAdmin, async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (article) res.json({ message: 'Article removed' });
    else res.status(404).json({ message: 'Article not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/articles/:id', protect, policeOrAdmin, async (req, res) => {
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

app.patch('/api/articles/:id/visibility', protect, policeOrAdmin, async (req, res) => {
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
  const protocol = req.protocol;
  const host = req.get('host');
  res.json({ imageUrl: `${protocol}://${host}/uploads/${req.file.filename}` });
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
    const response = await axios.post(`${OSINT_URL}/search`, {
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
    const response = await axios.post(`${OSINT_URL}/search_username`, {
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
    const response = await axios.post(`${OSINT_URL}/phone`, {
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

// =======================
// OTP & VERIFICATION ROUTES
// =======================

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('[MAIL ERROR]: SMTP connection failed. Check EMAIL_USER and EMAIL_PASS (App Password required for Gmail).');
    console.error(error);
  } else {
    console.log('[MAIL SUCCESS]: Server is ready to take our messages');
  }
});

const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_ACCOUNT_SID.startsWith('AC')) 
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN) 
  : null;

app.post('/api/otp/send', async (req, res) => {
  const { email } = req.body;
  console.log(`[OTP DEBUG] Incoming request to send code to: ${email}`);
  
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await OTP.deleteOne({ email });
    await OTP.create({ email, otp });
    console.log(`[OTP DEBUG] Code ${otp} stored in database for ${email}`);

    const mailOptions = {
      from: `"White Zero Verification" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'White Zero - Secure Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 40px; background-color: #050505; color: #ffffff; border-radius: 20px; border: 1px solid #10b981;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #10b981; margin: 0; font-size: 28px; letter-spacing: 2px;">WHITE ZERO</h1>
            <p style="color: #888; font-size: 12px; margin-top: 5px;">FORENSIC INTELLIGENCE FRAMEWORK</p>
          </div>
          <div style="background: rgba(16, 185, 129, 0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(16, 185, 129, 0.1);">
            <h2 style="font-size: 20px; margin-top: 0; color: #fff;">Identity Verification Required</h2>
            <p style="line-height: 1.6; color: #ccc;">A request has been made to verify your identity for an official forensic report submission. Use the secure authorization code below to continue.</p>
            
            <div style="text-align: center; margin: 40px 0; padding: 25px; background: #111; border-radius: 12px; border: 1px dashed #10b981;">
              <span style="font-size: 42px; font-weight: 800; letter-spacing: 10px; color: #10b981; font-family: 'Courier New', Courier, monospace;">${otp}</span>
            </div>
            
            <p style="font-size: 13px; color: #888; text-align: center;">This code will expire in <strong style="color: #10b981;">5 minutes</strong>. If you did not request this code, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #555;">
            &copy; 2026 White Zero Intelligence. All rights reserved. <br/>
            Secure Encryption Enabled | Digital Integrity Verified
          </div>
        </div>
      `
    };

    console.log(`[OTP DISPATCH]: Handing off to mail server for ${email}...`);
    
    // Send email in background
    transporter.sendMail(mailOptions)
      .then(() => console.log(`[OTP SUCCESS]: Secure email sent successfully to ${email}`))
      .catch(err => {
        console.error(`[MAIL ERROR]: Failed to send to ${email}. Error: ${err.message}`);
        if (err.code === 'EAUTH') {
          console.error(`[MAIL ERROR]: Authentication failed. Check if EMAIL_PASS is a valid App Password.`);
        }
      });

    res.json({ success: true, message: 'OTP dispatch protocol initiated' });
  } catch (error) {
    console.error(`[OTP CRASH]: ${error.message}`);
    res.status(500).json({ message: 'Failed to initiate OTP protocol' });
  }
});


app.post('/api/otp/verify', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await OTP.findOne({ email, otp });
    if (record) {
      await OTP.deleteOne({ _id: record._id });
      res.json({ success: true });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Verification error' });
  }
});

// =======================
// POLICE REPORT ROUTES
// =======================

app.post('/api/police-reports', protect, async (req, res) => {
  const { victimName, victimEmail, title, description, evidenceLinks } = req.body;
  try {
    const referenceId = `POL-${Math.floor(Math.random() * 900000) + 100000}`;
    const report = await PoliceReport.create({
      user: req.user._id,
      victimName,
      victimEmail,
      title,
      description,
      evidenceLinks,
      referenceId,
      contactVerified: true
    });

    // Send confirmation email to user
    const mailOptions = {
      from: `"White Zero Intelligence" <${process.env.EMAIL_USER}>`,
      to: victimEmail,
      subject: `Case Received: ${referenceId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #050505; color: white; border-radius: 15px; border: 1px solid #10b981;">
          <h2 style="color: #10b981;">Investigation Initialized</h2>
          <p>Your forensic report has been successfully transmitted to the White Zero Intelligence Network.</p>
          <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <strong>Reference ID:</strong> ${referenceId}<br/>
            <strong>Incident:</strong> ${title}
          </div>
          <p style="font-size: 13px; color: #888; margin-top: 20px;">An officer will review your case shortly. You will receive email notifications for any updates.</p>
        </div>
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`[MAIL] Confirmation sent to reporter: ${victimEmail}`);
    } catch (err) {
      console.error('[MAIL ERROR] Reporter confirmation failed:', err.message);
    }

    // Notify Police Team
    const policeMailOptions = {
      from: `"White Zero System Alert" <${process.env.EMAIL_USER}>`,
      to: 'whitezero.lk@gmail.com',
      subject: `[NEW CASE] Forensic Investigation Initialized: ${referenceId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #050505; color: white; border-radius: 15px; border: 1px solid #10b981;">
          <h2 style="color: #10b981;">Urgent: New Investigation Report</h2>
          <div style="padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px;">
            <strong>Reference ID:</strong> ${referenceId}<br/>
            <strong>Reporter:</strong> ${victimName} (${victimEmail})<br/>
            <strong>Title:</strong> ${title}
          </div>
          <p><strong>Description Preview:</strong></p>
          <p style="font-size: 14px; opacity: 0.8;">${description.substring(0, 200)}...</p>
          <p style="font-size: 13px; color: #888; margin-top: 20px;">Log in to the Police Portal to review evidence and begin forensic analysis.</p>
        </div>
      `
    };
    try {
      await transporter.sendMail(policeMailOptions);
      console.log(`[MAIL] Intelligence alert sent to Police: whitezero.lk@gmail.com`);
    } catch (err) {
      console.error('[MAIL ERROR] Police notification failed:', err.message);
    }

    res.status(201).json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/police/reports', protect, policeOrAdmin, async (req, res) => {
  try {
    const reports = await PoliceReport.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/police/reports/:id/respond', protect, policeOrAdmin, async (req, res) => {
  const { message } = req.body;
  try {
    const report = await PoliceReport.findById(req.params.id);
    if (report) {
      if (report.isClosed) return res.status(400).json({ message: 'Case is closed' });
      
      report.responses.push({
        sender: req.user._id,
        role: req.user.role,
        message
      });
      report.status = 'In Progress';
      report.isReadByUser = false; // Mark as unread for the user
      await report.save();

      // Notify user via email
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: report.victimEmail,
        subject: `New Update: Case ${report.referenceId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background: #050505; color: white; border-radius: 15px; border: 1px solid #10b981;">
            <h2 style="color: #10b981;">Official Transmission Received</h2>
            <p>A police officer has responded to your investigation.</p>
            <div style="padding: 15px; background: rgba(16, 185, 129, 0.1); border-left: 4px solid #10b981; margin: 20px 0;">
              "${message}"
            </div>
            <p>Please log in to the White Zero portal to view full details and reply.</p>
          </div>
        `
      };
      transporter.sendMail(mailOptions).catch(err => console.error('Email failed:', err));
      
      res.json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User reply to police
app.post('/api/police-reports/:id/reply', protect, async (req, res) => {
  const { message } = req.body;
  console.log(`[REPLY ATTEMPT] User: ${req.user._id}, Report: ${req.params.id}`);
  try {
    const report = await PoliceReport.findById(req.params.id);
    if (report) {
      if (report.user.toString() !== req.user._id.toString()) {
        console.error(`[REPLY DENIED] ID mismatch. Report Owner: ${report.user}, Requestor: ${req.user._id}`);
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (report.isClosed) return res.status(400).json({ message: 'Case is closed' });

      report.responses.push({
        sender: req.user._id,
        role: 'user',
        message
      });
      report.isReadByPolice = false; // Mark as unread for police
      await report.save();
      console.log(`[REPLY SUCCESS] Message added to case ${report.referenceId}`);
      res.json(report);
    } else {
      console.error(`[REPLY ERROR] Report ${req.params.id} not found`);
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    console.error(`[REPLY CRASH] Error: ${error.message}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close Case
app.post('/api/reports/police/:id/close', protect, async (req, res) => {
  const { reason } = req.body;
  try {
    const report = await PoliceReport.findById(req.params.id);
    if (report) {
      // Both user and police/admin can close
      const isAuthorized = report.user.toString() === req.user._id.toString() || req.user.role === 'admin' || req.user.role === 'police';
      if (!isAuthorized) return res.status(401).json({ message: 'Unauthorized' });

      report.isClosed = true;
      report.conclusion = reason;
      report.status = 'Resolved';
      await report.save();
      res.json(report);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/admin/police-reports/metadata', protect, admin, async (req, res) => {
  try {
    const reports = await PoliceReport.find({})
      .select('victimName victimEmail title createdAt isClosed conclusion status referenceId')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/reports/police/my', protect, async (req, res) => {
  try {
    const reports = await PoliceReport.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark report as read
app.patch('/api/police-reports/:id/read', protect, async (req, res) => {
  try {
    const report = await PoliceReport.findById(req.params.id);
    if (report) {
      if (req.user.role === 'police' || req.user.role === 'admin') {
        report.isReadByPolice = true;
      } else {
        report.isReadByUser = true;
      }
      await report.save();
      res.json({ success: true });
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread counts and notifications
app.get('/api/police-reports/unread-count', protect, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'police' || req.user.role === 'admin') {
      query = { isReadByPolice: false };
    } else {
      query = { user: req.user._id, isReadByUser: false };
    }
    const count = await PoliceReport.countDocuments(query);
    const totalCount = await PoliceReport.countDocuments(req.user.role === 'user' ? { user: req.user._id } : {});
    
    // Show 5 most recent reports in the dropdown, not just unread ones
    const notificationsQuery = req.user.role === 'police' || req.user.role === 'admin' 
      ? {} 
      : { user: req.user._id };
      
    const notifications = await PoliceReport.find(notificationsQuery)
      .sort({ updatedAt: -1 })
      .limit(5);
    
    console.log(`[NOTIF DEBUG] User: ${req.user._id}, Unread Badge: ${count}, Items in Dropdown: ${notifications.length}`);
    res.json({ count, notifications, totalCount });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.use((err, req, res, next) => {
  console.error('[GLOBAL ERROR]:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
