export function Link({ to, navigate, children, className }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}
