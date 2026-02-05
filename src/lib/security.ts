export function sanitizeInput(input: string): string {
  if (!input) return ''
  
  return input
    // Remove script tags and their contents
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Remove event handlers
    .replace(/\s*on\w+\s*=\s*["']?[^"'>]*["']?/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove expression: (IE)
    .replace(/expression\s*\(/gi, '')
    // Trim whitespace
    .trim()
}

export function validatePrice(price: number): { valid: boolean; error?: string } {
  const MIN_PRICE = 0
  const MAX_PRICE = 100000 // $100k max

  if (typeof price !== 'number' || isNaN(price)) {
    return { valid: false, error: 'Price must be a valid number' }
  }

  if (price < MIN_PRICE) {
    return { valid: false, error: `Price must be at least $${MIN_PRICE}` }
  }

  if (price > MAX_PRICE) {
    return { valid: false, error: `Price cannot exceed $${MAX_PRICE.toLocaleString()}` }
  }

  return { valid: true }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters' }
  }

  return { valid: true }
}

export function validateRequired(value: string, fieldName: string): { valid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} is required` }
  }

  return { valid: true }
}

export function validateDeliverables(
  selected: string[],
  allowed: string[]
): { valid: boolean; error?: string } {
  if (!selected || selected.length === 0) {
    return { valid: false, error: 'At least one deliverable must be selected' }
  }

  const invalid = selected.filter(d => !allowed.includes(d))
  if (invalid.length > 0) {
    return { valid: false, error: 'Invalid deliverables selected' }
  }

  return { valid: true }
}

export function validateFutureDate(date: string | Date): { valid: boolean; error?: string } {
  const inputDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (isNaN(inputDate.getTime())) {
    return { valid: false, error: 'Invalid date format' }
  }

  if (inputDate < today) {
    return { valid: false, error: 'Date must be in the future' }
  }

  return { valid: true }
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function validateUserType(type: string): type is 'sme' | 'influencer' {
  return type === 'sme' || type === 'influencer'
}
