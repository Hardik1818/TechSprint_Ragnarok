
interface TaxSlab {
    limit: number;
    rate: number;
}

export interface PayrollDetails {
    monthlyGross: number;
    employeeSSF: number; // 11%
    employerSSF: number; // 20%
    annualTax: number;
    monthlyTax: number;
    netMonthlySalary: number;
    dailyPayout: number;
    weeklyPayout: number;
}

export class PayrollCalculator {
    private static WORKING_DAYS_PER_MONTH = 30;

    // Nepal Tax Slabs for 2080/81 (Single) - Simplification for MVP
    // Adjust as per exact government fiscal year rules if strictly needed
    private static TAX_SLABS: TaxSlab[] = [
        { limit: 500000, rate: 0.01 },   // 1% up to 5L
        { limit: 200000, rate: 0.10 },   // 10% next 2L
        { limit: 300000, rate: 0.20 },   // 20% next 3L
        { limit: 1000000, rate: 0.30 },  // 30% next 10L
        { limit: Infinity, rate: 0.36 }  // 36% above 20L
    ];

    /**
     * Calculates full payroll breakdown for an employee
     * @param monthlyGrossSalary The monthly gross salary (NPR)
     * @returns PayrollDetails object with all deductions and final payout
     */
    static calculate(monthlyGrossSalary: number): PayrollDetails {
        // 1. Social Security Fund (SSF)
        const employeeSSF = monthlyGrossSalary * 0.11;
        const employerSSF = monthlyGrossSalary * 0.20;

        // 2. Taxable Income Calculation
        // Taxable income is Gross - Employee SSF (SSF is tax deductible up to limit but for simplicity assuming full deduction here as standard)
        // Note: exact Nepal tax laws have allowances (CIT/Insurance). We use simplified basic rule here.
        const monthlyTaxableIncome = monthlyGrossSalary - employeeSSF;
        const annualTaxableIncome = monthlyTaxableIncome * 12;

        // 3. Income Tax Calculation
        let taxRemaining = annualTaxableIncome;
        let totalAnnualTax = 0;

        for (const slab of this.TAX_SLABS) {
            if (taxRemaining <= 0) break;

            const taxableInThisSlab = Math.min(taxRemaining, slab.limit);
            totalAnnualTax += taxableInThisSlab * slab.rate;
            taxRemaining -= taxableInThisSlab;
        }

        const monthlyTax = totalAnnualTax / 12;

        // 4. Net Salary Calculation
        const netMonthlySalary = monthlyGrossSalary - employeeSSF - monthlyTax;

        // 5. Distribution Payouts
        const dailyPayout = netMonthlySalary / this.WORKING_DAYS_PER_MONTH;
        const weeklyPayout = netMonthlySalary / 4;

        return {
            monthlyGross: monthlyGrossSalary,
            employeeSSF: Math.round(employeeSSF),
            employerSSF: Math.round(employerSSF),
            annualTax: Math.round(totalAnnualTax),
            monthlyTax: Math.round(monthlyTax),
            netMonthlySalary: Math.round(netMonthlySalary),
            dailyPayout: Math.round(dailyPayout),
            weeklyPayout: Math.round(weeklyPayout)
        };
    }
}
