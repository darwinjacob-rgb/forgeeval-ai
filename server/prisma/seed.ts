import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting ForgeEval database seeding...");

  // Clean existing tables
  await prisma.judgeScore.deleteMany();
  await prisma.requirementResult.deleteMany();
  await prisma.runtimeTest.deleteMany();
  await prisma.securityFinding.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.team.deleteMany();
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

  const judge = await prisma.user.create({
    data: {
      email: "judge@forgeeval.com",
      passwordHash,
      name: "Alex Vance",
      role: "JUDGE",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    },
  });

  const dev = await prisma.user.create({
    data: {
      email: "dev@forgeeval.com",
      passwordHash,
      name: "CyberPulse Team",
      role: "PARTICIPANT",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  console.log(" Created seed users");

  // 2. Create Hackathon & Team
  const hackathon = await prisma.hackathon.create({
    data: {
      name: "ForgeEval AI Hackathon 2026",
      description: "Premier AI and Distributed Systems Hackathon",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: "ACTIVE",
    },
  });

  const team = await prisma.team.create({
    data: {
      name: "CyberPulse",
      hackathonId: hackathon.id,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    },
  });

  await prisma.teamMember.create({
    data: {
      teamId: team.id,
      userId: dev.id,
      role: "LEAD",
    },
  });

  // 3. Create Problem Statements
  const problem1 = await prisma.problem.create({
    data: {
      code: "PROB-01",
      title: "Real-Time AI Fraud Detection Pipeline",
      description:
        "Build a zero-trust stream processing pipeline that ingests transaction logs and detects fraudulent patterns under 50ms latency using hybrid ML inference models.",
      category: "FinTech",
      difficulty: "HARD",
      status: "ACTIVE",
      functionalRequirements: ["Sub-50ms transaction latency", "Kafka stream ingest"],
      securityRequirements: ["Zero-trust payload encryption"],
      performanceRequirements: ["5000 TPS load capacity"],
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
    },
  });

  console.log(" Created problem statements");

  // 4. Create Submissions
  const sub1 = await prisma.submission.create({
    data: {
      teamId: team.id,
      problemId: problem1.id,
      repositoryUrl: "https://github.com/forgeeval/aegisshield-core",
      branch: "main",
      language: "TypeScript / Rust",
      status: "ANALYZED",
      overallScore: 94,
      scoreCodeQuality: 92,
      scoreSecurity: 91,
      scoreTesting: 95,
      scoreRequirement: 96,
    },
  });

  console.log(" Created submissions");

  // 5. Create Security Findings
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

  // 6. Create Runtime Test Results
  await prisma.runtimeTest.create({
    data: {
      submissionId: sub1.id,
      name: "Transaction Log Parsing Benchmark",
      description: "Verifies processing latency under 50ms",
      status: "PASSED",
      duration: 38,
    },
  });

  // 7. Create Judge Score
  await prisma.judgeScore.create({
    data: {
      submissionId: sub1.id,
      userId: judge.id,
      dimension: "TECHNICAL",
      score: 94,
      comment: "Outstanding project execution! Highly scalable Rust pipeline.",
    },
  });

  console.log(" Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
