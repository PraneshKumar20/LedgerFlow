import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Repeat, Pencil, AlertCircle } from "lucide-react"
import { formatNumber } from "../../utils/formatUtils"

const CATEGORIES = ["Food", "Travel", "Bills", "Entertainment", "Shopping", "Salary", "Subscriptions", "Other"]

export default function TransactionModal({ isOpen, onClose, onSave, editingTransaction, currencySymbol = "₹" }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "expense",
    date: "",
    isRecurring: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        type: editingTransaction.type || "expense",
        date: editingTransaction.date.split('T')[0],
        isRecurring: editingTransaction.isRecurring || false
      })
    } else {
      setFormData({ 
        title: "", 
        amount: "", 
        category: "", 
        type: "expense", 
        date: new Date().toISOString().split('T')[0], 
        isRecurring: false 
      })
    }
    setError(null)
    setIsSubmitting(false)
  }, [editingTransaction, isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError("Please enter a description.")
      return
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Enter a valid amount.")
      return
    }
    if (!formData.category) {
      setError("Please select a category.")
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await onSave({
        ...editingTransaction,
        ...formData,
        amount: Number(formData.amount)
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  // Derived values for preview
  const displayAmount = formData.amount ? formatNumber(Number(formData.amount), currencySymbol) : '0.00'
  const isIncome = formData.type === 'income'
  const amountColor = isIncome ? 'text-emerald-400' : 'text-slate-100'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isSubmitting && onClose(open)}>
      <DialogContent className="sm:max-w-[460px] bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl shadow-2xl p-0 overflow-hidden">
        
        {/* Header */}
        <DialogHeader className="pt-5 px-5 pb-4 border-b border-slate-800/60 bg-slate-900/20">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 mt-0.5 shadow-sm">
              <Pencil className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-white tracking-tight">
                {editingTransaction ? "Edit Transaction" : "New Transaction"}
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-medium mt-1 leading-relaxed">
                Log financial flows directly to your ledger.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-6">
          
          {/* Main Form Fields */}
          <div className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 mb-1 px-0.5">
              Transaction Details
            </div>
            
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-medium text-slate-300">
                Description / Payee
              </Label>
              <Input 
                id="title" 
                placeholder="e.g. AWS Cloud or Freelance" 
                value={formData.title} 
                onChange={(e) => {
                  setFormData({...formData, title: e.target.value})
                  if (error) setError(null)
                }} 
                className="bg-slate-900/50 border-slate-800 focus-visible:border-blue-500 focus-visible:bg-slate-900 text-slate-100 text-sm h-11 px-3.5 rounded-lg shadow-sm transition-all placeholder:text-slate-500" 
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount" className="text-xs font-medium text-slate-300">
                  Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">{currencySymbol}</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={formData.amount} 
                    onChange={(e) => {
                      setFormData({...formData, amount: e.target.value})
                      if (error) setError(null)
                    }} 
                    className={`bg-slate-900/50 border-slate-800 focus-visible:border-blue-500 focus-visible:bg-slate-900 font-mono-nums text-base font-semibold h-11 pl-8 rounded-lg shadow-sm transition-all ${amountColor}`} 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-800 focus:ring-0 text-slate-100 font-medium text-sm h-11 rounded-lg shadow-sm transition-all">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1523] border-slate-800 text-slate-100 shadow-xl rounded-lg">
                    <SelectItem value="expense" className="text-rose-400 font-medium focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer">Expense (-)</SelectItem>
                    <SelectItem value="income" className="text-emerald-400 font-medium focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer">Income (+)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-300">
                  Category
                </Label>
                <Select value={formData.category} onValueChange={(val) => {
                  setFormData({...formData, category: val, isRecurring: val === 'Subscriptions' ? true : formData.isRecurring})
                  if (error) setError(null)
                }}>
                  <SelectTrigger className="bg-slate-900/50 border-slate-800 focus:ring-0 text-slate-100 text-sm h-11 rounded-lg shadow-sm transition-all">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1523] border-slate-800 text-slate-100 shadow-xl rounded-lg">
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="focus:bg-slate-800 cursor-pointer">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date" className="text-xs font-medium text-slate-300">
                  Date
                </Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                  className="bg-slate-900/50 border-slate-800 focus-visible:border-blue-500 focus-visible:bg-slate-900 text-slate-100 text-sm h-11 px-3.5 rounded-lg shadow-sm transition-all" 
                />
              </div>
            </div>
          </div>

          {/* Recurring Control */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 mb-3 px-0.5">
              Optional
            </div>
            
            <button
              type="button"
              onClick={() => setFormData(prev => ({...prev, isRecurring: !prev.isRecurring}))}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                formData.isRecurring 
                  ? 'bg-emerald-500/10 border-emerald-500/30' 
                  : 'bg-slate-900/40 border-slate-800/60 hover:bg-rose-500/5 hover:border-rose-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg transition-colors ${formData.isRecurring ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Repeat className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className={`text-sm font-semibold transition-colors ${formData.isRecurring ? 'text-emerald-400' : 'text-slate-200'}`}>
                    Recurring Transaction
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium mt-0.5">Mark as periodic repeating cashflow</span>
                </div>
              </div>
              
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider transition-colors ${
                formData.isRecurring
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-rose-500/20 text-rose-400'
              }`}>
                {formData.isRecurring ? 'ON' : 'OFF'}
              </div>
            </button>
          </div>
          
          {/* Contextual Preview (only if title or amount entered) */}
          {(formData.title || formData.amount) && (
            <div className="pt-2">
              <div className="p-4 rounded-xl border border-slate-800/60 bg-slate-900/30 flex items-center justify-between shadow-sm">
                <div className="min-w-0 pr-4">
                  <h4 className="text-sm font-semibold text-slate-200 truncate">{formData.title || "New Transaction"}</h4>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-slate-500">
                    {formData.category && <span>{formData.category}</span>}
                    {formData.category && formData.type && <span>·</span>}
                    {formData.type && <span className={isIncome ? 'text-emerald-500/80' : 'text-rose-500/80'}>{isIncome ? 'Income' : 'Expense'}</span>}
                  </div>
                </div>
                <div className={`text-base font-bold font-mono-nums tracking-tight whitespace-nowrap ${amountColor}`}>
                  {isIncome ? '+' : '-'}{currencySymbol}{displayAmount}
                </div>
              </div>
            </div>
          )}

          {/* Save / Cancel Footer */}
          <DialogFooter className="pt-5 border-t border-slate-800/60 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 sm:gap-2 mt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="w-full sm:w-auto text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-sm font-medium h-10 px-4 rounded-lg transition-colors flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm h-10 px-5 rounded-lg shadow-sm transition-all disabled:opacity-50 flex-1 sm:flex-none"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
          
        </form>
      </DialogContent>
    </Dialog>
  )
}
