export const FamilySettingsSkeleton = () => {
  return (
    <div style={{ padding: 20 }}>
      {/* Owner */}
      <div className="skeleton-title" />

      <div className="skeleton-owner">
        <div className="skeleton-avatar" />
        <div style={{ flex: 1 }}>
          <div className="skeleton-line short" />
          <div className="skeleton-line" />
        </div>

        <div className="skeleton-badge" />
      </div>

      {/* Members */}
      <div className="skeleton-title" />

      {[1, 2, 3].map((item) => (
        <div key={item} className="skeleton-member">
          <div className="skeleton-avatar" />

          <div style={{ flex: 1 }}>
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
          </div>

          <div className="skeleton-icon" />
        </div>
      ))}

      {/* Add Form */}
      <div className="skeleton-title" />

      <div className="skeleton-input" />
      <div className="skeleton-input" />

      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 20,
        }}
      >
        <div className="skeleton-button" />
        <div className="skeleton-button" />
      </div>
    </div>
  );
};