export default function PageHeader({ title, description, children }) {
  return (
    <header className="max-w-2xl">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {children}
      </div>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </header>
  );
}
