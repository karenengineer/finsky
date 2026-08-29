export function sanitizeText(value: string): string {
  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

export function sanitizeOptionalText(value: string | undefined): string | undefined {
  const sanitized = value ? sanitizeText(value) : undefined;
  return sanitized || undefined;
}
