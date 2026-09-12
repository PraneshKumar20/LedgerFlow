import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Layers, X, CheckCircle2, ShieldAlert } from "lucide-react"
import { formatNumber } from "../../utils/formatUtils"
import { getCategoryStyle } from "../../utils/categoryColors"

export default function CategoryEnvelopesModal({ 
  isOpen, 
  onClose, 
  expenses = [], 
  currencySymbol = "₹", 
  multiplier = 1,
  categoryBudgets = {}, 
  onUpdateCategoryBudget
}) {
  const [editingValues, setEditingValues] = useState({})

  const handleCommitCategory = (category) => {
    if (editingValues[category] === undefined) return
    const val = editingValues[category].replace(/[^0-9]/g, '')
    const numVal = (Number(val) || 0) / multiplier
    onUpdateCategoryBudget(category, numVal)
    setEditingValues(prev => {
      const copy = { ...prev }
      delete copy[category]
      return copy
    })
  }

  const handleDone = () => {
    // Commit any unsaved edits quietly before closing
    Object.entries(editingValues).forEach(([cat, val]) => {
      const clean = val.replace(/[^0-9]/g, '')
      const numVal = (Number(clean) || 0) / multiplier
      onUpdateCategoryBudget(cat, numVal)
    })
    setEditingValues({})
    onClose()
  }

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

    const totalAllocated = Object.values(categoryBudgets).reduce((a, b) => a + b, 0) * multiplier
    const totalSpentInEnvelopes = list.reduce((a, b) => a + b.spent, 0)
    const overCount = list.filter(i => i.isOver).length

    return {
      list,
      totalAllocated,
      totalSpentInEnvelopes,
      overCount
    }
  }, [categoryBudgets, categorySpending, multiplier])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-surface-overlay backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-surface-2 border border-border-default rounded-modal shadow-elevation-modal overflow-hidden z-10 flex flex-col max-h-[90vh]"
          >
            <div className="p-6 flex flex-col h-full min-h-0 space-y-6">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-border-default pb-5 shrink-0">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-control bg-brand/10 text-brand border border-brand/20 shadow-elevation-sm">
                      <Layers className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-text-primary tracking-tight">
                      Category Budget Envelopes
                    </h2>
                  </div>
                  <p className="text-[13px] text-text-secondary font-medium mt-1.5 leading-relaxed">
                    Set target limits per category. Press <kbd className="px-1.5 py-0.5 rounded bg-surface-3 border border-border-subtle text-[11px] font-mono text-text-primary">Enter</kbd> or click Save to apply.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-text-secondary hover:text-text-primary rounded-control hover:bg-surface-hover focus-ring transition-all cursor-pointer"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Summary Ribbon */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-card bg-surface-1 border border-border-default shrink-0">
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">Total Allocated</span>
                  <p className="text-[22px] leading-tight font-bold text-text-primary font-mono-nums mt-1">
                    {currencySymbol}{formatNumber(envelopeStats.totalAllocated, currencySymbol, 0, 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">Envelopes Spent</span>
                  <p className="text-[22px] leading-tight font-bold text-text-primary font-mono-nums mt-1">
                    {currencySymbol}{formatNumber(envelopeStats.totalSpentInEnvelopes, currencySymbol, 0, 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">Threshold Status</span>
                  <p className={`text-sm font-semibold mt-1.5 flex items-center gap-1.5 ${envelopeStats.overCount > 0 ? 'text-negative' : 'text-positive'}`}>
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
                {envelopeStats.list.map((item) => {
                  const isDirty = editingValues[item.category] !== undefined
                  const displayValue = isDirty 
                    ? editingValues[item.category] 
                    : formatNumber(Math.round(item.limit), currencySymbol, 0, 0)

                  return (
                    <div 
                      key={item.category}
                      className="p-5 rounded-card bg-surface-1 border border-border-default hover:border-border-strong transition-colors space-y-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 rounded-badge text-xs font-semibold border ${item.theme.badge}`}>
                            {item.category}
                          </span>
                          <span className="text-xs text-text-secondary font-medium">
                            {item.isOver ? (
                              <span className="text-negative flex items-center gap-1.5">
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
                          <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider mb-1">Spent</div>
                          <div className="text-[22px] font-mono-nums font-bold text-text-primary tracking-tight leading-none">
                            {currencySymbol}{formatNumber(item.spent, currencySymbol, 0, 0)}
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <div className="text-[10px] uppercase font-semibold text-text-muted tracking-wider mb-1 text-right">Target</div>
                          <div className="flex items-center gap-1.5">
                            <div className={`relative border rounded-control bg-surface-3 transition-all focus-ring flex items-center h-9 px-2.5 shadow-elevation-sm ${
                              isDirty ? 'border-brand ring-1 ring-brand/40' : 'border-border-default'
                            }`}>
                              <span className="text-sm font-mono-nums text-text-muted font-medium mr-0.5">{currencySymbol}</span>
                              <input
                                type="text"
                                value={displayValue}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/[^0-9]/g, '')
                                  setEditingValues(prev => ({ ...prev, [item.category]: val }))
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    handleCommitCategory(item.category)
                                  }
                                }}
                                className="w-[84px] bg-transparent text-[15px] font-mono-nums font-bold text-text-primary text-right outline-none placeholder:text-text-muted"
                                placeholder="0"
                              />
                            </div>

                            {isDirty && (
                              <button
                                type="button"
                                onClick={() => handleCommitCategory(item.category)}
                                className="h-9 px-2.5 rounded-control bg-brand hover:bg-brand-hover active:bg-brand-active text-white text-xs font-semibold flex items-center gap-1 transition-all shadow-elevation-sm cursor-pointer shrink-0"
                                title="Save Target (Enter)"
                              >
                                <span>Save</span>
                                <span className="text-[10px] font-mono opacity-80">↵</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="pt-1.5 space-y-2">
                        <div className="h-1.5 w-full bg-surface-inset rounded-full overflow-hidden flex">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full transition-colors ${
                              item.rawPercent > 100 
                                ? 'bg-negative' 
                                : item.rawPercent > 80 
                                  ? 'bg-warning' 
                                  : item.theme.bg
                            }`}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-text-secondary font-medium px-0.5">
                          <span>Usage: {formatNumber(item.rawPercent, currencySymbol, 0, 0)}%</span>
                          <span>Target: {currencySymbol}{formatNumber(item.limit, currencySymbol, 0, 0)}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Modal Footer */}
              <div className="pt-5 border-t border-border-default flex items-center justify-between shrink-0">
                <p className="text-[11px] font-medium text-text-muted max-w-[260px] leading-relaxed">
                  Press Enter or click Save next to an amount to update its target.
                </p>
                <button
                  onClick={handleDone}
                  className="px-6 py-2.5 rounded-control bg-brand hover:bg-brand-hover active:bg-brand-active text-white text-[13px] font-semibold transition-colors shadow-elevation-sm focus-ring cursor-pointer"
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
