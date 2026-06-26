const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

const incomeSchema = new mongoose.Schema({ amount: Number, category: String, date: Date }, { timestamps: true })
const expenseSchema = new mongoose.Schema({ amount: Number, category: String, date: Date }, { timestamps: true })

const Income = mongoose.models.Income || mongoose.model('Income', incomeSchema)
const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema)

app.post('/api/income', async (req, res) => {
  try {
    const { amount, category, date } = req.body
    if (amount == null || Number(amount) < 0) return res.status(400).json({ error: 'invalid amount' })
    const doc = await Income.create({ amount: Number(amount), category, date })
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/api/income', async (req, res) => {
  try {
    const q = {}
    if (req.query.category) q.category = String(req.query.category)
    if (req.query.from || req.query.to) {
      q.date = {}
      if (req.query.from) q.date.$gte = new Date(req.query.from)
      if (req.query.to) q.date.$lte = new Date(req.query.to)
    }
    const items = await Income.find(q).lean()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.put('/api/income/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end()
    const doc = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!doc) return res.status(404).end()
    res.json(doc)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.delete('/api/income/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end()
    const doc = await Income.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).end()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.post('/api/expense', async (req, res) => {
  try {
    const { amount, category, date } = req.body
    if (amount == null || Number(amount) < 0) return res.status(400).json({ error: 'invalid amount' })
    const doc = await Expense.create({ amount: Number(amount), category, date })
    res.status(201).json(doc)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.delete('/api/expense/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).end()
    const doc = await Expense.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).end()
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/api/dashboard/summary', async (req, res) => {
  try {
    const inc = await Income.aggregate([{ $group: { _id: null, sum: { $sum: '$amount' } } }])
    const exp = await Expense.aggregate([{ $group: { _id: null, sum: { $sum: '$amount' } } }])
    const totalIncome = inc[0]?.sum || 0
    const totalExpenses = exp[0]?.sum || 0
    res.json({ totalIncome, totalExpenses, balance: totalIncome - totalExpenses })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

app.get('/api/dashboard/recent', async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 }).limit(5).lean()
    const expenses = await Expense.find().sort({ createdAt: -1 }).limit(5).lean()
    const recent = [...incomes.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))]
    recent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    res.json({ recentTransactions: recent.slice(0, 10) })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// Connect if MONGO URI present (useful when running server directly)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI).catch(() => {})
}

module.exports = app

if (require.main === module) {
  const port = process.env.PORT || 4000
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/nestledger'
    mongoose.connect(uri).then(() => {
    app.listen(port, () => {})
  })
}
