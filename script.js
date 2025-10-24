// Unionen Akassa Calculator - Clean Two-Page Application
// Based on rules effective after October 1, 2025

class AkassaApp {
    constructor() {
        this.MAX_MONTHLY_AMOUNT = 34000; // SEK
        this.DAILY_REDUCTION_FACTOR = 1/22; // Approximately 1/22 per unavailable day
        this.MIN_QUALIFYING_INCOME = 11000; // SEK per month
        
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
        
        // Data page elements
        this.personalIdDisplay = document.getElementById('personal-id-display');
        this.dataStatusDisplay = document.getElementById('data-status-display');
        this.saveAllDataBtn = document.getElementById('save-all-data');
        this.loadDataBtn = document.getElementById('load-data');
        this.exportDataBtn = document.getElementById('export-data');
        this.clearDataBtn = document.getElementById('clear-data');
        
        // Income inputs and summaries
        this.incomeInputs = document.querySelectorAll('.income-input');
        this.notesInputs = document.querySelectorAll('.notes-input');
        this.qualifyingStatuses = document.querySelectorAll('.qualifying-status');
        
        // Eligibility assessment elements
        this.assessmentCheckboxes = document.querySelectorAll('.requirement-checkbox');
        this.decisionStatus = document.getElementById('decision-status');
        this.decisionDetails = document.getElementById('decision-details');
        this.decisionActions = document.getElementById('decision-actions');
        this.applyNowBtn = document.getElementById('apply-now-btn');
        this.prepareBtn = document.getElementById('prepare-btn');
    }

    bindEvents() {
        // Navigation
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchPage(btn.dataset.page));
        });

        // Calculator events
        this.calculateBtn.addEventListener('click', () => this.calculate());
        
        // Only auto-calculate for non-text inputs to avoid jumping
        [this.membershipDurationSelect, this.workStatusSelect, 
         this.monthlyIncomeInput, this.unavailableDaysInput].forEach(element => {
            element.addEventListener('input', () => this.calculate());
        });
        
        // For previous income, only calculate on blur (when you finish typing)
        this.previousIncomeInput.addEventListener('blur', () => this.calculate());

        // Scenario buttons
        document.querySelectorAll('.scenario-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const income = parseInt(btn.dataset.income);
                const days = parseInt(btn.dataset.days);
                this.monthlyIncomeInput.value = income;
                this.unavailableDaysInput.value = days;
                this.calculate();
            });
        });

        // Data page events
        this.incomeInputs.forEach(input => {
            input.addEventListener('input', () => this.updateDataSummaries());
        });
        
        this.saveAllDataBtn.addEventListener('click', () => this.savePersonalData());
        this.loadDataBtn.addEventListener('click', () => this.loadPersonalData(true));
        this.exportDataBtn.addEventListener('click', () => this.exportPersonalData());
        this.clearDataBtn.addEventListener('click', () => this.clearPersonalData());
        
        // Eligibility assessment events
        this.assessmentCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateEligibilityAssessment());
        });
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
        if (pageName === 'data') {
            this.updateDataPage();
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
        const wasHidden = this.resultsSection.style.display === 'none';
        this.resultsSection.style.display = 'block';
        
        // Only scroll if results were hidden (first calculation)
        if (wasHidden) {
            this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    updateDataSummaries() {
        // Update individual month qualifying status
        this.incomeInputs.forEach((input, index) => {
            const income = parseFloat(input.value) || 0;
            const status = this.qualifyingStatuses[index];
            status.textContent = income >= this.MIN_QUALIFYING_INCOME ? '✅' : '❌';
        });

        // Update year summaries
        this.updateYearSummary('2025');
        this.updateYearSummary('2026');
        
        // Update overall summary
        this.updateOverallSummary();
        
        // Update eligibility assessment when income data changes
        this.updateEligibilityAssessment();
    }

    updateYearSummary(year) {
        const yearSection = document.querySelector(`[data-year="${year}"]`);
        const incomeInputs = yearSection.querySelectorAll('.income-input');
        const incomes = Array.from(incomeInputs).map(input => parseFloat(input.value) || 0);
        
        const qualifyingMonths = incomes.filter(income => income >= this.MIN_QUALIFYING_INCOME).length;
        const totalIncome = incomes.reduce((sum, income) => sum + income, 0);
        const averageIncome = totalIncome / incomes.length;
        
        document.getElementById(`${year}-qualifying`).textContent = `${qualifyingMonths}/12`;
        document.getElementById(`${year}-total`).textContent = this.formatCurrency(totalIncome);
        document.getElementById(`${year}-average`).textContent = this.formatCurrency(averageIncome);
    }

    updateOverallSummary() {
        const allIncomes = Array.from(this.incomeInputs).map(input => parseFloat(input.value) || 0);
        const totalQualifying = allIncomes.filter(income => income >= this.MIN_QUALIFYING_INCOME).length;
        const totalIncome = allIncomes.reduce((sum, income) => sum + income, 0);
        const averageMonthly = totalIncome / allIncomes.length;
        
        // Determine eligibility based on official Unionen Akassa rules
        let eligibilityStatus = 'Not Eligible';
        if (totalQualifying >= 11) {
            eligibilityStatus = 'Eligible (300 days)';
        } else if (totalQualifying >= 8) {
            eligibilityStatus = 'Eligible (200 days)';
        } else if (totalQualifying >= 4) {
            eligibilityStatus = 'Eligible (100 days)';
        }
        
        document.getElementById('total-qualifying').textContent = `${totalQualifying}/24`;
        document.getElementById('total-income').textContent = this.formatCurrency(totalIncome);
        document.getElementById('average-monthly').textContent = this.formatCurrency(averageMonthly);
        document.getElementById('overall-eligibility').textContent = eligibilityStatus;
    }

    updateDataPage() {
        this.personalIdDisplay.textContent = this.personalId;
        
        const savedData = localStorage.getItem('akassa_personal_data');
        if (savedData) {
            this.dataStatusDisplay.textContent = 'Data Saved';
            this.dataStatusDisplay.style.color = '#27ae60';
        } else {
            this.dataStatusDisplay.textContent = 'No Data Saved';
            this.dataStatusDisplay.style.color = '#e74c3c';
        }
        
        this.updateDataSummaries();
        this.updateEligibilityAssessment();
    }

    updateEligibilityAssessment() {
        // Update individual requirement statuses
        this.assessmentCheckboxes.forEach(checkbox => {
            const statusSpan = document.getElementById(checkbox.id.replace('-', '-') + '-status');
            if (statusSpan) {
                statusSpan.textContent = checkbox.checked ? '✅' : '❌';
            }
        });

        // Auto-check income requirements based on data
        this.updateIncomeRequirements();

        // Calculate overall eligibility
        this.calculateEligibilityDecision();
    }

    updateIncomeRequirements() {
        // Check if user has qualifying income months
        const allIncomes = Array.from(this.incomeInputs).map(input => parseFloat(input.value) || 0);
        const qualifyingMonths = allIncomes.filter(income => income >= this.MIN_QUALIFYING_INCOME).length;
        
        // Auto-check income-related requirements
        const incomeMonthsCheckbox = document.getElementById('assess-income-months');
        const workHistoryCheckbox = document.getElementById('assess-work-history');
        
        if (incomeMonthsCheckbox) {
            incomeMonthsCheckbox.checked = qualifyingMonths >= 4;
            // Trigger change event to update visual state
            incomeMonthsCheckbox.dispatchEvent(new Event('change'));
        }
        
        if (workHistoryCheckbox) {
            workHistoryCheckbox.checked = allIncomes.some(income => income > 0);
            // Trigger change event to update visual state
            workHistoryCheckbox.dispatchEvent(new Event('change'));
        }
    }

    calculateEligibilityDecision() {
        const checkedBoxes = Array.from(this.assessmentCheckboxes).filter(cb => cb.checked);
        const totalRequirements = this.assessmentCheckboxes.length;
        const metRequirements = checkedBoxes.length;
        
        // Calculate income eligibility
        const allIncomes = Array.from(this.incomeInputs).map(input => parseFloat(input.value) || 0);
        const qualifyingMonths = allIncomes.filter(income => income >= this.MIN_QUALIFYING_INCOME).length;
        
        // Determine eligibility status
        let decision = {
            status: 'incomplete',
            icon: '❓',
            text: 'Complete the checklist above',
            details: 'Fill in your income data and check the requirements to get your eligibility assessment.',
            actions: []
        };

        if (metRequirements >= 10 && qualifyingMonths >= 4) {
            decision = {
                status: 'eligible',
                icon: '✅',
                text: 'ELIGIBLE for Akassa',
                details: `You meet all requirements! You have ${qualifyingMonths} qualifying months and ${metRequirements}/${totalRequirements} requirements met. You can apply for unemployment insurance.`,
                actions: ['apply']
            };
        } else if (metRequirements >= 8 && qualifyingMonths >= 4) {
            decision = {
                status: 'partial',
                icon: '⚠️',
                text: 'LIKELY ELIGIBLE',
                details: `You're close to meeting requirements. You have ${qualifyingMonths} qualifying months and ${metRequirements}/${totalRequirements} requirements met. Review missing requirements and consider applying.`,
                actions: ['prepare']
            };
        } else if (metRequirements >= 6) {
            decision = {
                status: 'partial',
                icon: '⚠️',
                text: 'MAY BE ELIGIBLE',
                details: `You have ${metRequirements}/${totalRequirements} requirements met and ${qualifyingMonths} qualifying months. Some requirements may need attention before applying.`,
                actions: ['prepare']
            };
        } else if (metRequirements > 0) {
            decision = {
                status: 'not-eligible',
                icon: '❌',
                text: 'NOT ELIGIBLE',
                details: `You have ${metRequirements}/${totalRequirements} requirements met and ${qualifyingMonths} qualifying months. You need to meet more requirements before applying.`,
                actions: []
            };
        }

        // Update decision display
        this.decisionStatus.className = `decision-status ${decision.status}`;
        this.decisionStatus.innerHTML = `
            <span class="decision-icon">${decision.icon}</span>
            <span class="decision-text">${decision.text}</span>
        `;
        
        this.decisionDetails.innerHTML = `<p>${decision.details}</p>`;
        
        // Update action buttons
        this.applyNowBtn.style.display = decision.actions.includes('apply') ? 'block' : 'none';
        this.prepareBtn.style.display = decision.actions.includes('prepare') ? 'block' : 'none';
        this.decisionActions.style.display = decision.actions.length > 0 ? 'flex' : 'none';
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
            monthlyData: Array.from(this.incomeInputs).map((input, index) => ({
                month: input.closest('.month-card').dataset.month,
                income: input.value,
                notes: this.notesInputs[index].value
            }))
        };
        
        localStorage.setItem('akassa_personal_data', JSON.stringify(personalData));
        this.showSuccess('Personal data saved successfully!');
        this.updateDataPage();
    }

    loadPersonalData(showMessage = false) {
        const savedData = localStorage.getItem('akassa_personal_data');
        if (!savedData) {
            if (showMessage) {
                this.showError('No saved data found.');
            }
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
            
            // Load monthly data
            if (personalData.monthlyData) {
                personalData.monthlyData.forEach(item => {
                    const monthCard = document.querySelector(`[data-month="${item.month}"]`);
                    if (monthCard) {
                        const incomeInput = monthCard.querySelector('.income-input');
                        const notesInput = monthCard.querySelector('.notes-input');
                        if (incomeInput) incomeInput.value = item.income || '';
                        if (notesInput) notesInput.value = item.notes || '';
                    }
                });
            }
            
            if (showMessage) {
                this.showSuccess('Personal data loaded successfully!');
            }
            this.updateDataSummaries();
            this.updateDataPage();
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
            this.updateDataPage();
            
            // Reset all forms
            this.previousIncomeInput.value = '';
            this.monthlyIncomeInput.value = '';
            this.unavailableDaysInput.value = '';
            this.incomeInputs.forEach(input => input.value = '');
            this.notesInputs.forEach(input => input.value = '');
            
            this.updateDataSummaries();
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