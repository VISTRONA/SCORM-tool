import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/** App-wide toasts. The app is light-only, so the theme is fixed. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-right"
      duration={2500}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-3.5 text-primary" />,
        info: <InfoIcon className="size-3.5" />,
        warning: <TriangleAlertIcon className="size-3.5" />,
        error: <OctagonXIcon className="size-3.5 text-destructive" />,
        loading: <Loader2Icon className="size-3.5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--width": "300px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast !gap-2 !px-3 !py-2.5 !text-[13px] !shadow-lg !shadow-black/5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
