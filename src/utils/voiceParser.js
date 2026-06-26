/**
 * voiceParser.js
 * Lightweight, extensible voice command parser for Nest Ledger.
 * Exports: parseVoiceCommand(transcript)
 */

const incomeKeywords = ['salary', 'freelance', 'bonus', 'income', 'pay', 'payout']

function toNumber(str) {
  if (!str) return null
  const cleaned = String(str).replace(/[,₹$€£¥\s]/g, '')
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

function parsePair(segment) {
  const m = segment.trim().match(/(.+?)\s+([₹$€£¥]?\d+[\d,]*)$/)
  if (!m) return null
  const name = capitalizeWords(m[1])
  const amount = toNumber(m[2])
  if (amount == null) return null
  return { name, amount }
}

function looksLikeIncome(name) {
  const lowerName = name.toLowerCase()
  return incomeKeywords.some((k) => lowerName.includes(k))
}

function normalizeText(raw) {
  return String(raw)
    .trim()
    .replace(/[₹$€£¥]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\band\b/gi, ',')
}

function extractCommands(text) {
  const commands = []

  const goalRegex = /create\s+(.+?)\s+goal(?:\s+to\s+(\d+[\d,]*))?/gi
  text = text.replace(goalRegex, (_, goalName, amount) => {
    commands.push({
      module: 'goal',
      payload: {
        goalName: capitalizeWords(goalName),
        targetAmount: toNumber(amount),
      },
    })
    return ''
  })

  const budgetRegex = /(?:set|create)\s+(.+?)\s+budget(?:\s+to)?\s+(\d+[\d,]*)/gi
  text = text.replace(budgetRegex, (_, category, amount) => {
    commands.push({
      module: 'budget',
      payload: {
        category: capitalizeWords(category),
        amount: toNumber(amount),
      },
    })
    return ''
  })

  const contributionRegex = /(?:add|contribute|contributed)\s+(\d+[\d,]*)\s+(?:to|towards?)\s+(.+?)(?=$|,|\s+and\s+|\s+create\s+|\s+set\s+)/gi
  text = text.replace(contributionRegex, (_, amount, goalName) => {
    commands.push({
      module: 'goalContribution',
      payload: {
        goalName: capitalizeWords(goalName),
        amount: toNumber(amount),
      },
    })
    return ''
  })

  const remaining = normalizeText(text)
  const pairs = []
  let match
  const pairRegex = /(.+?)\s+(\d+[\d,]*)(?=\s|$)/g
  while ((match = pairRegex.exec(remaining)) !== null) {
    const parsed = parsePair(match[0])
    if (parsed) pairs.push(parsed)
  }

  if (pairs.length > 0) {
    if (pairs.length === 1 && (looksLikeIncome(pairs[0].name) || incomeKeywords.some((k) => remaining.toLowerCase().includes(k)))) {
      commands.push({
        module: 'income',
        payload: { source: pairs[0].name, amount: pairs[0].amount },
      })
    } else {
      commands.push({
        module: 'expense',
        payload: pairs.map((p) => ({ category: p.name, amount: p.amount })),
      })
    }
  }

  return commands
}

export function parseVoiceCommand(transcript) {
  const raw = (transcript || '').trim()
  const commands = extractCommands(raw)

  if (commands.length === 0) {
    return { module: 'unknown', payload: null, raw }
  }

  return { module: 'batch', payload: commands, raw }
}

export default { parseVoiceCommand }
