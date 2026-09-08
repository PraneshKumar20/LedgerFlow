import { useMemo } from "react"
import { formatNumber } from "../../utils/formatUtils"
import { Award, Sparkles } from "lucide-react"
import AnimatedCounter from "../ui/AnimatedCounter"

export default function FinancialHealthCard({ 
  totalIncome, 
  totalExpense, 
  budgetLimit, 
  expenses = [], 
  currencySymbol = "₹" 
}) {
  // --- Intelligent Scoring Engine ---
  const { 
    totalScore, 
    grade, 
    statusBg,
    pillars, 
    recommendations 
  } = useMemo(() => {
    // 1. Savings Pillar (0 - 35 points)
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0
    let savingsScore = 0
    if (savingsRate >= 30) savingsScore = 35
    else if (savingsRate >= 20) savingsScore = 28
    else if (savingsRate >= 10) savingsScore = 20
    else if (savingsRate > 0) savingsScore = 12
    else savingsScore = 5

    // 2. Budget Adherence Pillar (0 - 30 points)
    const budgetUsage = budgetLimit > 0 ? (totalExpense / budgetLimit) * 100 : 100
    let budgetScore = 0
    if (budgetUsage <= 60) budgetScore = 30
    else if (budgetUsage <= 75) budgetScore = 25
    else if (budgetUsage <= 90) budgetScore = 18
    else if (budgetUsage <= 100) budgetScore = 10
    else budgetScore = 3

    // 3. Cashflow Stability Pillar (0 - 20 points)
    const hasSurplus = totalIncome > totalExpense
    const bufferRatio = totalIncome > 0 ? (totalIncome - totalExpense) / totalIncome : 0
    let stabilityScore = 0
    if (hasSurplus && bufferRatio >= 0.25) stabilityScore = 20
    else if (hasSurplus) stabilityScore = 14
    else if (totalIncome === 0 && totalExpense === 0) stabilityScore = 10
    else stabilityScore = 4

    // 4. Fixed & Recurring Burden Pillar (0 - 15 points)
    const recurringExpense = Array.isArray(expenses)
      ? expenses.filter(e => e.isRecurring && e.type === 'expense').reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
      : 0
    const recurringRatio = totalExpense > 0 ? (recurringExpense / totalExpense) * 100 : 0
    let recurringScore = 0
    if (recurringRatio <= 20) recurringScore = 15
    else if (recurringRatio <= 35) recurringScore = 11
    else if (recurringRatio <= 50) recurringScore = 7
    else recurringScore = 3

    const finalScore = Math.min(100, Math.max(10, Math.round(savingsScore + budgetScore + stabilityScore + recurringScore)))

    // Grade & Tiering
    let gradeLabel = "A+"
    let bg = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"

    if (finalScore >= 85) {
      gradeLabel = "A+"
      bg = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
    } else if (finalScore >= 70) {
      gradeLabel = "B+"
      bg = "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
    } else if (finalScore >= 50) {
      gradeLabel = "C"
      bg = "bg-amber-500/10 border-amber-500/20 text-amber-400"
    } else {
      gradeLabel = "D"
      bg = "bg-rose-500/10 border-rose-500/20 text-rose-400"
    }

    const netSurplus = Math.max(0, totalIncome - totalExpense)

    // Pillars Breakdown matching Category Budgets structure & color palette
    const pillarList = [
      {
        name: "Savings Ratio",
        scoreValue: totalIncome > 0 
          ? `${currencySymbol}${formatNumber(netSurplus, currencySymbol, 0, 0)}` 
          : `${savingsScore} pts`,
        targetValue: totalIncome > 0 
          ? `of ${currencySymbol}${formatNumber(totalIncome, currencySymbol, 0, 0)}` 
          : `of 35 max`,
        percent: Math.min(100, Math.max(0, savingsRate || (savingsScore / 35) * 100)),
        detail: `${savingsRate.toFixed(0)}% retained`,
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        barColor: "bg-emerald-500",
        statusLabel: savingsScore >= 28 ? "Optimal" : "Pacing",
        statusTextClass: savingsScore >= 28 ? "text-emerald-400" : "text-amber-400"
      },
      {
        name: "Budget Buffer",
        scoreValue: budgetLimit > 0 
          ? `${currencySymbol}${formatNumber(totalExpense, currencySymbol, 0, 0)}` 
          : `${budgetScore} pts`,
        targetValue: budgetLimit > 0 
          ? `of ${currencySymbol}${formatNumber(budgetLimit, currencySymbol, 0, 0)}` 
          : `of 30 max`,
        percent: Math.min(100, Math.max(0, budgetUsage)),
        detail: `${Math.max(0, Math.round(100 - budgetUsage))}% headroom`,
        badgeClass: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        barColor: budgetScore >= 25 ? "bg-sky-500" : budgetScore >= 18 ? "bg-amber-500" : "bg-rose-500",
        statusLabel: budgetScore >= 25 ? "Safe Limit" : budgetScore >= 18 ? "Moderate" : "Tight",
        statusTextClass: budgetScore >= 25 ? "text-sky-400" : budgetScore >= 18 ? "text-amber-400" : "text-rose-400"
      },
      {
        name: "Cashflow Buffer",
        scoreValue: totalIncome > 0 || totalExpense > 0 
          ? `${currencySymbol}${formatNumber(Math.abs(totalIncome - totalExpense), currencySymbol, 0, 0)}` 
          : `${stabilityScore} pts`,
        targetValue: totalIncome > 0 || totalExpense > 0 
          ? `net ${totalIncome >= totalExpense ? "surplus" : "deficit"}` 
          : `of 20 max`,
        percent: Math.min(100, Math.max(10, (stabilityScore / 20) * 100)),
        detail: hasSurplus ? "Cashflow Positive" : "Deficit Warning",
        badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        barColor: "bg-indigo-500",
        statusLabel: hasSurplus ? "Stable" : "Deficit",
        statusTextClass: hasSurplus ? "text-emerald-400" : "text-rose-400"
      },
      {
        name: "Fixed Burden",
        scoreValue: `${currencySymbol}${formatNumber(recurringExpense, currencySymbol, 0, 0)}`,
        targetValue: `of ${currencySymbol}${formatNumber(totalExpense, currencySymbol, 0, 0)}`,
        percent: Math.min(100, Math.max(0, recurringRatio)),
        detail: `${recurringRatio.toFixed(0)}% recurring`,
        badgeClass: recurringScore >= 11 ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
        barColor: recurringScore >= 11 ? "bg-purple-500" : "bg-amber-500",
        statusLabel: recurringScore >= 11 ? "Low Burden" : "High Burn",
        statusTextClass: recurringScore >= 11 ? "text-purple-400" : "text-amber-400"
      }
    ]

    // Actionable Recommendations matching Savings Goals style
    const recs = []
    if (recurringRatio > 35) {
      recs.push({
        title: "Audit Subscriptions",
        category: "Recurring Liabilities",
        desc: "Fixed recurring charges take up more than 35% of outflows. Audit unused subscriptions in Bill Radar.",
        potentialSaving: `${currencySymbol}30-80/mo`,
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        emoji: "📡",
        impact: "Lower Burn"
      })
    }
    if (budgetUsage > 85) {
      recs.push({
        title: "Pace Discretionary Spend",
        category: "Budget Threshold",
        desc: "You have utilized over 85% of your planned monthly budget limit. Consider limiting dining and shopping.",
        potentialSaving: `${currencySymbol}100-200`,
        badgeClass: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        emoji: "⚠️",
        impact: "Budget Safety"
      })
    }
    if (savingsRate >= 25) {
      recs.push({
        title: "High Savings Optimization",
        category: "Wealth Accelerator",
        desc: "Your savings rate exceeds the benchmark 20%. Allocate recurring surplus into dedicated savings targets.",
        potentialSaving: "Wealth Compounder",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        emoji: "💎",
        impact: "Growth"
      })
    } else {
      recs.push({
        title: "Boost Emergency Runway",
        category: "Capital Reserve",
        desc: "Aiming for a 20% savings target creates a comfortable living buffer against unexpected outlays.",
        potentialSaving: `${currencySymbol}150+/mo`,
        badgeClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        emoji: "🛡️",
        impact: "Security"
      })
    }

    return {
      totalScore: finalScore,
      grade: gradeLabel,
      statusBg: bg,
      pillars: pillarList,
      recommendations: recs.slice(0, 3)
    }
  }, [totalIncome, totalExpense, budgetLimit, expenses, currencySymbol])

  return (
    <div className="finance-card p-5 sm:p-6 lg:p-7 space-y-6 md:space-y-8">
      {/* Section Header (matching Category Budgets & Savings Goals header standard) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-[19px] font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            <span>4-Pillar Financial Health Audit</span>
          </h2>
          <p className="text-[13px] text-slate-400 font-medium mt-1">
            Algorithmic scoring across savings rate, budget adherence, cashflow buffer, and recurring burden
          </p>
        </div>

        {/* Health Score Summary Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Health Score:</span>
            <span className="text-white font-bold font-mono-nums">
              <AnimatedCounter value={totalScore} decimals={0} />
            </span>
            <span className="text-slate-500 font-mono-nums text-[11px]">/ 100</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${statusBg}`}>
              Grade {grade}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Recommendation Insight Bar */}
      {recommendations.length > 0 && (
        <div className="rounded-xl bg-slate-900/40 border border-slate-800/60 p-4 sm:p-5 lg:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/50">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Recommendation
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              {recommendations.length} insight{recommendations.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-5">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{rec.emoji}</span>
                    <h3 className="text-base font-semibold text-white">{rec.title}</h3>
                  </div>
                  <span className="inline-block self-start sm:self-auto text-[11px] font-medium text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded">
                    {rec.category}
                  </span>
                </div>
                
                <p className="text-sm text-slate-400 leading-relaxed max-w-3xl sm:pl-9">
                  {rec.desc}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-3 mt-1.5 border-t border-slate-800/40 sm:ml-9">
                  <span className="text-slate-500">
                    Impact: <span className="font-medium text-slate-300">{rec.impact}</span>
                  </span>
                  <span className="text-emerald-400 font-medium">
                    Active Advice
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 4 Health Pillars Grid (Secondary Supporting Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {pillars.map((pillar) => (
          <div
            key={pillar.name}
            className="p-4 sm:p-5 rounded-lg bg-slate-900/40 border border-slate-800/40 space-y-4"
          >
            {/* Row 1: Pillar name on left + Percentage on right */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-slate-300">
                {pillar.name}
              </span>
              <span className="text-[11px] font-mono-nums text-slate-500">
                {pillar.percent.toFixed(0)}%
              </span>
            </div>

            {/* Row 2: Primary value + secondary context */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[17px] font-semibold text-white font-mono-nums leading-tight">
                  {pillar.scoreValue}
                </span>
                <span className="text-[11px] text-slate-500">
                  {pillar.targetValue}
                </span>
              </div>

              {/* Row 3: Progress Bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${pillar.barColor}`}
                  style={{ width: `${pillar.percent}%` }}
                />
              </div>
            </div>

            {/* Row 4: Detail + Status */}
            <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-800/40 text-[11px]">
              <span className="text-slate-500">
                {pillar.detail}
              </span>
              <span className={`font-medium ${pillar.statusTextClass}`}>
                {pillar.statusLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
