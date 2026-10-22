import React, { useState } from 'react';
import { Menu, Plus, Sparkles, User, Bell, CheckCircle2, AlertCircle, BookOpen, Sun, Moon } from 'lucide-react';
import { NavTab } from './Sidebar.js';
import { AIProviderStatus } from '../types/finance.js';

interface HeaderProps {
  activeTab: NavTab;
  onOpenMobileNav: () => void;
  onOpenTransactionModal: () => void;
  onNavigateToAgent: () => void;
  onOpenOnboarding: () => void;
  unpaidBillsCount: number;
  pendingProposalsCount: number;
  providerStatus: AIProviderStatus | null;
  currency: string;
  onToggleCurrency: (c: string) => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenMobileNav,
  onOpenTransactionModal,
  onNavigateToAgent,
  onOpenOnboarding,
  unpaidBillsCount,
  pendingProposalsCount,
  providerStatus,
  currency,
  onToggleCurrency,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [imageError, setImageError] = useState(false);
  const isDark = theme === 'dark';

  const tabLabels: Record<NavTab, string> = {
    workflow: 'Autonomous Loop: Plan → Act → Verify → Recover',
    overview: 'Financial Overview',
    runway: 'Financial Runway & Survival Analysis',
    transactions: 'Transaction Ledger',
    budgets: 'Budgets & Spending Limits',
    savings: 'Savings Goals & Accelerators',
    bills: 'Upcoming Recurring Bills',
    agent: 'FinPilot AI Autonomous Copilot',
  };

  return (
    <header className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b px-4 md:px-8 backdrop-blur-md transition-colors ${
      isDark
        ? 'border-slate-800/80 bg-[#0B0F19]/90'
        : 'border-slate-200 bg-white/90 shadow-xs'
    }`}>
      {/* Left zone: Mobile toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileNav}
          className={`rounded-lg p-1.5 transition-colors md:hidden ${
            isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs md:text-sm">
          <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>FinPilot AI</span>
          <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
          <span className={`font-semibold truncate max-w-[140px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {tabLabels[activeTab]}
          </span>
        </div>
      </div>

      {/* Right zone: Provider badge, Actions & User Avatar */}
      <div className="flex items-center gap-2 md:gap-3.5">
        {/* Sun/Moon Theme Switcher */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`flex items-center justify-center p-1.5 rounded-lg border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900/90 text-amber-400 hover:bg-slate-800 hover:text-amber-300 shadow-xs'
                : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-indigo-600 shadow-xs'
            }`}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        )}

        {/* Currency Switcher */}
        <div className={`flex items-center rounded-lg border p-0.5 text-[11px] font-mono ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => onToggleCurrency('৳')}
            className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
              currency === '৳'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Bangladeshi Taka (BDT)"
          >
            ৳ BDT
          </button>
          <button
            onClick={() => onToggleCurrency('$')}
            className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
              currency === '$'
                ? 'bg-indigo-600 text-white shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="US Dollar (USD)"
          >
            $ USD
          </button>
        </div>

        {/* Provider Status Badge */}
        {providerStatus && (
          <div
            title={providerStatus.description}
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium border ${
              providerStatus.provider === 'openrouter'
                ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                providerStatus.provider === 'openrouter' ? 'bg-indigo-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="font-mono text-[10px]">
              {providerStatus.provider === 'openrouter'
                ? `OpenRouter (${providerStatus.model})`
                : 'Demo Engine (Offline-Safe)'}
            </span>
          </div>
        )}

        {/* Pending Approval notification pill */}
        {pendingProposalsCount > 0 && (
          <button
            onClick={onNavigateToAgent}
            className="flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-semibold text-amber-300 animate-pulse"
            title={`${pendingProposalsCount} action(s) awaiting your confirmation`}
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px]">{pendingProposalsCount} Awaiting Approval</span>
          </button>
        )}

        {/* FinTech 2026 Guide & Demo Scenario */}
        <button
          onClick={onOpenOnboarding}
          className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20 shadow-xs"
          title="FinTech 2026 Hackathon Demo Guide & Scenario Walkthrough"
        >
          <BookOpen className="h-3.5 w-3.5 text-purple-400" />
          <span className="hidden sm:inline">Demo Guide</span>
        </button>

        {/* Ask AI Copilot quick button */}
        <button
          onClick={onNavigateToAgent}
          className="hidden md:flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Ask FinPilot</span>
        </button>

        {/* Add Transaction primary action */}
        <button
          onClick={onOpenTransactionModal}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden xs:inline">Log Transaction</span>
          <span className="xs:hidden">Add</span>
        </button>

        {/* Notifications badge for upcoming bills */}
        <div
          className={`relative p-1.5 cursor-pointer transition-colors ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
          title={`${unpaidBillsCount} upcoming bills scheduled`}
        >
          <Bell className="h-4 w-4" />
          {unpaidBillsCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-amber-400" />
          )}
        </div>

        {/* User Profile Avatar */}
        <div className={`flex items-center gap-2 pl-2 border-l ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className={`relative h-8 w-8 rounded-full overflow-hidden border shrink-0 ${
            isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-slate-100'
          }`}>
            {!imageError ? (
              <img
                src="/src/assets/images/finpilot_user_avatar_1792197114384.jpg"
                alt="Alex Vance"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-indigo-950 text-indigo-300 font-semibold text-xs">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
          <div className="hidden xl:block text-left">
            <p className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Alex Vance</p>
            <p className="text-[10px] text-slate-400">Principal</p>
          </div>
        </div>
      </div>
    </header>
  );
};
