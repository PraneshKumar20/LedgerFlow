export const CATEGORY_COLORS = {
  Travel: {
    base: "#6366f1", // indigo-500
    badge: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    text: "text-indigo-400",
    bg: "bg-indigo-500"
  },
  Subscriptions: {
    base: "#0ea5e9", // sky-500 (Cyan/Blue)
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    text: "text-sky-400",
    bg: "bg-sky-500"
  },
  Shopping: {
    base: "#10b981", // emerald-500
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500"
  },
  Food: {
    base: "#f43f5e", // rose-500
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    text: "text-rose-400",
    bg: "bg-rose-500"
  },
  Bills: {
    base: "#f59e0b", // amber-500
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    text: "text-amber-400",
    bg: "bg-amber-500"
  },
  Entertainment: {
    base: "#8b5cf6", // violet-500
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    text: "text-violet-400",
    bg: "bg-violet-500"
  },
  Salary: {
    base: "#10b981", // emerald-500 (Income)
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    text: "text-emerald-400",
    bg: "bg-emerald-500"
  },
  Other: {
    base: "#64748b", // slate-500
    badge: "bg-slate-800 text-slate-400 border-slate-700",
    text: "text-slate-400",
    bg: "bg-slate-500"
  }
};

export const getCategoryStyle = (categoryName) => {
  return CATEGORY_COLORS[categoryName] || CATEGORY_COLORS.Other;
};
