import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  FileCode, 
  Cpu, 
  Terminal,
  Trophy,
  Medal,
  ChevronRight
} from 'lucide-react';
import { Submission, Problem } from '../types';
import { Card, Badge, Button, Input } from './CommonUI';

interface LeaderboardViewProps {
  submissions: Submission[];
  problems: Problem[];
  onSelectSubmission: (id: string) => void;
  onNavigate: (view: string) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  submissions,
  problems,
  onSelectSubmission,
  onNavigate
}) => {
  const [selectedProblem, setSelectedProblem] = useState<string>('ALL');

  // Filter and sort by overall score descending
  const filtered = (selectedProblem === 'ALL'
    ? [...submissions]
    : submissions.filter(s => s.problemId === selectedProblem)
  ).sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#292D32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#FF6A1A]" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF8A3D]">RANKING BENCHMARK</span>
          </div>
          <h1 className="text-2xl font-bold font-mono text-[#F5F5F2] uppercase">
            Global Hackathon Leaderboard
          </h1>
          <p className="text-xs font-mono text-[#92979D]">
            Empirical multi-dimensional ranking table sorted by weighted evaluation criteria.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => onNavigate('judge-workspace')}
        >
          ENTER JUDGE DESK
        </Button>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        {filtered.slice(0, 3).map((sub, index) => {
          const rankColors = [
            'border-[#FF6A1A] bg-[#FF6A1A]/5',
            'border-[#F5F5F2]/40 bg-[#181B1F]',
            'border-[#FFB547]/40 bg-[#181B1F]'
          ];

          const medalIcons = [
            <Trophy key="1" className="w-6 h-6 text-[#FF6A1A]" />,
            <Medal key="2" className="w-6 h-6 text-[#F5F5F2]" />,
            <Medal key="3" className="w-6 h-6 text-[#FFB547]" />
          ];

          return (
            <Card key={sub.id} className={`${rankColors[index]} relative overflow-hidden`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-[#F5F5F2]">#{index + 1}</span>
                  {medalIcons[index]}
                </div>
                <div className="text-2xl font-black text-[#FF6A1A]">{sub.overallScore.toFixed(1)}</div>
              </div>

              <h3 className="font-bold text-sm text-[#F5F5F2] truncate">{sub.team}</h3>
              <p className="text-[11px] text-[#92979D] truncate mt-0.5">{sub.problemTitle}</p>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#292D32] text-[10px]">
                <div>
                  <span className="text-[#92979D] block">REQUIREMENTS</span>
                  <span className="text-[#F5F5F2] font-bold">{sub.criteriaScores.requirement}/100</span>
                </div>
                <div>
                  <span className="text-[#92979D] block">SECURITY</span>
                  <span className="text-[#45D483] font-bold">{sub.criteriaScores.security}/100</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Track Filter */}
      <div className="flex items-center gap-3 bg-[#111316] p-3 rounded-xl border border-[#292D32] font-mono text-xs">
        <span className="text-[#92979D] uppercase">Filter Track:</span>
        <select
          value={selectedProblem}
          onChange={(e) => setSelectedProblem(e.target.value)}
          className="bg-[#181B1F] text-[#F5F5F2] border border-[#292D32] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#FF6A1A]"
        >
          <option value="ALL">All Problems ({submissions.length} Submissions)</option>
          {problems.map(p => (
            <option key={p.id} value={p.id}>{p.code}: {p.title.slice(0, 35)}...</option>
          ))}
        </select>
      </div>

      {/* Main Ranking Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#292D32] text-[#92979D]">
                <th className="pb-3 uppercase">Rank</th>
                <th className="pb-3 uppercase">Team / Project</th>
                <th className="pb-3 uppercase">Problem</th>
                <th className="pb-3 uppercase text-center">Req (25%)</th>
                <th className="pb-3 uppercase text-center">Code (20%)</th>
                <th className="pb-3 uppercase text-center">Sec (20%)</th>
                <th className="pb-3 uppercase text-center">Test (15%)</th>
                <th className="pb-3 uppercase text-center">Doc (10%)</th>
                <th className="pb-3 uppercase text-center">UI/UX (10%)</th>
                <th className="pb-3 uppercase text-right">Composite</th>
                <th className="pb-3 uppercase text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2227]">
              {filtered.map((sub, idx) => (
                <tr key={sub.id} className="hover:bg-[#181B1F]/60 transition-colors">
                  {/* Rank */}
                  <td className="py-3.5 pr-2">
                    <span className={`font-black text-sm ${idx === 0 ? 'text-[#FF6A1A]' : idx === 1 ? 'text-[#F5F5F2]' : idx === 2 ? 'text-[#FFB547]' : 'text-[#92979D]'}`}>
                      #{idx + 1}
                    </span>
                  </td>

                  {/* Team */}
                  <td className="py-3.5 pr-2">
                    <div className="font-bold text-[#F5F5F2]">{sub.team}</div>
                    <div className="text-[10px] text-[#92979D]">{sub.language}</div>
                  </td>

                  {/* Problem */}
                  <td className="py-3.5 pr-2 max-w-[150px]">
                    <div className="text-[#92979D] truncate">{sub.problemTitle}</div>
                  </td>

                  {/* Dimensions */}
                  <td className="py-3.5 text-center text-[#F5F5F2]">{sub.criteriaScores.requirement}</td>
                  <td className="py-3.5 text-center text-[#F5F5F2]">{sub.criteriaScores.codeQuality}</td>
                  <td className="py-3.5 text-center text-[#45D483]">{sub.criteriaScores.security}</td>
                  <td className="py-3.5 text-center text-[#F5F5F2]">{sub.criteriaScores.testing}</td>
                  <td className="py-3.5 text-center text-[#F5F5F2]">{sub.criteriaScores.documentation}</td>
                  <td className="py-3.5 text-center text-[#F5F5F2]">{sub.criteriaScores.uiUx}</td>

                  {/* Final Score */}
                  <td className="py-3.5 text-right pr-2">
                    <span className={`text-sm font-black ${sub.overallScore > 85 ? 'text-[#45D483]' : sub.overallScore > 70 ? 'text-[#FFB547]' : 'text-[#FF5C5C]'}`}>
                      {sub.overallScore.toFixed(1)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onSelectSubmission(sub.id);
                        onNavigate('submission-detail');
                      }}
                    >
                      DOSSIER
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
