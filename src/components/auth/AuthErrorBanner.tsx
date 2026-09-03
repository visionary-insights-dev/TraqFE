export const AuthErrorBanner = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="rounded-md border border-danger-light bg-danger-light/60 px-4 py-3 text-sm text-danger-dark"
    >
      {message}
    </div>
  );
};
