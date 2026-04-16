import { FinancialSummary, LeaseComparable, SaleComparable } from '@/lib/types';

export function calcWeightedAvgRent(financials: FinancialSummary): number {
  const totals = financials.unitMix.reduce(
    (acc, row) => {
      acc.units += row.units;
      acc.rent += row.avgRent * row.units;
      return acc;
    },
    { units: 0, rent: 0 }
  );

  return totals.units ? totals.rent / totals.units : 0;
}

export function calcBovRange(noi: number, lowCap = 0.0525, highCap = 0.0475): [number, number] {
  return [noi / lowCap, noi / highCap];
}

export function avgSalePricePerUnit(sales: SaleComparable[]): number {
  if (!sales.length) return 0;
  return sales.reduce((sum, sale) => sum + sale.pricePerUnit, 0) / sales.length;
}

export function avgLeaseRentPerSF(leases: LeaseComparable[]): number {
  if (!leases.length) return 0;
  return leases.reduce((sum, lease) => sum + lease.rentPerSF, 0) / leases.length;
}
