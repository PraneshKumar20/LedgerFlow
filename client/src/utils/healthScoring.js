/**
 * Financial Health Scoring Engine & Grade Rules:
 * - Above 80%: Green (Grade A+ / A)
 * - Above 60% and below 80% (60% - 80%): Yellow (Grade B)
 * - Below 60%: Red (Grade C / D)
 */

export function calculateFinancialHealth({
  totalIncome = 0,
  totalExpense = 0,
  budgetLimit = 0,
  expenses = []
}) {
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

  const score = Math.min(100, Math.max(10, Math.round(savingsScore + budgetScore + stabilityScore + recurringScore)))

  const tier = getGradeFromScore(score)

  return {
    score,
    ...tier,
    savingsRate,
    savingsScore,
    budgetUsage,
    budgetScore,
    hasSurplus,
    stabilityScore,
    recurringExpense,
    recurringRatio,
    recurringScore
  }
}

/**
 * Maps score to Grade & Color according to user-defined rules:
 * - > 80: Green
 * - 60 - 80: Yellow
 * - < 60: Red
 */
export function getGradeFromScore(score = 85) {
  if (score > 80) {
    return {
      score,
      grade: "A+",
      colorKey: "green",
      sidebarBadge: "bg-emerald-950/80 border-emerald-800/60 text-emerald-400",
      sidebarActiveBadge: "bg-emerald-950/90 border-emerald-400/50 text-emerald-300 shadow-sm",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]",
      barGradient: "bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.5)]",
      dotColor: "bg-emerald-400",
      textColor: "text-emerald-400",
      title: "Exceptional Financial Standing",
      desc: "Outstanding savings velocity and cashflow resilience. You're in the top financial health bracket.",
      statusText: "Optimal Tier"
    }
  }
  if (score >= 60) {
    return {
      score,
      grade: "B",
      colorKey: "yellow",
      sidebarBadge: "bg-amber-950/80 border-amber-800/60 text-amber-400",
      sidebarActiveBadge: "bg-amber-950/90 border-amber-400/50 text-amber-300 shadow-sm",
      badgeClass: "bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]",
      barGradient: "bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.5)]",
      dotColor: "bg-amber-400",
      textColor: "text-amber-400",
      title: "Moderate Financial Resilience",
      desc: "Budget headroom is tightening. Consider trimming discretionary spend to strengthen savings buffer.",
      statusText: "Fair Tier"
    }
  }
  return {
    score,
    grade: "C",
    colorKey: "red",
    sidebarBadge: "bg-rose-950/80 border-rose-800/60 text-rose-400",
    sidebarActiveBadge: "bg-rose-950/90 border-rose-400/50 text-rose-300 shadow-sm",
    badgeClass: "bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]",
    barGradient: "bg-gradient-to-r from-rose-600 via-red-500 to-rose-400 shadow-[0_0_14px_rgba(244,63,94,0.5)]",
    dotColor: "bg-rose-400",
    textColor: "text-rose-400",
    title: "High Financial Burn Rate",
    desc: "Expenses exceed recommended thresholds. Audit high recurring burdens and establish budget limits.",
    statusText: "Critical Tier"
  }
}

/**
 * Returns badge styling for sidebar nav based on grade or score string/number.
 */
export function getGradeBadgeStyle(gradeOrScore = "A+", isActive = false, scoreVal = null) {
  let colorKey = "green"
  let gradeText = "A+"

  const num = typeof scoreVal === "number" ? scoreVal : typeof gradeOrScore === "number" ? gradeOrScore : null

  if (num !== null) {
    if (num > 80) {
      colorKey = "green"
      gradeText = "A+"
    } else if (num >= 60) {
      colorKey = "yellow"
      gradeText = "B"
    } else {
      colorKey = "red"
      gradeText = "C"
    }
  } else if (typeof gradeOrScore === "string") {
    const g = gradeOrScore.toUpperCase().trim()
    if (g.startsWith("A")) {
      colorKey = "green"
      gradeText = g
    } else if (g.startsWith("B")) {
      colorKey = "yellow"
      gradeText = g
    } else {
      colorKey = "red"
      gradeText = g
    }
  }

  if (colorKey === "green") {
    return {
      gradeText,
      badgeClass: isActive
        ? "bg-emerald-950/90 border border-emerald-400/50 text-emerald-300 shadow-sm"
        : "bg-emerald-950/80 border border-emerald-800/60 text-emerald-400"
    }
  }
  if (colorKey === "yellow") {
    return {
      gradeText,
      badgeClass: isActive
        ? "bg-amber-950/90 border border-amber-400/50 text-amber-300 shadow-sm"
        : "bg-amber-950/80 border border-amber-800/60 text-amber-400"
    }
  }
  return {
    gradeText,
    badgeClass: isActive
      ? "bg-rose-950/90 border border-rose-400/50 text-rose-300 shadow-sm"
      : "bg-rose-950/80 border border-rose-800/60 text-rose-400"
  }
}
