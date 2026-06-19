export default function Button({
  onClick,
  disabled,
  loading = false,
  text,
}: {
  onClick: (e:any) => void;
  disabled?: boolean;
  loading?: boolean;
  text: string;
}) {
  return (
    <button
      type="button"
      className="button primary"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="button-loading">
          <span className="spinner" />
        </span>
      ) : (
        text
      )}
    </button>
  );
}