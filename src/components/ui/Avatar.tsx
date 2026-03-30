const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg", xl: "w-20 h-20 text-2xl" };

function initials(name: string) {
  const p = name.trim().split(" ").filter(Boolean);
  if (!p.length) return "?";
  return p.length === 1 ? p[0][0].toUpperCase() : (p[0][0] + p[p.length-1][0]).toUpperCase();
}

export function Avatar({ name, size = "md" }: { name: string; size?: keyof typeof sizes }) {
  return (
    <div className={`${sizes[size]} rounded-full bg-accent-primary flex items-center justify-center flex-shrink-0`}>
      <span className="font-bold text-background-primary">{initials(name)}</span>
    </div>
  );
}
