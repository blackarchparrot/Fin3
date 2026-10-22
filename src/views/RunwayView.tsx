import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  Calendar,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Sliders,
  DollarSign,
  HeartPulse,
  Info,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';
import { FinanceDataState } from '../types/finance.js';
import { calculateFinancialRunway } from '../utils/runwayCalculator.js';

interface RunwayViewProps {
  financeState: FinanceDataState;
  currency: string;
  theme: 'dark' | 'light';
  onNavigateToAgent?: (prompt?: string) => void;
}

export const RunwayView: React.FC<RunwayViewProps> = ({
  financeState,
  currency,
  theme,
  onNavigateToAgent,
}) => {
  const [includeSavings, setIncludeSavings] = useState(true);
  const [reductionPct, setReductionPct] = useState(0);

  const runway = calculateFinancialRunway(financeState, {
    includeSavings,
    discretionaryReductionPct: reductionPct,
  });

  const isDark = theme === 'dark';

  const statusColors = {
    critical: {
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      bar: 'bg-rose-500',
      label: 'Critical Runway (<30 Days)',
    },
    cautious: {
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      bar: 'bg-amber-500',
      label: 'Cautious (30-60 Days)',
    },
    stable: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      bar: 'bg-blue-500',
      label: 'Stable (60-120 Days)',
    },
    fortress: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      bar: 'bg-emerald-500',
      label: 'Fortress Tier (>120 Days)',
    },
  }[runway.status];

  const presets = [
    { label: 'Current Pace', pct: 0 },
    { label: 'Trim 15%', pct: 15 },
    { label: 'Discipline 30%', pct: 30 },
    { label: 'Survival 50%', pct: 50 },
    { label: 'Essentials Only (100% Discretionary Cut)', pct: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Title & Runway Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Financial Runway & Survival Analysis
            </h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${statusColors.badge}`}
            >
              {statusColors.label}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Deterministic burn rate modeling calculating exact days of survival before liquidity exhaustion.
          </p>
        </div>

        <button
          onClick={() =>
            onNavigateToAgent &&
            onNavigateToAgent('How many days can I survive with my current spending and budget plan?')
          }
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask Copilot for Runway Strategy</span>
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Liquid Checking Runway */}
        <div
          className={`rounded-2xl p-5 border shadow-sm transition-all ${
            isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Checking Runway
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              {runway.runwayDaysCurrent}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>days</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Based on {currency}{runway.liquidReserves.toLocaleString('en-US', { minimumFractionDigits: 2 })} liquid checking
          </p>
        </div>

        {/* Extended Runway with Emergency Savings */}
        <div
          className={`rounded-2xl p-5 border shadow-sm transition-all ${
            isDark ? 'bg-[#0E1322] border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-white border-indigo-200 ring-1 ring-indigo-100'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Extended Survival
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-mono text-indigo-400`}>
              {runway.extendedRunwayDays}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>days</span>
            {runway.unlockedExtraDays > 0 && (
              <span className="text-[11px] font-bold text-emerald-400 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded">
                +{runway.unlockedExtraDays}d unlocked
              </span>
            )}
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Depletion Date: <strong className="text-indigo-300">{runway.depletionFormatted}</strong>
          </p>
        </div>

        {/* Daily Outflow Burn */}
        <div
          className={`rounded-2xl p-5 border shadow-sm transition-all ${
            isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Daily Burn Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              {currency}{runway.dailyBurnCurrent.toFixed(2)}
            </span>
            <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ day</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            In Survival Mode: {currency}{runway.dailyBurnEssential.toFixed(2)} / day
          </p>
        </div>

        {/* Essential vs Discretionary Split */}
        <div
          className={`rounded-2xl p-5 border shadow-sm transition-all ${
            isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Essential Cushion
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <HeartPulse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className={`text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} font-mono`}>
              {runway.runwayDaysEssential}
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>days</span>
          </div>
          <p className={`text-[11px] mt-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            If non-essential spending is reduced to 0
          </p>
        </div>
      </div>

      {/* Interactive Survival Simulator */}
      <div
        className={`rounded-2xl p-6 border shadow-lg space-y-5 ${
          isDark
            ? 'bg-gradient-to-br from-[#0F1424] to-[#0A0D18] border-indigo-500/30'
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-indigo-400" />
            <div>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Interactive Runway Extension Simulator
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Simulate cutting discretionary spending to calculate how many additional days of survival you unlock.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer self-start sm:self-auto text-xs font-semibold">
            <input
              type="checkbox"
              checked={includeSavings}
              onChange={(e) => setIncludeSavings(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500"
            />
            <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              Include Emergency Savings Goals ({currency}{(financeState.savingsGoals.reduce((a, b) => a + b.currentAmount, 0)).toLocaleString()})
            </span>
          </label>
        </div>

        {/* Reduction Presets */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Simulate Discretionary Cut: {reductionPct}%
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => {
              const active = reductionPct === p.pct;
              return (
                <button
                  key={p.pct}
                  onClick={() => setReductionPct(p.pct)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-102'
                      : isDark
                      ? 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider */}
        <div className="space-y-2 pt-2">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={reductionPct}
            onChange={(e) => setReductionPct(Number(e.target.value))}
            className="w-full accent-indigo-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-500">
            <span>0% (Current Spending)</span>
            <span>25% Trim</span>
            <span>50% Frugal</span>
            <span>75% Austere</span>
            <span>100% (Essential Commitments Only)</span>
          </div>
        </div>

        {/* Dynamic Simulation Outcome Callout */}
        <div
          className={`rounded-xl p-4 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            isDark ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-indigo-50/70 border-indigo-200'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-indigo-300' : 'text-indigo-900'}`}>
                Simulated Survival Forecast
              </span>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Cutting discretionary outflow by <strong>{reductionPct}%</strong> preserves{' '}
              <strong className="text-emerald-400">
                {currency}
                {Math.round(runway.monthlyDiscretionaryBurn * (reductionPct / 100)).toLocaleString()}/month
              </strong>
              , extending your survival runway to{' '}
              <strong className="text-indigo-400">{runway.extendedRunwayDays} days</strong> (through{' '}
              <strong>{runway.depletionFormatted}</strong>).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <p className={`text-[10px] uppercase font-mono tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Unlocked Buffer
              </p>
              <p className="text-xl font-bold font-mono text-emerald-400">
                +{runway.unlockedExtraDays} Days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Burn Comparison: Essential Commitments vs Discretionary Outlays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Fixed Essential Obligations */}
        <div
          className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
            isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Fixed Essential Commitments</span>
            </h4>
            <span className="text-xs font-bold font-mono text-emerald-400">
              {currency}{runway.essentialMonthlyBills.toLocaleString()} / mo
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Non-negotiable survival obligations (housing rent/mortgage, utilities, essential insurance) that cannot be paused.
          </p>

          <div className="space-y-2.5 pt-1">
            {financeState.upcomingBills
              .filter((b) => b.isEssential !== false)
              .map((bill) => (
                <div
                  key={bill.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{bill.name}</span>
                  <span className={`font-mono font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currency}{bill.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            <div
              className={`flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold ${
                isDark ? 'bg-indigo-950/20 border-indigo-900/40 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
              }`}
            >
              <span>Housing & Primary Residence Allocation</span>
              <span className="font-mono">
                {currency}
                {(financeState.budgets.find((b) => b.category === 'Housing')?.limit || 2100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Discretionary Adjustable Categories */}
        <div
          className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
            isDark ? 'bg-[#0E1322] border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Discretionary Flexible Outflows</span>
            </h4>
            <span className="text-xs font-bold font-mono text-amber-400">
              {currency}{runway.discretionaryMonthlyBudget.toLocaleString()} / mo
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Variable lifestyle expenses that can be throttled or paused during income disruptions to preserve checking runway.
          </p>

          <div className="space-y-2.5 pt-1">
            {financeState.budgets
              .filter((b) => b.category !== 'Housing')
              .map((budget) => {
                const effectiveTrim = Math.round(budget.limit * (reductionPct / 100));
                return (
                  <div
                    key={budget.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                      isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                        {budget.category}
                      </span>
                      {reductionPct > 0 && (
                        <span className="ml-2 text-[10px] text-emerald-400 font-mono">
                          (-{currency}{effectiveTrim})
                        </span>
                      )}
                    </div>
                    <div className="text-right font-mono">
                      <span className={reductionPct > 0 ? 'line-through text-slate-500 mr-1.5' : isDark ? 'text-white' : 'text-slate-900'}>
                        {currency}{budget.limit.toFixed(2)}
                      </span>
                      {reductionPct > 0 && (
                        <span className="font-bold text-emerald-400">
                          {currency}{(budget.limit - effectiveTrim).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
