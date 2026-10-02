import { Problem, Submission, Finding, RequirementItem } from './types';

export const INITIAL_PROBLEMS: Problem[] = [
  {
    id: 'prob-01',
    code: 'FG-091',
    title: 'Autonomous Fraud Sentinel: Zero-Latency Transaction Interceptor',
    category: 'FinTech',
    difficulty: 'CRITICAL',
    submissionsCount: 14,
    requirementsCount: 18,
    status: 'ACTIVE',
    deadline: '2026-10-18T23:59:00Z',
    description: 'High-frequency streaming engine detecting coordinated adversary laundering rings with under 5ms inference latency and zero credential telemetry leakage.',
    inputRequirements: ['Kafka payload streaming format v2.4', 'ISO 20022 compliant message structure', 'Ed25519 node signature validation'],
    outputRequirements: ['Fraud confidence vector (0.00 - 1.00)', 'Sub-millisecond alert callback webhook', 'Merkle-proof auditable audit trail'],
    functionalRequirements: ['Distributed sliding window aggregator', 'Graph ring traversal within 3 hops', 'Dynamic rule hot-reloading without service restart'],
    technicalRequirements: ['Rust or Go core runtime engine', 'gRPC high-throughput IPC', 'In-memory Redis/Dragonfly state replication'],
    securityRequirements: ['Strict memory-safe payload parsing', 'No plaintext account identifier caching in memory', 'TLS 1.3 mutual handshake'],
    performanceRequirements: ['P99 latency under 4.8ms under 50,000 req/sec', 'Memory footprint capped at 1.8GB per pod'],
    uiUxRequirements: ['Real-time topology stream visualization', 'Incident triage timeline with step-back inspection'],
    docRequirements: ['Architecture decision records (ADR 001-004)', 'Deterministic load-testing reproduction script with k6']
  },
  {
    id: 'prob-02',
    code: 'FG-092',
    title: 'Verifiable AI Consensus Engine for Multi-Agent Orchestration',
    category: 'AI & Agents',
    difficulty: 'HARD',
    submissionsCount: 26,
    requirementsCount: 22,
    status: 'EVALUATING',
    deadline: '2026-10-15T18:00:00Z',
    description: 'Byzantine fault-tolerant agent negotiation network with cryptographic execution logs and dynamic safety guardrails.',
    inputRequirements: ['OpenAI / Anthropic format tool call frames', 'Multi-tenant session cryptographic credentials'],
    outputRequirements: ['Signed consensus receipt', 'Deterministic deterministic execution rollbacks'],
    functionalRequirements: ['Quorum agreement protocol (3f+1)', 'Hallucination detection via ensemble divergence cross-check'],
    technicalRequirements: ['TypeScript/Python or Rust agent adapters', 'PostgreSQL with pgvector for semantic state tracking'],
    securityRequirements: ['Prompt injection sanitization boundary', 'Sandbox jail with strict seccomp filters'],
    performanceRequirements: ['Token overhead under 8% per negotiation cycle', 'Sub-250ms roundtrip consensus voting'],
    uiUxRequirements: ['Agent message cascade trace graph', 'Dispute inspection timeline'],
    docRequirements: ['Formal verification spec', 'End-to-end benchmark suite']
  },
  {
    id: 'prob-03',
    code: 'FG-093',
    title: 'Kernel-Level eBPF Telemetry & Ransomware Killswitch',
    category: 'Cybersecurity',
    difficulty: 'CRITICAL',
    submissionsCount: 9,
    requirementsCount: 16,
    status: 'ACTIVE',
    deadline: '2026-10-24T12:00:00Z',
    description: 'Autonomous host sensor monitoring VFS syscall patterns, catching rapid directory encryption within 40ms and freezing rogue processes.',
    inputRequirements: ['Linux kernel tracepoints (sys_enter_write, sys_enter_openat2)', 'Process cgroup attribution tables'],
    outputRequirements: ['SIGSTOP kernel intervention signal', 'Memory snapshot core dump trigger for forensics'],
    functionalRequirements: ['Entropy-burst detection algorithm', 'Canary file honeypot monitoring in /var/data and /home'],
    technicalRequirements: ['C/eBPF kernel probe with Aya or libbpf-rs user-space coordinator'],
    securityRequirements: ['Verifier-compliant safe memory bounds', 'Zero user-space bypass capability'],
    performanceRequirements: ['CPU overhead < 1.2% total core saturation', 'Ringbuffer buffer drops = 0'],
    uiUxRequirements: ['Attack timeline telemetry chart', 'Live process tree visualization'],
    docRequirements: ['Kernel configuration checklist', 'QEMU virtual machine test fixture reproduction']
  },
  {
    id: 'prob-04',
    code: 'FG-094',
    title: 'Next-Gen Decentralized State Sync & Blob Pipeline',
    category: 'Web3 Infrastructure',
    difficulty: 'MEDIUM',
    submissionsCount: 18,
    requirementsCount: 14,
    status: 'ACTIVE',
    deadline: '2026-10-30T00:00:00Z',
    description: 'Peer-to-peer optimistic data dispersal network utilizing KZG commitments and erasure-coded peer propagation.',
    inputRequirements: ['EIP-4844 blob bundle inputs', 'Node peer discovery bootnodes list'],
    outputRequirements: ['Proof of availability certificate', 'Distributed chunk gossip stream'],
    functionalRequirements: ['Reed-Solomon 2D erasure coding', 'DHT shard routing with rendezvous hashing'],
    technicalRequirements: ['Go or Rust async runtime', 'P2P transport over libp2p with QUIC multiplexing'],
    securityRequirements: ['Eclipse attack mitigation heuristics', 'Sybil resistance through stake-weight verification'],
    performanceRequirements: ['128MB payload distribution in < 1.4 seconds across 200 virtual nodes'],
    uiUxRequirements: ['Swarm node connection matrix', 'Throughput heat map'],
    docRequirements: ['Network simulator setup guide', 'Protocol RFC specification']
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-101',
    team: 'Aetheris Protocol Labs',
    avatar: 'APL',
    problemId: 'prob-01',
    problemTitle: 'Autonomous Fraud Sentinel: Zero-Latency Transaction Interceptor',
    repository: 'https://github.com/aetheris-labs/sentinel-engine-v2',
    branch: 'release/v2.1-hackathon',
    language: 'Rust / TypeScript',
    submittedAt: '2026-10-02T04:12:30Z',
    commitHash: '7f9a2c3',
    status: 'ANALYZED',
    overallScore: 92.4,
    criteriaScores: {
      requirement: 95,
      codeQuality: 92,
      security: 88,
      testing: 94,
      documentation: 91,
      uiUx: 94
    },
    metrics: {
      linesOfCode: 18420,
      cyclomaticComplexity: 7.2,
      testCoverage: 91.5,
      buildTimeSec: 42.1,
      vulnerabilitiesCount: 1
    },
    frameworks: ['Tokio', 'Actix-Web', 'React 19', 'TailwindCSS', 'RocksDB-sys'],
    dependencies: [
      { name: 'tokio', version: '1.38.0', auditStatus: 'SECURE' },
      { name: 'serde_json', version: '1.0.117', auditStatus: 'SECURE' },
      { name: 'ring', version: '0.17.8', auditStatus: 'SECURE' },
      { name: 'actix-web', version: '4.7.0', auditStatus: 'SECURE' },
      { name: 'openssl-sys', version: '0.9.102', auditStatus: 'OUTDATED' }
    ],
    readmePreview: `# Sentinel Engine v2 - High Performance Fraud Sentinel

Sentinel is an in-memory streaming transaction verification pipeline capable of processing 100,000 ISO 20022 events per second with graph-based anomaly tracing.

## Quickstart
\`\`\`bash
cargo run --release -- --config config/hackathon-preset.toml
\`\`\`
`,
    projectStructure: [
      {
        name: 'crates',
        type: 'dir',
        children: [
          { name: 'sentinel-core', type: 'dir', children: [
            { name: 'src/engine.rs', type: 'file', size: '14.2 KB' },
            { name: 'src/graph.rs', type: 'file', size: '28.5 KB' },
            { name: 'src/verifier.rs', type: 'file', size: '9.8 KB' }
          ]},
          { name: 'sentinel-ui', type: 'dir', children: [
            { name: 'src/App.tsx', type: 'file', size: '8.4 KB' },
            { name: 'src/components/TopologyView.tsx', type: 'file', size: '15.1 KB' }
          ]}
        ]
      },
      { name: 'Cargo.toml', type: 'file', size: '2.1 KB' },
      { name: 'docker-compose.yml', type: 'file', size: '1.4 KB' },
      { name: 'tests/integration_stress_spec.rs', type: 'file', size: '18.9 KB' }
    ],
    runtimeLogs: [
      { timestamp: '00:00:01.042', level: 'SYSTEM', message: 'FORGEVAL container runner initialized in sandboxed seccomp enclosure' },
      { timestamp: '00:00:01.488', level: 'INFO', message: 'Executing cargo test --all-targets --release...' },
      { timestamp: '00:00:14.210', level: 'INFO', message: 'Compiling sentinel-core v2.1.0 (/workspace/crates/sentinel-core)' },
      { timestamp: '00:00:32.890', level: 'INFO', message: 'Running 48 unit tests in crates/sentinel-core... OK (48 passed; 0 failed; 0 ignored)' },
      { timestamp: '00:00:38.120', level: 'INFO', message: 'Running integration benchmark with simulated 25,000 msg/sec synthetic workload' },
      { timestamp: '00:00:41.950', level: 'INFO', message: 'Workload completed. P50: 1.2ms | P95: 3.1ms | P99: 4.62ms. Target: < 4.8ms. STATUS: PASS' },
      { timestamp: '00:00:42.100', level: 'SYSTEM', message: 'Process exited with code 0. Runtime memory ceiling: 1.42 GB.' }
    ],
    exitCode: 0,
    buildStatus: 'SUCCESS',
    executionTime: '42.10s'
  },
  {
    id: 'sub-102',
    team: 'ZeroState Engineering',
    avatar: 'ZSE',
    problemId: 'prob-01',
    problemTitle: 'Autonomous Fraud Sentinel: Zero-Latency Transaction Interceptor',
    repository: 'https://github.com/zerostate/fraud-interceptor-go',
    branch: 'main',
    language: 'Go / Next.js',
    submittedAt: '2026-10-02T03:45:10Z',
    commitHash: '9c4b11f',
    status: 'IN_REVIEW',
    overallScore: 84.8,
    criteriaScores: {
      requirement: 88,
      codeQuality: 85,
      security: 76,
      testing: 82,
      documentation: 89,
      uiUx: 89
    },
    metrics: {
      linesOfCode: 12150,
      cyclomaticComplexity: 9.1,
      testCoverage: 79.2,
      buildTimeSec: 28.4,
      vulnerabilitiesCount: 3
    },
    frameworks: ['Gin Gonic', 'gRPC-Go', 'React', 'Zustand', 'Redis-Go'],
    dependencies: [
      { name: 'github.com/gin-gonic/gin', version: 'v1.9.1', auditStatus: 'SECURE' },
      { name: 'google.golang.org/grpc', version: 'v1.62.0', auditStatus: 'SECURE' },
      { name: 'github.com/golang-jwt/jwt', version: 'v3.2.2', auditStatus: 'VULNERABLE' }
    ],
    readmePreview: `# GoFraud Sentinel - Ultra-Lightweight Interceptor

A lightning fast Go daemon capturing Kafka bursts and updating in-memory Bloom filters.
`,
    projectStructure: [
      { name: 'cmd/server/main.go', type: 'file', size: '4.8 KB' },
      { name: 'pkg/rules/evaluator.go', type: 'file', size: '12.3 KB' },
      { name: 'pkg/storage/redis.go', type: 'file', size: '6.1 KB' },
      { name: 'go.mod', type: 'file', size: '1.2 KB' }
    ],
    runtimeLogs: [
      { timestamp: '00:00:01.010', level: 'SYSTEM', message: 'Starting Go 1.22 test harness sandbox' },
      { timestamp: '00:00:08.200', level: 'INFO', message: 'go test -v -race ./...' },
      { timestamp: '00:00:19.450', level: 'WARN', message: 'Race condition detector hit non-fatal lock contention in rules/evaluator.go:142' },
      { timestamp: '00:00:27.900', level: 'INFO', message: 'PASS: 32 tests passed, 2 skipped' },
      { timestamp: '00:00:28.400', level: 'SYSTEM', message: 'Process exited with code 0' }
    ],
    exitCode: 0,
    buildStatus: 'WARNING',
    executionTime: '28.40s'
  },
  {
    id: 'sub-103',
    team: 'NeuroMesh Systems',
    avatar: 'NMS',
    problemId: 'prob-02',
    problemTitle: 'Verifiable AI Consensus Engine for Multi-Agent Orchestration',
    repository: 'https://github.com/neuromesh/consensus-core-py',
    branch: 'hackathon/final',
    language: 'Python / FastAPI',
    submittedAt: '2026-10-02T01:15:00Z',
    commitHash: 'e14d89a',
    status: 'ANALYZED',
    overallScore: 89.2,
    criteriaScores: {
      requirement: 91,
      codeQuality: 88,
      security: 84,
      testing: 88,
      documentation: 96,
      uiUx: 88
    },
    metrics: {
      linesOfCode: 9840,
      cyclomaticComplexity: 5.8,
      testCoverage: 88.0,
      buildTimeSec: 19.3,
      vulnerabilitiesCount: 0
    },
    frameworks: ['FastAPI', 'LangChain', 'Pydantic V2', 'PyCryptodome', 'SvelteKit'],
    dependencies: [
      { name: 'fastapi', version: '0.110.0', auditStatus: 'SECURE' },
      { name: 'pydantic', version: '2.6.4', auditStatus: 'SECURE' },
      { name: 'pycryptodome', version: '3.20.0', auditStatus: 'SECURE' }
    ],
    readmePreview: `# NeuroMesh BFT Protocol

Autonomous multi-agent consensus layer with zero-knowledge verification receipts.
`,
    projectStructure: [
      { name: 'neuromesh/engine.py', type: 'file', size: '8.9 KB' },
      { name: 'neuromesh/quorum.py', type: 'file', size: '11.4 KB' },
      { name: 'pyproject.toml', type: 'file', size: '2.4 KB' }
    ],
    runtimeLogs: [
      { timestamp: '00:00:01.000', level: 'SYSTEM', message: 'Initializing pytest with asyncio runner' },
      { timestamp: '00:00:04.200', level: 'INFO', message: 'test_quorum_agreement PASSED [12%]' },
      { timestamp: '00:00:18.900', level: 'INFO', message: 'test_byzantine_resilience PASSED [100%]' },
      { timestamp: '00:00:19.300', level: 'SYSTEM', message: 'Finished test execution: 64 passed in 18.2s' }
    ],
    exitCode: 0,
    buildStatus: 'SUCCESS',
    executionTime: '19.30s'
  },
  {
    id: 'sub-104',
    team: 'KernelVanguard',
    avatar: 'KVG',
    problemId: 'prob-03',
    problemTitle: 'Kernel-Level eBPF Telemetry & Ransomware Killswitch',
    repository: 'https://github.com/vanguard-sec/ebpf-killswitch',
    branch: 'dev-stable',
    language: 'C / Rust',
    submittedAt: '2026-10-01T22:30:10Z',
    commitHash: '3a18ef4',
    status: 'ANALYZED',
    overallScore: 95.8,
    criteriaScores: {
      requirement: 98,
      codeQuality: 96,
      security: 97,
      testing: 92,
      documentation: 94,
      uiUx: 98
    },
    metrics: {
      linesOfCode: 15400,
      cyclomaticComplexity: 4.9,
      testCoverage: 94.1,
      buildTimeSec: 35.8,
      vulnerabilitiesCount: 0
    },
    frameworks: ['Aya-bpf', 'eBPF', 'Tokio', 'Vite', 'React'],
    dependencies: [
      { name: 'aya', version: '0.12.0', auditStatus: 'SECURE' },
      { name: 'aya-bpf', version: '0.1.0', auditStatus: 'SECURE' }
    ],
    readmePreview: `# eBPF Ransomware Interceptor

Real-time entropy probe injecting into sys_enter_write hook. Quenches ransomware processes within 28ms.
`,
    projectStructure: [
      { name: 'ebpf/main.bpf.c', type: 'file', size: '18.2 KB' },
      { name: 'userspace/src/main.rs', type: 'file', size: '12.9 KB' }
    ],
    runtimeLogs: [
      { timestamp: '00:00:01.000', level: 'SYSTEM', message: 'Loading kernel probe via bpf_prog_load' },
      { timestamp: '00:00:02.100', level: 'INFO', message: 'Kernel eBPF verifier: OK. Instruction count: 3,114. Zero loops detected.' },
      { timestamp: '00:00:35.800', level: 'SYSTEM', message: 'Benchmark killswitch triggered in 24.2ms. Synthetic lockup defeated.' }
    ],
    exitCode: 0,
    buildStatus: 'SUCCESS',
    executionTime: '35.80s'
  },
  {
    id: 'sub-105',
    team: 'HyperBlob Team',
    avatar: 'HBT',
    problemId: 'prob-04',
    problemTitle: 'Next-Gen Decentralized State Sync & Blob Pipeline',
    repository: 'https://github.com/hyperblob/dispersal-net',
    branch: 'submission-v1',
    language: 'Go / TypeScript',
    submittedAt: '2026-10-01T19:22:00Z',
    commitHash: '8b77d2a',
    status: 'FAILED',
    overallScore: 54.1,
    criteriaScores: {
      requirement: 62,
      codeQuality: 58,
      security: 42,
      testing: 45,
      documentation: 68,
      uiUx: 50
    },
    metrics: {
      linesOfCode: 8400,
      cyclomaticComplexity: 12.4,
      testCoverage: 44.0,
      buildTimeSec: 14.2,
      vulnerabilitiesCount: 5
    },
    frameworks: ['libp2p', 'Go-Ethereum', 'React'],
    dependencies: [
      { name: 'github.com/libp2p/go-libp2p', version: 'v0.32.0', auditStatus: 'SECURE' },
      { name: 'github.com/ethereum/go-ethereum', version: 'v1.13.0', auditStatus: 'OUTDATED' }
    ],
    readmePreview: `# HyperBlob Data Dispersal

KZG multi-point proof validation engine over decentralized gossipsub.
`,
    projectStructure: [
      { name: 'cmd/node/main.go', type: 'file', size: '7.8 KB' },
      { name: 'kzg/verify.go', type: 'file', size: '14.1 KB' }
    ],
    runtimeLogs: [
      { timestamp: '00:00:01.000', level: 'SYSTEM', message: 'Compiling Go binary...' },
      { timestamp: '00:00:04.200', level: 'ERROR', message: 'kzg/verify.go:88: cannot convert point to G1Aff (type mismatch in cryptographic pairing)' },
      { timestamp: '00:00:14.200', level: 'SYSTEM', message: 'Build failed with exit code 2. Compilation terminated.' }
    ],
    exitCode: 2,
    buildStatus: 'FAILED',
    executionTime: '14.20s'
  }
];

export const INITIAL_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'req-01',
    code: 'REQ-SEC-01',
    category: 'Security',
    requirement: 'Strict memory-safe payload parsing without raw pointer arithmetic on network buffers',
    evidence: 'Traced safe usage of Rust slice indexing and serde_json deserialization in crates/sentinel-core/src/verifier.rs:44-88',
    status: 'SATISFIED',
    confidence: 98,
    fileMatch: 'crates/sentinel-core/src/verifier.rs',
    lineSpan: '44-88'
  },
  {
    id: 'req-02',
    code: 'REQ-PERF-01',
    category: 'Performance',
    requirement: 'P99 transaction classification latency under 4.8ms under 50k req/sec load',
    evidence: 'k6 test execution report demonstrates P99 at 4.62ms under synthetic load; passed hardware clock telemetry.',
    status: 'SATISFIED',
    confidence: 94,
    fileMatch: 'tests/integration_stress_spec.rs',
    lineSpan: '120-185'
  },
  {
    id: 'req-03',
    code: 'REQ-FUNC-01',
    category: 'Functional',
    requirement: 'Dynamic rule hot-reloading without service downtime or dropping in-flight socket connections',
    evidence: 'Found atomic ArcSwap pointer swap implementation in engine.rs. Verified reload signal handler SIGUSR1 without thread crash.',
    status: 'SATISFIED',
    confidence: 96,
    fileMatch: 'crates/sentinel-core/src/engine.rs',
    lineSpan: '192-230'
  },
  {
    id: 'req-04',
    code: 'REQ-FUNC-02',
    category: 'Functional',
    requirement: 'Multi-hop graph traversal for money laundering ring detection up to 3 hops',
    evidence: 'Graph traversal algorithm implemented in graph.rs:88 using BFS. Depth hard-capped at 2 hops in current commit.',
    status: 'PARTIAL',
    confidence: 76,
    fileMatch: 'crates/sentinel-core/src/graph.rs',
    lineSpan: '88-142'
  },
  {
    id: 'req-05',
    code: 'REQ-SEC-02',
    category: 'Security',
    requirement: 'Zero plaintext account identifier caching in memory dumps or telemetry logs',
    evidence: 'Scanned log macros; found masked IBAN string formatting helper in telemetry/logger.rs, but raw payload traces into /tmp during debug builds.',
    status: 'PARTIAL',
    confidence: 82,
    fileMatch: 'crates/sentinel-core/src/telemetry.rs',
    lineSpan: '55-70'
  },
  {
    id: 'req-06',
    code: 'REQ-UI-01',
    category: 'UI/UX',
    requirement: 'Real-time topology stream visualization with step-back inspection',
    evidence: 'TopologyView.tsx implements live Canvas/WebGL node renderer with interactive timeline scrubber and historical playback.',
    status: 'SATISFIED',
    confidence: 99,
    fileMatch: 'sentinel-ui/src/components/TopologyView.tsx',
    lineSpan: '1-320'
  },
  {
    id: 'req-07',
    code: 'REQ-DOC-01',
    category: 'Documentation',
    requirement: 'Architecture decision records (ADR 001-004) covering storage engine and failover',
    evidence: 'Found docs/adr/001-rocksdb-selection.md, 002-memory-model.md, 003-wire-protocol.md, 004-failover.md.',
    status: 'SATISFIED',
    confidence: 100,
    fileMatch: 'docs/adr/001-004.md',
    lineSpan: '1-450'
  },
  {
    id: 'req-08',
    code: 'REQ-TEST-01',
    category: 'Testing',
    requirement: 'Deterministic load-testing reproduction script with automated pass/fail assertion threshold',
    evidence: 'Found scripts/stress_suite.sh invoking k6 and parsing output JSON against 4.8ms threshold.',
    status: 'SATISFIED',
    confidence: 95,
    fileMatch: 'scripts/stress_suite.sh',
    lineSpan: '1-60'
  },
  {
    id: 'req-09',
    code: 'REQ-SEC-03',
    category: 'Security',
    requirement: 'TLS 1.3 mutual handshake certificate revocation checking (OCSP stapling)',
    evidence: 'No OCSP stapling logic found in TLS configuration context. Raw rustls ClientConfig without custom cert verifier.',
    status: 'MISSING',
    confidence: 91,
    fileMatch: 'crates/sentinel-core/src/net/tls.rs',
    lineSpan: '12-30'
  }
];

export const INITIAL_FINDINGS: Finding[] = [
  {
    id: 'find-01',
    code: 'FIND-CRIT-001',
    severity: 'CRITICAL',
    category: 'Security',
    teamId: 'sub-102',
    teamName: 'ZeroState Engineering',
    problemId: 'prob-01',
    problemTitle: 'Autonomous Fraud Sentinel',
    title: 'JWT Algorithm Confusion & None Cipher Bypass',
    description: 'The authentication middleware allows JWT tokens signed with algorithm "none" to pass validation without secret verification.',
    evidence: 'pkg/auth/jwt.go line 54: token, err := jwt.Parse(tokenStr, func(t *jwt.Token) { return []byte(""), nil }) allows unchecked algorithms.',
    affectedFile: 'pkg/auth/jwt.go',
    recommendation: 'Enforce strict verification using jwt.WithValidMethods([]string{"HS256", "RS256"}) and validate claims before allowing authorization.',
    status: 'OPEN'
  },
  {
    id: 'find-02',
    code: 'FIND-HIGH-002',
    severity: 'HIGH',
    category: 'Architecture',
    teamId: 'sub-101',
    teamName: 'Aetheris Protocol Labs',
    problemId: 'prob-01',
    problemTitle: 'Autonomous Fraud Sentinel',
    title: 'Unbounded Graph Node Queue on Circular Transfer Cascades',
    description: 'Circular laundering graph analysis can cause cyclical node re-queueing under specific ring topologies, consuming excess heap.',
    evidence: 'crates/sentinel-core/src/graph.rs:114: queue.push_back(neighbor) occurs without checking visited bloom set in fast path.',
    affectedFile: 'crates/sentinel-core/src/graph.rs',
    recommendation: 'Filter candidates using pre-allocated bitset visited vector before pushing to BFS deque.',
    status: 'VERIFIED'
  },
  {
    id: 'find-03',
    code: 'FIND-MED-003',
    severity: 'MEDIUM',
    category: 'Code Quality',
    teamId: 'sub-101',
    teamName: 'Aetheris Protocol Labs',
    problemId: 'prob-01',
    problemTitle: 'Autonomous Fraud Sentinel',
    title: 'Outdated OpenSSL Dependency in Cargo Tree',
    description: 'Cargo.lock pulls openssl-sys 0.9.102 which carries advisory RUSTSEC-2024-0019 for memory leak under TLS renegotiation.',
    evidence: 'Cargo.lock line 412: openssl-sys v0.9.102 resolved via actix-tls.',
    affectedFile: 'Cargo.lock',
    recommendation: 'Run cargo update -p openssl-sys to bump to >= 0.9.104.',
    status: 'OPEN'
  },
  {
    id: 'find-04',
    code: 'FIND-LOW-004',
    severity: 'LOW',
    category: 'Testing',
    teamId: 'sub-103',
    teamName: 'NeuroMesh Systems',
    problemId: 'prob-02',
    problemTitle: 'Verifiable AI Consensus Engine',
    title: 'Mocked Random Seeds in Byzantine Fault Tests',
    description: 'Deterministic pseudo-random seed in unit tests skips non-deterministic edge scenarios with variable network latency jitter.',
    evidence: 'tests/test_quorum.py line 24: random.seed(42) pinned unconditionally.',
    affectedFile: 'tests/test_quorum.py',
    recommendation: 'Use hypothesis or property-based fuzz testing across variable seed matrices.',
    status: 'MITIGATED'
  },
  {
    id: 'find-05',
    code: 'FIND-CRIT-005',
    severity: 'CRITICAL',
    category: 'Security',
    teamId: 'sub-105',
    teamName: 'HyperBlob Team',
    problemId: 'prob-04',
    problemTitle: 'Next-Gen Decentralized State Sync',
    title: 'Arbitrary Memory Read in Unvalidated Blob Deserializer',
    description: 'Missing bound checks on incoming peer chunk offset header allows malformed packet to read arbitrary memory offsets.',
    evidence: 'kzg/verify.go line 88: slice length constructed directly from peer uint32 payload size without upper clamp.',
    affectedFile: 'kzg/verify.go',
    recommendation: 'Enforce MAX_CHUNK_SIZE constant check prior to allocating read slice.',
    status: 'OPEN'
  }
];
