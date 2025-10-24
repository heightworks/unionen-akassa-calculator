// Unionen Akassa Calculator - Multi-Page Application
// Based on rules effective after October 1, 2025

class AkassaApp {
    constructor() {
        this.MAX_MONTHLY_AMOUNT = 34000; // SEK
        this.DAILY_REDUCTION_FACTOR = 1/22; // Approximately 1/22 per unavailable day
        this.MIN_QUALIFYING_INCOME = 11000; // SEK per month
        this.MIN_QUALIFYING_MONTHS = 6; // months in last 12
        
        this.personalId = this.generatePersonalId();
        this.currentPage = 'calculator';
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedData();
    }

    generatePersonalId() {
        // Generate a unique personal ID for data storage
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `akassa_${timestamp}_${random}`;
    }

    initializeElements() {
        // Navigation elements
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.pages = document.querySelectorAll('.page');
        
        // Calculator elements
        this.previousIncomeInput = document.getElementById('previousIncome');
        this.membershipDurationSelect = document.getElementById('membershipDuration');
        this.workStatusSelect = document.getElementById('workStatus');
        this.monthlyIncomeInput = document.getElementById('monthlyIncome');
        this.unavailableDaysInput = document.getElementById('unavailableDays');
        this.calculateBtn = document.getElementById('calculateBtn');
        
        // Calculator result elements
        this.resultsSection = document.getElementById('resultsSection');
        this.baseAmountSpan = document.getElementById('baseAmount');
        this.incomeReductionSpan = document.getElementById('incomeReduction');
        this.availabilityReductionSpan = document.getElementById('availabilityReduction');
        this.finalAmountSpan = document.getElementById('finalAmount');
        this.replacementRateSpan = document.getElementById('replacementRate');
        this.statusInfoSpan = document.getElementById('statusInfo');
        
        // Eligibility elements
        this.requirementCheckboxes = document.querySelectorAll('.requirement-checkbox');
        this.requirementsMetSpan = document.getElementById('requirements-met');
        this.eligibilityStatusSpan = document.getElementById('eligibility-status');
        this.missingRequirementsSpan = document.getElementById('missing-requirements');
        
        // Worksheet elements
        this.incomeInputs = document.querySelectorAll('.income-input');
        this.notesInputs = document.querySelectorAll('.notes-input');
        this.qualifyingIndicators = document.querySelectorAll('.qualifying-indicator');
        this.saveWorksheetBtn = document.getElementById('save-worksheet');
        this.qualifyingMonthsSpan = document.getElementById('qualifying-months');
        this.totalIncomeSpan = document.getElementById('total-income');
        this.averageIncomeSpan = document.getElementById('average-income');
        this.incomeEligibilitySpan = document.getElementById('income-eligibility');
        
        // Dashboard elements
        this.personalIdSpan = document.getElementById('personal-id');
        this.lastUpdatedSpan = document.getElementById('last-updated');
        this.dataStatusSpan = document.getElementById('data-status');
        this.loadDataBtn = document.getElementById('load-data');
        this.exportDataBtn = document.getElementById('export-data');
        this.clearDataBtn = document.getElementById('clear-data');
        this.dataPreviewDiv = document.getElementById('data-preview');
    }

    bindEvents() {
        // Navigation
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchPage(btn.dataset.page));
        });

        // Calculator events
        this.calculateBtn.addEventListener('click', () => this.calculate());
        [this.previousIncomeInput, this.membershipDurationSelect, this.workStatusSelect, 
         this.monthlyIncomeInput, this.unavailableDaysInput].forEach(element => {
            element.addEventListener('input', () => this.calculate());
        });

        // Eligibility events
        this.requirementCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateEligibilityStatus());
        });

        // Worksheet events
        this.incomeInputs.forEach(input => {
            input.addEventListener('input', () => this.updateWorksheetSummary());
        });
        this.saveWorksheetBtn.addEventListener('click', () => this.savePersonalData());

        // Dashboard events
        this.loadDataBtn.addEventListener('click', () => this.loadPersonalData());
        this.exportDataBtn.addEventListener('click', () => this.exportPersonalData());
        this.clearDataBtn.addEventListener('click', () => this.clearPersonalData());
    }

    switchPage(pageName) {
        // Update navigation
        this.navButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-page="${pageName}"]`).classList.add('active');
        
        // Update pages
        this.pages.forEach(page => page.classList.remove('active'));
        document.getElementById(`${pageName}-page`).classList.add('active');
        
        this.currentPage = pageName;
        
        // Update page-specific data
        if (pageName === 'dashboard') {
            this.updateDashboard();
        }
    }

    calculate() {
        try {
            const inputs = this.getInputs();
            
            // Validate required inputs
            if (inputs.previousIncome <= 0) {
                this.showError('Please enter your previous monthly salary to calculate akassa.');
                return;
            }
            
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

    updateEligibilityStatus() {
        const checkedBoxes = Array.from(this.requirementCheckboxes).filter(cb => cb.checked);
        const totalRequirements = this.requirementCheckboxes.length;
        const metRequirements = checkedBoxes.length;
        
        // Update status indicators
        this.requirementCheckboxes.forEach(checkbox => {
            const statusSpan = document.getElementById(checkbox.id.replace('-', '-') + '-status');
            if (statusSpan) {
                statusSpan.textContent = checkbox.checked ? '✅' : '❌';
            }
        });
        
        // Update summary
        this.requirementsMetSpan.textContent = `${metRequirements}/${totalRequirements}`;
        this.missingRequirementsSpan.textContent = `${totalRequirements - metRequirements} items`;
        
        // Determine eligibility status
        let eligibilityStatus = 'Not Eligible';
        if (metRequirements >= 10) {
            eligibilityStatus = 'Likely Eligible';
        } else if (metRequirements >= 8) {
            eligibilityStatus = 'Possibly Eligible';
        } else if (metRequirements >= 6) {
            eligibilityStatus = 'May Need More Info';
        }
        
        this.eligibilityStatusSpan.textContent = eligibilityStatus;
        this.eligibilityStatusSpan.className = `value ${eligibilityStatus.toLowerCase().replace(' ', '-')}`;
    }

    updateWorksheetSummary() {
        const incomes = Array.from(this.incomeInputs).map(input => parseFloat(input.value) || 0);
        const qualifyingMonths = incomes.filter(income => income >= this.MIN_QUALIFYING_INCOME).length;
        const totalIncome = incomes.reduce((sum, income) => sum + income, 0);
        const averageIncome = totalIncome / incomes.length;
        
        // Update qualifying indicators
        this.incomeInputs.forEach((input, index) => {
            const income = parseFloat(input.value) || 0;
            const indicator = this.qualifyingIndicators[index];
            indicator.textContent = income >= this.MIN_QUALIFYING_INCOME ? '✅' : '❌';
        });
        
        // Update summary
        this.qualifyingMonthsSpan.textContent = `${qualifyingMonths}/12`;
        this.totalIncomeSpan.textContent = this.formatCurrency(totalIncome);
        this.averageIncomeSpan.textContent = this.formatCurrency(averageIncome);
        
        // Determine income eligibility
        let incomeEligibility = 'Not Eligible';
        if (qualifyingMonths >= this.MIN_QUALIFYING_MONTHS) {
            incomeEligibility = 'Eligible';
        } else if (qualifyingMonths >= 4) {
            incomeEligibility = 'Close to Eligible';
        }
        
        this.incomeEligibilitySpan.textContent = incomeEligibility;
        this.incomeEligibilitySpan.className = `value ${incomeEligibility.toLowerCase().replace(' ', '-')}`;
    }

    savePersonalData() {
        const personalData = {
            personalId: this.personalId,
            lastUpdated: new Date().toISOString(),
            calculator: {
                previousIncome: this.previousIncomeInput.value,
                membershipDuration: this.membershipDurationSelect.value,
                workStatus: this.workStatusSelect.value
            },
            eligibility: Array.from(this.requirementCheckboxes).map(cb => ({
                id: cb.id,
                checked: cb.checked
            })),
            worksheet: Array.from(this.incomeInputs).map((input, index) => ({
                month: input.closest('.month-row').dataset.month,
                income: input.value,
                notes: this.notesInputs[index].value
            }))
        };
        
        localStorage.setItem('akassa_personal_data', JSON.stringify(personalData));
        this.showSuccess('Personal data saved successfully!');
        this.updateDashboard();
    }

    loadPersonalData() {
        const savedData = localStorage.getItem('akassa_personal_data');
        if (!savedData) {
            this.showError('No saved data found.');
            return;
        }
        
        try {
            const personalData = JSON.parse(savedData);
            
            // Load calculator data
            if (personalData.calculator) {
                this.previousIncomeInput.value = personalData.calculator.previousIncome || '';
                this.membershipDurationSelect.value = personalData.calculator.membershipDuration || '80';
                this.workStatusSelect.value = personalData.calculator.workStatus || 'unemployed';
            }
            
            // Load eligibility data
            if (personalData.eligibility) {
                personalData.eligibility.forEach(item => {
                    const checkbox = document.getElementById(item.id);
                    if (checkbox) {
                        checkbox.checked = item.checked;
                    }
                });
                this.updateEligibilityStatus();
            }
            
            // Load worksheet data
            if (personalData.worksheet) {
                personalData.worksheet.forEach(item => {
                    const row = document.querySelector(`[data-month="${item.month}"]`);
                    if (row) {
                        const incomeInput = row.querySelector('.income-input');
                        const notesInput = row.querySelector('.notes-input');
                        if (incomeInput) incomeInput.value = item.income || '';
                        if (notesInput) notesInput.value = item.notes || '';
                    }
                });
                this.updateWorksheetSummary();
            }
            
            this.showSuccess('Personal data loaded successfully!');
            this.updateDashboard();
        } catch (error) {
            this.showError('Error loading saved data.');
        }
    }

    loadSavedData() {
        // Auto-load data on page load
        this.loadPersonalData();
    }

    exportPersonalData() {
        const savedData = localStorage.getItem('akassa_personal_data');
        if (!savedData) {
            this.showError('No data to export.');
            return;
        }
        
        const dataStr = JSON.stringify(JSON.parse(savedData), null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `akassa_data_${this.personalId}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showSuccess('Data exported successfully!');
    }

    clearPersonalData() {
        if (confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
            localStorage.removeItem('akassa_personal_data');
            this.showSuccess('All data cleared successfully!');
            this.updateDashboard();
            
            // Reset all forms
            this.previousIncomeInput.value = '';
            this.monthlyIncomeInput.value = '';
            this.unavailableDaysInput.value = '';
            this.requirementCheckboxes.forEach(cb => cb.checked = false);
            this.incomeInputs.forEach(input => input.value = '');
            this.notesInputs.forEach(input => input.value = '');
            
            this.updateEligibilityStatus();
            this.updateWorksheetSummary();
        }
    }

    updateDashboard() {
        const savedData = localStorage.getItem('akassa_personal_data');
        
        this.personalIdSpan.textContent = this.personalId;
        
        if (savedData) {
            try {
                const personalData = JSON.parse(savedData);
                this.lastUpdatedSpan.textContent = new Date(personalData.lastUpdated).toLocaleString();
                this.dataStatusSpan.textContent = 'Data Saved';
                this.dataStatusSpan.className = 'value data-saved';
                
                // Update preview
                this.dataPreviewDiv.innerHTML = `
                    <h4>Saved Information:</h4>
                    <p><strong>Calculator:</strong> Previous income: ${personalData.calculator?.previousIncome || 'Not set'} SEK</p>
                    <p><strong>Eligibility:</strong> ${personalData.eligibility?.filter(e => e.checked).length || 0} requirements met</p>
                    <p><strong>Worksheet:</strong> ${personalData.worksheet?.length || 0} months tracked</p>
                `;
            } catch (error) {
                this.dataStatusSpan.textContent = 'Data Error';
                this.dataPreviewDiv.innerHTML = '<p>Error loading saved data.</p>';
            }
        } else {
            this.lastUpdatedSpan.textContent = 'Never';
            this.dataStatusSpan.textContent = 'No Data Saved';
            this.dataStatusSpan.className = 'value no-data';
            this.dataPreviewDiv.innerHTML = '<p>No data loaded. Use the Income Worksheet to enter your information.</p>';
        }
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
        alert('Error: ' + message);
    }

    showSuccess(message) {
        // Simple success display - could be enhanced with a proper success UI
        alert('Success: ' + message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AkassaApp();
});

// Add some helpful utility functions
window.AkassaUtils = {
    // Calculate total for multiple months
    calculateMultipleMonths: function(scenarios) {
        return scenarios.reduce((total, scenario) => {
            const calculator = new AkassaApp();
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