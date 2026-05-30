export async function runWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit =
      error?.status === 429 ||
      error?.statusCode === 429 ||
      error?.message?.includes("429") ||
      error?.message?.toLowerCase().includes("rate limit") ||
      error?.message?.toLowerCase().includes("too many requests");

    const isTimeout =
      error?.message?.toLowerCase().includes("timeout") ||
      error?.message?.toLowerCase().includes("deadline exceeded");

    // Reintentar si queda intentos y es un error recuperable (429 o Timeout)
    if (retries > 0 && (isRateLimit || isTimeout)) {
      console.warn(
        `Error recuperable detectado (${error.message || "429/Timeout"}). Reintentando en ${delay}ms... (Reintentos restantes: ${retries})`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      return runWithRetry(fn, retries - 1, delay * 2);
    }

    throw error;
  }
}
