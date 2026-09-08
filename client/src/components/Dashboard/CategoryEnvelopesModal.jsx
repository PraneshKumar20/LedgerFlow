import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, X, Sparkles, AlertCircle, CheckCircle2, DollarSign, TrendingUp, RotateCcw, Sliders, ShieldAlert } from "lucide-react"
import AnimatedCounter from "../ui/AnimatedCounter"
import { formatNumber } from "../../utils/formatUtils"
import { getCategoryStyle } from "../../utils/categoryColors"

const DEFAULT_ENVELOPES = {
  Food: 450,
  Travel: 250,
  Bills: 350,
  Subscriptions: 100,
  Entertainment: 150,
  Shopping: 200,
  Other: 150
}

export default function CategoryEnvelopesModal({ 
  isOpen, 
  onClose, 
  expenses = [], 
  currencySymbol = "₹", 
  multiplier = 1,
  categoryBudgets,
  onUpdateCategoryBudget
}) {
  const [editingCategory, setEditingCategory] = useState(null)

  // Calculate actual spend per category
  const categorySpending = useMemo(() => {
    const map = {}
    if (Array.isArray(expenses)) {
      expenses.filter(e => e.type === 'expense').forEach(e => {
        const cat = e.category || 'Other'
        map[cat] = (map[cat] || 0) + (Number(e.amount) || 0)
      })
    }
    return map
  }, [expenses])

  // Aggregate Envelope Stats
  const envelopeStats = useMemo(() => {
    const list = Object.entries(categoryBudgets).map(([cat, baseLimit]) => {
      const limit = baseLimit * multiplier
      const spent = categorySpending[cat] || 0
      const percent = limit > 0 ? (spent / limit) * 100 : 0
      const remaining = limit - spent

      return {
        category: cat,
        baseLimit,
        limit,
        spent,
        percent: Math.min(percent, 100),
        rawPercent: percent,
        remaining,
        isOver: spent > limit,
        theme: getCategoryStyle(cat)
      }
    })

    const totalAllocated = Object.values(categoryBudgets).reduce((sum, v) => sum + (v * multiplier), 0)
    const totalSpentInEnvelopes = list.reduce((sum, item) => sum + item.spent, 0)
    const overCount = list.filter(item => item.isOver).length

    return {
      list: list.sort((a, b) => b.rawPercent - a.rawPercent),
      totalAllocated,
      totalSpentInEnvelopes,
      overCount
    }
  }, [categoryBudgets, categorySpending, multiplier])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#0f1523] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 flex flex-col h-full min-h-0 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-5 shrink-0">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                      Category Budget Envelopes
                    </h2>
                  </div>
                  <p className="text-[13px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                    Set target limits per category to maintain balanced cashflow.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Ribbon */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Total Allocated</span>
                  <p className="text-[22px] leading-tight font-bold text-white font-mono-nums mt-1">
                    {currencySymbol}{formatNumber(envelopeStats.totalAllocated, currencySymbol, 0, 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Envelopes Spent</span>
                  <p className="text-[22px] leading-tight font-bold text-white font-mono-nums mt-1">
                    {currencySymbol}{formatNumber(envelopeStats.totalSpentInEnvelopes, currencySymbol, 0, 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500">Threshold Status</span>
                  <p className={`text-sm font-semibold mt-1.5 flex items-center gap-1.5 ${envelopeStats.overCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {envelopeStats.overCount > 0 ? (
                      <>
                        <ShieldAlert className="h-4 w-4" />
                        {envelopeStats.overCount} Exceeded
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        All Healthy
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Envelopes List */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-2 pb-1 space-y-4">
                {envelopeStats.list.map((item) => (
                  <div 
                    key={item.category}
                    className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700/80 transition-colors space-y-4 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${item.theme.badge}`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.isOver ? (
                            <span className="text-rose-400 flex items-center gap-1.5">
                              Over budget by {currencySymbol}{formatNumber(Math.abs(item.remaining), currencySymbol, 0, 0)}
                            </span>
                          ) : (
                            <span>{currencySymbol}{formatNumber(item.remaining, currencySymbol, 0, 0)} remaining</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">Spent</div>
                        <div className="text-[22px] font-mono-nums font-bold text-white tracking-tight leading-none">
                          {currencySymbol}{formatNumber(item.spent, currencySymbol, 0, 0)}
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1 text-right">Target</div>
                        <div className="relative group-hover:border-slate-600 border border-slate-700 rounded-lg bg-slate-950 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 flex items-center h-9 px-2.5 shadow-sm">
                          <span className="text-sm font-mono-nums text-slate-400 font-medium mr-0.5">{currencySymbol}</span>
                          <input
                            type="text"
                            value={formatNumber(Math.round(item.limit), currencySymbol, 0, 0)}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, '')
                              onUpdateCategoryBudget(item.category, (Number(val) || 0) / multiplier)
                            }}
                            className="w-[84px] bg-transparent text-[15px] font-mono-nums font-bold text-white text-right outline-none placeholder:text-slate-600"
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-1.5 space-y-2">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percent}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full transition-colors ${
                            item.rawPercent > 100 
                              ? 'bg-rose-500' 
                              : item.rawPercent > 80 
                                ? 'bg-amber-500' 
                                : item.theme.bg
                          }`}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium px-0.5">
                        <span>Usage: {formatNumber(item.rawPercent, currencySymbol, 0, 0)}%</span>
                        <span>Target: {currencySymbol}{formatNumber(item.limit, currencySymbol, 0, 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="pt-5 border-t border-slate-800/80 flex items-center justify-between shrink-0">
                <p className="text-[11px] font-medium text-slate-500 max-w-[260px] leading-relaxed">
                  Category envelope targets scale automatically with your active currency.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-semibold transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f1523] cursor-pointer"
                >
                  Done
                </button>
              </div>
              
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
