import { FinanceDataState, FinancialRunwayInfo } from '../types/finance.js';

export interface CalculatedRunway extends FinancialRunwayInfo {
  unlockedExtraDays: number;
  depletionFormatted: string;
  monthlyDiscretionaryBurn: number;
  monthlyEssentialBurn: number;
  survivalPercentage: number;
}

/**
 * Deterministic financial runway and survival days calculator
 */
export function calculateFinancialRunway(
  state: FinanceDataState,
  options?: {
    includeSavings?: boolean;
    discretionaryReductionPct?: number;
  }
): CalculatedRunway {
  const monthlyExpenses = state.summary?.monthlyExpenses || 2735.95;
  const liquidBalance = state.summary?.totalBalance || 18134.55;
  const savingsTotal = (state.savingsGoals || []).reduce((acc, g) => acc + (g.currentAmount || 0), 0);

  // Essential fixed commitments: Housing budget + essential upcoming bills
  const housingBudget = state.budgets.find((b) => b.category === 'Housing')?.limit || 2100;
  const essentialBills = (state.upcomingBills || [])
    .filter((b) => b.isEssential !== false)
    .reduce((acc, b) => acc + (b.amount || 0), 0);
  const essentialMonthly = housingBudget + essentialBills;

  const discretionaryMonthly = Math.max(0, monthlyExpenses - essentialMonthly);
  const reduction = Math.min(100, Math.max(0, options?.discretionaryReductionPct || 0)) / 100;
  const adjustedDiscretionary = discretionaryMonthly * (1 - reduction);
  const adjustedMonthlyTotal = essentialMonthly + adjustedDiscretionary;

  const dailyBurnCurrent = Math.max(1, Math.round((monthlyExpenses / 30) * 100) / 100);
  const dailyBurnAdjusted = Math.max(1, Math.round((adjustedMonthlyTotal / 30) * 100) / 100);
  const dailyBurnEssential = Math.max(1, Math.round((essentialMonthly / 30) * 100) / 100);

  const includeSavings = options?.includeSavings ?? true;
  const activeReserves = includeSavings ? liquidBalance + savingsTotal : liquidBalance;

  const runwayDaysCurrent = Math.floor(liquidBalance / dailyBurnCurrent);
  const runwayDaysEssential = Math.floor(liquidBalance / dailyBurnEssential);
  const extendedRunwayDays = Math.floor(activeReserves / dailyBurnAdjusted);

  const baselineWithSavings = Math.floor(activeReserves / dailyBurnCurrent);
  const unlockedExtraDays = Math.max(0, extendedRunwayDays - baselineWithSavings);

  const targetDate = new Date(Date.now() + extendedRunwayDays * 24 * 60 * 60 * 1000);
  const depletionFormatted = targetDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  let status: 'critical' | 'cautious' | 'stable' | 'fortress' = 'stable';
  if (runwayDaysCurrent < 30) status = 'critical';
  else if (runwayDaysCurrent < 60) status = 'cautious';
  else if (runwayDaysCurrent < 120) status = 'stable';
  else status = 'fortress';

  // Survival percentage for gauge meter (180 days = 100%)
  const survivalPercentage = Math.min(100, Math.round((extendedRunwayDays / 180) * 100));

  return {
    dailyBurnCurrent,
    dailyBurnEssential,
    runwayDaysCurrent,
    runwayDaysEssential,
    extendedRunwayDays,
    liquidReserves: liquidBalance,
    totalReserves: liquidBalance + savingsTotal,
    essentialMonthlyBills: Math.round(essentialMonthly * 100) / 100,
    discretionaryMonthlyBudget: Math.round(discretionaryMonthly * 100) / 100,
    projectedDepletionDate: targetDate.toISOString().split('T')[0],
    depletionFormatted,
    status,
    unlockedExtraDays,
    monthlyDiscretionaryBurn: Math.round(discretionaryMonthly * 100) / 100,
    monthlyEssentialBurn: Math.round(essentialMonthly * 100) / 100,
    survivalPercentage,
  };
}
