export const CANONICAL_CATEGORIES = {
  Travel: {
    base: "#8B5CF6",
    bg: "bg-purple-500",
    badgeBg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
  Shopping: {
    base: "#10B981",
    bg: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  Food: {
    base: "#F43F5E",
    bg: "bg-rose-500",
    badgeBg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
  Bills: {
    base: "#F59E0B",
    bg: "bg-amber-500",
    badgeBg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  Entertainment: {
    base: "#C084FC",
    bg: "bg-purple-400",
    badgeBg: "bg-purple-400/10",
    text: "text-purple-300",
    border: "border-purple-400/20",
  },
  Subscriptions: {
    base: "#38BDF8",
    bg: "bg-sky-500",
    badgeBg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
  },
  Salary: {
    base: "#10B981",
    bg: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  Other: {
    base: "#6366F1",
    bg: "bg-indigo-500",
    badgeBg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
  },
}

// Category badge styles are strictly derived from the canonical category definition
export const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(CANONICAL_CATEGORIES).map(([cat, def]) => [
    cat,
    {
      base: def.base,
      bg: def.bg,
      badgeBg: def.badgeBg,
      text: def.text,
      border: def.border,
      badge: `${def.badgeBg} ${def.text} ${def.border}`,
    },
  ])
)

export const getCategoryStyle = (categoryName) => {
  return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Other
}
