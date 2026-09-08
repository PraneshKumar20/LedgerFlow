import { useState } from "react"
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Layers, 
  Radio, 
  Plus, 
  Command, 
  Database, 
  LogOut, 
  Wallet,
  CheckCircle2,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"
import { parseQuickAdd } from "../../utils/quickAddParser"
import { formatNumber } from "../../utils/formatUtils"

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenQuickAdd,
  onSeedDemo,
  transactionCount = 0,
  recurringCount = 0,
  healthGrade = "A",
  goalsCount = 0,
  currency,
  setCurrency,
  currentUser,
  onLogout,
  onSaveTransaction,
  isCollapsed = false,
  onToggleCollapse
}) {
  const [quickAddQuery, setQuickAddQuery] = useState("")
  const [isQuickAddFocused, setIsQuickAddFocused] = useState(false)
  const [quickAddSuccess, setQuickAddSuccess] = useState(null)
  const currencySymbol = currency === "INR" ? "₹" : "$"
  const samplePrompts = [
    `Spent ${currencySymbol}45 on groceries yesterday`,
    `Uber ride to airport ${currencySymbol}28 travel`,
    `Freelance client design ${currencySymbol}850 salary`,
    `Netflix monthly ${currencySymbol}15.99 subscription`,
    `Electricity bill ${currencySymbol}115 bills`
  ]

  const handleQuickAddKeyDown = (e) => {
    if (e.key === "Enter") {
      if (!quickAddQuery.trim()) return
      const parsed = parseQuickAdd(quickAddQuery)
      if (parsed && parsed.isValid) {
        onSaveTransaction(parsed)
        setQuickAddQuery("")
        setQuickAddSuccess(parsed)
        setTimeout(() => setQuickAddSuccess(null), 2000)
      }
    }
  }

  const handlePromptClick = (promptStr) => {
    setQuickAddQuery(promptStr)
  }

  const navItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: Receipt,
      badge: transactionCount > 0 ? transactionCount : null
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      badge: healthGrade ? `Grade ${healthGrade}` : null,
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    },
    {
      id: "budgets",
      label: "Budgets & Goals",
      icon: Layers,
      badge: goalsCount > 0 ? `${goalsCount} Goals` : null,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    },
    {
      id: "subscriptions",
      label: "Bill Radar",
      icon: Radio,
      badge: recurringCount > 0 ? recurringCount : null,
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
    }
  ]

  return (
    <aside
      className={`hidden lg:flex flex-col shrink-0 bg-[#0b101b] border-r border-slate-800/80 h-screen sticky top-0 z-40 select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Brand Header */}
      {isCollapsed ? (
        <div className="p-3 pb-3 border-b border-slate-800/80 flex flex-col items-center gap-2">
          <img src="/ledgerflow-logo.png?v=2" alt="LedgerFlow Logo" className="h-8 w-8 object-contain drop-shadow-sm" />
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Expand sidebar (Ctrl+B)"
          >
            <PanelLeftOpen className="h-4 w-4 text-blue-400" />
          </button>
        </div>
      ) : (
        <div className="p-4 pb-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src="/ledgerflow-logo.png?v=2" alt="LedgerFlow Logo" className="h-8 w-8 object-contain shrink-0 drop-shadow-sm" />
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight text-white block truncate">LedgerFlow</span>
              <p className="text-[11px] text-slate-400 font-normal truncate">Personal Financial Command</p>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title="Collapse sidebar (Ctrl+B)"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Navigation Section */}
      <div className={`flex-1 ${isCollapsed ? "px-2" : "px-3"} py-2 space-y-1 overflow-y-auto overflow-x-hidden`}>
        {!isCollapsed && (
          <p className="px-2.5 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
            Navigation
          </p>
        )}

        {navItems.map((item) => {
          const isActive = activeTab === item.id
          const Icon = item.icon

          if (isCollapsed) {
            return (
              <div key={item.id} className="relative group flex justify-center py-0.5">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "text-white bg-blue-600 shadow-md shadow-blue-500/25"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </button>

                {/* Floating Tooltip on Hover */}
                <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-300 font-mono-nums border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
            )
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13.5px] transition-colors cursor-pointer ${
                isActive
                  ? "text-white font-semibold bg-slate-800/90 border border-slate-700/80 shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-medium"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-mono-nums font-medium px-2 py-0.5 rounded border ${
                    item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* Quick Add Section */}
        {isCollapsed ? (
          <div className="relative group pt-4 flex justify-center">
            <button
              onClick={onOpenQuickAdd}
              className="h-11 w-11 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
              title="Quick Add Command (Ctrl+K)"
            >
              <Command className="h-4 w-4 text-blue-400" />
            </button>
            <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Quick Add (Ctrl+K)
            </div>
          </div>
        ) : (
          <>
            <div className="pt-6 px-2.5 pb-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                Quick Add
              </p>
            </div>

            <div className="px-2.5 pb-2">
              <div className={`relative flex items-center rounded-lg border transition-all duration-200 ${isQuickAddFocused ? 'border-blue-500/50 bg-slate-900/80' : 'border-slate-800/80 bg-slate-900/40'}`}>
                <Command className="h-3.5 w-3.5 text-slate-500 absolute left-2.5" />
                <input
                  type="text"
                  value={quickAddQuery}
                  onChange={(e) => setQuickAddQuery(e.target.value)}
                  onFocus={() => setIsQuickAddFocused(true)}
                  onBlur={() => setTimeout(() => setIsQuickAddFocused(false), 200)}
                  onKeyDown={handleQuickAddKeyDown}
                  placeholder="Type naturally..."
                  className="w-full bg-transparent text-[13px] text-white placeholder:text-slate-600 outline-none py-2.5 pl-8 pr-8"
                />
                {quickAddSuccess ? (
                  <div className="absolute right-2.5 flex items-center gap-1.5 text-emerald-400 bg-slate-800/80 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-medium whitespace-nowrap">Added {currencySymbol}{formatNumber(quickAddSuccess.amount, currencySymbol)}</span>
                  </div>
                ) : (
                  <div className="absolute right-2 text-[9px] font-mono-nums font-semibold text-slate-500 bg-slate-800 px-1 py-0.5 rounded border border-slate-700">
                    ↵
                  </div>
                )}
              </div>
              
              {/* Contextual Suggestions */}
              {isQuickAddFocused && !quickAddQuery && (
                <div className="mt-1.5 space-y-1">
                  {samplePrompts.slice(0, 3).map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePromptClick(prompt)}
                      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded hover:bg-slate-900/60 text-left cursor-pointer group"
                    >
                      <ArrowRight className="h-3 w-3 text-slate-600 group-hover:text-blue-400 transition-colors shrink-0" />
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-300 truncate">{prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Settings & Data */}
        {isCollapsed ? (
          <div className="pt-4 space-y-2 flex flex-col items-center">
            <div className="relative group">
              <button
                onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
                className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 hover:text-white font-mono-nums font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                title={`Switch Currency (${currency})`}
              >
                {currencySymbol}
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Currency: {currency} (Click to toggle)
              </div>
            </div>

            <div className="relative group">
              <button
                onClick={onSeedDemo}
                className="h-9 w-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                title="Reset Demo Data"
              >
                <Database className="h-4 w-4" />
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 border border-slate-700 text-white text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
                Reset Demo Data
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="pt-4 mt-2 px-2.5 pb-2 border-t border-slate-800/60">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">
                Settings & Data
              </p>
            </div>

            {/* Currency Selector */}
            <div className="px-2.5 py-2 bg-slate-900/60 rounded-lg border border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">Currency</span>
              <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800">
                {["INR", "USD"].map((c) => {
                  const active = currency === c
                  return (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer ${
                        active
                          ? "bg-blue-600 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {c === "USD" ? "$ USD" : "₹ INR"}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Seed Demo button */}
            <button
              onClick={onSeedDemo}
              className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors cursor-pointer"
            >
              <Database className="h-3.5 w-3.5 text-slate-400" />
              <span>Reset Demo Data</span>
            </button>
          </>
        )}
      </div>

      {/* User Profile & Sign Out Footer */}
      {isCollapsed ? (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 flex flex-col items-center gap-2">
          <div className="relative group">
            <div className="h-9 w-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 cursor-default">
              {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "PL"}
            </div>
            <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-white text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 space-y-0.5">
              <p className="font-semibold">{currentUser?.name || "Personal Ledger"}</p>
              <p className="text-[10px] text-slate-400">{currentUser?.isGuest ? "Guest Mode" : currentUser?.email || "Active User"}</p>
            </div>
          </div>

          <div className="relative group">
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 bg-slate-900 border border-slate-700 text-rose-400 text-xs font-semibold rounded-md shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Sign Out
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "PL"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {currentUser?.name || "Personal Ledger"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {currentUser?.isGuest ? "Guest Mode" : currentUser?.email || "Active User"}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
