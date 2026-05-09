const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');
const Article = require('./models/Article');

dotenv.config({ path: path.join(__dirname, '.env') });

const seedArticles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Intelligence Database...');

    const adminUser = await User.findOne({ role: 'admin' });
    const policeUser = await User.findOne({ role: 'police' });

    if (!adminUser || !policeUser) {
      console.error('CRITICAL: Admin or Police user not found. Please ensure both roles exist.');
      process.exit(1);
    }

    const articles = [
      // ADMIN ARTICLES (6)
      {
        title: "Neural Threat Mapping: The Future of OSINT",
        category: "Intelligence",
        excerpt: "Analyzing how neural networks are revolutionizing the extraction of actionable intelligence from fragmented public data.",
        content: "### The Evolution of Intelligence\n\nIn 2026, raw data is no longer the bottleneck; the challenge is the velocity of synthesis. Neural Threat Mapping (NTM) allows investigators to visualize connections between disparate digital shadows in real-time.\n\n#### Key Methodologies\n1. **Pattern Recognition**: Identifying behavioral anomalies across encrypted channels.\n2. **Sentiment Weighting**: Assessing the volatility of digital discourse.\n3. **Network Visualization**: Mapping the hierarchy of clandestine digital nodes.\n\nWhite Zero's implementation of NTM provides a forensic-grade overlay that highlights threat vectors before they manifest in physical space.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },
      {
        title: "Zero-Day Exploits: A Forensic Investigator's Tactical Guide",
        category: "Cyber Security",
        excerpt: "Deconstructing the anatomy of a zero-day attack and the forensic protocols required to trace origin points.",
        content: "### Anatomy of an Unseen Threat\n\nA Zero-Day exploit represents the highest tier of cyber threat. When a vulnerability is exploited before a patch exists, the forensic timeline becomes the only line of defense.\n\n#### Investigation Protocols\n- **Memory Volatility Analysis**: Capturing transient evidence before a reboot clears the stack.\n- **Packet Inspection**: Identifying non-standard protocol behavior in outbound traffic.\n- **Binary Diffing**: Reconstructing the payload to identify author-specific coding patterns.\n\nAt White Zero, we maintain a repository of known heuristics to assist investigators in identifying zero-day signatures in the wild.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },
      {
        title: "The Ethics of Digital Shadowing in 2026",
        category: "Privacy",
        excerpt: "Balancing public safety with individual privacy rights in an era of automated OSINT harvesting.",
        content: "### The Thin Digital Line\n\nAs forensic tools become more powerful, the ethical framework governing their use must evolve. OSINT harvesting, by definition, uses public data, but the aggregation of that data can create a profile more intimate than a private search.\n\n#### Ethical Guardrails\n- **Proportionality**: Is the level of surveillance justified by the threat?\n- **Transparency**: Clear documentation of how data was harvested.\n- **Integrity**: Ensuring the data is not manipulated during extraction.\n\nWhite Zero is committed to the Ethical Investigative Standard, ensuring our framework is used for the protection of digital safety.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },
      {
        title: "Dark Web Harvesting: Advanced Extraction Techniques",
        category: "Intelligence",
        excerpt: "Navigating the hidden layers of the web to extract actionable threat intelligence from illicit marketplaces.",
        content: "### Beyond the Surface\n\nThe dark web remains a primary hub for the trade of stolen credentials and malware. Traditional scrapers fail against the anti-bot protocols of modern .onion sites.\n\n#### Advanced Techniques\n- **Automated Captcha Solving**: Using AI to navigate gatekeeper protocols.\n- **Multi-Node Routing**: Preventing IP bans through high-velocity proxy rotation.\n- **Natural Language Processing**: Translating slang and code-speak used in illicit forums.\n\nThese tools allow White Zero investigators to monitor emerging threats in real-time.",
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },
      {
        title: "Global Misinformation Trends: Sentinel AI Report Q1",
        category: "Data Breach",
        excerpt: "An analytical deep-dive into the state of digital misinformation and its impact on platform integrity.",
        content: "### The Misinformation Pandemic\n\nOur Sentinel AI engine has tracked a 40% increase in AI-generated fake news this quarter. The focus has shifted from simple text to high-fidelity deepfake video assets.\n\n#### Q1 Key Findings\n1. **Deepfake Sophistication**: Detection rates for automated systems are dropping.\n2. **Coordinated Campaigns**: Bot-nets are becoming more human-like in their engagement patterns.\n3. **Cross-Platform Propagation**: Misinformation now travels across 3+ platforms within 15 minutes of origin.\n\nContinuous monitoring is essential to maintain the integrity of the digital safety ecosystem.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },
      {
        title: "Quantum Encryption vs. Forensic Decryption",
        category: "Cyber Security",
        excerpt: "Preparing for the post-quantum era: How encryption standards are changing and what it means for forensics.",
        content: "### The Quantum Leap\n\nQuantum computing threatens to render current encryption standards obsolete. While RSA-2048 is currently secure, the 'Harvest Now, Decrypt Later' strategy is a real threat.\n\n#### The New Frontier\n- **Post-Quantum Cryptography (PQC)**: Algorithms resistant to quantum attacks.\n- **Q-Day Readiness**: Assessing the vulnerability of archived data.\n- **Forensic Implications**: Decrypting legacy evidence in the quantum age.\n\nWhite Zero is currently researching PQC integration to protect forensic archives from future decryption threats.",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: 'admin',
        isHidden: false
      },

      // POLICE ARTICLES (4)
      {
        title: "Reconstructing Digital Crime Scenes: A Step-by-Step Protocol",
        category: "Cyber Security",
        excerpt: "A practical field guide for police officers on how to secure and document a digital crime scene.",
        content: "### The First Response\n\nJust like a physical crime scene, a digital one is fragile. The first 30 minutes are critical for evidence preservation.\n\n#### Steps for Officers\n1. **Isolation**: Prevent the device from connecting to any network (Airplane mode or Faraday bags).\n2. **Observation**: Photograph the screen exactly as it was found.\n3. **Stabilization**: Do not attempt to log in or navigate files without forensic imaging tools.\n\nFollowing these protocols ensures that the evidence remains admissible in a court of law.",
        image: "https://images.unsplash.com/photo-1453873531674-2151bcd01ed0?auto=format&fit=crop&q=80&w=1200",
        author: policeUser.name,
        authorId: policeUser._id,
        authorRole: 'police',
        isHidden: false
      },
      {
        title: "Chain of Custody in the Digital Age",
        category: "Malware",
        excerpt: "Ensuring the integrity of digital evidence from the moment of seizure to the final courtroom presentation.",
        content: "### Verifying Integrity\n\nDigital evidence is easily modified. Without a rigorous Chain of Custody, even the most smoking-gun evidence can be dismissed.\n\n#### Key Components\n- **Hash Verification**: Using MD5/SHA-256 to create a digital fingerprint of the data.\n- **Audit Logs**: Every person who accesses the evidence must be recorded.\n- **Write Blockers**: Hardware tools that prevent any modification of the original media.\n\nWhite Zero's report generation tool includes automated timestamping and hash-readiness to assist in maintaining this chain.",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1200",
        author: policeUser.name,
        authorId: policeUser._id,
        authorRole: 'police',
        isHidden: false
      },
      {
        title: "Social Media Behavioral Patterns: Pre-Incident Indicators",
        category: "Intelligence",
        excerpt: "Using OSINT to identify behavioral red flags on social media platforms before incidents occur.",
        content: "### Predictive Intelligence\n\nMany digital incidents follow a predictable pattern of behavior. Identifying these 'Pre-Incident Indicators' (PII) is key to prevention.\n\n#### Indicators to Monitor\n- **Sudden Network Expansion**: Rapidly adding new, disconnected friends/followers.\n- **Aggressive Sentiment Shifts**: A sudden transition to alarmist or violent discourse.\n- **OpSec Failures**: Leaking personal details that could lead to doxxing.\n\nBy monitoring these patterns, investigators can intervene before a situation escalates.",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1200",
        author: policeUser.name,
        authorId: policeUser._id,
        authorRole: 'police',
        isHidden: false
      },
      {
        title: "Official Forensic Reporting: Best Practices for Official Submissions",
        category: "Data Breach",
        excerpt: "How to draft high-authority forensic reports that meet the standards of law enforcement and platform compliance teams.",
        content: "### Drafting Authority\n\nA report is only as good as its clarity. Technical jargon must be balanced with plain-text explanations for legal officials.\n\n#### Best Practices\n- **Objective Language**: State facts, not assumptions.\n- **Technical Appendices**: Keep complex logs in the back, keep the summary in the front.\n- **Direct Links**: Provide evidence in a way that is easily accessible to the reviewer.\n\nUsing the White Zero Forensic Wizard ensures that your reports are formatted for maximum impact and authority.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200",
        author: policeUser.name,
        authorId: policeUser._id,
        authorRole: 'police',
        isHidden: false
      }
    ];

    // Clear existing dummy articles to make room for the professional set
    await Article.deleteMany({});
    console.log('Cleared existing articles...');

    await Article.insertMany(articles);
    console.log('Successfully seeded 10 professional forensic articles.');
    
    process.exit();
  } catch (err) {
    console.error('Error seeding articles:', err);
    process.exit(1);
  }
};

seedArticles();
