import { Course } from '../types';

export interface FeeCalculationResult {
  total: number;
  base: number;
  laptop: number;
  minFee: number;
  discount: number;
  firstInstallment: number;
  secondInstallment: number;
}

/**
 * Robust fee calculator that cleanly computes course fees with consistent rounding
 */
export function feeCalculator(
  courses: Course[],
  courseName: string,
  laptopRequired: 'Yes' | 'No',
  civilStatus: string,
  discountAmount: number,
  milCategory?: 'Officer' | 'JCO' | ''
): FeeCalculationResult {
  const found: Partial<Course> = courses.find(c => c.name.toLowerCase().trim() === courseName.toLowerCase().trim()) || { baseFee: 30000, minFee: 20000 };
  
  let base = found.baseFee ?? 30000;
  let minCapVal = found.minFee ?? 20000;

  // Check if Military quota matches specialized base/min caps
  const isMilitary = civilStatus === 'Military' || civilStatus.toLowerCase().includes('military');
  const actualMilCategory = milCategory || (civilStatus.toLowerCase().includes('officer') ? 'Officer' : civilStatus.toLowerCase().includes('lower') || civilStatus.toLowerCase().includes('jco') ? 'JCO' : '');

  if (isMilitary) {
    if (actualMilCategory === 'Officer') {
      base = found.milOfficerBaseFee ?? found.baseFee;
      minCapVal = found.milOfficerMinFee ?? found.minFee;
    } else if (actualMilCategory === 'JCO') {
      base = found.milJcoBaseFee ?? found.baseFee;
      minCapVal = found.milJcoMinFee ?? found.minFee;
    }
  }

  const laptop = laptopRequired === 'Yes' ? 3000 : 0;
  const discount = Number(discountAmount) || 0;
  
  // Consistent rounding
  let total = Math.round(base + laptop - discount);

  // Split calculations
  const firstInstallment = Math.round(total / 2);
  const secondInstallment = total - firstInstallment;

  return {
    total,
    base: Math.round(base),
    laptop: Math.round(laptop),
    minFee: Math.round(minCapVal),
    discount: Math.round(discount),
    firstInstallment,
    secondInstallment
  };
}
