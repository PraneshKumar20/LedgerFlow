import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  Receipt, 
  BarChart3, 
  Layers, 
  Radio,
  Plus, 
  Command, 
  Menu,
  X,
  Database,
  LogOut
} from "lucide-react"

export default function MobileNav({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenQuickAdd,
  currency,
  setCurrency,
  currentUser,
  onLogout,
  onSeedDemo
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "transactions", label: "Transactions Ledger", icon: Receipt },
    { id: "analytics", label: "Analytics & Insights", icon: BarChart3 },
    { id: "budgets", label: "Budgets & Milestones", icon: Layers },
    { id: "subscriptions", label: "Bill Radar", icon: Radio }
  ]

  const handleNavClick = (tabId) => {
    setActiveTab(tabId)
    setIsDrawerOpen(false)
  }

  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0b101b] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-850 transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <img src="/ledgerflow-logo.png?v=2" alt="LedgerFlow Logo" className="h-7 w-7 object-contain drop-shadow-sm" />
          <span className="font-bold text-sm tracking-tight text-white">LedgerFlow</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Currency Switcher */}
          <div className="flex bg-slate-900 p-0.5 rounded border border-slate-800">
            {["INR", "USD"].map((c) => {
              const active = currency === c
              return (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-0.5 text-[11px] font-mono-nums font-semibold rounded cursor-pointer transition-colors ${
                    active ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          {/* Quick Add Cmd+K Button */}
          <button
            onClick={onOpenQuickAdd}
            className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors"
            title="Quick Add"
          >
            <Command className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-72 max-w-[85vw] bg-[#0b101b] border-r border-slate-800 h-full flex flex-col z-10 shadow-2xl p-4"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <img src="/ledgerflow-logo.png?v=2" alt="LedgerFlow Logo" className="h-7 w-7 object-contain" />
                  <div>
                    <span className="font-bold text-sm tracking-tight text-white block">LedgerFlow</span>
                    <p className="text-[10px] text-slate-400">Financial Command</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                <p className="px-2.5 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Navigation
                </p>
                {navItems.map((item) => {
                  const isActive = activeTab === item.id
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                        isActive
                          ? "text-white bg-blue-600 font-semibold shadow-sm"
                          : "text-slate-400 hover:text-white hover:bg-slate-900"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}

                <div className="pt-4 border-t border-slate-800/80 my-2">
                  <p className="px-2.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Quick Actions
                  </p>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false)
                      onOpenAddModal()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New Transaction</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false)
                      onOpenQuickAdd()
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 cursor-pointer"
                  >
                    <Command className="h-4 w-4" />
                    <span>Quick Add Dialog</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-3 border-t border-slate-800">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-7 w-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 shrink-0">
                      {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : "PL"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {currentUser?.name || "Personal Ledger"}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {currentUser?.email || "Active User"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b101b] border-t border-slate-800 px-2 py-1.5 pb-safe shadow-lg">
        <div className="flex items-center justify-around relative">
          {/* Overview */}
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
              activeTab === "overview" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-[11px] mt-1">Overview</span>
          </button>

          {/* Transactions */}
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
              activeTab === "transactions" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
          >
            <Receipt className="h-4 w-4" />
            <span className="text-[11px] mt-1">Ledger</span>
          </button>

          {/* Center (+) New Transaction Action */}
          <div className="relative -top-2">
            <button
              onClick={onOpenAddModal}
              className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md border-2 border-[#0b101b] active:scale-95 transition-transform cursor-pointer"
              title="Add Transaction"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Analytics */}
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
              activeTab === "analytics" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-[11px] mt-1">Analytics</span>
          </button>

          {/* Budgets & Radar */}
          <button
            onClick={() => setActiveTab("budgets")}
            className={`flex flex-col items-center justify-center py-1 px-3 transition-colors cursor-pointer ${
              activeTab === "budgets" || activeTab === "subscriptions" ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200 font-medium"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="text-[11px] mt-1">Budgets</span>
          </button>
        </div>
      </nav>
    </>
  )
}
