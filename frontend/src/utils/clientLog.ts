/**
 * Privacy-safe diagnostics: only enabled in development, logs Firebase-style error codes — never
 * passwords, tokens, emails, or full error payloads.
 */
const extractErrorCode = (error: unknown): string | undefined => {
  if (error != null && typeof error === 'object' && 'code' in error) {
    const c = (error as { code: unknown }).code;
    if (typeof c === 'string') return c;
  }
  return undefined;
};

export const logAppError = (scope: string, error: unknown): void => {
  if (!import.meta.env.DEV) return;
  const code = extractErrorCode(error);
  console.error(`[kinniku:${scope}]`, code ?? 'unknown');
};
