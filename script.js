// Unionen Akassa Calculator
// Based on rules effective after October 1, 2025

class AkassaCalculator {
    constructor() {
        this.MAX_MONTHLY_AMOUNT = 34000; // SEK
        this.DAILY_REDUCTION_FACTOR = 1/22; // Approximately 1/22 per unavailable day
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        // Input elements
        this.previousIncomeInput = document.getElementById('previousIncome');
        this.membershipDurationSelect = document.getElementById('membershipDuration');
        this.workStatusSelect = document.getElementById('workStatus');
        this.monthlyIncomeInput = document.getElementById('monthlyIncome');
        this.unavailableDaysInput = document.getElementById('unavailableDays');
        
        // Button elements
        this.calculateBtn = document.getElementById('calculateBtn');
        
        // Result elements
        this.resultsSection = document.getElementById('resultsSection');
        this.baseAmountSpan = document.getElementById('baseAmount');
        this.incomeReductionSpan = document.getElementById('incomeReduction');
        this.availabilityReductionSpan = document.getElementById('availabilityReduction');
        this.finalAmountSpan = document.getElementById('finalAmount');
        this.replacementRateSpan = document.getElementById('replacementRate');
        this.statusInfoSpan = document.getElementById('statusInfo');
        
        // Scenario buttons
        this.scenarioButtons = document.querySelectorAll('.scenario-btn');
    }

    bindEvents() {
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Auto-calculate on input change
        [this.previousIncomeInput, this.membershipDurationSelect, this.workStatusSelect, 
         this.monthlyIncomeInput, this.unavailableDaysInput].forEach(element => {
            element.addEventListener('input', () => this.calculate());
        });

        // Scenario buttons
        this.scenarioButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const income = parseInt(btn.dataset.income);
                const days = parseInt(btn.dataset.days);
                this.monthlyIncomeInput.value = income;
                this.unavailableDaysInput.value = days;
                this.calculate();
            });
        });
    }

    calculate() {
        try {
            const inputs = this.getInputs();
            const results = this.performCalculation(inputs);
            this.displayResults(results, inputs);
        } catch (error) {
            console.error('Calculation error:', error);
            this.showError('An error occurred during calculation. Check your inputs.');
        }
    }

    getInputs() {
        const previousIncome = parseFloat(this.previousIncomeInput.value) || 0;
        const membershipDuration = parseInt(this.membershipDurationSelect.value);
        const workStatus = this.workStatusSelect.value;
        const monthlyIncome = parseFloat(this.monthlyIncomeInput.value) || 0;
        const unavailableDays = parseInt(this.unavailableDaysInput.value) || 0;

        return {
            previousIncome,
            membershipDuration,
            workStatus,
            monthlyIncome,
            unavailableDays
        };
    }

    performCalculation(inputs) {
        const { previousIncome, membershipDuration, monthlyIncome, unavailableDays } = inputs;

        // Calculate base amount (percentage of previous income, capped at MAX_MONTHLY_AMOUNT)
        const baseAmount = Math.min(previousIncome * (membershipDuration / 100), this.MAX_MONTHLY_AMOUNT);

        // Income reduction: if monthly income >= MAX_MONTHLY_AMOUNT, akassa becomes 0
        let incomeReduction = 0;
        let finalAmount = baseAmount;

        if (monthlyIncome >= this.MAX_MONTHLY_AMOUNT) {
            incomeReduction = baseAmount;
            finalAmount = 0;
        } else if (monthlyIncome > 0) {
            // Proportional reduction based on income
            incomeReduction = Math.min(monthlyIncome, baseAmount);
            finalAmount = Math.max(0, baseAmount - incomeReduction);
        }

        // Availability reduction: reduce by ~1/22 per unavailable day
        const availabilityReduction = finalAmount * unavailableDays * this.DAILY_REDUCTION_FACTOR;
        finalAmount = Math.max(0, finalAmount - availabilityReduction);

        return {
            baseAmount,
            incomeReduction,
            availabilityReduction,
            finalAmount,
            replacementRate: membershipDuration
        };
    }

    displayResults(results, inputs) {
        const { baseAmount, incomeReduction, availabilityReduction, finalAmount, replacementRate } = results;
        const { workStatus } = inputs;

        // Update result values
        this.baseAmountSpan.textContent = this.formatCurrency(baseAmount);
        this.incomeReductionSpan.textContent = this.formatCurrency(incomeReduction);
        this.availabilityReductionSpan.textContent = this.formatCurrency(availabilityReduction);
        this.finalAmountSpan.textContent = this.formatCurrency(finalAmount);
        
        // Update info
        this.replacementRateSpan.textContent = `${replacementRate}%`;
        this.statusInfoSpan.textContent = workStatus === 'unemployed' ? 'Unemployed' : 'Working part-time';

        // Show results section
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'SEK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    showError(message) {
        // Simple error display - could be enhanced with a proper error UI
        alert(message);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AkassaCalculator();
});

// Add some helpful utility functions
window.AkassaUtils = {
    // Calculate total for multiple months
    calculateMultipleMonths: function(scenarios) {
        return scenarios.reduce((total, scenario) => {
            const calculator = new AkassaCalculator();
            const results = calculator.performCalculation(scenario);
            return total + results.finalAmount;
        }, 0);
    },

    // Get optimal income threshold
    getOptimalIncomeThreshold: function(previousIncome, membershipDuration) {
        const baseAmount = Math.min(previousIncome * (membershipDuration / 100), 34000);
        return Math.min(baseAmount, 34000);
    },

    // Calculate break-even point
    getBreakEvenIncome: function(previousIncome, membershipDuration) {
        const baseAmount = Math.min(previousIncome * (membershipDuration / 100), 34000);
        return baseAmount;
    }
};
