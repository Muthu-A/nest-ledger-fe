import { useState, type FormEvent } from 'react'
import { categories } from '../../constants/categories'
import type { ExpenseCreatePayload } from '../../services/expenseService'
import Button from '../../components/common/Button'

interface ExpenseFormProps {
  onCreate: (expense: ExpenseCreatePayload) => void
  onClose?: () => void
  loading?: boolean
}

export default function ExpenseForm({ onCreate, onClose ,loading}: ExpenseFormProps) {
  const [category, setCategory] = useState(categories[0].label)
  const [subCategory, setSubCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [notes, setNotes] = useState('')

  const currentGroup = categories.find((group) => group.label === category) ?? categories[0]
  const subCategories = currentGroup.items

  function handleSubmit(event: any) {
    event.preventDefault()

    if (!amount || !date) return

    onCreate({
      category,
      subCategory,
      amount: Number(amount),
      date,
      notes: notes || undefined,
    })

    setAmount('')
    setDate('')
    setNotes('')
  }

  return (
    <form className="page-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* <label style={{ color: "var(--ink)" }}>
          Subcategory
          <select value={subCategory} onChange={(event) => setSubCategory(event.target.value)} style={{ color: "var(--ink)" }}>
            {subCategories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label> */}
         <label style={{ color: "var(--ink)" }}>
          Category
          <input style={{ color: "var(--ink)" }} type="text" value={subCategory} onChange={(event) => setSubCategory(event.target.value)} required />
        </label>
        <label style={{ color: "var(--ink)" }}>
          Amount
          <input style={{ color: "var(--ink)" }} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} min="0" required />
        </label>
        <label style={{ color: "var(--ink)" }}>
          Date
          <input style={{ color: "var(--ink)" }} type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
        </label>
        <label style={{ color: "var(--ink)" }}>
          Notes
          <input style={{ color: "var(--ink)" }} type="text" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
      </div>
      <div className="form-actions">
        <button style={{ color: "var(--ink)" }} type="button" className="button secondary" onClick={onClose}>
          Cancel
        </button>
        <Button text='Save expense' onClick={(e)=>handleSubmit(e)} loading={loading}/>
      </div>
    </form>
  )
}
