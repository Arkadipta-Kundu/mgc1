// Admin Portal JavaScript
class AdminPortal {
    constructor() {
        this.schemes = [
            {
                id: 1,
                name: "Pradhan Mantri Awas Yojana",
                category: "housing",
                description: "Housing scheme for urban poor",
                status: "active",
                beneficiaries: 1250,
                criteria: {
                    maxIncome: 18000,
                    minFamilySize: 2,
                    socialCategory: "",
                    housingStatus: "homeless",
                    bplRequired: true,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 2,
                name: "Antyodaya Anna Yojana",
                category: "food",
                description: "Food security for poorest of poor",
                status: "active",
                beneficiaries: 2800,
                criteria: {
                    maxIncome: 15000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: true,
                    widowPreference: true,
                    disabilityPreference: true
                }
            },
            {
                id: 3,
                name: "Ayushman Bharat Scheme",
                category: "health",
                description: "Health insurance for economically vulnerable",
                status: "active",
                beneficiaries: 3500,
                criteria: {
                    maxIncome: 25000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: true
                }
            },
            {
                id: 4,
                name: "Pradhan Mantri Mudra Yojana",
                category: "finance",
                description: "Micro-finance for small businesses",
                status: "active",
                beneficiaries: 980,
                criteria: {
                    maxIncome: 50000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 5,
                name: "Pradhan Mantri Kaushal Vikas Yojana",
                category: "education",
                description: "Skill development and vocational training program",
                status: "active",
                beneficiaries: 1850,
                criteria: {
                    maxIncome: 30000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 6,
                name: "Mahatma Gandhi NREGA",
                category: "employment",
                description: "Guaranteed employment for 100 days per year",
                status: "active",
                beneficiaries: 4200,
                criteria: {
                    maxIncome: 20000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 7,
                name: "Pradhan Mantri Jan Aushadhi Yojana",
                category: "health",
                description: "Affordable quality medicines for all",
                status: "active",
                beneficiaries: 2150,
                criteria: {
                    maxIncome: 40000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: true
                }
            },
            {
                id: 8,
                name: "Pradhan Mantri Ujjwala Yojana",
                category: "welfare",
                description: "Free LPG connections for BPL women",
                status: "active",
                beneficiaries: 3800,
                criteria: {
                    maxIncome: 18000,
                    minFamilySize: 2,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: true,
                    widowPreference: true,
                    disabilityPreference: false
                }
            },
            {
                id: 9,
                name: "SC/ST Education Scholarship",
                category: "education",
                description: "Educational support for SC/ST students",
                status: "active",
                beneficiaries: 1620,
                criteria: {
                    maxIncome: 25000,
                    minFamilySize: 1,
                    socialCategory: "sc",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 10,
                name: "OBC Minority Scholarship",
                category: "education",
                description: "Educational assistance for OBC and minority students",
                status: "active",
                beneficiaries: 950,
                criteria: {
                    maxIncome: 22000,
                    minFamilySize: 1,
                    socialCategory: "obc",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 11,
                name: "Widow Pension Scheme",
                category: "welfare",
                description: "Monthly pension for widowed women",
                status: "active",
                beneficiaries: 780,
                criteria: {
                    maxIncome: 15000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: true,
                    widowPreference: true,
                    disabilityPreference: false
                }
            },
            {
                id: 12,
                name: "Disability Pension Scheme",
                category: "welfare",
                description: "Financial assistance for persons with disabilities",
                status: "active",
                beneficiaries: 1320,
                criteria: {
                    maxIncome: 20000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: true
                }
            },
            {
                id: 13,
                name: "Janani Suraksha Yojana",
                category: "health",
                description: "Safe motherhood intervention under NRHM",
                status: "active",
                beneficiaries: 2450,
                criteria: {
                    maxIncome: 30000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 14,
                name: "Pradhan Mantri Fasal Bima Yojana",
                category: "agriculture",
                description: "Crop insurance scheme for farmers",
                status: "active",
                beneficiaries: 890,
                criteria: {
                    maxIncome: 60000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 15,
                name: "Digital India Initiative",
                category: "technology",
                description: "Digital literacy and empowerment program",
                status: "active",
                beneficiaries: 1150,
                criteria: {
                    maxIncome: 35000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 16,
                name: "Stand Up India Scheme",
                category: "finance",
                description: "Bank loans for SC/ST and women entrepreneurs",
                status: "active",
                beneficiaries: 420,
                criteria: {
                    maxIncome: 75000,
                    minFamilySize: 1,
                    socialCategory: "sc",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: true,
                    disabilityPreference: false
                }
            },
            {
                id: 17,
                name: "Sukanya Samriddhi Yojana",
                category: "welfare",
                description: "Small deposit scheme for girl child",
                status: "active",
                beneficiaries: 1580,
                criteria: {
                    maxIncome: 40000,
                    minFamilySize: 2,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 18,
                name: "Atal Pension Yojana",
                category: "finance",
                description: "Pension scheme for unorganized sector",
                status: "active",
                beneficiaries: 2100,
                criteria: {
                    maxIncome: 45000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            },
            {
                id: 19,
                name: "National Health Mission",
                category: "health",
                description: "Comprehensive healthcare for rural and urban poor",
                status: "active",
                beneficiaries: 5200,
                criteria: {
                    maxIncome: 35000,
                    minFamilySize: 1,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: true,
                    widowPreference: true,
                    disabilityPreference: true
                }
            },
            {
                id: 20,
                name: "Swachh Bharat Mission",
                category: "welfare",
                description: "Sanitation and cleanliness initiative",
                status: "active",
                beneficiaries: 3650,
                criteria: {
                    maxIncome: 25000,
                    minFamilySize: 2,
                    socialCategory: "",
                    housingStatus: "",
                    bplRequired: false,
                    widowPreference: false,
                    disabilityPreference: false
                }
            }
        ];

        this.videoStream = null;

        this.demoUsers = {
            demo1: {
                personalInfo: {
                    fullName: "Ramesh Kumar Singh",
                    fatherName: "Rajesh Singh",
                    motherName: "Sunita Singh",
                    dateOfBirth: "1985-06-15",
                    gender: "male",
                    maritalStatus: "married",
                    phoneNumber: "9876543210",
                    email: "ramesh.singh@email.com",
                    aadhaarNumber: "1234-****-****-5678",
                    panNumber: "ABCDE****F"
                },
                familyInfo: {
                    totalMembers: 4,
                    children: 2,
                    dependentAdults: 1,
                    familyMembers: [
                        { name: "Ramesh Kumar Singh", age: 38, relation: "self", occupation: "Construction Worker" },
                        { name: "Meera Singh", age: 35, relation: "wife", occupation: "Domestic Helper" },
                        { name: "Ankit Singh", age: 12, relation: "son", occupation: "Student" },
                        { name: "Priya Singh", age: 8, relation: "daughter", occupation: "Student" }
                    ]
                },
                incomeEmployment: {
                    employmentStatus: "self-employed",
                    primaryOccupation: "Construction Worker",
                    monthlyIncome: 12000,
                    hasRegularIncome: false,
                    workLocation: "Delhi NCR",
                    skillSets: ["Construction", "Masonry"]
                },
                housingAssets: {
                    housingStatus: "rented",
                    monthlyRent: 4500,
                    hasLandProperty: false,
                    hasBankAccount: true,
                    hasVehicle: false,
                    hasLivestock: false
                },
                locationMigration: {
                    currentState: "Delhi",
                    currentDistrict: "New Delhi",
                    originState: "Bihar",
                    originDistrict: "Patna",
                    migrationYear: 2018,
                    migrationReason: "employment"
                },
                socialCategory: {
                    caste: "obc",
                    religion: "hindu",
                    hasDisability: false,
                    isMinority: false
                },
                specialCircumstances: {
                    hasBPLCard: true,
                    isWidowed: false,
                    isSingleParent: false,
                    hasChronicIllness: false,
                    isPregnant: false,
                    hasSeniorCitizen: false
                }
            },
            demo2: {
                personalInfo: {
                    fullName: "Priya Sharma",
                    fatherName: "Mohan Sharma",
                    motherName: "Kamala Sharma",
                    dateOfBirth: "1992-03-22",
                    gender: "female",
                    maritalStatus: "widowed",
                    phoneNumber: "8765432109",
                    email: "priya.sharma@email.com",
                    aadhaarNumber: "2345-****-****-6789",
                    panNumber: "FGHIJ****K"
                },
                familyInfo: {
                    totalMembers: 3,
                    children: 2,
                    dependentAdults: 0,
                    familyMembers: [
                        { name: "Priya Sharma", age: 31, relation: "self", occupation: "Domestic Helper" },
                        { name: "Ravi Sharma", age: 10, relation: "son", occupation: "Student" },
                        { name: "Kavya Sharma", age: 6, relation: "daughter", occupation: "Student" }
                    ]
                },
                incomeEmployment: {
                    employmentStatus: "employed",
                    primaryOccupation: "Domestic Helper",
                    monthlyIncome: 8000,
                    hasRegularIncome: true,
                    workLocation: "Mumbai",
                    skillSets: ["Housekeeping", "Cooking"]
                },
                housingAssets: {
                    housingStatus: "rented",
                    monthlyRent: 6000,
                    hasLandProperty: false,
                    hasBankAccount: true,
                    hasVehicle: false,
                    hasLivestock: false
                },
                locationMigration: {
                    currentState: "Maharashtra",
                    currentDistrict: "Mumbai",
                    originState: "Uttar Pradesh",
                    originDistrict: "Agra",
                    migrationYear: 2019,
                    migrationReason: "employment"
                },
                socialCategory: {
                    caste: "general",
                    religion: "hindu",
                    hasDisability: false,
                    isMinority: false
                },
                specialCircumstances: {
                    hasBPLCard: true,
                    isWidowed: true,
                    isSingleParent: true,
                    hasChronicIllness: false,
                    isPregnant: false,
                    hasSeniorCitizen: false
                }
            },
            demo3: {
                personalInfo: {
                    fullName: "Arjun Das",
                    fatherName: "Suresh Das",
                    motherName: "Rekha Das",
                    dateOfBirth: "2003-11-10",
                    gender: "male",
                    maritalStatus: "single",
                    phoneNumber: "7654321098",
                    email: "arjun.das@email.com",
                    aadhaarNumber: "3456-****-****-7890",
                    panNumber: "KLMNO****P"
                },
                familyInfo: {
                    totalMembers: 5,
                    children: 2,
                    dependentAdults: 2,
                    familyMembers: [
                        { name: "Suresh Das", age: 55, relation: "father", occupation: "Daily Wage Laborer" },
                        { name: "Rekha Das", age: 50, relation: "mother", occupation: "Homemaker" },
                        { name: "Arjun Das", age: 20, relation: "self", occupation: "Student" },
                        { name: "Sneha Das", age: 16, relation: "sister", occupation: "Student" },
                        { name: "Gopal Das", age: 75, relation: "grandfather", occupation: "Retired" }
                    ]
                },
                incomeEmployment: {
                    employmentStatus: "student",
                    primaryOccupation: "Student",
                    monthlyIncome: 0,
                    hasRegularIncome: false,
                    workLocation: "Kolkata",
                    skillSets: ["Computer Skills", "English"]
                },
                housingAssets: {
                    housingStatus: "rented",
                    monthlyRent: 3500,
                    hasLandProperty: false,
                    hasBankAccount: true,
                    hasVehicle: false,
                    hasLivestock: false
                },
                locationMigration: {
                    currentState: "West Bengal",
                    currentDistrict: "Kolkata",
                    originState: "Odisha",
                    originDistrict: "Cuttack",
                    migrationYear: 2020,
                    migrationReason: "education"
                },
                socialCategory: {
                    caste: "sc",
                    religion: "hindu",
                    hasDisability: false,
                    isMinority: false
                },
                specialCircumstances: {
                    hasBPLCard: true,
                    isWidowed: false,
                    isSingleParent: false,
                    hasChronicIllness: false,
                    isPregnant: false,
                    hasSeniorCitizen: true
                }
            }
        };

        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.updateStatistics();
        this.loadSchemes();
        this.showDashboard();
        this.initializeQRScanner();
    }

    updateStatistics() {
        // Fetch real statistics from API
        fetch('/api/admin/statistics')
            .then(response => response.json())
            .then(data => {
                document.getElementById('total-schemes').textContent = data.totalSchemes || 0;
                document.getElementById('total-beneficiaries').textContent = (data.totalBeneficiaries || 0).toLocaleString();
                document.getElementById('qr-scans-today').textContent = data.qrScansToday || 0;
                document.getElementById('pending-approvals').textContent = data.pendingApplications || 0;
            })
            .catch(error => {
                console.error('Error fetching statistics:', error);
                // Fallback to demo data with updated counts
                document.getElementById('total-schemes').textContent = '20';
                document.getElementById('total-beneficiaries').textContent = '45,230';
                document.getElementById('qr-scans-today').textContent = Math.floor(Math.random() * 80) + 40;
                document.getElementById('pending-approvals').textContent = Math.floor(Math.random() * 35) + 15;
            });
    }

    showDashboard() {
        this.hideAllSections();
        this.currentSection = 'dashboard';
    }

    showQRScanner() {
        this.hideAllSections();
        document.getElementById('qr-scanner-section').classList.remove('d-none');
        this.currentSection = 'qr-scanner';

        // Check QR library status when opening scanner
        this.checkQRLibraryStatus();
    }

    showSchemeManagement() {
        this.hideAllSections();
        document.getElementById('scheme-management-section').classList.remove('d-none');
        this.loadSchemes();
        this.currentSection = 'scheme-management';
    }

    showReports() {
        this.hideAllSections();
        document.getElementById('reports-section').classList.remove('d-none');
        this.loadReports();
        this.currentSection = 'reports';
    }

    hideAllSections() {
        document.getElementById('qr-scanner-section').classList.add('d-none');
        document.getElementById('scheme-management-section').classList.add('d-none');
        document.getElementById('reports-section').classList.add('d-none');
    }

    loadDemoUser() {
        const selectedUser = document.getElementById('demo-user-select').value;
        if (!selectedUser || !this.demoUsers[selectedUser]) {
            alert('Please select a demo user');
            return;
        }

        const userData = this.demoUsers[selectedUser];
        this.displayCitizenInfo(userData);
        this.checkEligibility(userData);
    }

    simulateQRScan() {
        // For demo purposes, use the selected user from dropdown
        const selectedUser = document.getElementById('demo-user-select').value;
        if (selectedUser && this.demoUsers[selectedUser]) {
            const userData = this.demoUsers[selectedUser];
            this.displayCitizenInfo(userData);
            this.checkEligibility(userData);
        } else {
            // If no selection, show a random user
            const userKeys = Object.keys(this.demoUsers);
            const randomUser = userKeys[Math.floor(Math.random() * userKeys.length)];
            const userData = this.demoUsers[randomUser];

            document.getElementById('demo-user-select').value = randomUser;
            this.displayCitizenInfo(userData);
            this.checkEligibility(userData);
        }
    }

    displayCitizenInfo(userData) {
        const citizenInfoDiv = document.getElementById('citizen-info');

        citizenInfoDiv.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6 class="text-primary"><i class="fas fa-user"></i> Personal Information</h6>
                    <p><strong>Name:</strong> ${userData.personalInfo.fullName}</p>
                    <p><strong>DOB:</strong> ${new Date(userData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                    <p><strong>Gender:</strong> ${userData.personalInfo.gender.charAt(0).toUpperCase() + userData.personalInfo.gender.slice(1)}</p>
                    <p><strong>Phone:</strong> ${userData.personalInfo.phoneNumber}</p>
                    <p><strong>Aadhaar:</strong> ${userData.personalInfo.aadhaarNumber}</p>
                    <p><strong>PAN:</strong> ${userData.personalInfo.panNumber}</p>
                </div>
                <div class="col-md-6">
                    <h6 class="text-primary"><i class="fas fa-users"></i> Family & Economic Info</h6>
                    <p><strong>Family Size:</strong> ${userData.familyInfo.totalMembers} members</p>
                    <p><strong>Monthly Income:</strong> ₹${userData.incomeEmployment.monthlyIncome.toLocaleString()}</p>
                    <p><strong>Occupation:</strong> ${userData.incomeEmployment.primaryOccupation}</p>
                    <p><strong>Housing:</strong> ${userData.housingAssets.housingStatus.charAt(0).toUpperCase() + userData.housingAssets.housingStatus.slice(1)}</p>
                    <p><strong>Social Category:</strong> ${userData.socialCategory.caste.toUpperCase()}</p>
                    <p><strong>BPL Card:</strong> ${userData.specialCircumstances.hasBPLCard ? 'Yes' : 'No'}</p>
                </div>
            </div>
        `;
    }

    checkEligibility(userData) {
        const eligibleSchemes = [];
        const ineligibleSchemes = [];

        this.schemes.forEach(scheme => {
            const eligibility = this.evaluateEligibility(userData, scheme.criteria);
            if (eligibility.eligible) {
                eligibleSchemes.push({ scheme, reasons: eligibility.reasons });
            } else {
                ineligibleSchemes.push({ scheme, reasons: eligibility.reasons });
            }
        });

        this.displayEligibilityResults(eligibleSchemes, ineligibleSchemes);
    }

    evaluateEligibility(userData, criteria) {
        const reasons = [];
        let eligible = true;

        // Income check
        if (criteria.maxIncome && userData.incomeEmployment.monthlyIncome > criteria.maxIncome) {
            eligible = false;
            reasons.push(`Income ₹${userData.incomeEmployment.monthlyIncome.toLocaleString()} exceeds limit of ₹${criteria.maxIncome.toLocaleString()}`);
        } else if (criteria.maxIncome) {
            reasons.push(`Income ₹${userData.incomeEmployment.monthlyIncome.toLocaleString()} is within limit`);
        }

        // Family size check
        if (criteria.minFamilySize && userData.familyInfo.totalMembers < criteria.minFamilySize) {
            eligible = false;
            reasons.push(`Family size ${userData.familyInfo.totalMembers} is below minimum of ${criteria.minFamilySize}`);
        } else if (criteria.minFamilySize) {
            reasons.push(`Family size ${userData.familyInfo.totalMembers} meets minimum requirement`);
        }

        // Social category check
        if (criteria.socialCategory && criteria.socialCategory !== userData.socialCategory.caste) {
            eligible = false;
            reasons.push(`Social category ${userData.socialCategory.caste.toUpperCase()} doesn't match required ${criteria.socialCategory.toUpperCase()}`);
        } else if (criteria.socialCategory) {
            reasons.push(`Social category ${userData.socialCategory.caste.toUpperCase()} matches requirement`);
        }

        // Housing status check
        if (criteria.housingStatus && criteria.housingStatus !== userData.housingAssets.housingStatus) {
            eligible = false;
            reasons.push(`Housing status '${userData.housingAssets.housingStatus}' doesn't match required '${criteria.housingStatus}'`);
        } else if (criteria.housingStatus) {
            reasons.push(`Housing status '${userData.housingAssets.housingStatus}' matches requirement`);
        }

        // BPL card check
        if (criteria.bplRequired && !userData.specialCircumstances.hasBPLCard) {
            eligible = false;
            reasons.push('BPL card required but not available');
        } else if (criteria.bplRequired) {
            reasons.push('BPL card requirement satisfied');
        }

        // Widow preference
        if (criteria.widowPreference && userData.specialCircumstances.isWidowed) {
            reasons.push('Eligible for widow preference');
        }

        // Disability preference
        if (criteria.disabilityPreference && userData.socialCategory.hasDisability) {
            reasons.push('Eligible for disability preference');
        }

        return { eligible, reasons };
    }

    displayEligibilityResults(eligibleSchemes, ineligibleSchemes) {
        const resultsDiv = document.getElementById('eligibility-results');
        const contentDiv = document.getElementById('eligibility-content');

        let html = '';

        if (eligibleSchemes.length > 0) {
            html += '<h6 class="text-success mb-3"><i class="fas fa-check-circle"></i> Eligible Schemes</h6>';
            eligibleSchemes.forEach(({ scheme, reasons }) => {
                html += `
                    <div class="eligibility-result">
                        <h6>${scheme.name} (${scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)})</h6>
                        <p class="text-muted mb-2">${scheme.description}</p>
                        <ul class="mb-0">
                            ${reasons.map(reason => `<li class="small">${reason}</li>`).join('')}
                        </ul>
                        <div class="mt-2">
                            <button class="btn btn-success btn-sm">Apply Now</button>
                            <button class="btn btn-outline-primary btn-sm">View Details</button>
                        </div>
                    </div>
                `;
            });
        }

        if (ineligibleSchemes.length > 0) {
            html += '<h6 class="text-danger mb-3 mt-4"><i class="fas fa-times-circle"></i> Not Eligible</h6>';
            ineligibleSchemes.forEach(({ scheme, reasons }) => {
                html += `
                    <div class="eligibility-result not-eligible">
                        <h6>${scheme.name} (${scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)})</h6>
                        <p class="text-muted mb-2">${scheme.description}</p>
                        <ul class="mb-0">
                            ${reasons.map(reason => `<li class="small">${reason}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });
        }

        contentDiv.innerHTML = html;
        resultsDiv.classList.remove('d-none');
    }

    loadSchemes() {
        const tbody = document.getElementById('schemes-table-body');
        tbody.innerHTML = '';

        this.schemes.forEach(scheme => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${scheme.name}</strong>
                    <br><small class="text-muted">${scheme.description}</small>
                </td>
                <td>
                    <span class="badge bg-primary">${scheme.category.charAt(0).toUpperCase() + scheme.category.slice(1)}</span>
                </td>
                <td>
                    <small>
                        ${scheme.criteria.maxIncome ? `Max Income: ₹${scheme.criteria.maxIncome.toLocaleString()}<br>` : ''}
                        ${scheme.criteria.minFamilySize ? `Min Family: ${scheme.criteria.minFamilySize}<br>` : ''}
                        ${scheme.criteria.bplRequired ? 'BPL Required<br>' : ''}
                        ${scheme.criteria.socialCategory ? `Category: ${scheme.criteria.socialCategory.toUpperCase()}<br>` : ''}
                    </small>
                </td>
                <td>
                    <span class="scheme-badge ${scheme.status === 'active' ? 'scheme-active' : 'scheme-inactive'}">
                        ${scheme.status.charAt(0).toUpperCase() + scheme.status.slice(1)}
                    </span>
                </td>
                <td>
                    <strong>${scheme.beneficiaries.toLocaleString()}</strong>
                </td>
                <td>
                    <button class="btn btn-outline-primary btn-sm me-1" onclick="adminPortal.editScheme(${scheme.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="adminPortal.deleteScheme(${scheme.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    showCreateSchemeModal() {
        const modal = new bootstrap.Modal(document.getElementById('createSchemeModal'));
        modal.show();
    }

    async createScheme() {
        const formData = {
            name: document.getElementById('scheme-name').value,
            category: document.getElementById('scheme-category').value,
            description: document.getElementById('scheme-description').value,
            criteria: {
                maxIncome: parseInt(document.getElementById('max-income').value) || null,
                minFamilySize: parseInt(document.getElementById('min-family-size').value) || 1,
                socialCategory: document.getElementById('social-category-criteria').value || '',
                housingStatus: document.getElementById('housing-criteria').value || '',
                bplRequired: document.getElementById('bpl-required').checked,
                widowPreference: document.getElementById('widow-preference').checked,
                disabilityPreference: document.getElementById('disability-preference').checked
            }
        };

        if (!formData.name || !formData.category) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const response = await fetch('/api/admin/schemes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                this.loadSchemesFromServer();
                this.updateStatistics();

                // Close modal and reset form
                const modal = bootstrap.Modal.getInstance(document.getElementById('createSchemeModal'));
                modal.hide();
                document.getElementById('scheme-form').reset();

                alert('Scheme created successfully!');
            } else {
                alert('Error creating scheme: ' + result.message);
            }
        } catch (error) {
            console.error('Error creating scheme:', error);
            alert('Error creating scheme. Please try again.');
        }
    }

    editScheme(id) {
        const scheme = this.schemes.find(s => s.id === id);
        if (scheme) {
            alert(`Edit functionality for "${scheme.name}" would be implemented here`);
        }
    }

    async deleteScheme(id) {
        if (confirm('Are you sure you want to delete this scheme?')) {
            try {
                const response = await fetch(`/api/admin/schemes/${id}`, {
                    method: 'DELETE'
                });

                const result = await response.json();

                if (result.success) {
                    this.loadSchemesFromServer();
                    this.updateStatistics();
                    alert('Scheme deleted successfully!');
                } else {
                    alert('Error deleting scheme: ' + result.message);
                }
            } catch (error) {
                console.error('Error deleting scheme:', error);
                alert('Error deleting scheme. Please try again.');
            }
        }
    }

    loadReports() {
        // Load recent activities
        const activities = [
            'QR scan for Ramesh Kumar Singh - 3 schemes eligible',
            'New scheme "Digital Skills Training" created',
            'Priya Sharma applied for Antyodaya Anna Yojana',
            'Ayushman Bharat scheme updated',
            'QR scan for Arjun Das - 2 schemes eligible'
        ];

        const activitiesDiv = document.getElementById('recent-activities');
        activitiesDiv.innerHTML = activities.map(activity =>
            `<div class="border-bottom pb-2 mb-2">
                <small class="text-muted">${new Date().toLocaleTimeString()}</small>
                <div>${activity}</div>
            </div>`
        ).join('');
    }

    // QR Scanner Functions
    async startCameraScanner() {
        try {
            this.videoStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            const video = document.getElementById('camera-video');
            video.srcObject = this.videoStream;

            document.getElementById('camera-preview').classList.remove('d-none');

            // Start QR detection
            this.startQRDetection(video);
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access denied or not available. Please use the image upload option.');
        }
    }

    stopCamera() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
        document.getElementById('camera-preview').classList.add('d-none');
    }

    startQRDetection(video) {
        // Real QR detection using jsQR library
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        const detectQR = () => {
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get image data for QR detection
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                // Use jsQR to detect QR code
                if (typeof jsQR !== 'undefined') {
                    const code = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "dontInvert",
                    });

                    if (code) {
                        console.log("QR Code detected:", code.data);
                        clearInterval(this.qrDetectionInterval);
                        this.stopCamera();
                        this.processQRData(code.data);
                        return;
                    }
                } else {
                    console.error('jsQR library not loaded');
                    // Fallback to simulation
                    setTimeout(() => {
                        this.simulateQRDetection();
                    }, 3000);
                    return;
                }
            }
        };

        // Check for QR every 100ms for better detection
        this.qrDetectionInterval = setInterval(detectQR, 100);

        // Auto-stop after 30 seconds to prevent infinite scanning
        setTimeout(() => {
            if (this.qrDetectionInterval) {
                clearInterval(this.qrDetectionInterval);
                this.stopCamera();
                alert('QR scanning timeout. Please try again or use the simulation button.');
            }
        }, 30000);
    }

    simulateQRDetection() {
        clearInterval(this.qrDetectionInterval);
        this.stopCamera();

        // Simulate QR detection - in real scenario, this would come from QR library
        const selectedUser = document.getElementById('demo-user-select').value;
        if (selectedUser && this.demoUsers[selectedUser]) {
            const userData = this.demoUsers[selectedUser];
            this.processQRData(JSON.stringify(this.convertToQRFormat(userData)));
        } else {
            alert('Please select a user first for QR simulation');
        }
    }

    convertToQRFormat(userData) {
        // Convert admin portal user data to QR format that matches what's generated
        return {
            migrantId: userData.personalInfo.aadhaarNumber.slice(-6),
            name: userData.personalInfo.fullName,
            aadhaar: `****${userData.personalInfo.aadhaarNumber.slice(-4)}`,
            phone: `****${userData.personalInfo.phoneNumber.slice(-4)}`,
            panNumber: userData.personalInfo.panNumber ? `****${userData.personalInfo.panNumber.slice(-4)}` : null,
            dateOfBirth: userData.personalInfo.dateOfBirth,
            gender: userData.personalInfo.gender,
            maritalStatus: userData.personalInfo.maritalStatus,
            familySize: userData.familyInfo.totalMembers,
            dependents: userData.familyInfo.dependents,
            children: userData.familyInfo.children,
            elderlyMembers: userData.familyInfo.elderlyMembers,
            disabledMembers: userData.familyInfo.disabledMembers,
            monthlyIncome: userData.incomeEmployment.monthlyIncome,
            annualIncome: userData.incomeEmployment.monthlyIncome * 12,
            employmentType: userData.incomeEmployment.employmentStatus,
            occupation: userData.incomeEmployment.primaryOccupation,
            houseOwnership: userData.housingAssets.housingStatus,
            houseType: userData.housingAssets.houseType || 'unknown',
            homeState: userData.locationMigration.originState,
            currentState: userData.locationMigration.currentState,
            migrationReason: userData.locationMigration.migrationReason,
            yearsInCurrentState: new Date().getFullYear() - userData.locationMigration.migrationYear,
            socialCategory: userData.socialCategory.caste,
            religion: userData.socialCategory.religion,
            specialCircumstances: {
                hasBPLCard: userData.specialCircumstances.hasBPLCard,
                isWidowed: userData.specialCircumstances.isWidowed,
                hasDisability: userData.socialCategory.hasDisability,
                hasChronicIllness: userData.specialCircumstances.hasChronicIllness,
                isPregnant: userData.specialCircumstances.isPregnant,
                hasSeniorCitizen: userData.specialCircumstances.hasSeniorCitizen
            },
            generatedAt: new Date().toISOString(),
            version: '2.0'
        };
    } processQRData(qrContent) {
        try {
            // Validate QR data first
            this.validateQRData(qrContent);

            const qrData = JSON.parse(qrContent);

            console.log('Processing QR data:', qrData);

            // Convert QR data back to display format
            const userData = this.convertFromQRFormat(qrData);

            this.displayCitizenInfo(userData);
            this.checkEligibility(userData);

            alert(`QR Code processed successfully for ${qrData.name}!`);

        } catch (error) {
            console.error('Error processing QR data:', error);
            alert(`QR processing failed: ${error.message}\n\nPlease ensure you're scanning a valid MigrantConnect QR code or use the demo simulation.`);
        }
    }

    convertFromQRFormat(qrData) {
        // Convert QR format back to admin portal format for display
        return {
            personalInfo: {
                fullName: qrData.name,
                dateOfBirth: qrData.dateOfBirth,
                gender: qrData.gender,
                maritalStatus: qrData.maritalStatus,
                phoneNumber: qrData.phone,
                aadhaarNumber: qrData.aadhaar,
                panNumber: qrData.panNumber
            },
            familyInfo: {
                totalMembers: qrData.familySize,
                dependents: qrData.dependents,
                children: qrData.children,
                elderlyMembers: qrData.elderlyMembers,
                disabledMembers: qrData.disabledMembers
            },
            incomeEmployment: {
                monthlyIncome: qrData.monthlyIncome,
                primaryOccupation: qrData.occupation,
                employmentStatus: qrData.employmentType
            },
            housingAssets: {
                housingStatus: qrData.houseOwnership,
                houseType: qrData.houseType
            },
            locationMigration: {
                currentState: qrData.currentState,
                originState: qrData.homeState,
                migrationReason: qrData.migrationReason,
                migrationYear: new Date().getFullYear() - qrData.yearsInCurrentState
            },
            socialCategory: {
                caste: qrData.socialCategory,
                religion: qrData.religion,
                hasDisability: qrData.specialCircumstances?.hasDisability || false
            },
            specialCircumstances: {
                hasBPLCard: qrData.specialCircumstances?.hasBPLCard || false,
                isWidowed: qrData.specialCircumstances?.isWidowed || false,
                hasChronicIllness: qrData.specialCircumstances?.hasChronicIllness || false,
                isPregnant: qrData.specialCircumstances?.isPregnant || false,
                hasSeniorCitizen: qrData.specialCircumstances?.hasSeniorCitizen || false
            }
        };
    }

    captureQRFromCamera() {
        const video = document.getElementById('camera-video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        // Convert to blob and process
        canvas.toBlob((blob) => {
            this.processQRBlob(blob);
        }, 'image/jpeg', 0.9);
    } processQRImage(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file');
            return;
        }

        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById('uploaded-qr-image');
            img.src = e.target.result;
            document.getElementById('qr-image-preview').classList.remove('d-none');
        };
        reader.readAsDataURL(file);

        // Show processing indicator
        const processingDiv = document.createElement('div');
        processingDiv.id = 'qr-processing';
        processingDiv.className = 'alert alert-info mt-2';
        processingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning QR code from image...';
        document.getElementById('qr-image-preview').appendChild(processingDiv);

        // Process QR code from the uploaded file
        this.processQRImageEnhanced(file)
            .then(qrData => {
                console.log('QR decoded successfully:', qrData);
                processingDiv.className = 'alert alert-success mt-2';
                processingDiv.innerHTML = '<i class="fas fa-check"></i> QR code successfully decoded!';
                setTimeout(() => processingDiv.remove(), 3000);
            })
            .catch(error => {
                console.error('QR decoding failed:', error);
                processingDiv.className = 'alert alert-warning mt-2';
                processingDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${error.message}<br>
                    <small>Tip: Make sure the QR code is clear and well-lit. You can also try the camera scanner or use the demo simulation.</small>`;

                // Add retry button
                const retryBtn = document.createElement('button');
                retryBtn.className = 'btn btn-sm btn-primary mt-2';
                retryBtn.innerHTML = 'Try Demo Simulation';
                retryBtn.onclick = () => {
                    processingDiv.remove();
                    this.simulateQRDetectionForImage();
                };
                processingDiv.appendChild(retryBtn);

                // Remove error message after 10 seconds
                setTimeout(() => processingDiv.remove(), 10000);
            });
    }

    // Simulate QR detection for uploaded images when real detection fails
    simulateQRDetectionForImage() {
        const selectedUser = document.getElementById('demo-user-select').value;
        if (selectedUser && this.demoUsers[selectedUser]) {
            const userData = this.demoUsers[selectedUser];
            const qrData = this.convertToQRFormat(userData);
            this.processQRData(JSON.stringify(qrData));

            // Show simulation notice
            const simulationDiv = document.createElement('div');
            simulationDiv.className = 'alert alert-info mt-2';
            simulationDiv.innerHTML = '<i class="fas fa-info-circle"></i> Using simulation data for selected demo user.';
            document.getElementById('qr-image-preview').appendChild(simulationDiv);
            setTimeout(() => simulationDiv.remove(), 5000);
        } else {
            alert('Please select a demo user first for simulation.');
        }
    }

    decodeUploadedQR() {
        const img = document.getElementById('uploaded-qr-image');
        if (!img.src) {
            alert('Please upload an image first');
            return;
        }

        // Show processing message
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'alert alert-info mt-3';
        loadingMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing QR code...';
        document.getElementById('qr-image-preview').appendChild(loadingMessage);

        // Simulate QR decoding process
        setTimeout(() => {
            try {
                // In a real implementation, you would use a QR decoding library like jsQR
                // For demo, we'll use the selected user data formatted as QR
                const selectedUser = document.getElementById('demo-user-select').value;
                if (selectedUser && this.demoUsers[selectedUser]) {
                    const userData = this.demoUsers[selectedUser];
                    const qrData = this.convertToQRFormat(userData);
                    this.processQRData(JSON.stringify(qrData));
                } else {
                    throw new Error('Please select a demo user first');
                }

                // Remove loading message
                loadingMessage.remove();

            } catch (error) {
                console.error('QR decoding error:', error);
                loadingMessage.className = 'alert alert-danger mt-3';
                loadingMessage.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Failed to decode QR code. Please ensure it is a valid MigrantConnect QR code.';

                setTimeout(() => loadingMessage.remove(), 3000);
            }
        }, 2000); // Simulate processing time
    }

    processQRBlob(blob) {
        // Process QR from camera capture
        this.decodeUploadedQR();
    }    // Real QR code decoding using jsQR library
    async decodeQRFromCanvas(canvas) {
        try {
            const context = canvas.getContext('2d');
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

            // Use jsQR library to decode QR code
            if (typeof jsQR !== 'undefined') {
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "attemptBoth",
                });

                if (code) {
                    console.log("QR Code decoded from image:", code.data);
                    return code.data;
                } else {
                    throw new Error('No QR code detected in the image');
                }
            } else {
                throw new Error('jsQR library not available');
            }
        } catch (error) {
            throw new Error('Failed to decode QR code: ' + error.message);
        }
    }

    // Enhanced image processing for QR upload with real decoding
    async processQRImageEnhanced(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Create canvas to process image
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');

                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);

                    // Try to decode QR from canvas using jsQR
                    this.decodeQRFromCanvas(canvas)
                        .then(qrData => {
                            // Process the actual QR data
                            this.processQRData(qrData);
                            resolve(qrData);
                        })
                        .catch(error => {
                            console.error('QR decoding failed:', error);
                            reject(error);
                        });
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Add handler for demo user selection
    handleDemoUserSelection() {
        const selectElement = document.getElementById('demo-user-select');
        if (selectElement) {
            selectElement.addEventListener('change', (e) => {
                const selectedUser = e.target.value;
                if (selectedUser && this.demoUsers[selectedUser]) {
                    const userData = this.demoUsers[selectedUser];
                    this.displayCitizenInfo(userData);
                    this.checkEligibility(userData);
                }
            });
        }
    }

    // Initialize QR scanner with proper event handlers
    initializeQRScanner() {
        // Add event listener for demo user selection
        this.handleDemoUserSelection();

        // Add file input handler for QR image upload
        const fileInput = document.getElementById('qr-file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.processQRImage(e);
            });
        }

        // Check QR library status
        this.checkQRLibraryStatus();
    }

    // Debug QR library availability
    checkQRLibraryStatus() {
        const statusDiv = document.createElement('div');
        statusDiv.className = 'alert alert-info mt-2';

        if (typeof jsQR !== 'undefined') {
            statusDiv.innerHTML = '<i class="fas fa-check-circle text-success"></i> jsQR library loaded successfully. Real QR detection enabled.';
            console.log('jsQR library version:', jsQR.version || 'Unknown');
        } else {
            statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle text-warning"></i> jsQR library not available. Using simulation mode.';
            console.error('jsQR library not loaded');
        }

        // Add to QR scanner section
        const qrSection = document.getElementById('qr-scanner-section');
        if (qrSection) {
            qrSection.appendChild(statusDiv);
            setTimeout(() => statusDiv.remove(), 5000);
        }
    }

    // Enhanced QR validation
    validateQRData(qrData) {
        try {
            const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;

            // Check required fields
            const requiredFields = ['migrantId', 'name'];
            const missingFields = requiredFields.filter(field => !parsed[field]);

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            // Check data integrity
            if (parsed.version && parseFloat(parsed.version) < 1.0) {
                console.warn('Old QR code version detected:', parsed.version);
            }

            return true;
        } catch (error) {
            throw new Error(`Invalid QR data: ${error.message}`);
        }
    }

    // Process manually pasted QR data
    processManualQRInput() {
        const qrInput = document.getElementById('manual-qr-input');
        const qrData = qrInput.value.trim();

        if (!qrData) {
            alert('Please paste QR code data first');
            return;
        }

        try {
            // Try to parse as JSON
            JSON.parse(qrData);
            this.processQRData(qrData);
            qrInput.value = ''; // Clear input after successful processing

            // Show success message
            const successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success mt-2';
            successDiv.innerHTML = '<i class="fas fa-check"></i> QR data processed successfully!';
            qrInput.parentNode.appendChild(successDiv);
            setTimeout(() => successDiv.remove(), 3000);

        } catch (error) {
            alert('Invalid QR data format. Please ensure you paste valid JSON data from a MigrantConnect QR code.');
            console.error('Manual QR input error:', error);
        }
    }

    // Generate sample QR data for testing
    generateSampleQRData() {
        const selectedUser = document.getElementById('demo-user-select').value;
        if (selectedUser && this.demoUsers[selectedUser]) {
            const userData = this.demoUsers[selectedUser];
            const qrData = this.convertToQRFormat(userData);
            const qrJson = JSON.stringify(qrData, null, 2);

            // Display in the manual input area
            const qrInput = document.getElementById('manual-qr-input');
            qrInput.value = qrJson;

            // Show info message
            const infoDiv = document.createElement('div');
            infoDiv.className = 'alert alert-info mt-2';
            infoDiv.innerHTML = '<i class="fas fa-info-circle"></i> Sample QR data generated. Click "Process QR Data" to test.';
            qrInput.parentNode.appendChild(infoDiv);
            setTimeout(() => infoDiv.remove(), 5000);
        } else {
            alert('Please select a demo user first');
        }
    }
}

// Global functions for HTML onclick events
function showQRScanner() {
    adminPortal.showQRScanner();
}

function showSchemeManagement() {
    adminPortal.showSchemeManagement();
}

function showReports() {
    adminPortal.showReports();
}

function simulateQRScan() {
    adminPortal.simulateQRScan();
}

function loadDemoUser() {
    adminPortal.loadDemoUser();
}

function showCreateSchemeModal() {
    adminPortal.showCreateSchemeModal();
}

function createScheme() {
    adminPortal.createScheme();
}

// QR Scanner Functions
function startCameraScanner() {
    adminPortal.startCameraScanner();
}

function stopCamera() {
    adminPortal.stopCamera();
}

function captureQRFromCamera() {
    adminPortal.captureQRFromCamera();
}

function processQRImage(event) {
    adminPortal.processQRImage(event);
}

function decodeUploadedQR() {
    adminPortal.decodeUploadedQR();
}

// Initialize admin portal when page loads
let adminPortal;
document.addEventListener('DOMContentLoaded', function () {
    adminPortal = new AdminPortal();
    // Initialize QR scanner functionality
    adminPortal.initializeQRScanner();
});
