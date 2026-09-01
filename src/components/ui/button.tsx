import { clsx } from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={clsx('button', `button--${variant}`, className)} {...props} />
}
