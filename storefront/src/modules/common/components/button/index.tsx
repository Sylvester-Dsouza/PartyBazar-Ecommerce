import { forwardRef, ButtonHTMLAttributes, ReactNode } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"
export type ButtonSize = "sm" | "md" | "lg"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: ButtonVariant
    size?: ButtonSize
    href?: string
    isLoading?: boolean
    fullWidth?: boolean
    className?: string
}

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-sm",
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "party-btn-primary",
    secondary: "party-btn-secondary",
    outline: "party-btn-outline",
    ghost: "party-btn-ghost",
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = "primary",
            size = "md",
            href,
            isLoading = false,
            fullWidth = false,
            className,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseClasses = clx(
            "inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200",
            variantClasses[variant],
            sizeClasses[size],
            fullWidth && "w-full",
            disabled && "opacity-50 cursor-not-allowed",
            isLoading && "opacity-70 cursor-wait",
            className
        )

        // Loading spinner
        const LoadingSpinner = () => (
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
        )

        // If href is provided, render as a link
        if (href) {
            return (
                <LocalizedClientLink href={href} className={baseClasses}>
                    {isLoading && <LoadingSpinner />}
                    {children}
                </LocalizedClientLink>
            )
        }

        return (
            <button
                ref={ref}
                className={baseClasses}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <LoadingSpinner />}
                {children}
            </button>
        )
    }
)

Button.displayName = "Button"

export default Button
