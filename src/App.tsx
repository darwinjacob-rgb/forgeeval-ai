import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { AppShell } from './components/AppShell';
import { DashboardView } from './components/DashboardView';
import { ProblemsView } from './components/ProblemsView';
import { CreateProblemView } from './components/CreateProblemView';
import { SubmissionManagement } from './components/SubmissionManagement';
import { SubmissionDetail } from './components/SubmissionDetail';
import { AIAnalysisView } from './components/AIAnalysisView';
import { RequirementMappingView } from './components/RequirementMappingView';
import { CodeIntelligenceView } from './components/CodeIntelligenceView';
import { SecurityAnalysisView } from './components/SecurityAnalysisView';
import { RuntimeTestingView } from './components/RuntimeTestingView';
import { FindingsCenter } from './components/FindingsCenter';
import { JudgeWorkspace } from './components/JudgeWorkspace';
import { ResultsView } from './components/ResultsView';
import { LeaderboardView } from './components/LeaderboardView';
import { SettingsView, ProfileView } from './components/SettingsView';

import { INITIAL_PROBLEMS, INITIAL_SUBMISSIONS, INITIAL_REQUIREMENTS, INITIAL_FINDINGS } from './mockData';
import { Problem, Submission, Finding, RequirementItem, JudgeEvaluation } from './types';
import { problemsApi, submissionsApi, evaluationApi, judgeApi } from './services/api';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Core Data States
  const [problems, setProblems] = useState<Problem[]>(INITIAL_PROBLEMS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [requirements, setRequirements] = useState<RequirementItem[]>(INITIAL_REQUIREMENTS);
  const [findings, setFindings] = useState<Finding[]>(INITIAL_FINDINGS);

  // Active selection
  const [selectedSubId, setSelectedSubId] = useState<string>('sub-101');
  const [selectedProbId, setSelectedProbId] = useState<string>('prob-01');

  // Load backend data on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [fetchedProblems, fetchedSubmissions] = await Promise.all([
          problemsApi.getAll(),
          submissionsApi.getAll(),
        ]);
        if (fetchedProblems && fetchedProblems.length > 0) {
          setProblems(fetchedProblems);
        }
        if (fetchedSubmissions && fetchedSubmissions.length > 0) {
          setSubmissions(fetchedSubmissions);
        }
      } catch (err) {
        console.log('Using initial mock dataset');
      }
    }
    loadBackendData();
  }, []);

  const activeSubmission = submissions.find(s => s.id === selectedSubId) || submissions[0];
  const activeProblem = problems.find(p => p.id === (activeSubmission?.problemId || selectedProbId)) || problems[0];

  // Actions
  const handleSelectSubmission = (id: string) => {
    setSelectedSubId(id);
  };

  const handleCreateProblem = (newProb: Problem) => {
    setProblems(prev => [newProb, ...prev]);
    setCurrentView('problems');
  };

  const handleSaveEvaluation = (evaluation: JudgeEvaluation) => {
    setSubmissions(prev => prev.map(s => {
      if (s.id === evaluation.submissionId) {
        return {
          ...s,
          criteriaScores: {
            requirement: evaluation.scores.requirementCompliance,
            codeQuality: evaluation.scores.codeQuality,
            security: evaluation.scores.security,
            testing: evaluation.scores.testing,
            documentation: evaluation.scores.documentation,
            uiUx: evaluation.scores.uiUx
          },
          status: 'ANALYZED'
        };
      }
      return s;
    }));
  };

  const handleTriggerAnalyze = (probId: string) => {
    setSelectedProbId(probId);
    setCurrentView('analysis');
  };

  // View Routing Logic
  if (currentView === 'landing') {
    return (
      <LandingPage
        onNavigate={(view) => setCurrentView(view)}
        onOpenAnalysis={(subId) => {
          if (subId) setSelectedSubId(subId);
          setCurrentView('analysis');
        }}
      />
    );
  }

  if (currentView === 'login') {
    return (
      <AuthScreen
        mode="login"
        onNavigate={(view) => setCurrentView(view)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <AuthScreen
        mode="register"
        onNavigate={(view) => setCurrentView(view)}
        onSuccess={() => {
          setIsAuthenticated(true);
          setCurrentView('dashboard');
        }}
      />
    );
  }

  // Admin & App Views inside AppShell
  return (
    <AppShell
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
      onLogout={() => {
        setIsAuthenticated(false);
        setCurrentView('landing');
      }}
      activeSubmissionName={activeSubmission.team}
    >
      {currentView === 'dashboard' && (
        <DashboardView
          problems={problems}
          submissions={submissions}
          findings={findings}
          onSelectSubmission={handleSelectSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'problems' && (
        <ProblemsView
          problems={problems}
          onSelectProblem={(prob) => setSelectedProbId(prob.id)}
          onNavigate={(view) => setCurrentView(view)}
          onTriggerAnalyze={handleTriggerAnalyze}
        />
      )}

      {currentView === 'create-problem' && (
        <CreateProblemView
          onCancel={() => setCurrentView('problems')}
          onCreate={handleCreateProblem}
        />
      )}

      {currentView === 'submissions' && (
        <SubmissionManagement
          submissions={submissions}
          problems={problems}
          onSelectSubmission={handleSelectSubmission}
          onNavigate={(view) => setCurrentView(view)}
          onRunBatchAnalysis={() => setCurrentView('analysis')}
        />
      )}

      {currentView === 'submission-detail' && (
        <SubmissionDetail
          submission={activeSubmission}
          problem={activeProblem}
          onNavigate={(view) => setCurrentView(view)}
          onRunAnalysis={(id) => {
            setSelectedSubId(id);
            setCurrentView('analysis');
          }}
        />
      )}

      {currentView === 'analysis' && (
        <AIAnalysisView
          submission={activeSubmission}
          requirements={requirements}
          findings={findings}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'requirements' && (
        <RequirementMappingView
          requirements={requirements}
          submission={activeSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'code-intel' && (
        <CodeIntelligenceView
          submission={activeSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'security' && (
        <SecurityAnalysisView
          findings={findings}
          submission={activeSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'runtime' && (
        <RuntimeTestingView
          submission={activeSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'findings' && (
        <FindingsCenter
          findings={findings}
          submissions={submissions}
          problems={problems}
          onSelectSubmission={handleSelectSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'judge-workspace' && (
        <JudgeWorkspace
          submission={activeSubmission}
          requirements={requirements}
          onSaveEvaluation={handleSaveEvaluation}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'results' && (
        <ResultsView
          submissions={submissions}
          problems={problems}
          onSelectSubmission={handleSelectSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'leaderboard' && (
        <LeaderboardView
          submissions={submissions}
          problems={problems}
          onSelectSubmission={handleSelectSubmission}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'settings' && (
        <SettingsView onNavigate={(view) => setCurrentView(view)} />
      )}

      {currentView === 'profile' && (
        <ProfileView onNavigate={(view) => setCurrentView(view)} />
      )}
    </AppShell>
  );
}
