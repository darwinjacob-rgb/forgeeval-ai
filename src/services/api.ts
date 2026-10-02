import { Problem, Submission, Finding, RequirementItem, JudgeEvaluation } from '../types';
import { INITIAL_PROBLEMS, INITIAL_SUBMISSIONS, INITIAL_REQUIREMENTS, INITIAL_FINDINGS } from '../mockData';

const API_BASE_URL = 'http://localhost:5000/api/v1';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'API request failed');
  }

  return data.data;
}

// ====================================================
// AUTHENTICATION API
// ====================================================
export const authApi = {
  login: async (email: string, passwordHash: string) => {
    try {
      return await apiFetch<{ user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password: passwordHash }),
      });
    } catch (err) {
      console.warn('Backend unavailable, using simulated login fallback:', err);
      return {
        user: {
          id: 'user-simulated',
          name: email.split('@')[0] || 'Forge Developer',
          email,
          role: 'ADMIN',
        },
      };
    }
  },

  register: async (name: string, email: string, passwordHash: string, role = 'PARTICIPANT') => {
    try {
      return await apiFetch<{ user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password: passwordHash, role }),
      });
    } catch (err) {
      console.warn('Backend unavailable, using simulated register fallback:', err);
      return {
        user: { id: 'user-simulated', name, email, role },
      };
    }
  },

  logout: async () => {
    try {
      return await apiFetch('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout fallback:', err);
      return { success: true };
    }
  },

  getMe: async () => {
    try {
      return await apiFetch<{ user: any }>('/auth/me');
    } catch (err) {
      return null;
    }
  },
};

// ====================================================
// PROBLEMS API
// ====================================================
export const problemsApi = {
  getAll: async (params?: { category?: string; difficulty?: string; search?: string }): Promise<Problem[]> => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await apiFetch<{ problems: any[] }>(`/problems?${query}`);
      return res.problems.map((p) => ({
        id: p.id,
        code: p.id.slice(0, 8).toUpperCase(),
        title: p.title,
        category: p.category || 'AI & Agents',
        difficulty: p.difficulty || 'HARD',
        submissionsCount: p._count?.submissions || 0,
        requirementsCount: Array.isArray(p.requirements) ? p.requirements.length : 4,
        status: 'ACTIVE',
        description: p.description,
        deadline: '24h 00m left',
        inputRequirements: [],
        outputRequirements: [],
        functionalRequirements: [],
        technicalRequirements: [],
        securityRequirements: [],
        performanceRequirements: [],
        uiUxRequirements: [],
        docRequirements: [],
      }));
    } catch (err) {
      console.warn('Backend unavailable, using INITIAL_PROBLEMS fallback:', err);
      return INITIAL_PROBLEMS;
    }
  },

  getById: async (id: string): Promise<Problem | null> => {
    try {
      const res = await apiFetch<{ problem: any }>(`/problems/${id}`);
      const p = res.problem;
      return {
        id: p.id,
        code: p.id.slice(0, 8).toUpperCase(),
        title: p.title,
        category: p.category || 'AI & Agents',
        difficulty: p.difficulty || 'HARD',
        submissionsCount: p._count?.submissions || 0,
        requirementsCount: Array.isArray(p.requirements) ? p.requirements.length : 4,
        status: 'ACTIVE',
        description: p.description,
        deadline: '24h 00m left',
        inputRequirements: [],
        outputRequirements: [],
        functionalRequirements: [],
        technicalRequirements: [],
        securityRequirements: [],
        performanceRequirements: [],
        uiUxRequirements: [],
        docRequirements: [],
      };
    } catch (err) {
      return INITIAL_PROBLEMS.find((p) => p.id === id) || null;
    }
  },

  create: async (data: any) => {
    return apiFetch('/problems', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ====================================================
// SUBMISSIONS API
// ====================================================
export const submissionsApi = {
  getAll: async (params?: { problemId?: string; status?: string; search?: string }): Promise<Submission[]> => {
    try {
      const query = new URLSearchParams(params as any).toString();
      const res = await apiFetch<{ submissions: any[] }>(`/submissions?${query}`);
      return res.submissions.map((s) => ({
        id: s.id,
        team: s.teamName || 'CyberPulse',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        problemId: s.problemId,
        problemTitle: s.problem?.title || 'Real-Time Pipeline',
        repository: s.repositoryUrl || 'https://github.com/forgeeval/aegisshield',
        branch: 'main',
        language: 'TypeScript / Rust',
        submittedAt: new Date(s.createdAt).toISOString(),
        commitHash: s.id.slice(0, 7),
        status: s.status === 'EVALUATED' ? 'ANALYZED' : 'IN_REVIEW',
        overallScore: s.scoreOverall || 90,
        criteriaScores: {
          requirement: s.scoreRequirements || 90,
          codeQuality: s.scoreCodeQuality || 88,
          security: s.scoreSecurity || 92,
          testing: s.scoreRuntime || 90,
          documentation: 85,
          uiUx: 88,
        },
        metrics: {
          linesOfCode: 4520,
          cyclomaticComplexity: 12,
          testCoverage: 88,
          buildTimeSec: 14,
          vulnerabilitiesCount: s._count?.findings || 1,
        },
        frameworks: ['React', 'Express', 'Prisma', 'TailwindCSS'],
        dependencies: [],
        readmePreview: s.description,
        projectStructure: [],
        runtimeLogs: [],
        exitCode: 0,
        buildStatus: 'SUCCESS',
        executionTime: '42ms',
      }));
    } catch (err) {
      console.warn('Backend unavailable, using INITIAL_SUBMISSIONS fallback:', err);
      return INITIAL_SUBMISSIONS;
    }
  },

  getById: async (id: string) => {
    try {
      const res = await apiFetch<{ submission: any }>(`/submissions/${id}`);
      return res.submission;
    } catch (err) {
      return INITIAL_SUBMISSIONS.find((s) => s.id === id) || null;
    }
  },

  create: async (data: any) => {
    return apiFetch('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ====================================================
// EVALUATIONS & FINDINGS API
// ====================================================
export const evaluationApi = {
  triggerReevaluate: async (id: string) => {
    return apiFetch(`/evaluations/${id}/re-evaluate`, { method: 'POST' });
  },

  getFindings: async (submissionId?: string): Promise<Finding[]> => {
    try {
      const res = await apiFetch<{ findings: any[] }>(`/evaluations/${submissionId}/security-report`);
      return res.findings.map((f, idx) => ({
        id: f.id,
        code: `FND-00${idx + 1}`,
        severity: f.severity,
        category: f.category || 'Security',
        teamId: 'team-1',
        teamName: 'CyberPulse',
        problemId: 'prob-1',
        problemTitle: 'Fraud Engine',
        title: f.title,
        description: f.description,
        evidence: f.location || 'src/server.ts',
        affectedFile: f.location || 'src/server.ts',
        recommendation: f.recommendation,
        status: f.status === 'OPEN' ? 'OPEN' : 'MITIGATED',
      }));
    } catch (err) {
      return INITIAL_FINDINGS;
    }
  },
};

// ====================================================
// JUDGE API
// ====================================================
export const judgeApi = {
  submitEvaluation: async (submissionId: string, scores: any, feedback: string) => {
    return apiFetch('/judge/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        submissionId,
        scoreInnovation: scores.innovation || 90,
        scoreExecution: scores.execution || 90,
        scorePresentation: scores.presentation || 90,
        scoreOverall: Math.round(((scores.innovation || 90) + (scores.execution || 90) + (scores.presentation || 90)) / 3),
        feedback,
      }),
    });
  },
};

// ====================================================
// LEADERBOARD & DASHBOARD STATS API
// ====================================================
export const leaderboardApi = {
  getLeaderboard: async () => {
    try {
      return await apiFetch<{ leaderboard: any[] }>('/leaderboard');
    } catch (err) {
      return [];
    }
  },

  getDashboardStats: async () => {
    try {
      return await apiFetch<{ stats: any; recentSubmissions: any[] }>('/leaderboard/dashboard-stats');
    } catch (err) {
      return null;
    }
  },
};
