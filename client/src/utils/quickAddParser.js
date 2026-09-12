export const CATEGORY_KEYWORDS = {
  Food: ['food', 'groceries', 'grocery', 'dinner', 'lunch', 'breakfast', 'brunch', 'snack', 'restaurant', 'cafe', 'coffee', 'starbucks', 'pizza', 'burger', 'sushi', 'drinks', 'bar', 'subway', 'mcdonalds', 'kfc', 'boba'],
  Travel: ['travel', 'uber', 'lyft', 'taxi', 'cab', 'flight', 'airplane', 'airline', 'train', 'metro', 'bus', 'gas', 'fuel', 'petrol', 'parking', 'toll', 'trip', 'hotel', 'airbnb'],
  Bills: ['bill', 'bills', 'electricity', 'power', 'water', 'internet', 'wifi', 'broadband', 'phone', 'mobile', 'utility', 'utilities', 'rent', 'lease', 'insurance', 'tax'],
  Subscriptions: ['subscription', 'subscriptions', 'netflix', 'spotify', 'youtube', 'prime', 'gym', 'fitness', 'icloud', 'apple', 'chatgpt', 'openai', 'adobe', 'patreon', 'github', 'saas'],
  Entertainment: ['entertainment', 'movie', 'cinema', 'theatre', 'theater', 'concert', 'festival', 'game', 'gaming', 'steam', 'playstation', 'xbox', 'ticket', 'tickets', 'party', 'club', 'bowling'],
  Shopping: ['shopping', 'clothes', 'clothing', 'shoes', 'amazon', 'flipkart', 'walmart', 'target', 'headphones', 'gadget', 'electronics', 'laptop', 'iphone', 'ipad', 'watch', 'outfit', 'store'],
  Salary: ['salary', 'paycheck', 'payroll', 'wages', 'client', 'freelance', 'contract', 'stipend', 'bonus', 'dividend', 'interest', 'investment', 'consulting'],
  Other: ['other', 'misc', 'miscellaneous', 'cash', 'transfer']
}

import { CATEGORY_COLORS } from './categoryColors'
export { CATEGORY_COLORS }

export function parseQuickAdd(query) {
  if (!query || !query.trim()) return null

  const lower = query.toLowerCase()

  // 1. Detect Type (Income vs Expense)
  const incomeWords = ['income', 'earned', 'received', 'got', 'salary', 'paycheck', 'client', 'deposit', 'bonus', 'refund', 'cashback', '+']
  const hasIncomeWord = incomeWords.some(w => lower.includes(w))
  const type = hasIncomeWord ? 'income' : 'expense'

  // 2. Detect Recurring
  const recurringWords = ['recurring', 'monthly', 'weekly', 'yearly', 'annual', 'subscription', 'every month']
  let isRecurring = recurringWords.some(w => lower.includes(w))

  // 3. Extract Amount
  // Matches $45, 45.50, ₹1200, 1200 inr, 50usd, etc.
  const amountRegex = /(?:[\$₹€£]|(?:rs\.?|inr|usd)\s*)?(\d+(?:\.\d{1,2})?)(?:\s*(?:rs\.?|inr|usd))?/i
  const match = lower.match(amountRegex)
  let amount = null
  if (match && match[1]) {
    amount = parseFloat(match[1])
  }

  // 4. Detect Category
  let detectedCategory = type === 'income' ? 'Salary' : 'Other'
  let highestScore = 0

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        // longer keyword matches get higher score
        if (kw.length > highestScore) {
          highestScore = kw.length
          detectedCategory = category
        }
      }
    }
  }

  // Automatically mark as recurring if category is Subscriptions
  if (detectedCategory === 'Subscriptions') {
    isRecurring = true
  }

  // 5. Detect Date
  let date = new Date()
  let dateLabel = "Today"

  if (lower.includes('yesterday')) {
    date = new Date(Date.now() - 86400000)
    dateLabel = "Yesterday"
  } else if (lower.includes('tomorrow')) {
    date = new Date(Date.now() + 86400000)
    dateLabel = "Tomorrow"
  } else if (lower.includes('last week')) {
    date = new Date(Date.now() - 86400000 * 7)
    dateLabel = "7 days ago"
  }

  // 6. Extract Clean Title
  // Remove amount, currency signs, and common syntactic filler words
  let clean = query
    .replace(amountRegex, '')
    .replace(/\b(spent|paid|bought|got|received|on|for|at|yesterday|today|tomorrow|last week|recurring|monthly|weekly|annual|subscription|expense|income)\b/gi, '')
    .replace(/[,\$₹€£]/g, '')
    .trim()

  // Clean multiple spaces
  clean = clean.replace(/\s+/g, ' ')

  // Capitalize first letters of clean title
  if (clean.length > 0) {
    clean = clean.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  } else {
    clean = `${detectedCategory} ${type === 'income' ? 'Income' : 'Expense'}`
  }

  return {
    title: clean,
    amount: amount || 0,
    category: detectedCategory,
    type,
    date: date.toISOString().split('T')[0],
    dateLabel,
    isRecurring,
    isValid: amount !== null && amount > 0
  }
}
