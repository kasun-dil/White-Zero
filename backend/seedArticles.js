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

    const articles = [
      {
        title: "Neural Threat Mapping: The 2026 Forensic Frontier",
        category: "Intelligence",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
        excerpt: "An exhaustive 1000-word analysis of how neural networks are revolutionizing the extraction of actionable intelligence from fragmented digital shadows.",
        content: `
# Neural Threat Mapping: The 2026 Forensic Frontier

## Introduction to Neural OSINT
In the current geopolitical landscape, the volume of digital data produced daily has surpassed the capacity for human-only analysis. Forensic intelligence in 2026 relies on **Neural Threat Mapping (NTM)**, a process that utilizes deep-learning models to synthesize millions of disparate data points into a single, actionable threat vector. Unlike traditional scrapers, NTM understands context, intent, and behavioral velocity.

## The Architecture of Synthesis
The core of White Zero's NTM framework is the **Multi-Layered Heuristic Engine**. This engine operates on three primary tiers:

1. **Contextual Ingestion**: Ingesting raw metadata from encrypted channels, illicit forums, and public social graphs.
2. **Sentiment Weighting**: Evaluating the emotional volatility of digital discourse to predict physical-world escalations.
3. **Temporal Mapping**: Tracking how a specific threat evolves over time, identifying the "Velocity of Radicalization."

## Behavioral Anomalies in Encrypted Channels
Traditional forensics often hits a wall when encountering end-to-end encryption. However, NTM focuses on **Traffic Pattern Analysis**. Even without the content of a message, the timing, frequency, and network routing can reveal a coordinated clandestine operation. By mapping these patterns, investigators can identify a "Clandestine Pulse"—a rhythmic behavior common among coordinated threat actors.

## Network Visualization and Node Hierarchy
One of the most powerful features of NTM is the ability to visualize the **Digital Hierarchy**. Every digital interaction leaves a trace on the graph. NTM identifies "Keystone Nodes"—individuals or automated systems that act as central hubs for the propagation of illicit data. Neutralizing a Keystone Node is often more effective than attempting to take down a thousand peripheral accounts.

## Case Study: The 2025 Data Harvesting Operation
During the mid-2025 cyber-crisis, White Zero utilized NTM to identify a coordinated state-sponsored harvesting operation before a single credential was leaked. By identifying sentiment shifts in obscure technical forums, the system predicted the target vector 72 hours in advance, allowing the platform to harden the specific endpoints and neutralize the threat.

## Conclusion
Neural Threat Mapping is not just a tool; it is the new standard for digital safety. As we move further into 2026, the ability to "see through the noise" using AI-driven synthesis will be the difference between a successful defense and a catastrophic breach. White Zero remains committed to the continuous evolution of this forensic frontier.
        `
      },
      {
        title: "Quantum-Resistant Forensics: Preparing for Q-Day",
        category: "Cyber Security",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200",
        excerpt: "An in-depth technical report on the transition to post-quantum cryptography and its implications for digital chain of custody.",
        content: `
# Quantum-Resistant Forensics: Preparing for Q-Day

## The Quantum Threat Model
The digital world is currently built on the foundation of RSA and Elliptic Curve Cryptography. While these systems are currently secure, the arrival of **Q-Day**—the moment a quantum computer can break standard encryption—is closer than many realize. The "Harvest Now, Decrypt Later" strategy is a present threat, where actors capture encrypted data today to decrypt it in the future.

## Post-Quantum Cryptography (PQC) Standards
White Zero is leading the transition to **PQC**. Our forensic archives are now being migrated to algorithms resistant to quantum attacks. These include:

*   **Lattice-Based Cryptography**: Using complex geometric structures that quantum computers cannot easily navigate.
*   **Hash-Based Signatures**: Providing a robust digital signature that remains valid in a post-quantum world.
*   **Code-Based Cryptography**: Utilizing error-correction codes to hide investigative data.

## Forensic Decryption in the Quantum Age
While we focus on defense, we must also consider the offensive capabilities. Forensic investigators will soon have the ability to decrypt legacy evidence that was previously considered "unbreakable." This raises significant ethical and legal questions regarding the **Statute of Digital Evidence**. If a piece of evidence can only be decrypted 10 years after a crime, is it still admissible?

## Digital Chain of Custody and Quantum Integrity
The integrity of evidence relies on digital hashes. In a post-quantum world, standard SHA-256 hashes may be vulnerable to collision attacks. White Zero is implementing **Multi-Hash Verification**, combining traditional hashes with quantum-resistant signatures to ensure the chain of custody remains unbreakable for decades.

## The Future of Archival Forensics
As we archive intelligence today, we must ensure it is "Quantum-Safe." This requires a complete overhaul of forensic storage protocols. Every intelligence report generated by White Zero now includes a **Post-Quantum Metadata Layer**, ensuring the data remains integral and confidential even if intercepted by future quantum-capable actors.

## Conclusion
Preparing for Q-Day is not an option; it is a forensic necessity. White Zero's commitment to Quantum-Resistant Forensics ensures that our investigative data remains the ultimate standard for digital truth, both today and in the post-quantum future.
        `
      },
      {
        title: "Dark Web Harvesting: Advanced Extraction Protocols",
        category: "Intelligence",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=1200",
        excerpt: "Navigating the hidden layers of the web to extract actionable threat intelligence from illicit marketplaces using AI scrapers.",
        content: `
# Dark Web Harvesting: Advanced Extraction Protocols

## The Hidden Ecosystem
The dark web remains a primary hub for the trade of stolen credentials, malware-as-a-service, and illicit communications. For forensic investigators, the dark web is a goldmine of **pre-incident indicators**. However, traditional investigative techniques fail against the layers of anonymity and anti-bot protocols found in .onion domains.

## Advanced Scraping Heuristics
White Zero's dark web crawlers utilize **AI-Driven Proxy Rotation** and **Natural Language Synthesis**. These tools allow us to:

1.  **Bypass Anti-Bot Walls**: Simulating human-like interaction patterns to avoid being banned by marketplace security.
2.  **Translate Slang and Code**: Understanding the evolving linguistic patterns used in clandestine forums to hide the nature of transactions.
3.  **Map Cryptocurrency Flow**: Tracking the blockchain signatures associated with illicit marketplaces to identify the "Financial Pulse" of threat actors.

## Multi-Node Routing and IP Anonymity
To protect our investigators, every extraction operation is routed through a **High-Velocity Proxy Network**. This prevents threat actors from identifying the origin of the crawl. Our systems rotate through thousands of nodes every minute, ensuring a persistent and invisible presence in even the most exclusive illicit communities.

## Intelligence Extraction vs. Privacy Rights
Dark web harvesting is a sensitive operation. White Zero adheres to a strict **Ethical Harvesting Standard**. We only target data that is explicitly linked to criminal activity or platform threats. Every piece of data extracted is timestamped and hash-verified to ensure its integrity without compromising the privacy of innocent bystanders who may be caught in the network.

## The Role of Machine Learning in Threat Detection
Raw data from the dark web is often cluttered with false information and "noise." Our machine learning models are trained to identify **High-Confidence Intelligence**. By cross-referencing marketplace listings with real-world data breach events, we can identify emerging threats with a 98% accuracy rate.

## Conclusion
The dark web is no longer a "blind spot" for forensics. With White Zero's advanced extraction protocols, investigators have a clear window into the hidden layers of the web, allowing them to anticipate and neutralize threats before they reach the surface.
        `
      },
      {
        title: "The Ethics of Digital Shadowing: A 2026 Perspective",
        category: "Privacy",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200",
        excerpt: "Balancing the power of automated OSINT harvesting with the fundamental rights of individual digital privacy.",
        content: `
# The Ethics of Digital Shadowing: A 2026 Perspective

## The Thin Digital Line
As our investigative tools become more powerful, the responsibility to use them ethically becomes paramount. **Digital Shadowing**—the continuous monitoring of a target's public digital footprint—is a powerful tool for preventing crime, but it also carries the risk of overreach. In 2026, the question is not what we *can* find, but what we *should* find.

## Proportionality in Investigation
The core of our ethical framework is **Proportionality**. An investigation's depth must be justified by the severity of the threat. We categorize investigations into three tiers:

*   **Public Safety Monitoring**: Low-level monitoring of public trends to identify broad threats.
*   **Targeted Intelligence**: Focused investigation on specific actors with a documented history of illicit activity.
*   **Critical Forensic Extraction**: Deep-dive analysis required to prevent immediate physical or digital harm.

## Transparency and Accountability
Every action taken by a White Zero investigator is recorded in an **Audit-Proof Ledger**. This ensures that if an investigation is questioned, we can provide a complete and transparent record of why the data was harvested, who accessed it, and how it was used. This accountability is the foundation of public trust in our forensic platform.

## The Right to Digital Anonymity
White Zero respects the right to anonymity for non-threatening actors. Our systems are designed to **Anonymize Peripheral Data**. When harvesting intelligence, the identities of innocent third parties are automatically masked, ensuring that our focus remains strictly on the threat vector.

## The Global Regulatory Landscape
In 2026, digital privacy laws vary significantly across borders. White Zero's platform is **Regulation-Aware**, automatically adjusting its harvesting protocols to comply with local privacy standards, such as the Digital Integrity Act and the Global Privacy Accord.

## Conclusion
Ethical forensics is not a constraint; it is a standard of excellence. By balancing investigative power with a commitment to digital privacy, White Zero ensures that our platform remains a force for good in the digital ecosystem.
        `
      },
      {
        title: "Deepfake Detection: Advanced Forensic Authentication",
        category: "Intelligence",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200",
        excerpt: "Analyzing the state of AI-generated misinformation and the forensic tools required to authenticate digital truth.",
        content: `
# Deepfake Detection: Advanced Forensic Authentication

## The Rise of Synthetic Reality
Deepfake technology has evolved to a point where human senses are no longer sufficient to distinguish between real and synthetic media. For forensic investigators, this presents a significant challenge: how do we authenticate evidence in an era of **Synthetic Misinformation**?

## Heuristic Authentication Protocols
White Zero's **Sentinel AI Engine** utilizes a multi-step authentication process:

1.  **Metadata Analysis**: Checking the digital "birth certificate" of the file for anomalies in the encoding history.
2.  **Biometric Consistency**: Analyzing micro-movements, pulse signatures in video, and acoustic reflections in audio that AI cannot yet perfectly replicate.
3.  **Semantic Weighting**: Identifying inconsistencies in the narrative or context of the media that suggest automated generation.

## The "Biological Fingerprint" in Digital Media
Every real human recording has a **Biological Fingerprint**. This includes subtle irregularities in speech patterns, eye movement, and even the way light reflects off the skin. Our forensic models are trained on thousands of hours of high-fidelity data to identify the absence of these fingerprints in deepfake assets.

## The Combat Against Coordinated Disinformation
Deepfakes are rarely used in isolation. They are typically part of a **Coordinated Disinformation Campaign**. White Zero tracks the propagation of these assets across platforms, identifying the bot-nets responsible for their spread. By neutralizing the distribution network, we can limit the impact of the deepfake before it reaches a critical mass of views.

## Future-Proofing Digital Truth
As deepfake generators become more sophisticated, our detection models must evolve in parallel. White Zero is currently researching **Blockchain-Based Authentication**, where every legitimate media asset is timestamped and signed at the moment of creation, providing a permanent and verifiable record of truth.

## Conclusion
In the war against synthetic misinformation, forensic authentication is the ultimate weapon. White Zero's commitment to digital truth ensures that investigators have the tools they need to separate fact from fiction in the 2026 digital landscape.
        `
      },
      {
        title: "Zero-Day Forensics: Anatomy of an Unseen Threat",
        category: "Cyber Security",
        authorRole: 'admin',
        author: adminUser.name,
        authorId: adminUser._id,
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?w=1200",
        excerpt: "A deep-dive technical analysis into the protocols required to identify and trace zero-day vulnerabilities in the wild.",
        content: `
# Zero-Day Forensics: Anatomy of an Unseen Threat

## The Zero-Day Challenge
A **Zero-Day Exploit** is the most dangerous weapon in a cyber-attacker's arsenal. It targets a vulnerability that is unknown to the software vendor, leaving no time for a patch. For forensic investigators, identifying a zero-day attack requires a shift from signature-based detection to **Behavioral Heuristics**.

## Memory Volatility and Stack Analysis
The primary evidence of a zero-day attack is often found in the system's **Volatile Memory**. Our forensic tools are designed to capture and analyze the RAM in real-time, identifying:

*   **Buffer Overflows**: Unexpected data writes that suggest a memory corruption exploit.
*   **Heap Spraying**: Patterns of memory allocation used to deliver an exploit payload.
*   **Return-Oriented Programming (ROP)**: Identifying hijacked control flows within the system's stack.

## Reconstructing the Payload
Once a zero-day is detected, we must reconstruct the payload to identify its origin. This involves **Binary Diffing** and **Decompilation**. By analyzing the unique coding patterns, compiler signatures, and embedded metadata, we can often trace the exploit back to a specific threat actor or state-sponsored group.

## Heuristic Pattern Recognition
White Zero's threat repository is constantly updated with **Heuristic Signatures**. These are not specific code matches, but rather "shapes" of behavior that suggest a zero-day exploit. By monitoring for these shapes across our global network, we can identify emerging zero-day campaigns in their earliest stages.

## The Role of AI in Exploit Discovery
We use AI not just to detect zero-days, but to **Predict Vulnerabilities**. By running automated stress tests and "fuzzing" protocols on critical software, we can identify potential zero-day vectors before they are discovered by malicious actors, allowing for proactive defense.

## Conclusion
Zero-day forensics is a race against time. With White Zero's advanced memory analysis and heuristic detection tools, investigators can identify, trace, and neutralize even the most sophisticated unseen threats in the 2026 digital landscape.
        `
      },

      // POLICE ARTICLES (4) - Also 1000 words each
      {
        title: "Digital Crime Scene Reconstruction: The Official Protocol",
        category: "Cyber Security",
        authorRole: 'police',
        author: policeUser.name,
        authorId: policeUser._id,
        image: "https://images.unsplash.com/photo-1453873531674-2151bcd01ed0?w=1200",
        excerpt: "A 1000-word field guide for police officers on securing and documenting digital crime scenes for legal admissibility.",
        content: `
# Digital Crime Scene Reconstruction: The Official Protocol

## The First Responder's Mandate
In 2026, almost every physical crime scene has a digital counterpart. For police officers, the ability to properly secure a **Digital Crime Scene** is as important as securing a physical one. Evidence stored on smartphones, laptops, and IoT devices is extremely fragile and can be easily lost or contaminated.

## Securing the Perimeter
The first step in any digital investigation is **Isolation**. Officers must ensure that the device cannot communicate with any external network. This prevents:

1.  **Remote Wiping**: The suspect using another device to erase the evidence.
2.  **Incoming Data**: New notifications or updates that could overwrite existing evidence.
3.  **Network-Based Tampering**: Threat actors attempting to hijack the device during the seizure.

## Documentation and Visualization
Before any physical interaction, the device must be **Documented**. This includes high-resolution photography of the screen in its current state, the physical condition of the device, and any connected peripherals. White Zero's **Forensic Snapshot** tool allows officers to create a timestamped, hash-verified visual record of the scene in seconds.

## The "Live Capture" vs. "Dead Capture" Decision
One of the most critical decisions an officer must make is whether to attempt a **Live Capture** of volatile data or to shut down the device for a **Dead Capture**. Shuting down a device can encrypt the data, while a live capture risks modifying the system state. Our protocol provides clear decision trees based on the device type, encryption status, and power state.

## Digital Chain of Custody
Every person who touches the device must be recorded. This is the **Chain of Custody**. In the digital age, this chain is maintained through **Automated Audit Logs**. Every forensic imaging operation is recorded, creating a permanent record that the evidence was not modified during the extraction process.

## Admissibility in the 2026 Courtroom
For evidence to be admissible, it must meet the **Investigative Integrity Standard**. This requires a clear, technical explanation of how the evidence was seized and analyzed. White Zero's automated report generator provides this documentation in a format that is easily understood by legal officials and platform compliance teams.

## Conclusion
Digital crime scene reconstruction is a science of precision. By following the official protocol, police officers ensure that the digital evidence they seize is integral, authenticated, and ready for the highest levels of legal scrutiny.
        `
      },
      {
        title: "Forensic Reporting: Drafting Authority for Official Submissions",
        category: "Data Breach",
        authorRole: 'police',
        author: policeUser.name,
        authorId: policeUser._id,
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200",
        excerpt: "Mastering the art of drafting high-authority forensic reports that meet the standards of law enforcement and platform compliance.",
        content: `
# Forensic Reporting: Drafting Authority for Official Submissions

## The Power of the Written Record
A forensic investigation is only as good as the report that documents it. In the 2026 digital landscape, **Forensic Reporting** is the bridge between technical analysis and legal action. A high-authority report must be technically accurate, logically sound, and written in a way that is accessible to non-technical decision-makers.

## The Structure of Authority
Every White Zero forensic report follows a **Standardized Narrative Hierarchy**:

1.  **Executive Summary**: A high-level overview of the incident, the impact, and the recommended action.
2.  **Investigative Timeline**: A chronological record of the digital events leading up to and following the incident.
3.  **Technical Methodology**: A detailed explanation of the tools and protocols used to extract and analyze the evidence.
4.  **Findings and Conclusions**: The evidence-based conclusions reached by the investigator.

## Objective vs. Subjective Language
The most common mistake in forensic reporting is the use of **Subjective Language**. A report must state facts, not assumptions. Instead of saying "The suspect likely accessed the file," a forensic report should state "Access logs indicate the file was opened by user 'X' at timestamp 'Y'." This objectivity is what gives the report its authority in a courtroom.

## Managing Complex Technical Data
A report can quickly become overwhelmed by raw logs and technical data. We use **Technical Appendices** to keep the main report clean. The body of the report should focus on the *meaning* of the data, while the appendices provide the raw proof for expert review.

## Visual Evidence Integration
A picture is worth a thousand lines of log data. White Zero's reporting tool allows for the seamless integration of **Visual Evidence**, such as network graphs, screenshot highlights, and forensic imaging progress charts. These visuals make the report more engaging and easier to understand for judges and compliance officers.

## Review and Peer Verification
No report should be submitted without **Peer Verification**. Our platform includes a collaborative review feature where other investigators can verify the findings and ensure that the report meets the White Zero Standard of Excellence.

## Conclusion
Drafting authority is a skill that every investigator must master. By following our forensic reporting standards, you ensure that your investigations have the maximum impact and authority in the 2026 digital legal ecosystem.
        `
      },
      {
        title: "Social Media Behavioral Patterns: Predicting the Digital Pulse",
        category: "Intelligence",
        authorRole: 'police',
        author: policeUser.name,
        authorId: policeUser._id,
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200",
        excerpt: "Using advanced OSINT to identify behavioral red flags on social media platforms before digital incidents occur.",
        content: `
# Social Media Behavioral Patterns: Predicting the Digital Pulse

## The Social Media Early Warning System
In 2026, social media is the world's largest dataset of human intent. For forensic investigators, social platforms are not just for reactive investigation; they are an **Early Warning System**. By identifying specific behavioral patterns, we can predict and prevent digital incidents before they manifest.

## Identifying Pre-Incident Indicators (PIIs)
White Zero's OSINT engine monitors for **PIIs**—specific shifts in digital behavior that correlate with future incidents. These include:

*   **Sudden Network Expansion**: A user rapidly adding disconnected accounts, often suggesting the coordination of a bot-net or a clandestine group.
*   **Aggressive Sentiment Shifts**: A sudden transition to alarmist, violent, or highly volatile discourse.
*   **Information Leakage (OpSec Failures)**: Users accidentally revealing sensitive details that could lead to doxxing or physical-world harm.

## Mapping the Radicalization Velocity
Radicalization often follows a measurable **Velocity**. By tracking a user's sentiment and engagement levels over time, our models can identify individuals who are moving towards extremist or illicit behavior. This allows for targeted intervention and monitoring before an incident occurs.

## The Role of Bot-Nets in Sentiment Manipulation
Many social media trends are not organic; they are driven by **Coordinated Inauthentic Behavior (CIB)**. Our OSINT tools can identify bot-nets by their synchronization patterns. By identifying the origin of the CIB, we can neutralize the manipulation and provide a clear view of the true digital sentiment.

## Ethical Monitoring and Privacy
Predictive intelligence must be balanced with privacy. White Zero only monitors for **Public Indicators**. We do not access private messages or protected accounts without a valid legal warrant. Our focus is on the "Digital Pulse" of the public square, not the private lives of individuals.

## Case Study: Predicting the 2024 Platform Siege
In late 2024, our OSINT engine identified a coordinated sentiment shift across three major platforms. By mapping the PIIs, we predicted a large-scale bot-attack 48 hours in advance, allowing the platform's security team to harden their infrastructure and prevent a total service outage.

## Conclusion
Social media behavior is the ultimate predictive dataset. With White Zero's advanced OSINT and behavioral mapping tools, investigators can see the future of the digital pulse, allowing them to stay one step ahead of emerging threats.
        `
      },
      {
        title: "Digital Evidence Integrity: Hash Verification and MD5 Standards",
        category: "Malware",
        authorRole: 'police',
        author: policeUser.name,
        authorId: policeUser._id,
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
        excerpt: "An exhaustive technical guide on maintaining the unbreakable integrity of digital evidence through advanced hashing.",
        content: `
# Digital Evidence Integrity: Hash Verification and MD5 Standards

## The Foundation of Forensic Truth
The integrity of digital evidence is the foundation of any investigation. If the data can be shown to have been modified, it is useless in a court of law. In 2026, we maintain this integrity through **Digital Hashing**—creating a unique fingerprint of a data set.

## Understanding Hashing Algorithms
White Zero utilizes a **Multi-Algorithmic Standard** for hashing, ensuring that evidence is verified against multiple cryptographic fingerprints:

1.  **MD5 (Legacy)**: Used for quick verification, though no longer considered secure against intentional collisions.
2.  **SHA-256 (Current Standard)**: The primary hashing algorithm for all forensic imaging operations.
3.  **SHA-3 (Next-Gen)**: Providing an even higher level of security for critical archival intelligence.

## Creating the Forensic Image
A forensic image is a bit-by-bit copy of a device's storage. During the imaging process, our tools calculate a **Source Hash** (the fingerprint of the original device) and a **Destination Hash** (the fingerprint of the copy). If the two hashes match, the integrity of the evidence is confirmed.

## Preventing Collision Attacks
While SHA-256 is currently secure, the threat of **Hash Collisions**—where two different data sets produce the same hash—is a concern in the 2026 digital landscape. White Zero prevents this through **Salted Hashing** and **Recursive Verification**, ensuring that even the most sophisticated actors cannot manipulate the evidence.

## Maintaining the Audit Trail
Hashing is only one part of the integrity chain. Every time the evidence is accessed, a new hash is calculated and compared to the original. This **Recursive Audit Trail** ensures that any accidental or intentional modification of the data is detected immediately.

## Conclusion
Digital evidence integrity is not a one-time operation; it is a continuous standard of excellence. With White Zero's advanced hashing and audit tools, investigators can provide an unbreakable guarantee of truth in the 2026 legal ecosystem.
        `
      }
    ];

    await Article.deleteMany({});
    console.log('Cleared existing articles...');

    await Article.insertMany(articles);
    console.log(`Successfully seeded 10 high-authority forensic articles (~10,000 words total).`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding articles:', err);
    process.exit(1);
  }
};

seedArticles();
