const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PoliceReport = require('./models/PoliceReport');
const User = require('./models/User');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://kasun_db_user:kasun123@ac-nsrtg1a-shard-00-00.olln504.mongodb.net:27017,ac-nsrtg1a-shard-00-01.olln504.mongodb.net:27017,ac-nsrtg1a-shard-00-02.olln504.mongodb.net:27017/?ssl=true&replicaSet=atlas-l9bbf2-shard-0&authSource=admin&appName=WhiteZero';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to Forensic Database...');

    // Clear existing reports to start fresh
    await PoliceReport.deleteMany({});
    console.log('Purged existing dummy data.');

    const victimId = '69ec00161accca2118e38547'; // kasun@gmail.com
    const adminId = '69ebf9ea15c33c83945f351e';  // admin@whitezero.com

    const cases = [
      {
        user: victimId,
        victimName: 'Kasun Dilshan',
        victimEmail: 'kasundilshan@gmail.com',
        title: 'Cryptographic Ransomware Deployment - Network Breach',
        description: 'Critical infrastructure compromise detected at 02:45 UTC. Threat actors have deployed AES-256 encryption on core file servers. Initial entry vector appears to be a zero-day exploit in the VPN gateway. Extortion demand received in BTC.',
        status: 'In Progress',
        referenceId: 'POL-882941',
        responses: [
          { sender: victimId, role: 'user', message: 'I cannot access any of the project directories. There is a README.txt file on every drive demanding payment.' },
          { sender: adminId, role: 'police', message: 'Intelligence received. Do not attempt to pay the ransom. We are tracing the BTC wallet and analyzing the encryption headers. Isolate the affected subnet immediately.' }
        ]
      },
      {
        user: victimId,
        victimName: 'Kasun Dilshan',
        victimEmail: 'kasundilshan@gmail.com',
        title: 'Social Engineering & Account Takeover (ATO)',
        description: 'Persistent unauthorized access attempts on LinkedIn and Corporate Email accounts. The attacker bypassed 2FA via a sophisticated session hijacking technique (EvilProxy). Private data exfiltration suspected.',
        status: 'Pending',
        referenceId: 'POL-119402',
        responses: [
          { sender: victimId, role: 'user', message: 'I received a security alert from LinkedIn about a login from a Russian IP, but I never got a 2FA prompt.' }
        ]
      },
      {
        user: victimId,
        victimName: 'Kasun Dilshan',
        victimEmail: 'kasundilshan@gmail.com',
        title: 'Spear-Phishing Campaign - Financial Integrity Compromise',
        description: 'Detected a highly targeted phishing campaign mimicking internal CFO communications. Multiple employees reported receiving a "Urgent Wire Transfer" request with an attached malicious macro-enabled XLSM file.',
        status: 'Resolved',
        isClosed: true,
        conclusion: 'Malicious domain blacklisted at ISP level. Affected workstations reimaged. No financial loss recorded.',
        referenceId: 'POL-553018',
        responses: [
          { sender: victimId, role: 'user', message: 'One of my staff members opened the attachment but closed it immediately. Should we be worried?' },
          { sender: adminId, role: 'police', message: 'Confirmed malware activity. The macro attempted to connect to a C2 server in Eastern Europe. We have neutralized the threat.' }
        ]
      },
      {
        user: victimId,
        victimName: 'Kasun Dilshan',
        victimEmail: 'kasundilshan@gmail.com',
        title: 'Distributed Denial of Service (DDoS) - Public Web Surface',
        description: 'Public-facing API under high-volume SYN flood attack. Ingress traffic peaked at 450Gbps. Service availability dropped to 15%. Cloudflare protection partially bypassed via direct IP exposure.',
        status: 'In Progress',
        referenceId: 'POL-992104',
        responses: [
          { sender: victimId, role: 'user', message: 'The site is crawling. Customers are reporting 504 Gateway Timeouts.' },
          { sender: adminId, role: 'police', message: 'We are implementing rate-limiting at the edge and rotating the origin IP. Traffic patterns suggest a Botnet-of-Things (Mirai variant) is responsible.' }
        ]
      }
    ];

    await PoliceReport.insertMany(cases);
    console.log('Successfully injected 4 high-fidelity forensic scenarios.');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedData();
