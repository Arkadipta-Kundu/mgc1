// MigrantConnect Registration Form Handler
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.progressBar = document.getElementById('progress-bar');
        this.completionPercentage = document.getElementById('completion-percentage');
        this.requiredFields = document.querySelectorAll('.required-field');
        this.totalFields = this.requiredFields.length;

        this.init();
    }

    init() {
        // Add event listeners
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.addFieldListeners();

        // Initial progress calculation
        this.calculateProgress();

        // Update income indicator
        this.setupIncomeIndicator();
    }

    addFieldListeners() {
        this.requiredFields.forEach(field => {
            field.addEventListener('input', this.calculateProgress.bind(this));
            field.addEventListener('change', this.calculateProgress.bind(this));
        });
    }

    calculateProgress() {
        let filledFields = 0;

        this.requiredFields.forEach(field => {
            if (field.value.trim() !== '') {
                filledFields++;
            }
        });

        const percentage = Math.round((filledFields / this.totalFields) * 100);

        this.progressBar.style.width = `${percentage}%`;
        this.completionPercentage.textContent = percentage;
    }

    setupIncomeIndicator() {
        const monthlyIncomeField = document.getElementById('monthlyIncome');
        const incomeIndicator = document.getElementById('income-indicator');

        if (monthlyIncomeField && incomeIndicator) {
            monthlyIncomeField.addEventListener('input', (e) => {
                const income = parseFloat(e.target.value) || 0;
                const povertyLine = 15000; // Approximate poverty line for India

                incomeIndicator.classList.remove('d-none', 'income-below-poverty', 'income-above-poverty');

                if (income > 0) {
                    if (income <= povertyLine) {
                        incomeIndicator.className = 'income-indicator income-below-poverty';
                        incomeIndicator.textContent = '✅ Eligible for multiple government schemes (Below Poverty Line)';
                    } else {
                        incomeIndicator.className = 'income-indicator income-above-poverty';
                        incomeIndicator.textContent = '⚠️ May have limited eligibility for some schemes (Above Poverty Line)';
                    }
                }
            });
        }
    }

    collectFormData() {
        const formData = {
            // Personal Information
            name: document.getElementById('fullName')?.value || '',
            dateOfBirth: document.getElementById('dateOfBirth')?.value || '',
            gender: document.getElementById('gender')?.value || '',
            maritalStatus: document.getElementById('maritalStatus')?.value || '',
            aadhaar: document.getElementById('aadhaarNumber')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            password: document.getElementById('password')?.value || '',

            // Family Information
            familySize: parseInt(document.getElementById('familySize')?.value) || 1,
            dependents: parseInt(document.getElementById('dependents')?.value) || 0,
            children: parseInt(document.getElementById('children')?.value) || 0,
            elderlyMembers: parseInt(document.getElementById('elderlyMembers')?.value) || 0,
            disabledMembers: parseInt(document.getElementById('disabledMembers')?.value) || 0,

            // Income and Employment
            monthlyIncome: parseFloat(document.getElementById('monthlyIncome')?.value) || 0,
            annualIncome: parseFloat(document.getElementById('annualIncome')?.value) || 0,
            employmentType: document.getElementById('employmentType')?.value || '',
            occupation: document.getElementById('occupation')?.value || '',

            // Housing and Assets
            houseOwnership: document.getElementById('houseOwnership')?.value || '',
            houseType: document.getElementById('houseType')?.value || '',
            assets: this.getSelectedAssets(),

            // Location and Migration
            homeState: document.getElementById('homeState')?.value || '',
            currentState: document.getElementById('currentState')?.value || '',
            migrationReason: document.getElementById('migrationReason')?.value || '',
            yearsInCurrentState: parseInt(document.getElementById('yearsInCurrentState')?.value) || 0,

            // Social Category and Special Circumstances
            socialCategory: document.getElementById('socialCategory')?.value || '',
            religion: document.getElementById('religion')?.value || '',
            specialCircumstances: this.getSelectedSpecialCircumstances()
        };

        return formData;
    }

    getSelectedAssets() {
        const assets = [];
        const assetCheckboxes = document.querySelectorAll('input[type="checkbox"][id^="asset-"]');

        assetCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                assets.push(checkbox.value);
            }
        });

        return assets;
    }

    getSelectedSpecialCircumstances() {
        const circumstances = [];
        const circumstanceCheckboxes = document.querySelectorAll('input[type="checkbox"]:not([id^="asset-"])');

        circumstanceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                circumstances.push(checkbox.value);
            }
        });

        return circumstances;
    }

    async handleSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registering...';

            const formData = this.collectFormData();

            // Validate required fields
            if (!this.validateForm(formData)) {
                throw new Error('Please fill all required fields');
            }

            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Registration successful
                this.showSuccess(result);

                // Redirect to QR generation page after 2 seconds
                setTimeout(() => {
                    window.location.href = `qr.html?migrantId=${result.migrantId}`;
                }, 2000);

            } else {
                throw new Error(result.error || 'Registration failed');
            }

        } catch (error) {
            console.error('Registration error:', error);
            this.showError(error.message);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    validateForm(formData) {
        const requiredFields = [
            'name', 'dateOfBirth', 'gender', 'maritalStatus', 'aadhaar', 'phone', 'password',
            'familySize', 'monthlyIncome', 'annualIncome', 'employmentType', 'houseOwnership',
            'homeState', 'currentState', 'socialCategory'
        ];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field] === '') {
                return false;
            }
        }

        // Validate Aadhaar format
        if (!/^\d{12}$/.test(formData.aadhaar)) {
            alert('Please enter a valid 12-digit Aadhaar number');
            return false;
        }

        // Validate phone format
        if (!/^\d{10}$/.test(formData.phone)) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }

        return true;
    }

    showSuccess(result) {
        // Create success message
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        successDiv.style.zIndex = '9999';
        successDiv.innerHTML = `
            <strong>🎉 Registration Successful!</strong><br>
            Your Migrant ID: <strong>${result.migrantId}</strong><br>
            Redirecting to QR code generation...
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(successDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }

    showError(message) {
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `
            <strong>❌ Registration Failed!</strong><br>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(errorDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
}

// Initialize the registration form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RegistrationForm();
});
