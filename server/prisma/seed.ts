import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ForgeEval V2 database seeding...");

  // Clean existing tables
  await prisma.judgeScore.deleteMany();
  await prisma.requirementResult.deleteMany();
  await prisma.runtimeTest.deleteMany();
  await prisma.securityFinding.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
  await prisma.hackathonProblem.deleteMany();
  await prisma.hackathonParticipant.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.user.deleteMany();

  // 1. Create Users
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@forgeeval.com",
      passwordHash,
      name: "Dr. Sarah Jenkins",
      role: "ADMIN",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    },
  });

  const organizer = await prisma.user.create({
    data: {
      email: "organizer@forgeeval.com",
      passwordHash,
      name: "Morgan Stone",
      role: "ORGANIZER",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
    },
  });

  const judge = await prisma.user.create({
    data: {
      email: "judge@forgeeval.com",
      passwordHash,
      name: "Alex Vance",
      role: "JUDGE",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const participant1 = await prisma.user.create({
    data: {
      email: "dev@forgeeval.com",
      passwordHash,
      name: "Elena Rostova",
      role: "PARTICIPANT",
      phone: "+1-555-0192",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  const participant2 = await prisma.user.create({
    data: {
      email: "participant2@forgeeval.com",
      passwordHash,
      name: "Marcus Chen",
      role: "PARTICIPANT",
      phone: "+1-555-0144",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  console.log(" Created seed users (1 Admin, 1 Organizer, 1 Judge, 2 Participants)");

  // 2. Create Hackathons
  const now = new Date();
  const hackathon1 = await prisma.hackathon.create({
    data: {
      name: "Global AI Agents & Infrastructure Summit 2026",
      theme: "Autonomous Agents & High-Throughput Distributed Compute",
      description: "Build state-of-the-art verifiable intelligence architectures and low-latency streaming inference pipelines.",
      rules: "Submissions must be original work with an active GitHub repository, automated tests, and clear README.",
      eligibility: "Open to developers and engineering teams worldwide.",
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      registrationDeadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      submissionDeadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  });

  // Join participants to hackathon
  await prisma.hackathonParticipant.createMany({
    data: [
      { hackathonId: hackathon1.id, userId: participant1.id },
      { hackathonId: hackathon1.id, userId: participant2.id },
    ],
  });

  // 3. Create Problems
  const problem1 = await prisma.problem.create({
    data: {
      code: "PROB-01",
      title: "Real-Time AI Fraud Detection Pipeline",
      description:
        "Build a zero-trust stream processing pipeline that ingests transaction logs and detects fraudulent patterns under 50ms latency using hybrid ML inference models.",
      category: "FinTech",
      difficulty: "HARD",
      status: "ACTIVE",
      functionalRequirements: ["Sub-50ms transaction latency", "Kafka stream ingest", "Dynamic scoring engine"],
      technicalRequirements: ["TypeScript / Rust / Python core", "Automated unit and integration test coverage > 80%"],
      securityRequirements: ["Zero-trust payload encryption", "Strict CORS and secret management"],
      performanceRequirements: ["5,000 TPS sustained throughput under benchmark load"],
      uiUxRequirements: ["Responsive status monitoring dashboard with micro-second latency display"],
      docRequirements: ["Comprehensive architecture README, API specs, and deployment guide"],
    },
  });

  const problem2 = await prisma.problem.create({
    data: {
      code: "PROB-02",
      title: "Decentralized Autonomous Evaluation Engine",
      description:
        "Design a verifiable evaluation smart contract system and zero-knowledge proof verification protocol for automated hackathon scoring.",
      category: "Web3 Infrastructure",
      difficulty: "HARD",
      status: "ACTIVE",
      functionalRequirements: ["ZK-proof verification for rubric items", "Gas-optimized smart contract"],
      securityRequirements: ["Formal verification report", "Anti-sybil identity binding"],
    },
  });

  // Link problems to hackathon
  await prisma.hackathonProblem.createMany({
    data: [
      { hackathonId: hackathon1.id, problemId: problem1.id },
      { hackathonId: hackathon1.id, problemId: problem2.id },
    ],
  });

  console.log(" Created hackathon and linked problem statements");

  // 4. Create Teams with Invite Codes
  const team1 = await prisma.team.create({
    data: {
      name: "CyberPulse",
      inviteCode: "FORGE-7X92",
      hackathonId: hackathon1.id,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team1.id,
      userId: participant1.id,
      role: "CAPTAIN",
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: "NeuralSquad",
      inviteCode: "FORGE-8K31",
      hackathonId: hackathon1.id,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team2.id,
      userId: participant2.id,
      role: "CAPTAIN",
    },
  });

  console.log(" Created teams with invite codes (FORGE-7X92, FORGE-8K31)");

  // 5. Create Submissions
  const sub1 = await prisma.submission.create({
    data: {
      teamId: team1.id,
      problemId: problem1.id,
      projectName: "AegisShield",
      projectDescription: "High-throughput real-time zero-trust anomaly detection with Rust and eBPF instrumentation.",
      repositoryUrl: "https://github.com/forgeeval/aegisshield-core",
      branch: "main",
      demoUrl: "https://aegisshield.demo.forgeeval.dev",
      docUrl: "https://docs.aegisshield.dev",
      language: "TypeScript / Rust",
      status: "ANALYZED",
      overallScore: 94,
      scoreCodeQuality: 92,
      scoreSecurity: 91,
      scoreTesting: 95,
      scoreRequirement: 96,
      scoreDocumentation: 90,
      scoreUiUx: 94,
      isReleased: true, // Released for participant view testing
    },
  });

  const sub2 = await prisma.submission.create({
    data: {
      teamId: team2.id,
      problemId: problem1.id,
      projectName: "SentinAI",
      projectDescription: "Distributed streaming anomaly scanner with secure enclave execution.",
      repositoryUrl: "https://github.com/forgeeval/sentin-ai",
      branch: "main",
      demoUrl: "https://sentinai.demo.forgeeval.dev",
      language: "Python / Go",
      status: "ANALYZED",
      overallScore: 88,
      scoreCodeQuality: 87,
      scoreSecurity: 84,
      scoreTesting: 91,
      scoreRequirement: 90,
      scoreDocumentation: 85,
      scoreUiUx: 88,
      isReleased: false, // Unreleased to test unreleased state
    },
  });

  // 6. Security Findings
  await prisma.securityFinding.create({
    data: {
      submissionId: sub1.id,
      title: "Permissive CORS Wildcard configuration",
      severity: "LOW",
      category: "SECURITY",
      filePath: "src/server.ts",
      lineNumber: 42,
      description: "Access-Control-Allow-Origin header is set to '*'.",
      recommendation: "Restrict CORS origins strictly to client application domains.",
      status: "OPEN",
    },
  });

  // 7. Runtime Tests
  await prisma.runtimeTest.create({
    data: {
      submissionId: sub1.id,
      name: "Transaction Log Parsing Benchmark",
      description: "Verifies processing latency under 50ms",
      status: "PASSED",
      duration: 38,
    },
  });

  // 8. Judge Score
  await prisma.judgeScore.create({
    data: {
      submissionId: sub1.id,
      userId: judge.id,
      dimension: "TECHNICAL",
      score: 94,
      comment: "Outstanding project execution! Highly scalable Rust pipeline.",
    },
  });

  console.log(" Database V2 seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
