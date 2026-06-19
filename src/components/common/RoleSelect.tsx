import React from 'react'

type Props = {
  value: 'owner' | 'editor' | 'viewer'
  onChange: (v: Props['value']) => void
}

export default function RoleSelect({ value, onChange }: Props) {
  return (
    <select className="input" value={value} onChange={(e) => onChange(e.target.value as any)}>
      <option value="owner">Owner</option>
      <option value="editor">Editor</option>
      <option value="viewer">Viewer</option>
    </select>
  )
}
