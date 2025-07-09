// MigrantConnect Enhanced Utilities
// This file contains utility functions using modern JavaScript libraries

// Enhanced Alert System using SweetAlert2
const AlertUtils = {
    // Success alert
    success: (title, message = '') => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    },

    // Error alert
    error: (title, message = '') => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        });
    },

    // Warning alert
    warning: (title, message = '') => {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });
    },

    // Info alert
    info: (title, message = '') => {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            confirmButtonText: 'OK'
        });
    },

    // Loading alert
    loading: (title = 'Processing...') => {
        return Swal.fire({
            title: title,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    // Close loading
    close: () => {
        Swal.close();
    }
};

// Enhanced HTTP Client using Axios
const ApiClient = {
    // Base configuration
    baseURL: 'http://localhost:3000/api',

    // Default headers
    getHeaders: () => {
        const token = localStorage.getItem('sessionToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    },

    // GET request
    get: async (endpoint) => {
        try {
            const response = await axios.get(`${ApiClient.baseURL}${endpoint}`, {
                headers: ApiClient.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw ApiClient.handleError(error);
        }
    },

    // POST request
    post: async (endpoint, data) => {
        try {
            const response = await axios.post(`${ApiClient.baseURL}${endpoint}`, data, {
                headers: ApiClient.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw ApiClient.handleError(error);
        }
    },

    // PUT request
    put: async (endpoint, data) => {
        try {
            const response = await axios.put(`${ApiClient.baseURL}${endpoint}`, data, {
                headers: ApiClient.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw ApiClient.handleError(error);
        }
    },

    // DELETE request
    delete: async (endpoint) => {
        try {
            const response = await axios.delete(`${ApiClient.baseURL}${endpoint}`, {
                headers: ApiClient.getHeaders()
            });
            return response.data;
        } catch (error) {
            throw ApiClient.handleError(error);
        }
    },

    // Error handler
    handleError: (error) => {
        if (error.response) {
            // Server responded with error status
            return {
                message: error.response.data.error || error.response.data.message || 'Server error',
                status: error.response.status,
                data: error.response.data
            };
        } else if (error.request) {
            // Network error
            return {
                message: 'Network error. Please check your connection.',
                status: 0,
                data: null
            };
        } else {
            // Other error
            return {
                message: error.message || 'An unexpected error occurred',
                status: -1,
                data: null
            };
        }
    }
};

// Date/Time Utilities using Moment.js
const DateUtils = {
    // Format date for display
    formatDate: (date, format = 'DD/MM/YYYY') => {
        return moment(date).format(format);
    },

    // Format datetime for display
    formatDateTime: (date, format = 'DD/MM/YYYY HH:mm') => {
        return moment(date).format(format);
    },

    // Get relative time (e.g., "2 hours ago")
    fromNow: (date) => {
        return moment(date).fromNow();
    },

    // Check if date is valid
    isValid: (date) => {
        return moment(date).isValid();
    },

    // Get days between dates
    daysBetween: (date1, date2) => {
        return moment(date2).diff(moment(date1), 'days');
    },

    // Check if date is expired
    isExpired: (date) => {
        return moment().isAfter(moment(date));
    },

    // Get expiry status with color coding
    getExpiryStatus: (date) => {
        const daysLeft = DateUtils.daysBetween(new Date(), date);

        if (daysLeft < 0) {
            return { status: 'expired', class: 'text-danger', text: 'Expired' };
        } else if (daysLeft <= 30) {
            return { status: 'expiring', class: 'text-warning', text: `Expires in ${daysLeft} days` };
        } else {
            return { status: 'valid', class: 'text-success', text: `Valid until ${DateUtils.formatDate(date)}` };
        }
    }
};

// Data Utilities using Lodash
const DataUtils = {
    // Deep clone object
    clone: (obj) => {
        return _.cloneDeep(obj);
    },

    // Debounce function (useful for search)
    debounce: (func, wait = 300) => {
        return _.debounce(func, wait);
    },

    // Throttle function (useful for scroll events)
    throttle: (func, wait = 100) => {
        return _.throttle(func, wait);
    },

    // Group array by property
    groupBy: (array, property) => {
        return _.groupBy(array, property);
    },

    // Sort array by property
    sortBy: (array, property, order = 'asc') => {
        return order === 'desc' ? _.orderBy(array, [property], ['desc']) : _.sortBy(array, property);
    },

    // Filter array by multiple conditions
    filter: (array, conditions) => {
        return _.filter(array, conditions);
    },

    // Calculate percentage safely
    percentage: (part, total) => {
        if (!total || total === 0) return 0;
        return Math.round((part / total) * 100);
    },

    // Format number with commas
    formatNumber: (num) => {
        return num.toLocaleString('en-IN');
    },

    // Format currency (Indian Rupees)
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }
};

// Chart Utilities using Chart.js
const ChartUtils = {
    // Create usage chart for benefits
    createUsageChart: (canvasId, data) => {
        const ctx = document.getElementById(canvasId).getContext('2d');

        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Used', 'Remaining'],
                datasets: [{
                    data: [data.used, data.total - data.used],
                    backgroundColor: [
                        data.used > data.total * 0.8 ? '#dc3545' : data.used > data.total * 0.6 ? '#ffc107' : '#28a745',
                        '#e9ecef'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    },

    // Create benefits overview chart
    createOverviewChart: (canvasId, benefits) => {
        const ctx = document.getElementById(canvasId).getContext('2d');

        const labels = Object.keys(benefits);
        const data = Object.values(benefits).map(b => b.usage || 0);

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
                datasets: [{
                    label: 'Usage %',
                    data: data,
                    backgroundColor: [
                        '#fd7e14', // Food - Orange
                        '#dc3545', // Health - Red
                        '#6f42c1', // Education - Purple
                        '#198754'  // Finance - Green
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
};

// Form Validation Utilities
const ValidationUtils = {
    // Validate Aadhaar number
    validateAadhaar: (aadhaar) => {
        const cleanAadhaar = aadhaar.replace(/\s/g, '');
        return /^\d{12}$/.test(cleanAadhaar);
    },

    // Validate phone number
    validatePhone: (phone) => {
        const cleanPhone = phone.replace(/[^\d]/g, '');
        return /^[6-9]\d{9}$/.test(cleanPhone);
    },

    // Validate email
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Validate password strength
    validatePassword: (password) => {
        return {
            isValid: password.length >= 6,
            strength: password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 'strong' : 'weak'
        };
    },

    // Format Aadhaar for display
    formatAadhaar: (aadhaar) => {
        const clean = aadhaar.replace(/\D/g, '');
        return clean.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
    },

    // Format phone for display
    formatPhone: (phone) => {
        const clean = phone.replace(/\D/g, '');
        if (clean.startsWith('91')) {
            return `+91-${clean.slice(2, 7)}-${clean.slice(7)}`;
        }
        return `+91-${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
};

// Local Storage Utilities
const StorageUtils = {
    // Set item with expiry
    setWithExpiry: (key, value, ttl = 86400000) => { // 24 hours default
        const now = new Date();
        const item = {
            value: value,
            expiry: now.getTime() + ttl
        };
        localStorage.setItem(key, JSON.stringify(item));
    },

    // Get item with expiry check
    getWithExpiry: (key) => {
        const itemStr = localStorage.getItem(key);
        if (!itemStr) return null;

        const item = JSON.parse(itemStr);
        const now = new Date();

        if (now.getTime() > item.expiry) {
            localStorage.removeItem(key);
            return null;
        }
        return item.value;
    },

    // Clear all app data
    clearAppData: () => {
        const keysToRemove = ['sessionToken', 'currentUser', 'selectedLanguage', 'cachedUserData'];
        keysToRemove.forEach(key => localStorage.removeItem(key));
    }
};

// Export utilities for global use
window.AlertUtils = AlertUtils;
window.ApiClient = ApiClient;
window.DateUtils = DateUtils;
window.DataUtils = DataUtils;
window.ChartUtils = ChartUtils;
window.ValidationUtils = ValidationUtils;
window.StorageUtils = StorageUtils;
