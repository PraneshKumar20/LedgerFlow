import { useMemo } from "react"
import { formatNumber } from "../../utils/formatUtils"
import { getCategoryStyle } from "../../utils/categoryColors"
import { 
  Radio, 
  Clock, 
  Calendar, 
  Plus, 
  AlertTriangle, 
  CreditCard, 
  Bell,
  Dumbbell,
  Wifi,
  Zap,
  ShoppingBag,
  Film,
  Headphones,
  Home,
  Coffee,
  Tv,
  Monitor
} from "lucide-react"
import AnimatedCounter from "../ui/AnimatedCounter"

const getVisualIdentity = (title = '', category = '') => {
  const style = getCategoryStyle(category)
  const t = title.toLowerCase()
  let icon = CreditCard

  if (t.includes('netflix') || t.includes('hulu') || t.includes('prime') || t.includes('tv') || category.toLowerCase() === 'entertainment') {
    icon = Film
  } else if (t.includes('spotify') || t.includes('music')) {
    icon = Headphones
  } else if (t.includes('gym') || t.includes('fitness')) {
    icon = Dumbbell
  } else if (t.includes('internet') || t.includes('wifi') || t.includes('broadband')) {
    icon = Wifi
  } else if (t.includes('electric') || t.includes('power') || t.includes('energy')) {
    icon = Zap
  } else if (t.includes('grocery') || t.includes('groceries') || category.toLowerCase() === 'food') {
    icon = ShoppingBag
  } else if (category.toLowerCase() === 'bills' || t.includes('bill')) {
    icon = Home
  } else if (category.toLowerCase() === 'subscriptions') {
    icon = Monitor
  }

  const colorMatch = style.text.match(/text-([a-z]+)-\d+/)
  const cName = colorMatch ? colorMatch[1] : 'slate'

  return { 
    icon, 
    color: style.text, 
    bg: `bg-gradient-to-br from-${cName}-500/20 to-${cName}-500/5`, 
    border: `border-${cName}-500/20` 
  }
}

export default function SubscriptionsView({
  displayExpenses = [],
  currencySymbol = "₹",
  multiplier = 1,
  openAddModal
}) {
  const recurringSubscriptions = useMemo(() => {
    if (!Array.isArray(displayExpenses)) return []

    return displayExpenses
      .filter(e => e.isRecurring && e.type === 'expense')
      .map(item => {
        const txDate = new Date(item.date || Date.now())
        const now = new Date()
        const billingDay = txDate.getDate()
        
        let nextBilling = new Date(now.getFullYear(), now.getMonth(), billingDay)
        if (nextBilling < now) {
          nextBilling = new Date(now.getFullYear(), now.getMonth() + 1, billingDay)
        }

        const diffTime = nextBilling.getTime() - now.getTime()
        const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))

        return {
          ...item,
          amount: Number(item.amount) || 0,
          nextBillingDate: nextBilling.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          daysUntilRenewal: diffDays,
          billingDay
        }
      })
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)
  }, [displayExpenses])

  const { monthlyBurn, annualBurn, imminentRenewals } = useMemo(() => {
    const monthly = recurringSubscriptions.reduce((acc, curr) => acc + curr.amount, 0)
    const imminent = recurringSubscriptions.filter(s => s.daysUntilRenewal <= 3)
    return {
      monthlyBurn: monthly,
      annualBurn: monthly * 12,
      imminentRenewals: imminent
    }
  }, [recurringSubscriptions])

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Recurring Radar KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {/* Monthly Recurring Burn */}
        <div className="finance-card p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Monthly Subscription Costs</span>
            <div className="p-1 rounded bg-slate-800 text-blue-400">
              <Radio className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[20px] sm:text-[26px] font-semibold text-white font-mono-nums mt-2 leading-tight">
            <AnimatedCounter value={monthlyBurn} prefix={currencySymbol} />
          </p>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Recurring commitments / month</p>
        </div>

        {/* Projected Annual Burn */}
        <div className="finance-card p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Annual Projected Costs</span>
            <div className="p-1 rounded bg-slate-800 text-slate-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[20px] sm:text-[26px] font-semibold text-slate-200 font-mono-nums mt-2 leading-tight">
            <AnimatedCounter value={annualBurn} prefix={currencySymbol} />
          </p>
          <p className="text-xs text-slate-400 font-normal mt-0.5">12-month recurring projection</p>
        </div>

        {/* Imminent Renewals Alert */}
        <div className="finance-card p-5 sm:p-6 lg:p-7">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Renewals in &le; 3 Days</span>
            <div className={`p-1 rounded ${imminentRenewals.length > 0 ? 'bg-red-500/10 text-red-400' : 'bg-slate-800 text-slate-400'}`}>
              <Bell className="h-4 w-4" />
            </div>
          </div>
          <p className={`text-[20px] sm:text-[26px] font-semibold font-mono-nums mt-2 leading-tight ${imminentRenewals.length > 0 ? 'text-red-400' : 'text-slate-200'}`}>
            {imminentRenewals.length}
          </p>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            {imminentRenewals.length > 0 ? "Upcoming renewals requiring funds" : "No renewals in next 72 hours"}
          </p>
        </div>
      </div>

      {/* Imminent Alert Notice */}
      {imminentRenewals.length > 0 && (
        <div className="p-4 sm:p-5 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-red-300">
                Notice: {imminentRenewals.length} subscription{imminentRenewals.length > 1 ? 's' : ''} renew within 3 days
              </p>
              <p className="text-xs text-red-300/80 font-normal">
                Total debit: {currencySymbol}{formatNumber(imminentRenewals.reduce((a, b) => a + b.amount, 0), currencySymbol)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Subscriptions List */}
      <div className="finance-card p-5 sm:p-6 lg:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h2 className="text-[19px] font-bold text-white tracking-tight flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <span>Active Subscriptions ({recurringSubscriptions.length})</span>
            </h2>
            <p className="text-[13px] text-slate-400 font-medium mt-1">
              Automated renewal detection and cycle countdown
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Recurring Bill</span>
          </button>
        </div>

        {recurringSubscriptions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs space-y-1.5">
            <Radio className="h-6 w-6 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-400">No recurring subscriptions tracked</p>
            <p className="text-slate-500 max-w-sm mx-auto">
              When adding transactions, mark "Recurring" or type e.g. "Netflix monthly 15.99 subscription" in Quick Add to track them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recurringSubscriptions.map((sub) => {
              const days = sub.daysUntilRenewal
              const isUrgent = days <= 3
              const isMedium = days > 3 && days <= 14
              const isMore = days > 14
              
              const identity = getVisualIdentity(sub.title, sub.category)

              let statusDotColor = 'bg-slate-600'
              let statusDateColor = 'text-slate-400'
              let statusTimeColor = 'text-slate-500 font-medium'
              let cardBgColor = 'bg-slate-900/40 border-slate-800/60'

              if (isUrgent) {
                statusDotColor = 'bg-red-400 animate-pulse'
                statusDateColor = 'text-red-400 font-medium'
                statusTimeColor = 'text-red-500/80 font-medium'
                cardBgColor = 'bg-red-500/5 border-red-500/30'
              } else if (isMedium) {
                statusDotColor = 'bg-blue-400'
                statusDateColor = 'text-blue-400 font-medium'
                statusTimeColor = 'text-blue-500/80 font-medium'
              } else if (isMore) {
                statusDotColor = 'bg-emerald-400'
                statusDateColor = 'text-emerald-400 font-medium'
                statusTimeColor = 'text-emerald-500/80 font-medium'
              }

              return (
                <div
                  key={sub._id}
                  className={`p-5 sm:p-6 rounded-xl border transition-colors ${cardBgColor} flex flex-col justify-between min-h-[140px]`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3.5">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shrink-0 ${identity.bg} ${identity.border} ${identity.color}`}>
                      <identity.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <h3 className="text-[15px] font-semibold text-slate-100 truncate leading-snug">{sub.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`text-[11px] font-medium ${identity.color} opacity-80`}>
                          {sub.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Spacer and Bottom */}
                  <div className="mt-6 pt-4 border-t border-slate-800/50 flex flex-wrap items-end justify-between gap-3">
                    {/* Renewal Info */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className={`h-1.5 w-1.5 rounded-full ${statusDotColor}`} />
                      <span className={statusDateColor}>
                        {sub.nextBillingDate}
                      </span>
                      <span className={statusTimeColor}>
                        · {days === 0 ? "Today" : `In ${days}d`}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="flex items-baseline gap-1">
                      <span className="text-[19px] font-semibold text-white font-mono-nums tracking-tight">
                        {currencySymbol}{formatNumber(sub.amount, currencySymbol)}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">/month</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
