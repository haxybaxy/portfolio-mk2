import { useEffect, useRef, useState } from 'react'
import { EMAIL } from '../contact'

const RESET_AFTER_MS = 2000

/** Copies the email address and reports `copied` for a couple of seconds afterwards */
export function useCopyEmail() {
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
    } catch {
      return
    }
    setCopied(true)
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setCopied(false), RESET_AFTER_MS)
  }

  return { copied, copy }
}
