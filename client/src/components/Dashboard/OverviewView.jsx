import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Layers, 
  AlertTriangle, 
  Activity, 
  PieChart as PieIcon, 
  ArrowRight, 
  Receipt,
  Repeat,
  Edit2,
  Trash2,
  ChevronRight
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import AnimatedCounter from "../ui/AnimatedCounter"
import { formatNumber, formatCompactNumber } from "../../utils/formatUtils"
import { getCategoryStyle } from "../../utils/categoryColors"



export default function OverviewView({
  balance,
  totalIncome,
  totalExpense,
  currSym = "₹",
  multiplier,
  incomeShare,
  budgetPercent,
  budgetLimit,
  setBudgetLimit,
  trendData,
  categoryData,
  totalCategoryExpense,
  activeCategoryIndex,
  setActiveCategoryIndex,
  displayExpenses,
  openEditModal,
  handleDeleteTransaction,
  setIsEnvelopeModalOpen,
  setActiveTab
}) {
  const recentTransactions = [...displayExpenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const formatYAxis = (value) => {
    if (value === 0) return '0'
    return `${currSym}${formatCompactNumber(value, currSym)}`
  }
  const CustomTooltip = ({ active, payload, label, currSym }) => {
    if (active && payload && payload.length) {
      const inc = payload.find(p => p.dataKey === 'income')?.value || 0
      const exp = payload.find(p => p.dataKey === 'expense')?.value || 0
      const net = inc - exp
      return (
        <div className="bg-[#0f1523] border border-slate-700 p-3 rounded-lg shadow-xl min-w-[160px]">
          <p className="text-slate-300 text-[11px] font-semibold uppercase tracking-wider mb-2">{label}</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4 text-[13px]">
              <span className="text-slate-400 font-medium">Income</span>
              <span className="text-emerald-400 font-mono-nums font-semibold">{currSym}{formatNumber(inc, currSym)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-[13px]">
              <span className="text-slate-400 font-medium">Expense</span>
              <span className="text-rose-400 font-mono-nums font-semibold">{currSym}{formatNumber(exp, currSym)}</span>
            </div>
            <div className="border-t border-slate-700/80 pt-1.5 mt-1.5 flex items-center justify-between gap-4 text-[13px]">
              <span className="text-slate-300 font-medium">Net</span>
              <span className={`font-mono-nums font-bold ${net >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {net < 0 ? '-' : '+'}{currSym}{formatNumber(Math.abs(net), currSym)}
              </span>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Financial Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
        
        {/* Total Net Balance Card */}
        <div className="lg:col-span-2 finance-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
              Total Net Balance
            </span>
            <div className="p-1 rounded bg-slate-800 text-slate-300">
              <Wallet className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-0.035em] font-mono-nums leading-none">
                <AnimatedCounter value={balance} prefix={currSym} />
              </div>
              <p className="text-[13px] sm:text-[14px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                Current net position across active accounts
              </p>
            </div>

            {/* Income vs Expense Ratio Split */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-mono-nums font-semibold tracking-wide">
                <span className="text-emerald-400">
                  Income: {incomeShare.toFixed(0)}%
                </span>
                <span className="text-rose-400">
                  Expense: {(100 - incomeShare).toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  style={{ width: `${incomeShare}%` }} 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                />
                <div 
                  style={{ width: `${100 - incomeShare}%` }} 
                  className="bg-rose-500 h-full transition-all duration-500" 
                />
              </div>
            </div>

            {/* Income & Expense Subtotals */}
            <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-slate-800">
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-[0.06em] flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Monthly Income
                </p>
                <p className="text-[20px] sm:text-[24px] font-semibold text-emerald-400 font-mono-nums mt-0.5 leading-tight">
                  <AnimatedCounter value={totalIncome} prefix={currSym} />
                </p>
              </div>
              <div className="pl-4 border-l border-slate-800">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-[0.06em] flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5 text-rose-400" /> Monthly Expenses
                </p>
                <p className="text-[20px] sm:text-[24px] font-semibold text-rose-400 font-mono-nums mt-0.5 leading-tight">
                  <AnimatedCounter value={totalExpense} prefix={currSym} />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Budget Usage Card - Clean, Balanced & Neat */}
        <div className="lg:col-span-2 finance-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
              Monthly Budget Usage
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEnvelopeModalOpen(true)}
                className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Layers className="h-3 w-3 text-blue-400" />
                <span>Envelopes</span>
              </button>
              <div className="p-1 rounded bg-slate-800 text-slate-300">
                <Target className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-[32px] sm:text-[40px] font-bold text-white tracking-[-0.035em] font-mono-nums leading-none">
                <AnimatedCounter value={budgetPercent} decimals={0} suffix="%" />
              </div>
              <p className="text-[13px] sm:text-[14px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                {currSym}{formatNumber(Math.round(totalExpense), currSym, 0, 0)} spent of {currSym}{formatNumber(Math.round(budgetLimit * multiplier), currSym, 0, 0)} monthly allowance
              </p>
            </div>

            {/* Budget Progress Bar & Status */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-semibold tracking-wide">
                <span className={budgetPercent > 90 ? "text-rose-400" : budgetPercent > 75 ? "text-amber-400" : "text-emerald-400"}>
                  {budgetPercent > 90 ? "Budget threshold exceeded" : budgetPercent > 75 ? "Approaching threshold" : "Within budget limit"}
                </span>
                <span className="text-slate-400 font-mono-nums">
                  {totalExpense <= budgetLimit * multiplier 
                    ? `${currSym}${formatNumber(Math.round((budgetLimit * multiplier) - totalExpense), currSym, 0, 0)} remaining`
                    : `${currSym}${formatNumber(Math.round(totalExpense - (budgetLimit * multiplier)), currSym, 0, 0)} over budget`}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  style={{ width: `${Math.min(100, budgetPercent)}%` }} 
                  className={`h-full transition-all duration-500 ${
                    budgetPercent > 90
                      ? "bg-rose-500"
                      : budgetPercent > 75
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`} 
                />
              </div>
            </div>

            {/* Subtotals & Target Control */}
            <div className="grid grid-cols-2 gap-4 pt-5 mt-2 border-t border-slate-800">
              <div>
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-[0.06em] flex items-center gap-1.5">
                  {totalExpense <= budgetLimit * multiplier ? (
                    <>
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" /> Remaining Buffer
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-rose-400" /> Budget Overrun
                    </>
                  )}
                </p>
                <p className={`text-[20px] sm:text-[24px] font-semibold font-mono-nums mt-0.5 leading-tight ${
                  totalExpense <= budgetLimit * multiplier ? "text-emerald-400" : "text-rose-400"
                }`}>
                  {totalExpense <= budgetLimit * multiplier ? "+" : "-"}
                  {currSym}{formatNumber(Math.round(Math.abs((budgetLimit * multiplier) - totalExpense)), currSym, 0, 0)}
                </p>
              </div>
              <div className="pl-4 border-l border-slate-800">
                <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-[0.06em] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-400" /> Monthly Limit
                  </span>
                  <button
                    onClick={() => setActiveTab("budgets")}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-normal lowercase tracking-normal flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    manage <ChevronRight className="h-2.5 w-2.5" />
                  </button>
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[20px] sm:text-[24px] font-semibold text-slate-300 font-mono-nums leading-tight">
                    {currSym}
                  </span>
                  <input
                    type="text"
                    value={formatNumber(Math.round(budgetLimit * multiplier), currSym, 0, 0)}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '')
                      setBudgetLimit((Number(val) || 0) / multiplier)
                    }}
                    className="w-28 bg-transparent text-[20px] sm:text-[24px] font-semibold text-white font-mono-nums leading-tight outline-none focus:text-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cashflow Velocity & Expense Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8">
        {/* 7-Day Cashflow Velocity */}
        <div className="lg:col-span-2 finance-card p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-800 text-blue-400">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                7-Day Cashflow Velocity
              </span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-medium">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-400">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-slate-400">Expense</span>
              </div>
            </div>
          </div>

          <div className="h-[220px] sm:h-[240px] pt-6 pb-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  content={<CustomTooltip currSym={currSym} />}
                />
                <Bar 
                  dataKey="income" 
                  fill="#10b981" 
                  radius={[3, 3, 0, 0]} 
                  name="Income" 
                  maxBarSize={28}
                  minPointSize={6} 
                />
                <Bar 
                  dataKey="expense" 
                  fill="#f43f5e" 
                  radius={[3, 3, 0, 0]} 
                  name="Expense" 
                  maxBarSize={28}
                  minPointSize={6} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Donut */}
        <div className="finance-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-slate-800 text-blue-400">
                <PieIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-semibold text-white tracking-tight">
                Spend Breakdown
              </span>
            </div>
          </div>

          {categoryData.length > 0 ? (
            <div className="flex flex-col justify-between flex-1 pt-2">
              <div className="relative w-full h-[220px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={46}
                      outerRadius={66}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="#0f1523"
                      strokeWidth={2}
                      onMouseEnter={(_, index) => setActiveCategoryIndex(index)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={getCategoryStyle(entry.name).base} 
                          opacity={activeCategoryIndex === null || activeCategoryIndex === index ? 1 : 0.4}
                          className="cursor-pointer transition-opacity"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Centered HUD */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {activeCategoryIndex !== null && categoryData[activeCategoryIndex] ? (
                    <div className="flex flex-col items-center justify-center text-center px-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 truncate max-w-[90px]">
                        {categoryData[activeCategoryIndex].name}
                      </span>
                      <span className="text-sm font-bold text-white font-mono leading-tight">
                        {currSym}{formatNumber(categoryData[activeCategoryIndex].value, currSym, 0, 0)}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {totalCategoryExpense > 0 ? ((categoryData[activeCategoryIndex].value / totalCategoryExpense) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center px-2">
                      <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        TOTAL SPENT
                      </span>
                      <span className="text-sm font-bold text-white font-mono leading-tight">
                        {currSym}{formatNumber(totalCategoryExpense, currSym, 0, 0)}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {categoryData.length} categories
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 pt-4 mt-4 border-t border-slate-800/80">
                {categoryData.slice(0, 5).map((cat, idx) => {
                  const color = getCategoryStyle(cat.name).base
                  const percent = totalCategoryExpense > 0 ? ((cat.value / totalCategoryExpense) * 100).toFixed(0) : 0
                  const isHovered = activeCategoryIndex === idx

                  return (
                    <button
                      key={cat.name}
                      onMouseEnter={() => setActiveCategoryIndex(idx)}
                      onMouseLeave={() => setActiveCategoryIndex(null)}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer ${
                        isHovered ? 'text-white' : 'text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-medium">{cat.name}</span>
                      <span className="font-mono opacity-60 ml-0.5">{percent}%</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500 py-10 text-xs">
              No expenses recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="finance-card p-5 sm:p-6 lg:p-7">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-[19px] font-bold text-white tracking-tight">
              Recent Transactions
            </h2>
            <p className="text-[13px] text-slate-400 font-medium mt-1">Latest entries in your journal</p>
          </div>

          <button
            onClick={() => setActiveTab("transactions")}
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            <span>View All ({displayExpenses.length})</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80 mt-1">
          {recentTransactions.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No transactions logged yet. Click "+ New Transaction" to create one.
            </div>
          ) : (
            recentTransactions.map((tx) => {
              const isIncome = tx.type === "income"
              const badgeClass = getCategoryStyle(tx.category).badge

              return (
                <div 
                  key={tx._id} 
                  className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-2 rounded transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-1.5 rounded shrink-0 ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {isIncome ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-200 truncate">{tx.title}</span>
                        {tx.isRecurring && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase bg-slate-800 text-slate-300 border border-slate-700">
                            Recurring
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badgeClass}`}>
                          {tx.category}
                        </span>
                        <span className="text-xs text-slate-400 font-normal">
                          {new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-mono-nums font-semibold text-[13px] ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{currSym}{formatNumber(tx.amount, currSym)}
                    </span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(tx)}
                        className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(tx._id)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
