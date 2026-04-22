/**
 * Simulate network delay for realistic mock API behavior.
 * @param ms - Delay in milliseconds
 */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
