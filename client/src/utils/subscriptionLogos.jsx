import { 
  CreditCard, 
  Dumbbell, 
  Film, 
  Headphones, 
  ShoppingBag, 
  Wifi, 
  Zap, 
  Sparkles, 
  Tv, 
  Monitor 
} from "lucide-react"

/**
 * subscriptionLogos.jsx
 * Provides clean, authentic brand logos that match the LedgerFlow dark UI system.
 */
export const getSubscriptionBrand = (title = "", category = "") => {
  const t = (title || "").toLowerCase()
  const c = (category || "").toLowerCase()

  // 1. Netflix
  if (t.includes("netflix")) {
    return {
      name: "Netflix",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#E50914]" aria-label="Netflix">
          <path d="M4 2h4.5l5.5 14.5V2H18v20h-4.5L8 7.5V22H4V2z" />
        </svg>
      )
    }
  }

  // 2. Spotify
  if (t.includes("spotify")) {
    return {
      name: "Spotify",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#1DB954]" aria-label="Spotify">
          <circle cx="12" cy="12" r="10" />
          <path fill="#0b101b" d="M17.5 11.2c-2.4-1.4-6.4-1.5-8.7-.8-.4.1-.7-.1-.9-.5-.1-.4.1-.7.5-.9 2.7-.8 7.1-.6 9.8.9.3.2.4.6.3.9-.2.4-.6.5-1 .4zm-.3 2.7c-.3.4-.8.5-1.2.3-2-1.2-5-1.6-7.3-.9-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 2.7-.8 6-.4 8.2.9.4.2.5.8.3 1.2zm-1.4 2.6c-.2.3-.7.4-1 .2-1.7-1-3.9-1.3-6.4-.7-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 2.8-.6 5.2-.4 7.2.8.3.2.4.7.2 1z" />
        </svg>
      )
    }
  }

  // 3. OpenAI / ChatGPT / AI Services
  if (t.includes("chatgpt") || t.includes("openai") || t.includes("claude") || t.includes("ai ") || t.includes("ai services") || t.includes("copilot")) {
    return {
      name: "AI Services",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current text-teal-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="AI Services">
          <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 3.5 2 4 4 0 0 1 1 3.9 4 4 0 0 1-1.6 3.7 4 4 0 0 1-.9 4.4 4 4 0 0 1-4 1H9a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h3z" />
          <circle cx="12" cy="12" r="2" fill="#2DD4BF" />
        </svg>
      )
    }
  }

  // 4. Adobe Creative Cloud / Creative Tools
  if (t.includes("creative") || t.includes("adobe") || t.includes("photoshop") || t.includes("figma") || t.includes("cloud suite")) {
    return {
      name: "Creative Cloud",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-rose-500" aria-label="Creative Cloud">
          <path d="M14.5 3H21v18h-4.8l-3.2-8.5-2.2 5.8h3.4L15.3 21H9.8l-1.3-3.4H5.3L4.1 21H3L8.5 3h6z" />
        </svg>
      )
    }
  }

  // 5. Electricity & Utilities / Power
  if (t.includes("electric") || t.includes("power") || t.includes("energy") || t.includes("utility") || (c === "bills" && t.includes("bill"))) {
    return {
      name: "Utilities",
      icon: <Zap className="w-5 h-5 text-amber-400 fill-amber-400/20" />
    }
  }

  // 6. Groceries Weekly / Food Provisions
  if (t.includes("grocer") || t.includes("food") || t.includes("market") || t.includes("meal") || c === "food") {
    return {
      name: "Groceries",
      icon: <ShoppingBag className="w-5 h-5 text-rose-400" />
    }
  }

  // 7. Internet / Broadband Fiber / WiFi
  if (t.includes("internet") || t.includes("wifi") || t.includes("broadband") || t.includes("fiber") || t.includes("telecom")) {
    return {
      name: "Broadband",
      icon: <Wifi className="w-5 h-5 text-blue-400" />
    }
  }

  // 8. Amazon Prime
  if (t.includes("prime") || t.includes("amazon")) {
    return {
      name: "Amazon Prime",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-sky-400" aria-label="Amazon Prime">
          <path d="M1.5 13.5c4.5 3 11 3.5 16 1 1-.5 2-1 2.5-1.5.3-.3.1-.7-.3-.6-3.5 1-8.5 1.5-13 0-.8-.3-1.5-.7-2-1-.4-.3-.7.2-.5.6z" />
          <path d="M18.8 11.8c.8.6 1.8 1.4 2.2 2 .2.3 0 .7-.3.7-.6 0-1.4-.4-2.2-.9-.3-.2-.2-.6.1-.8.1 0 .1 0 .2 0z" />
        </svg>
      )
    }
  }

  // 9. Apple
  if (t.includes("apple") || t.includes("icloud") || t.includes("apple music")) {
    return {
      name: "Apple",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-slate-200" aria-label="Apple">
          <path d="M18.7 19.5c-.8 1.2-1.7 2.4-3 2.5-1.4 0-1.8-.8-3.4-.8s-2 .8-3.3.8c-1.3 0-2.3-1.2-3.1-2.4C4.3 17.2 3 13.5 3 10.3c0-3.3 2.1-5.1 4.2-5.1 1.4 0 2.5.9 3.3.9s2.1-.9 3.5-.9c.6 0 2.4.1 3.5 1.7-2.9 1.7-2.4 5.9.5 7.1-.6 1.8-1.5 3.8-2.3 5.5zM15.5 3.5c.6-.8 1.1-1.9 1-3-.9 0-2 .6-2.6 1.4-.6.7-1.1 1.9-1 3 1 .1 2-.6 2.6-1.4z" />
        </svg>
      )
    }
  }

  // 10. YouTube Premium
  if (t.includes("youtube")) {
    return {
      name: "YouTube",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-red-500" aria-label="YouTube">
          <path d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.7 3.5 12 3.5 12 3.5s-7.7 0-9.5.5c-1 .3-1.8 1.1-2.1 2.1C0 8 0 12 0 12s0 4 .4 5.8c.3 1 1 1.8 2.1 2.1 1.8.5 9.5.5 9.5.5s7.7 0 9.5-.5c1-.3 1.8-1.1 2-2.1.5-1.8.5-5.8.5-5.8s0-4-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z" />
        </svg>
      )
    }
  }

  // 11. GitHub
  if (t.includes("github") || t.includes("hosting") || t.includes("server") || t.includes("backup")) {
    return {
      name: "GitHub",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-purple-400" aria-label="GitHub">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      )
    }
  }

  // 12. Gym / Fitness
  if (t.includes("gym") || t.includes("fitness") || t.includes("workout")) {
    return {
      name: "Gym",
      icon: <Dumbbell className="w-5 h-5 text-rose-400" />
    }
  }

  // 13. Fallback by Category
  if (c === "entertainment") {
    return { name: "Entertainment", icon: <Film className="w-5 h-5 text-purple-400" /> }
  }
  if (c === "food") {
    return { name: "Food", icon: <ShoppingBag className="w-5 h-5 text-rose-400" /> }
  }
  if (c === "bills") {
    return { name: "Bills", icon: <Zap className="w-5 h-5 text-amber-400" /> }
  }
  if (c === "travel") {
    return { name: "Travel", icon: <CreditCard className="w-5 h-5 text-purple-400" /> }
  }

  return {
    name: title,
    icon: <CreditCard className="w-5 h-5 text-blue-400" />
  }
}
