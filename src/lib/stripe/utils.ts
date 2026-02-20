/**
 * Stripe utility functions for handling amounts and formatting
 */

/**
 * Convert CAD amount to cents (Stripe format)
 * @param amount - Amount in CAD dollars (e.g., 44.00)
 * @returns Amount in cents (e.g., 4400)
 */
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert cents to CAD amount
 * @param amount - Amount in cents (e.g., 4400)
 * @returns Amount in CAD dollars (e.g., 44.00)
 */
export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

/**
 * Format amount for display
 * @param amount - Amount in cents (e.g., 4400)
 * @param currency - Currency code (default: 'CAD')
 * @returns Formatted string (e.g., "$44.00 CAD")
 */
export function formatAmountForDisplay(
  amount: number,
  currency: string = 'CAD'
): string {
  const dollars = formatAmountFromStripe(amount);
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
  }).format(dollars);
}

/**
 * Get pricing based on early bird eligibility
 * @param isEarlyBird - Whether user is eligible for early bird pricing
 * @returns Price in cents
 */
export function getPricing(isEarlyBird: boolean): number {
  // Early bird: $44 CAD/month = 4400 cents
  // Regular: $62 CAD/month = 6200 cents
  return isEarlyBird ? 4400 : 6200;
}

/**
 * Calculate trial end date (2 months from now)
 * @param startDate - Trial start date (default: now)
 * @returns Trial end date
 */
export function calculateTrialEndDate(startDate: Date = new Date()): Date {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 2); // Add 2 months
  return endDate;
}

/**
 * Check if user is in trial period
 * @param trialEnd - Trial end date
 * @returns True if still in trial, false if trial ended
 */
export function isInTrialPeriod(trialEnd: Date | string): boolean {
  const endDate = typeof trialEnd === 'string' ? new Date(trialEnd) : trialEnd;
  return endDate > new Date();
}







