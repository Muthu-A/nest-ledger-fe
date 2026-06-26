import { expenseService } from '../services/expenseService'
import { incomeService } from '../services/incomeService'
import { budgetService } from '../services/budgetService'
import { goalService } from '../services/goalService'

type VoiceCommandPayload = Record<string, unknown>
type VoiceCommand = {
  module: string
  payload?: VoiceCommandPayload
}

function getString(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function getNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/[,₹$\s]/g, '')
    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7)
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

function getDefaultGoalTargetDate() {
  const date = new Date()
  date.setMonth(date.getMonth() + 6)
  return date.toISOString().slice(0, 10)
}

export async function handleParsedVoiceCommands(parsed: unknown) {
  const voiceParsed = parsed as VoiceCommand
  const commands =
    voiceParsed?.module === 'batch' && Array.isArray(voiceParsed.payload)
      ? (voiceParsed.payload as VoiceCommand[])
      : [voiceParsed]

  const month = getCurrentMonth()
  const date = getTodayDate()
  const goalTargetDate = getDefaultGoalTargetDate()

  for (const command of commands) {
    const module = String(command?.module || '').toLowerCase()
    const payload = (command?.payload as VoiceCommandPayload) || {}

    if (module === 'expense') {
      const expenses = Array.isArray(payload) ? payload : [payload]
      await Promise.all(
        expenses.map((item: VoiceCommandPayload) =>
          expenseService.create({
            category: getString(item.category, getString(item.name, 'Expense')),
            subCategory: getString(item.subCategory, ''),
            amount: getNumber(item.amount, 0),
            date,
            notes: getString(item.notes, 'Added by voice assistant'),
          }),
        ),
      )
    }

    if (module === 'income') {
      await incomeService.create({
        source: getString(payload.source, getString(payload.name, 'Voice income')),
        amount: getNumber(payload.amount, 0),
        date,
        notes: getString(payload.notes, 'Added by voice assistant'),
      })
    }

    if (module === 'budget') {
      await budgetService.createBudget({
        month: getString(payload.month, month),
        category: getString(payload.category, 'General'),
        budgetAmount: getNumber(payload.amount, 0),
      })
    }

    if (module === 'goal') {
      await goalService.createGoal({
        goalName: getString(payload.goalName, getString(payload.name, 'New Goal')),
        category: getString(payload.category, 'General'),
        targetAmount: getNumber(payload.targetAmount, 0),
        currentAmount: 0,
        targetDate: getString(payload.targetDate, goalTargetDate),
        notes: getString(payload.notes, 'Created by voice assistant'),
      })
    }

    if (module === 'goalcontribution' || module === 'goalContribution') {
      // This requires a goalId in the payload. If you only supply name,
      // you need a lookup step first (find the goal by name) or ask the user.
      const goalId = getString(payload.goalId)
      if (goalId) {
        await goalService.addContribution(goalId, {
          amount: getNumber(payload.amount, 0),
          date,
          notes: getString(payload.notes, 'Voice contribution'),
        })
      } else {
        throw new Error('Goal contribution needs a goalId to apply to an existing goal')
      }
    }
  }
}
