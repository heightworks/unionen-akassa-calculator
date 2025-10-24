# Unionen Akassa Calculator

A personal calculator for calculating unemployment insurance payments from Unionen Akassa based on the new rules effective after October 1, 2025.

## Features

- **Basic Calculation**: Calculate your monthly akassa based on previous salary and membership
- **Income Reduction**: See how part-time work affects your payment
- **Availability Reduction**: Calculate reduction for sick days, travel, studies etc.
- **Scenario Planning**: Quick calculation for common situations
- **Responsive Design**: Works on both desktop and mobile

## Important Rules (After Oct 2025)

### Maximum Amount
- **34,000 SEK per month** (before tax)

### Replacement Rate
- **12+ months membership**: 80% of previous salary
- **6-11 months membership**: 60% of previous salary  
- **<6 months membership**: 50% of previous salary

### Income Reduction
- If monthly income ≥ 34,000 SEK, akassa = 0 for that month
- Otherwise akassa is reduced proportionally with income

### Availability
- Each unavailable day reduces akassa by ~1/22 of the monthly amount

## Usage

1. **Open `index.html`** in your browser
2. **Fill in basic settings**:
   - Previous monthly salary
   - Membership duration
   - Work status
3. **Enter monthly data**:
   - Monthly income (if any)
   - Days unavailable
4. **Click "Calculate Akassa"** or use scenario buttons

## Common Scenarios

- **Fully Unemployed**: 0 SEK income, 0 unavailable days
- **Part-time Work**: Different income levels (15k, 25k SEK)
- **Sick Days**: 5-10 days unavailable
- **Full Salary**: 35k+ SEK (akassa = 0)

## Technical Information

- **Language**: HTML5, CSS3, Vanilla JavaScript
- **No external dependencies**: Works offline
- **Compatibility**: All modern browsers
- **Responsive**: Optimized for mobile and desktop

## Important Reminders

### Monthly Routines
- **AF Activity Report**: 1-14 every month
- **Akassa Monthly Application**: First week of next month (latest 3 months)

### Documentation
- Save Frilans Finans invoices per month
- Keep Arbetsförmedlingen and Unionen accounts updated
- Register with AF the same day you become unemployed

## Links

- [Unionen Akassa - New Rules](https://www.unionensakassa.se/nyheter/2025/03/nya-regler-for-a-kassa-fran-den-1-oktober/)
- [Unionen - Monthly Application](https://www.unionensakassa.se/nar-du-har-ersattning/sa-fyller-du-i-din-manadsansokan-eller-tidrapport/)
- [Arbetsförmedlingen - Activity Report](https://arbetsformedlingen.se/for-arbetssokande/arbetslos---vad-hander-nu/aktivitetsrapportera)

## Disclaimer

This calculator is for personal use and based on publicly available information about Unionen Akassa rules. Always contact Unionen Akassa for official advice and confirmation of your specific situation.

---

*Created to help with unemployment insurance calculations for seasonal rope access workers.*