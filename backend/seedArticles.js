const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Article = require('./models/Article');

dotenv.config();

const articles = [
  {
    title: 'Zero-Day Vulnerability Found in Popular Browser',
    category: 'Cyber Security',
    excerpt: 'A critical remote code execution vulnerability has been discovered that could allow attackers to take control of systems.',
    content: '# Zero-Day Threat\n\nSecurity researchers have identified a new zero-day vulnerability...\n\n### Impact\nUsers are advised to update their browsers immediately to the latest version.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'New Ransomware Group "Cyborg" Emerges',
    category: 'Malware',
    excerpt: 'A new sophisticated ransomware group has started targeting critical infrastructure across Europe and North America.',
    content: '# Cyborg Ransomware\n\nThe group uses advanced encryption techniques...\n\n### Prevention\nEnsure all backups are offline and immutable.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'Data Breach at Major Social Media Platform',
    category: 'Data Breach',
    excerpt: 'Personal data of over 50 million users has been leaked online after a misconfigured database was discovered.',
    content: '# Privacy Alert\n\nThe leak includes emails, names, and encrypted passwords...\n\n### Action Needed\nUsers should change their passwords and enable 2FA.',
    image: 'https://images.unsplash.com/photo-1510511459019-5dee667ff58b?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'AI in Cyber Defense: The Future of OSINT',
    category: 'Intelligence',
    excerpt: 'How artificial intelligence is revolutionizing the way security analysts gather and process open-source intelligence.',
    content: '# AI and OSINT\n\nMachine learning models are now capable of filtering millions of data points...\n\n### Benefits\n- Faster detection\n- Reduced false positives',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'The Rise of Supply Chain Attacks',
    category: 'Cyber Security',
    excerpt: 'Analyzing the increasing trend of attackers targeting software vendors to compromise downstream customers.',
    content: '# Supply Chain Security\n\nSoftware supply chains are becoming the weakest link...\n\n### Case Study\nRecent incidents show that even trusted software can be a vector.',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'Protecting Your Digital Privacy in 2026',
    category: 'Privacy',
    excerpt: 'Practical tips and tools for maintaining anonymity and data protection in an increasingly connected world.',
    content: '# Privacy Guide\n\nUsing VPNs and encrypted messaging is just the start...\n\n### Tools\n- Signal\n- Tor Browser\n- ProtonMail',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'Phishing Trends: Spear Phishing and Whaling',
    category: 'Cyber Security',
    excerpt: 'How attackers are tailoring their campaigns to target high-level executives and specific individuals.',
    content: '# Modern Phishing\n\nAttackers are using social engineering to build trust...\n\n### Red Flags\n- Unusual requests\n- Urgent tone\n- Suspicious attachments',
    image: 'https://images.unsplash.com/photo-1551808195-3004698544d6?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'Cloud Security Misconfigurations: A Top Threat',
    category: 'Privacy',
    excerpt: 'Why misconfigured S3 buckets and open databases remain a primary cause of major data leaks.',
    content: '# Cloud Risks\n\nAutomated tools are scanning for open buckets 24/7...\n\n### Best Practices\nApply the principle of least privilege.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'The Importance of Regular Patch Management',
    category: 'Cyber Security',
    excerpt: 'Why keeping your software up to date is the single most effective way to prevent most cyber attacks.',
    content: '# Patching Strategy\n\nMost attacks exploit known vulnerabilities for which patches exist...\n\n### Automation\nUse automated patching tools for critical systems.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  },
  {
    title: 'Advanced Persistent Threats (APT) Explained',
    category: 'Intelligence',
    excerpt: 'Understanding the lifecycle of a long-term targeted cyber attack from initial access to data exfiltration.',
    content: '# APT Lifecycle\n\n1. Initial Access\n2. Persistence\n3. Lateral Movement\n4. Data Collection\n5. Exfiltration',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    author: 'Admin'
  }
];

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing articles if you want, or just add new ones
    // await Article.deleteMany({});
    
    await Article.insertMany(articles);
    console.log('10 Dummy Articles Seeded Successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding articles:', error);
    process.exit(1);
  }
};

seedArticles();
