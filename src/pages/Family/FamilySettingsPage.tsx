import React, { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import MemberCard from '../../components/common/MemberCard'
import InviteModal from '../../components/common/InviteModal'
import ConfirmModal from '../../components/common/ConfirmModal'
import RoleSelect from '../../components/common/RoleSelect'

export default function FamilySettingsPage() {
  const auth = useAuth()
  const fam = auth.family
  const [inviteOpen, setInviteOpen] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<{ id: string; name: string } | null>(null)

  if (!fam) return <div className="p-6">No family</div>

  const members = fam.members ?? []

  const isOwner = auth.userRole === 'owner'

  return (
    <section className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl">{fam.name}</h1>
          <p className="text-sm text-muted">Family ID: {fam.id}</p>
        </div>
        {isOwner && <button className="button primary" onClick={() => setInviteOpen(true)}>Invite member</button>}
      </div>

      <div className="space-y-3">
        {members.map((m) => (
          <div key={m.id} className="flex items-center justify-between">
            <MemberCard member={m} isOwner={isOwner} onRemove={(id) => setConfirmRemove({ id, name: m.name })} />
            {isOwner && (
              <div className="ml-4">
                <RoleSelect value={m.role} onChange={(r) => auth.changeMemberRole(m.id, r)} />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="button danger" onClick={() => auth.logout()}>Leave family</button>
      </div>

      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} onInvite={(email) => auth.inviteMember(email)} />

      <ConfirmModal
        open={!!confirmRemove}
        title="Remove member"
        message={`Remove ${confirmRemove?.name} from the family?`}
        onCancel={() => setConfirmRemove(null)}
        onConfirm={async () => {
          if (confirmRemove) await auth.removeMember(confirmRemove.id)
          setConfirmRemove(null)
        }}
      />
    </section>
  )
}
