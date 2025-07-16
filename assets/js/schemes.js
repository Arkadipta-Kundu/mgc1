// Schemes Page JavaScript
class SchemesManager {
    constructor() {
        this.schemes = [];
        this.filteredSchemes = [];
        this.userProfile = null;
        this.eligibilityResults = {};
        this.currentScheme = null;

        this.init();
    }

    async init() {
        try {
            await this.loadUserProfile();
            await this.loadSchemes();
            await this.checkAllEligibility();
            this.renderSchemes();
        } catch (error) {
            console.error('Error initializing schemes page:', error);
            this.hideLoading();
            this.showError('Failed to load schemes. Please try again.');
        }
    }

    async loadUserProfile() {
        try {
            // Get user data from session
            const userData = localStorage.getItem('userData');
            if (userData) {
                this.userProfile = JSON.parse(userData);
                this.displayUserInfo();
            } else {
                // Try to get from sessionStorage (fallback)
                const sessionToken = localStorage.getItem('sessionToken') || sessionStorage.getItem('sessionToken');
                if (sessionToken) {
                    // In a real app, you'd fetch user data from API using session token
                    this.userProfile = this.getMockUserProfile();
                    this.displayUserInfo();
                }
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        }
    }

    getMockUserProfile() {
        // Mock user profile for demo
        return {
            personalInfo: {
                fullName: "Demo User",
                aadhaarNumber: "****-****-1234"
            },
            familyInfo: {
                totalMembers: 4
            },
            incomeEmployment: {
                monthlyIncome: 15000,
                employmentStatus: "employed"
            },
            socialCategory: {
                caste: "obc"
            },
            specialCircumstances: {
                hasBPLCard: true,
                isWidowed: false
            },
            housingAssets: {
                housingStatus: "rented"
            }
        };
    }

    displayUserInfo() {
        if (this.userProfile) {
            const userName = this.userProfile.personalInfo?.fullName ||
                this.userProfile.name ||
                "User";
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-info-card').classList.remove('d-none');
        }
    }

    async loadSchemes() {
        try {
            const response = await fetch('/api/user/schemes');
            const data = await response.json();

            if (data.success) {
                this.schemes = data.schemes;
                this.filteredSchemes = [...this.schemes];
                document.getElementById('total-schemes-count').textContent = this.schemes.length;
            } else {
                throw new Error(data.message || 'Failed to load schemes');
            }
        } catch (error) {
            console.error('Error loading schemes:', error);
            // Fallback to demo schemes
            this.schemes = this.getDemoSchemes();
            this.filteredSchemes = [...this.schemes];
            document.getElementById('total-schemes-count').textContent = this.schemes.length;
        }
    }

    getDemoSchemes() {
        return [
            {
                id: 1,
                name: "Pradhan Mantri Awas Yojana",
                category: "housing",
                description: "Affordable housing scheme for urban poor providing financial assistance for home construction and purchase",
                benefit_amount: 120000,
                benefit_type: "subsidy",
                max_income: 18000,
                min_family_size: 2,
                bpl_required: true,
                application_process: "Apply through local municipal corporation or designated centers",
                required_documents: ["Aadhaar Card", "Income Certificate", "BPL Card", "Property Documents"]
            },
            {
                id: 2,
                name: "Antyodaya Anna Yojana",
                category: "food",
                description: "Food security scheme providing subsidized food grains to the poorest of poor families",
                benefit_amount: 35,
                benefit_type: "subsidy",
                max_income: 15000,
                min_family_size: 1,
                bpl_required: true,
                widow_preference: true,
                application_process: "Apply at local Fair Price Shop with required documents",
                required_documents: ["Aadhaar Card", "BPL Card", "Income Certificate", "Residence Proof"]
            },
            {
                id: 3,
                name: "Ayushman Bharat Scheme",
                category: "health",
                description: "Health insurance scheme providing cashless treatment up to ₹5 lakh per family per year",
                benefit_amount: 500000,
                benefit_type: "service",
                max_income: 25000,
                min_family_size: 1,
                disability_preference: true,
                application_process: "Apply online or at designated enrollment centers",
                required_documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "Family Photo"]
            }
        ];
    }

    async checkAllEligibility() {
        if (!this.userProfile) return;

        try {
            const response = await fetch('/api/admin/check-eligibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.userProfile)
            });

            const data = await response.json();

            if (data.success) {
                data.results.forEach(result => {
                    this.eligibilityResults[result.schemeId] = result;
                });
            }
        } catch (error) {
            console.error('Error checking eligibility:', error);
            // Mock eligibility for demo
            this.schemes.forEach(scheme => {
                this.eligibilityResults[scheme.id] = this.mockEligibilityCheck(scheme);
            });
        }
    }

    mockEligibilityCheck(scheme) {
        if (!this.userProfile) {
            return { eligible: false, reasons: ["User profile not available"] };
        }

        const reasons = [];
        let eligible = true;

        // Income check
        if (scheme.max_income && this.userProfile.incomeEmployment?.monthlyIncome > scheme.max_income) {
            eligible = false;
            reasons.push(`Income ₹${this.userProfile.incomeEmployment.monthlyIncome.toLocaleString()} exceeds limit of ₹${scheme.max_income.toLocaleString()}`);
        } else if (scheme.max_income) {
            reasons.push(`Income within limit`);
        }

        // Family size check
        if (scheme.min_family_size && this.userProfile.familyInfo?.totalMembers < scheme.min_family_size) {
            eligible = false;
            reasons.push(`Family size below minimum requirement`);
        }

        // BPL card check
        if (scheme.bpl_required && !this.userProfile.specialCircumstances?.hasBPLCard) {
            eligible = false;
            reasons.push('BPL card required but not available');
        }

        return {
            eligible,
            reasons,
            schemeId: scheme.id,
            schemeName: scheme.name
        };
    }

    renderSchemes() {
        const container = document.getElementById('schemes-container');
        container.innerHTML = '';

        if (this.filteredSchemes.length === 0) {
            document.getElementById('no-schemes').classList.remove('d-none');
            this.hideLoading();
            return;
        }

        document.getElementById('no-schemes').classList.add('d-none');

        this.filteredSchemes.forEach(scheme => {
            const eligibility = this.eligibilityResults[scheme.id];
            const card = this.createSchemeCard(scheme, eligibility);
            container.appendChild(card);
        });

        this.hideLoading();
    }

    createSchemeCard(scheme, eligibility) {
        const card = document.createElement('div');
        card.className = 'col-12';

        const isEligible = eligibility?.eligible || false;
        const eligibilityClass = eligibility ? (isEligible ? 'eligible' : 'not-eligible') : 'checking';
        const eligibilityText = eligibility ? (isEligible ? 'Eligible' : 'Not Eligible') : 'Checking...';

        card.innerHTML = `
            <div class="scheme-card position-relative">
                <div class="eligibility-badge ${eligibilityClass}">
                    <i class="fas ${isEligible ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${eligibilityText}
                </div>
                
                <div class="card-body p-4">
                    <div class="scheme-category ${scheme.category}">${scheme.category.toUpperCase()}</div>
                    <h4 class="card-title text-primary mb-3">${scheme.name}</h4>
                    <p class="card-text text-muted mb-3">${scheme.description}</p>
                    
                    ${scheme.benefit_amount ? `
                        <div class="benefit-amount">
                            <h5 class="mb-1">₹${scheme.benefit_amount.toLocaleString()}</h5>
                            <small>${scheme.benefit_type.toUpperCase()} BENEFIT</small>
                        </div>
                    ` : ''}
                    
                    <div class="criteria-list">
                        <h6 class="mb-2"><i class="fas fa-list-check"></i> Eligibility Criteria</h6>
                        ${scheme.max_income ? `<div class="criteria-item"><i class="fas fa-rupee-sign"></i> Max Income: ₹${scheme.max_income.toLocaleString()}/month</div>` : ''}
                        ${scheme.min_family_size ? `<div class="criteria-item"><i class="fas fa-users"></i> Min Family Size: ${scheme.min_family_size}</div>` : ''}
                        ${scheme.bpl_required ? `<div class="criteria-item"><i class="fas fa-id-card"></i> BPL Card Required</div>` : ''}
                        ${scheme.widow_preference ? `<div class="criteria-item"><i class="fas fa-heart"></i> Widow Preference</div>` : ''}
                        ${scheme.disability_preference ? `<div class="criteria-item"><i class="fas fa-wheelchair"></i> Disability Preference</div>` : ''}
                        
                        ${eligibility && eligibility.reasons ? `
                            <div class="mt-2">
                                <small class="text-muted">Your Status:</small>
                                ${eligibility.reasons.map(reason => `<div class="small ${isEligible ? 'text-success' : 'text-danger'}"><i class="fas fa-${isEligible ? 'check' : 'times'} me-1"></i>${reason}</div>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <button class="btn btn-outline-primary" onclick="schemesManager.showSchemeDetails(${scheme.id})">
                            <i class="fas fa-info-circle me-2"></i>View Details
                        </button>
                        <button class="btn btn-apply ${!isEligible ? 'disabled' : ''}" 
                                onclick="schemesManager.applyForScheme(${scheme.id})" 
                                ${!isEligible ? 'disabled' : ''}>
                            <i class="fas fa-paper-plane me-2"></i>Apply Now
                        </button>
                    </div>
                </div>
            </div>
        `;

        return card;
    }

    filterSchemes() {
        const categoryFilter = document.getElementById('category-filter').value;
        const eligibilityFilter = document.getElementById('eligibility-filter').value;
        const searchInput = document.getElementById('search-input').value.toLowerCase();

        this.filteredSchemes = this.schemes.filter(scheme => {
            // Category filter
            if (categoryFilter && scheme.category !== categoryFilter) {
                return false;
            }

            // Eligibility filter
            if (eligibilityFilter) {
                const eligibility = this.eligibilityResults[scheme.id];
                if (eligibilityFilter === 'eligible' && (!eligibility || !eligibility.eligible)) {
                    return false;
                }
                if (eligibilityFilter === 'not-eligible' && eligibility && eligibility.eligible) {
                    return false;
                }
            }

            // Search filter
            if (searchInput && !scheme.name.toLowerCase().includes(searchInput) &&
                !scheme.description.toLowerCase().includes(searchInput)) {
                return false;
            }

            return true;
        });

        this.renderSchemes();
    }

    showSchemeDetails(schemeId) {
        const scheme = this.schemes.find(s => s.id === schemeId);
        if (!scheme) return;

        const modal = new bootstrap.Modal(document.getElementById('applyModal'));
        this.currentScheme = scheme;

        // Populate scheme details
        document.getElementById('scheme-details').innerHTML = `
            <h5>${scheme.name}</h5>
            <p class="text-muted">${scheme.description}</p>
            ${scheme.benefit_amount ? `
                <div class="alert alert-success">
                    <strong>Benefit Amount:</strong> ₹${scheme.benefit_amount.toLocaleString()} (${scheme.benefit_type})
                </div>
            ` : ''}
        `;

        // Populate required documents
        const documents = scheme.required_documents || [];
        document.getElementById('required-documents').innerHTML = documents.length > 0
            ? documents.map(doc => `<span class="badge bg-primary me-2 mb-2">${doc}</span>`).join('')
            : '<span class="text-muted">No specific documents mentioned</span>';

        // Populate application process
        document.getElementById('application-process').innerHTML =
            scheme.application_process || 'Contact local government office for application process.';

        modal.show();
    }

    async applyForScheme(schemeId) {
        const eligibility = this.eligibilityResults[schemeId];
        if (!eligibility || !eligibility.eligible) {
            alert('You are not eligible for this scheme. Please check the eligibility criteria.');
            return;
        }

        this.showSchemeDetails(schemeId);
    }

    async submitApplication() {
        if (!this.currentScheme || !this.userProfile) {
            alert('Please ensure you are logged in and have selected a scheme.');
            return;
        }

        try {
            // In a real application, this would submit to the backend
            const applicationData = {
                userId: this.userProfile.id || 1,
                schemeId: this.currentScheme.id,
                applicationData: {
                    applicationDate: new Date().toISOString(),
                    userProfile: this.userProfile
                }
            };

            // Mock API call
            setTimeout(() => {
                alert(`Application submitted successfully for ${this.currentScheme.name}! You will receive updates on your application status.`);

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('applyModal'));
                modal.hide();

                // Reset current scheme
                this.currentScheme = null;
            }, 1000);

        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Error submitting application. Please try again.');
        }
    }

    hideLoading() {
        document.getElementById('loading-spinner').style.display = 'none';
    }

    showError(message) {
        const container = document.getElementById('schemes-container');
        container.innerHTML = `
            <div class="text-center text-danger">
                <i class="fas fa-exclamation-triangle fa-3x mb-3"></i>
                <h5>Error</h5>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

// Global functions
async function checkAllEligibility() {
    if (schemesManager) {
        document.getElementById('loading-spinner').style.display = 'block';
        await schemesManager.checkAllEligibility();
        schemesManager.renderSchemes();
    }
}

function filterSchemes() {
    if (schemesManager) {
        schemesManager.filterSchemes();
    }
}

function submitApplication() {
    if (schemesManager) {
        schemesManager.submitApplication();
    }
}

// Initialize when page loads
let schemesManager;
document.addEventListener('DOMContentLoaded', function () {
    schemesManager = new SchemesManager();
});
