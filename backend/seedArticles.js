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
      console.error('CRITICAL: Admin or Police user not found.');
      process.exit(1);
    }

    const categories = ["Intelligence", "Cyber Security", "Privacy", "Forensics", "Malware", "Data Breach", "AI Ethics"];
    
    // 25 Completely Unique Unsplash IDs
    const unsplashIds = [
        "1550751827-4bd374c3f58b", "1563986768609-322da13575f3", "1558494949-ef010cbdcc51", 
        "1510511459019-5dda7724fd87", "1504384308090-c894fdcc538d", "1451187580459-43490279c0fa",
        "1518770660439-4636190af475", "1526374965328-7f61d4dc18c5", "1550439062-609e154a270e",
        "1531297484001-80022131f5a1", "1519389950473-47ba0277781c", "1509062522246-3755977927d7",
        "1485827404703-89b55fcc595e", "1581091226825-a6a2a5aee158", "1555949963-aa79dcee9b1b",
        "1551808198-35616f7340d8", "1633356122544-f134324a6cee", "1639322537228-f710d846310a",
        "1607791374335-a68185b3e3de", "1551288049-bbda4e18f7ad", "1535223289668-ac19e8198b4c",
        "1498050108023-c5249f4df085", "1551434678-e076c223a692", "1517694712202-14dd9538aa97",
        "1523961131990-5ea7c61b2107"
    ];

    const getUniqueImage = (i, width = 1200) => {
        const id = unsplashIds[i];
        return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;
    };

    const longContent = (cat, i) => `
## OPERATIONAL OVERVIEW
The rapid evolution of ${cat.toLowerCase()} in the 2026 landscape has necessitated a complete overhaul of existing forensic protocols. This report outlines the critical vulnerabilities identified during the last fiscal quarter and proposes a set of high-velocity response strategies designed to neutralize emerging threat vectors before they manifest in the physical or digital domains.

### THE LANDSCAPE OF 2026: A NEW FRONTIER
As we navigate the complexities of a hyper-connected global infrastructure, the line between traditional ${cat.toLowerCase()} and automated heuristic analysis has blurred. Threat actors are now leveraging distributed neural networks to obfuscate their digital signatures, making signature-based detection virtually obsolete. 

Our investigation has revealed that the "Velocity of Radicalization" among digital threat actors has increased by nearly 60% compared to the 2025 baseline. This shift is driven by the accessibility of low-cost, high-performance computing clusters and the proliferation of modular malware frameworks.

## TECHNICAL ARCHITECTURE: EXTRACTION PROTOCOLS
The primary mechanism for intelligence extraction in this cycle involved the use of **Multi-Node Heuristic Scrapers** (MNHS). These scrapers operate by simulating legitimate user behavior across a variety of illicit channels, allowing us to ingest raw metadata without alerting the target infrastructure.

### 1. CONTEXTUAL INGESTION STRATEGIES
We have implemented a tiered ingestion strategy that prioritizes metadata from high-volatility nodes. By mapping the interaction frequency between these nodes, we can identify "Keystone Actors"—individuals who act as central hubs for the distribution of illicit data. 

Neutralizing a Keystone Actor often causes the entire cluster to fragment, providing a significant tactical advantage.

### 2. SENTIMENT WEIGHTING AND RADICALIZATION VELOCITY
Data is not just binary; it carries emotional weight. Our SENTINEL AI models analyze the linguistic patterns within clandestine communications to predict shifts in group intent. A sudden increase in "Aggressive Sentiment" within a monitored node typically precedes a coordinated digital intrusion by 48 to 72 hours.

This predictive capability allows White Zero to implement "Pre-Emptive Hardening"—strengthening the perimeter of likely targets before the first offensive packet is even sent.

### 3. TRAFFIC PATTERN ANALYSIS IN ENCRYPTED SILOS
Even within end-to-end encrypted environments, the **Meta-Pulse** of communication remains visible. By analyzing the timing and frequency of encrypted packet bursts, we can reconstruct the command-and-control (C2) hierarchy of a threat group without ever decrypting the payload. 

This technique, known as "Temporal Forensics," is becoming the primary tool for investigating sophisticated APT (Advanced Persistent Threat) groups.

## DEEP-DIVE CASE STUDY: THE 2025 HARVESTING OPERATION
During the mid-2025 cycle, our systems identified a coordinated state-sponsored harvesting operation targeting critical healthcare infrastructure. By utilizing the protocols outlined above, White Zero was able to:
1. **Identify the target vector 96 hours** before the first packet was sent.
2. **Harden the specific API endpoints** that were being surveyed by the threat actor's reconnaissance bots.
3. **Neutralize the bot-net's C2 node** through a synchronized digital strike, preventing the exfiltration of over 50TB of sensitive medical data.

## FORENSIC INTEGRITY AND AI AUTHENTICATION
Integrity is the foundation of our work. Every data point ingested by our platform is timestamped and hash-verified using the SHA-3-512 standard. This ensures that the evidence we provide to legal and platform authorities is unbreakable and admissible in any jurisdiction.

Our AI models are now capable of identifying "Synthetic Anomalies"—data points that have been intentionally modified by adversarial AI to mislead forensic investigators. This "Counter-Forensic Detection" is now a standard component of our intelligence reports, ensuring that the truth remains visible even in a hall of digital mirrors.

## STRATEGIC RECOMMENDATIONS FOR THE NEXT CYCLE
Based on the data collected, we recommend the following high-priority actions for all investigators:
- **Accelerate Migration to Quantum-Resistant Archiving**: Legacy encryption is no longer a sufficient defense against future "Harvest Now, Decrypt Later" strategies.
- **Implement Real-Time Behavioral Heuristics**: Move away from static firewall rules and towards dynamic, AI-driven perimeter defense that adapts to the attacker's velocity.
- **Enhance Multi-Platform OSINT Syncing**: Ensure that intelligence from social graphs is synchronized with dark web harvesting in real-time to provide a 360-degree view of the threat.

## ADVANCED MITIGATION VECTORS
Beyond standard response, we are exploring "Digital Decoys"—synthetic environments designed to trap and analyze threat actors in real-time. By providing these actors with non-critical but highly realistic data, we can observe their extraction methodologies in a controlled environment, further refining our heuristic models.

The future of White Zero intelligence is not just reactive; it is pro-active, predictive, and pervasive. We are building the ultimate digital shield for a world that never sleeps.
`;

    const fullArticles = [
      {
        title: "How-To: Deploying OSINT Intelligence Search",
        category: "Intelligence",
        image: "https://cyesec.com/wp-content/uploads/2022/06/social-tips-min.jpg",
        galleryImages: [], 
        introBold: "", 
        excerpt: "Learn how to master the White Zero OSINT data harvesting engine, utilize target social dorks, and extract precise public digital footprints across global networks.",
        content: `## STEP-BY-STEP OPERATION GUIDE

The OSINT Intelligence Search module is designed to query multiple open-source indices in parallel and establish a digital footprint signature. Follow these instructions to conduct a standard inquiry:

### 1. SPECIFYING THE TARGET HANDLE
Enter the exact username or online pseudonym of the subject. The engine will perform a dual lookup:
- **Raw Query**: General search engine matching across Google, DuckDuckGo, and Yahoo.
- **Targeted Dorks**: Domain-specific constraint scoping on major social nodes like Facebook, X (formerly Twitter), Instagram, and LinkedIn.

### 2. EVALUATING RESULTS AND STRENGTHS
Results are categorized into:
- **Exact Matches**: Profiles where the handle or title is an identical match.
- **Related Profiles**: Expanded variations discovered during Heuristic Discovery (e.g. searching 'kasun' reveals related accounts like 'kasun.dilshan').

### 3. EXPORTING EVIDENCE
Use the "Export Analysis" command to capture a digitally timestamped plaintext brief of all discovered endpoints for your case ledger.`,
        conclusion: "Mastering OSINT ensures complete digital visibility. Always run verification checks on discovered related nodes.",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: "admin",
        isFeatured: true,
        createdAt: new Date()
      },
      {
        title: "How-To: Generating Forensic Incident Reports",
        category: "Forensics",
        image: "https://gendermatters.in/wp-content/uploads/2018/07/Police-Surveillance-Social-Media-Monitoring.jpg",
        galleryImages: [], 
        introBold: "", 
        excerpt: "A professional guide to translating digital evidence and incident narratives into courtroom-grade case reports following forensic integrity standards.",
        content: `## METHODOLOGY OF DOCUMENTATION

Forensic reporting bridges raw digital data and legal admissibility. White Zero conforms to strict intelligence led standards:

### 1. LOGGING BIO-DATA & TRANSMISSIONS
Begin by establishing the reporter metadata, subject identification parameters, and critical incident timelines. Ensure dates align with system logs.

### 2. CONTEXT SYNTHESIS
Write a structured narrative describing the breach, incident, or social engineering exploit. Avoid emotive language; state observed actions and packet records clearly.

### 3. OFFICIAL CORRESPONDENCE
Use the "Investigative Dialogue" feature to maintain verified correspondence between victims and police officers. Transmissions are indexed chronologically.`,
        conclusion: "A meticulously written forensic report accelerates justice and provides bulletproof documentation for subsequent litigation.",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: "admin",
        isFeatured: true,
        createdAt: new Date()
      },
      {
        title: "How-To: Executing Security Posture Audits",
        category: "Privacy",
        image: "https://www.socialchamp.com/blog/wp-content/uploads/2024/03/Content-Blog-Banner_Q1-2024_1125x600_063_Social-Media-Security.png",
        galleryImages: [], 
        introBold: "", 
        excerpt: "Maximize platform privacy, conduct autonomous social audits, map credential vulnerabilities, and implement critical profile hardening.",
        content: `## HARDENING DEPLOYMENT MANUAL

The Security Posture Auditor analyzes exposed elements of online entities to recommend structural enhancements:

### 1. INGESTING POSTURE CHECKS
Execute the profile scanner to pull public accessibility fields. The auditor inspects bio structures, visible email hashes, and cross-platform connection leakage.

### 2. VULNERABILITY MAPPING
Each vulnerability is scored against the OWASP Threat Scoring matrix to compute an aggregate Security Posture Rating.

### 3. HARDENING ACTIONS
Deploy the automated hardening recommendations. This includes locking down visible email fields, obfuscating birthday meta-tags, and severing unverified cross-network authentication hubs.`,
        conclusion: "Regular security posture audits significantly minimize attack vectors and preserve personal digital sovereignty.",
        author: adminUser.name,
        authorId: adminUser._id,
        authorRole: "admin",
        isFeatured: true,
        createdAt: new Date()
      }
    ];
    for (let i = 0; i < 25; i++) {
      const cat = categories[i % categories.length];
      const role = i % 2 === 0 ? 'admin' : 'police';
      const user = role === 'admin' ? adminUser : policeUser;
      
      fullArticles.push({
        title: `${cat.toUpperCase()} INTELLIGENCE BRIEF`,
        category: cat,
        image: getUniqueImage(i),
        galleryImages: [], 
        introBold: "", 
        excerpt: `A comprehensive forensic evaluation of emerging ${cat.toLowerCase()} threat vectors, identifying critical infrastructure vulnerabilities and proposing high-velocity response strategies.`,
        content: longContent(cat, i),
        conclusion: `The findings in this report confirm that the landscape of ${cat} is shifting towards an era of automated, AI-driven conflict. White Zero remains committed to maintaining the ultimate standard of digital truth through continuous evolution and forensic excellence.`,
        author: user.name,
        authorId: user._id,
        authorRole: role,
        isFeatured: i < 5, 
        createdAt: new Date(Date.now() - i * 3600000 * 12)
      });
    }

    await Article.deleteMany({});
    console.log('Cleared existing articles...');

    await Article.insertMany(fullArticles);
    console.log(`Successfully seeded ${fullArticles.length} unique forensic articles with 25 distinct images.`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding articles:', err);
    process.exit(1);
  }
};

seedArticles();
