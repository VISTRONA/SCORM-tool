import type { ReactNode } from "react"

interface PageHeaderProps {
  /** Small muted label before the title, e.g. the current section. */
  section?: string
  title: string
  actions?: ReactNode
}

export function PageHeader({ section, title, actions }: PageHeaderProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-5">
      {section && (
        <>
          <span className="text-[13px] text-muted-foreground">{section}</span>
          <span className="text-muted-foreground/50">/</span>
        </>
      )}
      <h1 className="truncate text-[13px] font-medium">{title}</h1>
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  )
}
