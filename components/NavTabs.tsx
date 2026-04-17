import Link from "next/link";

type ActivePage = "noticias" | "contratos";

export function NavTabs({ active }: { active: ActivePage }) {
  return (
    <div className="flex items-center gap-2">
      <Tab href="/"          label="NOTICIAS"  active={active === "noticias"}  />
      <Tab href="/contratos" label="CONTRATOS" active={active === "contratos"} />
    </div>
  );
}

function Tab({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        fontFamily: "inherit",
        fontSize: "0.78rem",
        letterSpacing: "0.1em",
        padding: "2px 12px",
        textDecoration: "none",
        color:           active ? "#000000"        : "var(--yellow)",
        backgroundColor: active ? "var(--yellow)"  : "transparent",
        border:          "1px solid var(--yellow)",
      }}
    >
      {label}
    </Link>
  );
}
