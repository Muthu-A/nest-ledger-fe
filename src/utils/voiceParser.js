/**
 * voiceParser.js
 * Lightweight, extensible voice command parser for Nest Ledger.
 * Exports: parseVoiceCommand(transcript)
 */

const incomeKeywords = ['salary', 'freelance', 'bonus', 'income', 'pay', 'payout']

function toNumber(str) {
  if (!str) return null
  const cleaned = str.replace(/[,₹$\s]/g, '')
  const n = parseFloat(cleaned)
  return Number.isFinite(n) ? n : null
}

function capitalizeWords(s) {
  return s
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * Parse a single "Name Amount" pair like "Groceries 500"
 */
function parsePair(segment) {
  const m = segment.trim().match(/(.+?)\s+(\d+[\d,]*)$/)
  if (!m) return null
  const name = capitalizeWords(m[1])
  const amount = toNumber(m[2])
  if (amount == null) return null
  return { name, amount }
}

/**
 * Main parser
 * @param {string} transcript
 * @returns {{module: string, payload: any, raw: string}}
 */
export function parseVoiceCommand(transcript) {
  const raw = (transcript || '').trim()
  const t = raw.toLowerCase()

  // Budget: "set groceries budget 8000" or "set groceries budget to 8000"
  const budgetMatch = t.match(/set\s+(.+?)\s+budget(?:\s+to)?\s+(\d+[\d,]*)$/)
  if (budgetMatch) {
    return {
      module: 'budget',
      payload: {
        category: capitalizeWords(budgetMatch[1]),
        amount: toNumber(budgetMatch[2]),
      },
      raw,
    }
  }

  // Goal contribution: "add 5000 to Bike Goal" or "contributed 2000 to Vacation Goal"
  const goalMatch = t.match(/(?:add|contribute|contributed)\s+(\d+[\d,]*)\s+(?:to|towards?)\s+(.+)$/)
  if (goalMatch) {
    return {
      module: 'goalContribution',
      payload: {
        goalName: capitalizeWords(goalMatch[2]),
        amount: toNumber(goalMatch[1]),
      },
      raw,
    }
  }

  // Income: single pair where the name matches income keywords OR the phrase contains known income words
  // Try to find a single pair
  const singlePair = parsePair(raw)
  if (singlePair) {
    const lowerName = singlePair.name.toLowerCase()
    const looksLikeIncome = incomeKeywords.some((k) => lowerName.includes(k)) || incomeKeywords.some((k) => t.includes(k))
    if (looksLikeIncome) {
      return {
        module: 'income',
        payload: { source: singlePair.name, amount: singlePair.amount },
        raw,
      }
    }
  }

  // Expense: support multiple comma-separated entries like "Groceries 500, Petrol 1000"
  // Split on commas or ' and '
  const segments = raw.split(/,|\band\b/)
  const expenses = segments
    .map((s) => parsePair(s))
    .filter(Boolean)
    .map((p) => ({ category: p.name, amount: p.amount }))

  if (expenses.length > 0) {
    return {
      module: 'expense',
      payload: expenses,
      raw,
    }
  }

  // Fallback: if nothing matched, return unknown
  return { module: 'unknown', payload: null, raw }
}

export default { parseVoiceCommand }
