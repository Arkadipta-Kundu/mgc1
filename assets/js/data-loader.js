// Data Loader for MigrantConnect Admin Portal
class DataLoader {
    constructor() {
        this.schemes = [];
        this.users = [];
        this.applications = [];
        this.benefits = [];
    }

    async loadAllData() {
        try {
            await Promise.all([
                this.loadSchemes(),
                this.loadUsers(),
                this.loadApplications(),
                this.loadBenefits()
            ]);
            console.log('All data loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading data:', error);
            return false;
        }
    }

    async loadSchemes() {
        try {
            // Try to load from server first
            const response = await fetch('/api/admin/schemes');
            if (response.ok) {
                const data = await response.json();
                this.schemes = data.schemes || [];
                return this.schemes;
            }
        } catch (error) {
            console.log('Server not available, loading from local data');
        }

        // Fallback to local data
        try {
            const response = await fetch('./data/schemes.json');
            if (response.ok) {
                this.schemes = await response.json();
                return this.schemes;
            }
        } catch (error) {
            console.error('Error loading schemes from local data:', error);
        }

        // Use hardcoded data as final fallback
        this.schemes = this.getDefaultSchemes();
        return this.schemes;
    }

    async loadUsers() {
        try {
            const response = await fetch('./data/users.json');
            if (response.ok) {
                const data = await response.text();
                if (data.trim()) {
                    this.users = JSON.parse(data);
                } else {
                    this.users = this.getDefaultUsers();
                }
            } else {
                this.users = this.getDefaultUsers();
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.users = this.getDefaultUsers();
        }
        return this.users;
    }

    async loadApplications() {
        try {
            const response = await fetch('./data/applications.json');
            if (response.ok) {
                const data = await response.text();
                if (data.trim()) {
                    this.applications = JSON.parse(data);
                } else {
                    this.applications = [];
                }
            } else {
                this.applications = [];
            }
        } catch (error) {
            console.error('Error loading applications:', error);
            this.applications = [];
        }
        return this.applications;
    }

    async loadBenefits() {
        try {
            const response = await fetch('./data/benefits.json');
            if (response.ok) {
                const data = await response.text();
                if (data.trim()) {
                    this.benefits = JSON.parse(data);
                } else {
                    this.benefits = [];
                }
            } else {
                this.benefits = [];
            }
        } catch (error) {
            console.error('Error loading benefits:', error);
            this.benefits = [];
        }
        return this.benefits;
    }

    getDefaultSchemes() {
        return [
            {
                "id": 1,
                "name": "Pradhan Mantri Awas Yojana",
                "category": "housing",
                "description": "Affordable housing scheme for urban poor",
                "status": "active",
                "beneficiaries": 1250,
                "criteria": {
                    "maxIncome": 18000,
                    "minFamilySize": 2,
                    "socialCategory": "",
                    "housingStatus": "homeless",
                    "bplRequired": true,
                    "widowPreference": false,
                    "disabilityPreference": false
                }
            },
            {
                "id": 2,
                "name": "Antyodaya Anna Yojana",
                "category": "food",
                "description": "Food security for poorest of poor",
                "status": "active",
                "beneficiaries": 2800,
                "criteria": {
                    "maxIncome": 15000,
                    "minFamilySize": 1,
                    "socialCategory": "",
                    "housingStatus": "",
                    "bplRequired": true,
                    "widowPreference": true,
                    "disabilityPreference": true
                }
            },
            {
                "id": 3,
                "name": "Ayushman Bharat Scheme",
                "category": "health",
                "description": "Health insurance for economically vulnerable",
                "status": "active",
                "beneficiaries": 3500,
                "criteria": {
                    "maxIncome": 25000,
                    "minFamilySize": 1,
                    "socialCategory": "",
                    "housingStatus": "",
                    "bplRequired": false,
                    "widowPreference": false,
                    "disabilityPreference": true
                }
            }
        ];
    }

    getDefaultUsers() {
        return [
            {
                "id": "demo1",
                "name": "Ramesh Kumar Singh",
                "aadhaar": "123456789012",
                "phone": "9876543210",
                "personalInfo": {
                    "fullName": "Ramesh Kumar Singh",
                    "dateOfBirth": "1985-03-15",
                    "gender": "male",
                    "maritalStatus": "married",
                    "phoneNumber": "9876543210",
                    "aadhaarNumber": "123456789012",
                    "panNumber": "ABCDE1234F"
                },
                "familyInfo": {
                    "totalMembers": 4,
                    "dependents": 2,
                    "children": 2
                },
                "incomeEmployment": {
                    "monthlyIncome": 12000,
                    "primaryOccupation": "Construction Worker",
                    "employmentStatus": "self-employed"
                },
                "housingAssets": {
                    "housingStatus": "rented"
                },
                "socialCategory": {
                    "caste": "obc",
                    "religion": "hindu"
                },
                "specialCircumstances": {
                    "hasBPLCard": true,
                    "isWidowed": false
                }
            }
        ];
    }

    // Helper methods for admin portal
    getSchemeById(id) {
        return this.schemes.find(scheme => scheme.id === id);
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    getSchemesByCategory(category) {
        return this.schemes.filter(scheme => scheme.category === category);
    }

    getEligibleSchemes(userData) {
        return this.schemes.filter(scheme => {
            return this.checkEligibility(userData, scheme.criteria).eligible;
        });
    }

    checkEligibility(userData, criteria) {
        const reasons = [];
        let eligible = true;

        // Income check
        if (criteria.maxIncome && userData.incomeEmployment?.monthlyIncome > criteria.maxIncome) {
            eligible = false;
            reasons.push(`Income exceeds limit of ₹${criteria.maxIncome.toLocaleString()}`);
        }

        // Family size check
        if (criteria.minFamilySize && userData.familyInfo?.totalMembers < criteria.minFamilySize) {
            eligible = false;
            reasons.push(`Family size below minimum of ${criteria.minFamilySize}`);
        }

        // Social category check
        if (criteria.socialCategory && criteria.socialCategory !== userData.socialCategory?.caste) {
            eligible = false;
            reasons.push(`Social category doesn't match requirement`);
        }

        // Housing status check
        if (criteria.housingStatus && criteria.housingStatus !== userData.housingAssets?.housingStatus) {
            eligible = false;
            reasons.push(`Housing status doesn't match requirement`);
        }

        // BPL card check
        if (criteria.bplRequired && !userData.specialCircumstances?.hasBPLCard) {
            eligible = false;
            reasons.push('BPL card required but not available');
        }

        // Widow preference
        if (criteria.widowPreference && !userData.specialCircumstances?.isWidowed) {
            reasons.push('Scheme has widow preference');
        }

        // Disability preference
        if (criteria.disabilityPreference && !userData.socialCategory?.hasDisability) {
            reasons.push('Scheme has disability preference');
        }

        return { eligible, reasons };
    }
}

// Global instance
const dataLoader = new DataLoader();
