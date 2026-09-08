import { useState, useMemo } from "react"
import { formatNumber } from "../../utils/formatUtils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { 
  Edit2, 
  Trash2, 
  Search, 
  ArrowUpDown, 
  Download, 
  X, 
  Repeat
} from "lucide-react"

import { getCategoryStyle } from "../../utils/categoryColors"


export default function TransactionTable({ transactions = [], onEdit, onDelete, currencySymbol = "₹" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  // Extract unique categories for filter dropdown
  const categories = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : []
    const cats = new Set(list.map(t => t.category).filter(Boolean))
    return Array.from(cats)
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : []
    return list.filter(t => {
      const title = (t.title || "").toLowerCase()
      const cat = (t.category || "").toLowerCase()
      const search = searchTerm.toLowerCase()
      const matchesSearch = title.includes(search) || cat.includes(search)
      const matchesType = filterType === "all" ? true : t.type === filterType
      const matchesCategory = filterCategory === "all" ? true : t.category === filterCategory
      return matchesSearch && matchesType && matchesCategory
    }).sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })
  }, [transactions, searchTerm, filterType, filterCategory, sortOrder])

  // Filter summary stats
  const { filteredIncome, filteredExpense } = useMemo(() => {
    let inc = 0, exp = 0
    filteredTransactions.forEach(t => {
      if (t.type === 'income') inc += (Number(t.amount) || 0)
      else exp += (Number(t.amount) || 0)
    })
    return { filteredIncome: inc, filteredExpense: exp }
  }, [filteredTransactions])

  const exportCSV = () => {
    const headers = ["Title", "Category", "Date", "Type", "Amount"]
    const rows = filteredTransactions.map(t => [
      `"${t.title ? t.title.replace(/"/g, '""') : ''}"`,
      `"${t.category || ''}"`,
      new Date(t.date).toLocaleDateString(),
      t.type || 'expense',
      t.amount
    ])
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `ledger_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setFilterCategory("all")
  }

  return (
    <div className="space-y-3">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search transactions, payees, categories..."
            className="pl-10 pr-10 bg-slate-900/50 border-slate-800/80 text-[13px] text-slate-100 placeholder:text-slate-500 h-10 rounded-xl focus-visible:border-blue-500 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Controls & CSV Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter */}
          <div className="bg-slate-900/80 rounded-xl border border-slate-800/80 flex items-center shadow-sm">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[110px] border-0 bg-transparent h-10 px-3.5 text-[13px] font-medium text-slate-200 focus:ring-0 cursor-pointer">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1523] border-slate-800 text-slate-200 text-sm shadow-xl rounded-lg">
                <SelectItem value="all" className="cursor-pointer">All Types</SelectItem>
                <SelectItem value="income" className="cursor-pointer">Income</SelectItem>
                <SelectItem value="expense" className="cursor-pointer">Expense</SelectItem>
              </SelectContent>
            </Select>

            <div className="w-px h-5 bg-slate-800/80" />

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[140px] border-0 bg-transparent h-10 px-3.5 text-[13px] font-medium text-slate-200 focus:ring-0 cursor-pointer">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1523] border-slate-800 text-slate-200 text-sm shadow-xl rounded-lg">
                <SelectItem value="all" className="cursor-pointer">All Categories</SelectItem>
                {categories.map(c => (
                  <SelectItem key={c} value={c} className="cursor-pointer">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Sort Toggle */}
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="h-10 px-3.5 bg-slate-900/80 border-slate-800/80 hover:bg-slate-800 hover:border-slate-700 text-[13px] font-medium text-slate-200 rounded-xl shadow-sm transition-all"
            title="Toggle sort order"
          >
            <ArrowUpDown className="h-3.5 w-3.5 mr-2 text-slate-400" />
            <span>{sortOrder === "desc" ? "Newest" : "Oldest"}</span>
          </Button>

          {/* Export CSV */}
          <Button
            variant="outline"
            onClick={exportCSV}
            className="h-10 px-4 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-[13px] font-semibold text-white rounded-xl shadow-sm transition-all flex items-center"
          >
            <Download className="h-4 w-4 mr-2 text-blue-400" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* Filter Summary Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>Showing <strong className="text-white font-mono">{filteredTransactions.length}</strong> of {transactions.length} entries</span>
          {(searchTerm || filterType !== "all" || filterCategory !== "all") && (
            <button
              onClick={resetFilters}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 font-mono-nums text-[11px]">
          <span className="text-emerald-400 font-semibold">
            +{currencySymbol}{formatNumber(filteredIncome, currencySymbol)}
          </span>
          <span className="text-rose-400 font-semibold">
            -{currencySymbol}{formatNumber(filteredExpense, currencySymbol)}
          </span>
        </div>
      </div>

      {/* Responsive View: Desktop Table (>= 768px) */}
      <div className="hidden md:block rounded-lg border border-slate-800 bg-[#0f1523] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-slate-800 bg-slate-900/60">
              <TableHead className="font-semibold text-[11px] uppercase tracking-[0.06em] text-slate-500 py-3 pl-5">
                Description / Title
              </TableHead>
              <TableHead className="font-semibold text-[11px] uppercase tracking-[0.06em] text-slate-500 py-3">
                Category
              </TableHead>
              <TableHead className="font-semibold text-[11px] uppercase tracking-[0.06em] text-slate-500 py-3">
                Date
              </TableHead>
              <TableHead className="font-semibold text-[11px] uppercase tracking-[0.06em] text-slate-500 py-3 text-right">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-[11px] uppercase tracking-[0.06em] text-slate-500 py-3 text-right pr-5">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-36 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <Search className="h-5 w-5 text-slate-500" />
                    <p className="font-semibold text-slate-300 text-xs">No matching transactions</p>
                    <p className="text-xs text-slate-500 font-normal">
                      Try adjusting your search query or reset your filters.
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-1 h-7 text-xs border-slate-800 bg-slate-900"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'income'
                const badgeClass = getCategoryStyle(tx.category).badge

                return (
                  <tr
                    key={tx._id}
                    className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors group"
                  >
                    {/* Title */}
                    <TableCell className="py-3 pl-5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-slate-200">
                          {tx.title}
                        </span>
                        {tx.isRecurring && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.2 rounded font-semibold font-mono-nums uppercase">
                            <Repeat className="h-2.5 w-2.5" /> Recurring
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Category Badge */}
                    <TableCell className="py-3">
                      <span className={`inline-flex items-center rounded border ${badgeClass} px-2 py-0.5 text-[11px] font-medium`}>
                        {tx.category}
                      </span>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="py-3 text-xs text-slate-400 font-normal">
                      {new Date(tx.date).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </TableCell>

                    {/* Amount */}
                    <TableCell className={`py-3 text-right font-mono-nums font-semibold text-[13px] ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{currencySymbol}{formatNumber(tx.amount, currencySymbol)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="py-3 text-right pr-5">
                      <div className="flex items-center justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(tx)}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(tx._id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Responsive View: Mobile Card List (< 768px) */}
      <div className="block md:hidden space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="p-6 text-center bg-[#0f1523] rounded-lg border border-slate-800 space-y-1.5">
            <Search className="h-5 w-5 text-slate-500 mx-auto" />
            <p className="font-semibold text-slate-300 text-xs">No matching transactions</p>
            <Button size="sm" variant="outline" onClick={resetFilters} className="text-xs h-7">
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income'
            const badgeClass = getCategoryStyle(tx.category).badge

            return (
              <div
                key={tx._id}
                className="p-3.5 rounded-lg bg-[#0f1523] border border-slate-800 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-sm text-white truncate">{tx.title}</span>
                      {tx.isRecurring && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase font-mono-nums bg-slate-800 text-slate-300 border border-slate-700">
                          Recurring
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${badgeClass}`}>
                        {tx.category}
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono-nums font-semibold text-[13px] ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIncome ? '+' : '-'}{currencySymbol}{formatNumber(tx.amount, currencySymbol)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => onEdit(tx)}
                    className="px-2 py-0.5 text-xs font-medium text-slate-300 bg-slate-850 hover:bg-slate-800 rounded border border-slate-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="h-3 w-3 text-slate-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(tx._id)}
                    className="px-2 py-0.5 text-xs font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded border border-rose-500/20 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
