export function sanitizeInput(input: string): string {
  if (!input) {
    return "";
  }

  return (
    input
      // Remove script tags and their contents
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      // Remove event handlers
      .replace(/\s*on\w+\s*=\s*["']?[^"'>]*["']?/gi, "")
      // Remove javascript: protocol
      .replace(/javascript:/gi, "")
      // Remove data: protocol
      .replace(/data:/gi, "")
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, "")
      // Remove expression: (IE)
      .replace(/expression\s*\(/gi, "")
      // Trim whitespace
      .trim()
  );
}

// Top-level regex for email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (!password || password.length < 6) {
    return { valid: false, error: "Kata sandi minimal 6 karakter" };
  }

  return { valid: true };
}

export function validateRequired(
  value: string,
  fieldName: string
): { valid: boolean; error?: string } {
  if (!value || value.trim().length === 0) {
    return { valid: false, error: `${fieldName} wajib diisi` };
  }

  return { valid: true };
}

export function validateUserType(type: string): type is "sme" | "influencer" {
  return type === "sme" || type === "influencer";
}
