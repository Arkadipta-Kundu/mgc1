// MigrantConnect - Main JavaScript File

// API Base URL - update this to match your backend
const API_BASE_URL = 'http://localhost:3000/api';

// Current user data (will be fetched from backend)
let currentUserData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function () {
    // Immediately hide offline banner if this is a benefit page
    if (window.location.pathname.includes('food.html') ||
        window.location.pathname.includes('health.html') ||
        window.location.pathname.includes('education.html') ||
        window.location.pathname.includes('finance.html')) {

        console.log('🏥 Benefit page detected - immediately hiding offline banner');
        const offlineBanner = document.getElementById('offline-banner');
        if (offlineBanner) {
            offlineBanner.classList.add('d-none');
            offlineBanner.style.display = 'none';
            console.log('✅ Offline banner hidden immediately on benefit page');
        }
    }

    // Wait a bit for external libraries to load
    setTimeout(() => {
        initializeApp();
    }, 100);
});

function initializeApp() {
    checkOnlineStatus();
    initializeTranslations();

    // Check which page we're on and initialize accordingly
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        initializeLoginPage();
    } else if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    } else if (window.location.pathname.includes('qr.html')) {
        initializeQRPage();
    } else if (window.location.pathname.includes('food.html') ||
        window.location.pathname.includes('health.html') ||
        window.location.pathname.includes('education.html') ||
        window.location.pathname.includes('finance.html')) {
        initializeBenefitPage();
    }

    // Setup logout functionality for all pages that have logout buttons
    setupLogoutButton();

    // Set up offline/online event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
}

// Check if user is logged in
async function checkAuth() {
    console.log('🔍 checkAuth() called');

    // Try both new and old storage methods for compatibility
    let sessionToken = null;

    // First try the new method with expiry
    if (typeof StorageUtils !== 'undefined') {
        sessionToken = StorageUtils.getWithExpiry('sessionToken');
        console.log('📦 StorageUtils available, token from expiry storage:', sessionToken ? 'found' : 'not found');
    }

    // Fallback to regular localStorage if utils not loaded or token not found
    if (!sessionToken) {
        sessionToken = localStorage.getItem('sessionToken');
        console.log('📦 Fallback to localStorage, token:', sessionToken ? 'found' : 'not found');
    }

    if (!sessionToken) {
        console.log('❌ No session token found, redirecting to login');
        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
        return false;
    }

    console.log('🔐 Session token found, verifying with server...');

    try {
        // Use enhanced API client if available, otherwise use fetch
        let data;
        if (typeof ApiClient !== 'undefined') {
            console.log('🚀 Using ApiClient for verification');
            data = await ApiClient.get('/auth/verify');
        } else {
            console.log('🌐 Using fetch for verification');
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.log('❌ Auth verification failed:', response.status, errorText);
                throw new Error('Auth verification failed');
            }

            data = await response.json();
        }

        console.log('✅ Auth verification successful, user:', data.user.name);
        currentUserData = data.user;

        // Cache user data if utils available
        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.setWithExpiry('cachedUserData', currentUserData, 24 * 60 * 60 * 1000);
            StorageUtils.setWithExpiry('lastOnline', new Date().toISOString(), 5 * 60 * 1000);
        }

        hideOfflineBanner();
        return true;

    } catch (error) {
        console.error('❌ Auth check error:', error);

        // Check if we have cached user data for offline mode (only if utils loaded)
        if (typeof StorageUtils !== 'undefined') {
            const cachedUser = StorageUtils.getWithExpiry('cachedUserData');
            const lastOnline = StorageUtils.getWithExpiry('lastOnline');

            if (cachedUser && lastOnline) {
                console.log('📱 Using cached user data for offline mode');
                // Allow offline access with cached data
                currentUserData = cachedUser;
                showOfflineBanner();
                if (typeof AlertUtils !== 'undefined') {
                    AlertUtils.warning('Offline Mode', 'You are offline. Showing cached data.');
                }
                return true;
            }
        }

        console.log('🧹 Clearing session and redirecting to login');
        // Clear session and redirect to login
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('currentUser');
        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.clearAppData();
        }

        if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/' && !window.location.pathname.endsWith('/')) {
            window.location.href = 'index.html';
        }
        return false;
    }
}

// Login page initialization
function initializeLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Password toggle functionality
    setupPasswordToggle('toggleLoginPassword', 'loginPassword');
    setupPasswordToggle('toggleRegPassword', 'regPassword');

    // Aadhaar formatting
    setupAadhaarFormatting('loginAadhaar');
    setupAadhaarFormatting('regAadhaar');

    // Check if already logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
        checkAuth().then(isValid => {
            if (isValid) {
                window.location.href = 'dashboard.html';
            }
        });
    }
}

// Setup password toggle functionality
function setupPasswordToggle(toggleId, inputId) {
    const toggleBtn = document.getElementById(toggleId);
    const passwordInput = document.getElementById(inputId);

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = toggleBtn.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
}

// Setup Aadhaar number formatting
function setupAadhaarFormatting(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
            value = value.substring(0, 12); // Limit to 12 digits

            // Add spaces every 4 digits
            if (value.length > 4) {
                value = value.substring(0, 4) + ' ' + value.substring(4);
            }
            if (value.length > 9) {
                value = value.substring(0, 9) + ' ' + value.substring(9);
            }

            e.target.value = value;
        });
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();

    const aadhaar = document.getElementById('loginAadhaar').value.replace(/\s/g, ''); // Remove spaces
    const password = document.getElementById('loginPassword').value;
    const language = document.getElementById('language').value;

    // Enhanced validation using ValidationUtils
    if (!aadhaar || !password) {
        AlertUtils.warning('Missing Information', 'Please fill in all fields');
        return;
    }

    if (!ValidationUtils.validateAadhaar(aadhaar)) {
        AlertUtils.warning('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number');
        return;
    }

    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Logging in...';
    loginBtn.disabled = true;

    // Show loading alert
    AlertUtils.loading('Authenticating...');

    try {
        // Use enhanced API client if available
        let data;
        if (typeof ApiClient !== 'undefined') {
            data = await ApiClient.post('/auth/login', { aadhaar, password });
        } else {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ aadhaar, password })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || errorData.message || 'Login failed');
            }

            data = await response.json();
        }

        // Store session data with both methods for compatibility
        const sessionToken = data.token;
        const userId = data.user.id;

        // New method with expiry (if utils available)
        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.setWithExpiry('sessionToken', sessionToken, 24 * 60 * 60 * 1000); // 24 hours
            StorageUtils.setWithExpiry('currentUser', userId, 24 * 60 * 60 * 1000);
            StorageUtils.setWithExpiry('cachedUserData', data.user, 24 * 60 * 60 * 1000);
        }

        // Fallback method (always store for compatibility)
        localStorage.setItem('sessionToken', sessionToken);
        localStorage.setItem('currentUser', userId);
        localStorage.setItem('selectedLanguage', language);

        currentUserData = data.user;

        if (typeof AlertUtils !== 'undefined') {
            AlertUtils.close();
            await AlertUtils.success('Login Successful!', 'Redirecting to dashboard...');
        }

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Login error:', error);
        if (typeof AlertUtils !== 'undefined') {
            AlertUtils.close();
            AlertUtils.error('Login Failed', error.message || 'Unable to login. Please try again.');
        } else {
            alert('Login failed: ' + (error.message || 'Please try again.'));
        }
    } finally {
        loginBtn.innerHTML = originalText;
        loginBtn.disabled = false;
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();

    const fullName = document.getElementById('regFullName').value.trim();
    const aadhaar = document.getElementById('regAadhaar').value.replace(/\s/g, ''); // Remove spaces
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value.trim();
    const homeState = document.getElementById('regHomeState').value;
    const currentState = document.getElementById('regCurrentState').value;

    // Enhanced validation
    if (!fullName || !aadhaar || !password || !phone || !homeState || !currentState) {
        AlertUtils.warning('Missing Information', 'Please fill in all fields');
        return;
    }

    if (!ValidationUtils.validateAadhaar(aadhaar)) {
        AlertUtils.warning('Invalid Aadhaar', 'Please enter a valid 12-digit Aadhaar number');
        return;
    }

    if (!ValidationUtils.validatePhone(phone)) {
        AlertUtils.warning('Invalid Phone', 'Please enter a valid 10-digit mobile number');
        return;
    }

    const passwordCheck = ValidationUtils.validatePassword(password);
    if (!passwordCheck.isValid) {
        AlertUtils.warning('Weak Password', 'Password must be at least 6 characters long');
        return;
    }

    const registerBtn = document.getElementById('registerBtn');
    const originalText = registerBtn.innerHTML;
    registerBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Creating Account...';
    registerBtn.disabled = true;

    // Show loading alert
    AlertUtils.loading('Creating your account...');

    try {
        // Use enhanced API client
        const data = await ApiClient.post('/auth/register', {
            name: fullName,
            aadhaar,
            password,
            phone,
            home_state: homeState,
            current_state: currentState
        });

        AlertUtils.close();
        await AlertUtils.success('Registration Successful!', 'You can now login with your credentials');

        // Switch to login tab
        const loginTab = document.getElementById('login-tab');
        if (loginTab) {
            loginTab.click();
        }

        // Pre-fill login form with formatted Aadhaar
        document.getElementById('loginAadhaar').value = ValidationUtils.formatAadhaar(aadhaar);

        // Reset registration form
        document.getElementById('registerForm').reset();

    } catch (error) {
        console.error('Registration error:', error);
        AlertUtils.close();
        AlertUtils.error('Registration Failed', error.message || 'Unable to create account. Please try again.');
    } finally {
        registerBtn.innerHTML = originalText;
        registerBtn.disabled = false;
    }
}

// Dashboard initialization
async function initializeDashboard() {
    const isAuth = await checkAuth();
    if (!isAuth) return;

    if (currentUserData) {
        updateWelcomeMessage(currentUserData);
        updateBenefitCards(currentUserData);

        // Cache user data for offline access
        StorageUtils.setWithExpiry('cachedUserData', currentUserData, 24 * 60 * 60 * 1000);

        // Create charts if Chart.js is available
        if (typeof Chart !== 'undefined') {
            createBenefitsChart();
        }
    } else {
        // Fetch user data if not available
        await fetchUserData();
    }
}

// Enhanced fetch user data
async function fetchUserData() {
    try {
        // Use enhanced API client
        const data = await ApiClient.get('/auth/verify');
        currentUserData = data.user;

        // Cache the data
        StorageUtils.setWithExpiry('cachedUserData', currentUserData, 24 * 60 * 60 * 1000);

        updateWelcomeMessage(currentUserData);
        updateBenefitCards(currentUserData);

        // Create charts
        if (typeof Chart !== 'undefined') {
            createBenefitsChart();
        }

    } catch (error) {
        console.error('Error fetching user data:', error);

        // Try to use cached data
        const cachedData = StorageUtils.getWithExpiry('cachedUserData');
        if (cachedData) {
            currentUserData = cachedData;
            updateWelcomeMessage(currentUserData);
            updateBenefitCards(currentUserData);
            showOfflineBanner();
        } else {
            AlertUtils.error('Data Error', 'Unable to load user data. Please refresh the page.');
        }
    }
}

// Create benefits overview chart
function createBenefitsChart() {
    const chartCanvas = document.getElementById('benefitsChart');
    if (chartCanvas && currentUserData && currentUserData.benefits) {
        try {
            ChartUtils.createOverviewChart('benefitsChart', currentUserData.benefits);
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }
}

// Setup logout button
function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        console.log('✅ Logout button found, setting up event listener');
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🚪 Logout button clicked');
            handleLogout();
        });
    } else {
        console.log('❌ Logout button not found on this page');
    }
}

// Handle logout
async function handleLogout() {
    console.log('🚪 Starting logout process...');
    const sessionToken = localStorage.getItem('sessionToken');
    console.log('🔑 Session token found:', sessionToken ? 'Yes' : 'No');

    if (sessionToken) {
        try {
            console.log('📡 Sending logout request to server...');
            const response = await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sessionToken })
            });

            if (response.ok) {
                console.log('✅ Server logout successful');
            } else {
                console.log('⚠️ Server logout failed, but continuing with local cleanup');
            }
        } catch (error) {
            console.error('❌ Logout error:', error);
            console.log('⚠️ Server error, but continuing with local cleanup');
        }
    }

    // Clear local storage
    console.log('🧹 Clearing local storage...');
    localStorage.removeItem('sessionToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedLanguage');

    // Clear cached data if utils available
    if (typeof StorageUtils !== 'undefined') {
        StorageUtils.clearAppData();
        console.log('🧹 StorageUtils cleared');
    }

    console.log('↩️ Redirecting to login page...');
    // Redirect to login
    window.location.href = 'index.html';
}

// Update welcome message
function updateWelcomeMessage(userData) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userLocation = document.getElementById('userLocation');

    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome ${userData.name}! 👋`;
    }

    if (userLocation) {
        userLocation.textContent = `From ${userData.home_state}, currently in ${userData.current_state}`;
    }
}

// Update benefit cards with user data
function updateBenefitCards(userData) {
    // For now, we'll use static benefit status since we don't have benefit tracking yet
    // This can be enhanced when we add benefit APIs
    const benefitCards = document.querySelectorAll('.benefit-card');

    benefitCards.forEach(card => {
        const benefitType = card.getAttribute('data-benefit');
        const statusBadge = card.querySelector('.badge');

        if (statusBadge) {
            // Default to active status for all benefits
            statusBadge.textContent = 'active';
            statusBadge.className = 'badge bg-success';
        }
    });
}

// QR Page initialization
async function initializeQRPage() {
    const isAuth = await checkAuth();
    if (!isAuth) return;

    if (currentUserData) {
        updateQRUserInfo(currentUserData);
        generateQRCode(currentUserData);
    } else {
        // Fetch user data if not available
        await fetchUserData();
        if (currentUserData) {
            updateQRUserInfo(currentUserData);
            generateQRCode(currentUserData);
        }
    }
}

// Update QR page user information
function updateQRUserInfo(userData) {
    const qrUserName = document.getElementById('qr-user-name');
    const qrUserId = document.getElementById('qr-user-id');
    const qrUserLocation = document.getElementById('qr-user-location');
    const qrIssueDate = document.getElementById('qr-issue-date');
    const qrExpiryDate = document.getElementById('qr-expiry-date');

    if (qrUserName) qrUserName.textContent = userData.name;
    if (qrUserId) qrUserId.textContent = `ID: ${userData.migrant_id || userData.id}`;
    if (qrUserLocation) qrUserLocation.textContent = `From: ${userData.home_state}, Currently in: ${userData.current_state}`;

    // Set dates
    const issueDate = new Date();
    const expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    if (qrIssueDate) qrIssueDate.textContent = issueDate.toLocaleDateString();
    if (qrExpiryDate) qrExpiryDate.textContent = expiryDate.toLocaleDateString();
}

// Generate QR Code with multiple fallback methods
function generateQRCode(userData) {
    console.log('Starting QR generation for:', userData.name);
    generateQRCodeEnhanced(userData);
}

// Alternative QR generation using Google Charts API (fallback)
function generateQRWithGoogleAPI(container, data, userData) {
    const encodedData = encodeURIComponent(data);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;

    container.innerHTML = `
        <div style="position: relative; display: inline-block;">
            <img src="${qrUrl}" 
                 alt="QR Code for ${userData.name}" 
                 style="width: 200px; height: 200px; border: 2px solid #007bff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                 onload="console.log('QR image loaded successfully')"
                 onerror="this.style.display='none'; this.parentNode.innerHTML='<div style=\\'width: 200px; height: 200px; border: 2px solid #dc3545; display: flex; align-items: center; justify-content: center; background: #f8f9fa; border-radius: 8px;\\'>\\
                    <div style=\\'text-align: center; padding: 20px;\\'>\\
                        <i class=\\'fas fa-exclamation-triangle fa-2x text-danger mb-2\\'></i>\\
                        <div style=\\'font-size: 12px; color: #666;\\'>QR Generation Failed</div>\\
                        <div style=\\'font-size: 10px; color: #999; margin-top: 5px;\\'>ID: ${userData.id}</div>\\
                    </div>\\
                </div>';">
        </div>
    `;
}

// Enhanced QR generation with multiple fallbacks
function generateQRCodeEnhanced(userData) {
    const qrCodeDiv = document.getElementById('qrcode');
    if (!qrCodeDiv) return;

    // Clear existing content
    qrCodeDiv.innerHTML = '<div style="text-align: center; padding: 20px;">Generating QR Code...</div>';

    // Create compact QR data with new user structure
    const qrString = `MC:${userData.migrant_id || userData.id}|${userData.name}|${userData.home_state}->${userData.current_state}|${userData.aadhaar ? userData.aadhaar.slice(-4) : '****'}|${new Date().toISOString().split('T')[0]}`;

    // Method 1: Try canvas-based QR library
    if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
        const canvas = document.createElement('canvas');
        QRCode.toCanvas(canvas, qrString, {
            width: 200,
            height: 200,
            color: { dark: '#000000', light: '#ffffff' },
            errorCorrectionLevel: 'M',
            margin: 2
        }, function (error) {
            if (error) {
                console.error('Canvas QR failed:', error);
                // Fallback to Google API
                generateQRWithGoogleAPI(qrCodeDiv, qrString, userData);
            } else {
                qrCodeDiv.innerHTML = '';
                qrCodeDiv.appendChild(canvas);
                canvas.style.border = '2px solid #007bff';
                canvas.style.borderRadius = '8px';
                canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                console.log('Canvas QR generated successfully');
            }
        });
    }
    // Method 2: Try QRious library if available
    else if (typeof QRious !== 'undefined') {
        try {
            const canvas = document.createElement('canvas');
            const qr = new QRious({
                element: canvas,
                value: qrString,
                size: 200,
                background: '#ffffff',
                foreground: '#000000'
            });
            qrCodeDiv.innerHTML = '';
            qrCodeDiv.appendChild(canvas);
            canvas.style.border = '2px solid #007bff';
            canvas.style.borderRadius = '8px';
            console.log('QRious QR generated successfully');
        } catch (error) {
            console.error('QRious QR failed:', error);
            generateQRWithGoogleAPI(qrCodeDiv, qrString, userData);
        }
    }
    // Method 3: Use Google API
    else {
        console.log('Using Google API for QR generation');
        generateQRWithGoogleAPI(qrCodeDiv, qrString, userData);
    }

    // Store data globally
    window.currentQRData = { userData, qrString };
    addQRUniqueIndicator(qrCodeDiv, userData);
}

// Create fallback QR display when library fails
function createFallbackQR(container, userData) {
    container.innerHTML = `
        <div style="width: 200px; height: 200px; border: 2px solid #007bff; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px; border-radius: 8px; position: relative; overflow: hidden;">
            <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <i class="fas fa-qrcode fa-2x text-primary mb-2"></i>
                <div style="font-size: 11px; font-weight: bold; color: #007bff; margin-bottom: 5px;">${userData.name}</div>
                <div style="font-size: 9px; color: #666; margin-bottom: 3px;">ID: ${userData.migrant_id || userData.id}</div>
                <div style="font-size: 8px; color: #666; margin-bottom: 3px;">${userData.home_state} → ${userData.current_state}</div>
                <div style="font-size: 8px; color: #666;">Digital Identity</div>
            </div>
            <div style="position: absolute; top: 5px; left: 5px; width: 15px; height: 15px; border: 2px solid #000; border-right: none; border-bottom: none;"></div>
            <div style="position: absolute; top: 5px; right: 5px; width: 15px; height: 15px; border: 2px solid #000; border-left: none; border-bottom: none;"></div>
            <div style="position: absolute; bottom: 5px; left: 5px; width: 15px; height: 15px; border: 2px solid #000; border-right: none; border-top: none;"></div>
        </div>
    `;
}

// Generate checksum for data integrity
function generateChecksum(userData) {
    const dataString = (userData.migrant_id || userData.id) + userData.name + (userData.aadhaar || '') + (userData.phone || '');
    let checksum = 0;
    for (let i = 0; i < dataString.length; i++) {
        checksum += dataString.charCodeAt(i);
    }
    return (checksum % 10000).toString().padStart(4, '0');
}

// Generate digital signature (simplified)
function generateDigitalSignature(userData) {
    const timestamp = Date.now();
    const dataHash = generateChecksum(userData);
    const signature = btoa(timestamp + dataHash + (userData.migrant_id || userData.id)).slice(0, 16);
    return signature;
}

// Add visual indicator showing QR uniqueness
function addQRUniqueIndicator(qrContainer, userData) {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
        position: absolute;
        top: -25px;
        right: -10px;
        background: #28a745;
        color: white;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 10px;
        font-weight: bold;
    `;
    const userId = userData.migrant_id || userData.id;
    const shortId = userId.includes('-') ? userId.split('-')[2] : userId.slice(-3);
    indicator.textContent = `ID: ${shortId}`;
    qrContainer.style.position = 'relative';
    qrContainer.appendChild(indicator);
}

// Quick Actions
function quickApply(benefitType) {
    showAlert(`Application submitted for ${benefitType} benefits!`, 'success');
}

function applyForBenefit(benefitType) {
    showAlert(`Redirecting to ${benefitType} benefit application...`, 'info');
    // Simulate application process
    setTimeout(() => {
        showAlert(`Application for ${benefitType} benefits submitted successfully!`, 'success');
    }, 1500);
}

function downloadCard(cardType) {
    showAlert(`Downloading ${cardType} card...`, 'info');
    // Simulate download
    setTimeout(() => {
        showAlert(`${cardType} card downloaded successfully!`, 'success');
    }, 1000);
}

function downloadAllCards() {
    showAlert('Downloading all benefit cards...', 'info');
    setTimeout(() => {
        showAlert('All cards downloaded successfully!', 'success');
    }, 1500);
}

function findNearestCenter() {
    showAlert('Finding nearest service center...', 'info');
    setTimeout(() => {
        showAlert('Nearest center: 123 Main Street, 2.5 km away', 'info');
    }, 1000);
}

function findNearestHospital() {
    showAlert('Finding nearest hospital...', 'info');
    setTimeout(() => {
        showAlert('Nearest hospital: City Hospital, 1.8 km away', 'info');
    }, 1000);
}

function findNearestSchool() {
    showAlert('Finding nearby schools...', 'info');
    setTimeout(() => {
        showAlert('Found 5 schools within 3 km radius', 'info');
    }, 1000);
}

function findNearestBank() {
    showAlert('Finding nearest bank...', 'info');
    setTimeout(() => {
        showAlert('Nearest bank: State Bank of India, 800m away', 'info');
    }, 1000);
}

function contactSupport() {
    showAlert('Connecting to support...', 'info');
    setTimeout(() => {
        showAlert('Support available at 1800-123-4567', 'info');
    }, 1000);
}

function reportIssue(benefitType) {
    showAlert(`Reporting issue with ${benefitType} benefits...`, 'warning');
    setTimeout(() => {
        showAlert('Issue reported successfully. Reference ID: INC123456', 'success');
    }, 1000);
}

function transferBenefits(benefitType) {
    showAlert(`Initiating ${benefitType} benefit transfer...`, 'info');
    setTimeout(() => {
        showAlert('Transfer process initiated. You will receive updates via SMS.', 'success');
    }, 1500);
}

// Financial Actions
function checkBalance() {
    showAlert('Checking account balance...', 'info');
    setTimeout(() => {
        showAlert('Current Balance: ₹15,450', 'success');
    }, 1000);
}

function transferMoney() {
    showAlert('Redirecting to money transfer...', 'info');
    setTimeout(() => {
        showAlert('Transfer initiated successfully!', 'success');
    }, 1500);
}

function applyForLoan() {
    showAlert('Processing loan application...', 'info');
    setTimeout(() => {
        showAlert('Loan application submitted. You are eligible for ₹50,000', 'success');
    }, 1500);
}

// Health Actions
function bookAppointment() {
    showAlert('Booking appointment...', 'info');
    setTimeout(() => {
        showAlert('Appointment booked for tomorrow at 10:00 AM', 'success');
    }, 1000);
}

function emergencyContact() {
    showAlert('Emergency services: 108', 'danger');
}

function setReminder() {
    showAlert('Medicine reminder set for 8:00 AM daily', 'success');
}

// Education Actions
function applyForAdmission() {
    showAlert('Redirecting to school admission portal...', 'info');
    setTimeout(() => {
        showAlert('Admission application submitted successfully!', 'success');
    }, 1500);
}

function applyForScholarship() {
    showAlert('Processing scholarship application...', 'info');
    setTimeout(() => {
        showAlert('Scholarship application submitted successfully!', 'success');
    }, 1500);
}

function downloadCertificates() {
    showAlert('Downloading certificates...', 'info');
    setTimeout(() => {
        showAlert('All certificates downloaded successfully!', 'success');
    }, 1000);
}

function initiateTransfer() {
    showAlert('Initiating school transfer process...', 'info');
    setTimeout(() => {
        showAlert('Transfer process initiated. Required documents will be sent via email.', 'success');
    }, 1500);
}

// Finance Actions
function accessLiteracy() {
    showAlert('Accessing financial literacy resources...', 'info');
    setTimeout(() => {
        showAlert('Resources loaded. Check your mobile for the link.', 'success');
    }, 1000);
}

function exploreInvestments() {
    showAlert('Loading investment options...', 'info');
    setTimeout(() => {
        showAlert('Investment options available: PPF, NSC, ELSS', 'info');
    }, 1000);
}

// QR Actions - Enhanced functionality
function downloadQRCode() {
    const qrCodeDiv = document.getElementById('qrcode');
    const canvas = qrCodeDiv.querySelector('canvas');
    const img = qrCodeDiv.querySelector('img');

    if (canvas) {
        // Download canvas as PNG
        const link = document.createElement('a');
        const currentUser = localStorage.getItem('currentUser');
        const userData = users[currentUser];

        link.download = `MigrantConnect_QR_${userData ? userData.name.replace(' ', '_') : 'Unknown'}_${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showAlert('QR Code downloaded successfully!', 'success');
    } else if (img) {
        // Download image QR code
        const link = document.createElement('a');
        const currentUser = localStorage.getItem('currentUser');
        const userData = users[currentUser];

        link.download = `MigrantConnect_QR_${userData ? userData.name.replace(' ', '_') : 'Unknown'}_${new Date().getTime()}.png`;
        link.href = img.src;
        link.target = '_blank';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showAlert('QR Code downloaded successfully!', 'success');
    } else {
        showAlert('QR Code not available for download. Please regenerate the QR code.', 'warning');
    }
}

function shareQRCode() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (navigator.share && userData) {
        // Use native sharing if available
        navigator.share({
            title: 'MigrantConnect Digital Identity',
            text: `Digital ID for ${userData.name} (${userData.id}) - Access government services across India`,
            url: window.location.href
        }).then(() => {
            showAlert('QR code shared successfully!', 'success');
        }).catch(() => {
            fallbackShare(userData);
        });
    } else {
        fallbackShare(userData);
    }
}

function fallbackShare(userData) {
    // Fallback sharing method
    const qrInfo = `
MigrantConnect Digital Identity
Name: ${userData.name}
ID: ${userData.id}
From: ${userData.homeState}
Currently in: ${userData.currentState}
Valid till: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}

This QR code provides access to government services across India.
    `.trim();

    if (navigator.clipboard) {
        navigator.clipboard.writeText(qrInfo).then(() => {
            showAlert('QR code information copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = qrInfo;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showAlert('QR code information copied to clipboard!', 'success');
    }
}

function printQRCode() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = users[currentUser];

    if (userData) {
        // Create printable version
        const printWindow = window.open('', '_blank');
        const qrCodeDiv = document.getElementById('qrcode');
        const canvas = qrCodeDiv.querySelector('canvas');

        if (canvas) {
            const qrDataURL = canvas.toDataURL('image/png');

            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>MigrantConnect QR Code - ${userData.name}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            padding: 20px;
                            background: white;
                        }
                        .qr-container { 
                            border: 2px solid #000; 
                            padding: 20px; 
                            margin: 20px auto;
                            max-width: 400px;
                            background: white;
                        }
                        .header { 
                            background: #007bff; 
                            color: white; 
                            padding: 10px; 
                            margin: -20px -20px 20px -20px;
                            font-size: 18px;
                            font-weight: bold;
                        }
                        .user-info { 
                            margin: 20px 0;
                            font-size: 14px;
                            line-height: 1.5;
                        }
                        .qr-image {
                            margin: 20px 0;
                            border: 1px solid #ddd;
                        }
                        .footer {
                            font-size: 12px;
                            color: #666;
                            margin-top: 20px;
                        }
                        @media print {
                            body { margin: 0; padding: 10px; }
                            .qr-container { page-break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <div class="qr-container">
                        <div class="header">🏠 MigrantConnect Digital Identity</div>
                        <div class="user-info">
                            <strong>${userData.name}</strong><br>
                            ID: ${userData.id}<br>
                            From: ${userData.homeState}<br>
                            Currently in: ${userData.currentState}<br>
                            Valid till: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                        </div>
                        <img src="${qrDataURL}" alt="QR Code" class="qr-image" style="max-width: 200px;">
                        <div class="footer">
                            Generated on: ${new Date().toLocaleDateString()}<br>
                            Government of India Initiative
                        </div>
                    </div>
                    <script>
                        window.onload = function() { 
                            setTimeout(function() { window.print(); }, 500); 
                        }
                    </script>
                </body>
                </html>
            `);

            printWindow.document.close();
        } else {
            showAlert('QR Code not available for printing', 'warning');
        }
    } else {
        showAlert('User data not found', 'error');
    }
}

// Add QR code validation function
function validateQRCode(qrData) {
    try {
        const data = JSON.parse(qrData);

        // Check required fields
        const requiredFields = ['migrantId', 'name', 'aadhaar', 'benefits', 'checksum'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return { valid: false, reason: `Missing required field: ${field}` };
            }
        }

        // Check expiry
        if (data.expiryDate && new Date(data.expiryDate) < new Date()) {
            return { valid: false, reason: 'QR code has expired' };
        }

        // Validate checksum (simplified)
        const userData = users[Object.keys(users).find(key => users[key].id === data.migrantId)];
        if (userData && generateChecksum(userData) !== data.checksum) {
            return { valid: false, reason: 'Invalid checksum' };
        }

        return { valid: true, data: data };
    } catch (error) {
        return { valid: false, reason: 'Invalid QR code format' };
    }
}

// Simulate QR code scanning for demo
function simulateQRScan() {
    if (!window.currentQRData) {
        showAlert('No QR code generated yet!', 'warning');
        return;
    }

    showAlert('Scanning QR code...', 'info');

    setTimeout(() => {
        const validation = validateQRCode(JSON.stringify(window.currentQRData));

        if (validation.valid) {
            const data = validation.data;
            showQRScanResult(data);
        } else {
            showAlert(`QR validation failed: ${validation.reason}`, 'error');
        }
    }, 1500);
}

// Show QR scan result
function showQRScanResult(data) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show';
    modal.style.display = 'block';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title">
                        <i class="fas fa-check-circle"></i> QR Code Verified Successfully
                    </h5>
                    <button type="button" class="btn-close btn-close-white" onclick="this.closest('.modal').remove()"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <h6><i class="fas fa-user"></i> Personal Information</h6>
                            <ul class="list-unstyled">
                                <li><strong>Name:</strong> ${data.name}</li>
                                <li><strong>ID:</strong> ${data.migrantId}</li>
                                <li><strong>Phone:</strong> ${data.phone}</li>
                                <li><strong>From:</strong> ${data.homeState}</li>
                                <li><strong>Currently in:</strong> ${data.currentState}</li>
                            </ul>
                        </div>
                        <div class="col-md-6">
                            <h6><i class="fas fa-shield-alt"></i> Security Information</h6>
                            <ul class="list-unstyled">
                                <li><strong>Issue Date:</strong> ${new Date(data.issueDate).toLocaleDateString()}</li>
                                <li><strong>Expiry:</strong> ${new Date(data.expiryDate).toLocaleDateString()}</li>
                                <li><strong>Checksum:</strong> ${data.checksum}</li>
                                <li><strong>Status:</strong> <span class="badge bg-success">Valid</span></li>
                            </ul>
                        </div>
                    </div>
                    
                    <h6 class="mt-3"><i class="fas fa-clipboard-list"></i> Available Benefits</h6>
                    <div class="row">
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-bread-slice fa-2x text-warning"></i>
                                <div><strong>Food</strong></div>
                                <div><span class="badge bg-${data.benefits.food.status === 'active' ? 'success' : 'warning'}">${data.benefits.food.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-heartbeat fa-2x text-danger"></i>
                                <div><strong>Health</strong></div>
                                <div><span class="badge bg-${data.benefits.health.status === 'active' ? 'success' : 'warning'}">${data.benefits.health.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-graduation-cap fa-2x text-primary"></i>
                                <div><strong>Education</strong></div>
                                <div><span class="badge bg-${data.benefits.education.status === 'active' ? 'success' : 'warning'}">${data.benefits.education.status}</span></div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <div class="border rounded p-2">
                                <i class="fas fa-university fa-2x text-info"></i>
                                <div><strong>Finance</strong></div>
                                <div><span class="badge bg-${data.benefits.finance.status === 'active' ? 'success' : 'warning'}">${data.benefits.finance.status}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="this.closest('.modal').remove(); showAlert('Service access granted!', 'success')">Grant Service Access</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Auto-remove after 30 seconds
    setTimeout(() => {
        if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }
    }, 30000);
}

// Online/Offline Status
// Enhanced online/offline status checking
function checkOnlineStatus() {
    console.log('🔍 Checking online status - Navigator says:', navigator.onLine);

    // Always start by hiding the offline banner
    hideOfflineBanner();

    // Only show offline banner if browser definitively says we're offline
    if (!navigator.onLine) {
        console.log('📵 Browser reports offline - showing banner');
        showOfflineBanner();
    } else {
        console.log('📶 Browser reports online - keeping banner hidden');
        // We're online according to browser, test API connection silently
        // but NEVER show offline banner based on API test alone
        testApiConnectionSilently();
    }
}

async function testApiConnectionSilently() {
    try {
        // Try a lightweight request to check API availability
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            hideOfflineBanner();
            if (typeof StorageUtils !== 'undefined') {
                StorageUtils.setWithExpiry('apiOnline', true, 5 * 60 * 1000); // Cache for 5 minutes
            }
            console.log('✅ API connection test: ONLINE');
        } else {
            console.log('⚠️ API returned error status:', response.status);
            // Don't show offline banner for API errors unless browser says offline
        }
    } catch (error) {
        console.log('🚫 API connection test failed (silent):', error.message);
        // Only show offline if browser also says we're offline
        // Never show offline banner just because API is unreachable
        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.setWithExpiry('apiOnline', false, 2 * 60 * 1000);
        }
    }
}

// Get API online status (check cache first, then test if needed)
async function isApiOnline() {
    // Check cached status first
    if (typeof StorageUtils !== 'undefined') {
        const cachedStatus = StorageUtils.getWithExpiry('apiOnline');
        if (cachedStatus !== null) {
            return cachedStatus;
        }
    }

    // If no cache, test connection
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const response = await fetch(`${API_BASE_URL}/status`, {
            method: 'GET',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        const isOnline = response.ok;

        if (typeof StorageUtils !== 'undefined') {
            StorageUtils.setWithExpiry('apiOnline', isOnline, 2 * 60 * 1000);
        }

        return isOnline;
    } catch (error) {
        return navigator.onLine; // Fallback to browser status
    }
}

function handleOnline() {
    console.log('📶 Network connection restored');
    hideOfflineBanner();

    // Double-check that banner is hidden after a short delay
    setTimeout(() => {
        hideOfflineBanner();
    }, 100);

    // Test API connection in background
    testApiConnectionSilently();

    if (typeof AlertUtils !== 'undefined') {
        AlertUtils.success('Connected', 'Network connection restored!');
    }
}

function handleOffline() {
    console.log('📵 Network connection lost');
    showOfflineBanner();

    if (typeof AlertUtils !== 'undefined') {
        AlertUtils.info('Offline', 'You are now offline. Cached data will be shown when available.');
    }
}

function showOfflineBanner() {
    const offlineBanner = document.getElementById('offline-banner');
    if (offlineBanner) {
        console.log('🚨 Showing offline banner');
        offlineBanner.classList.remove('d-none');
        offlineBanner.style.display = 'block';
    } else {
        console.log('⚠️ No offline banner element found on this page');
    }
}

function hideOfflineBanner() {
    const offlineBanner = document.getElementById('offline-banner');
    if (offlineBanner) {
        console.log('✅ Hiding offline banner');
        offlineBanner.classList.add('d-none');
        offlineBanner.style.display = 'none';
    } else {
        console.log('ℹ️ No offline banner element found on this page');
    }
}

// Utility Functions
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1060; max-width: 400px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Add to body
    document.body.appendChild(alertDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

function initializeTranslations() {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    loadLanguage(savedLanguage);
}

// Add smooth scrolling
document.addEventListener('DOMContentLoaded', function () {
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

// Add animation classes to cards
function addAnimations() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(addAnimations, 100);
});

// Initialize benefit pages (food, health, education, finance)
async function initializeBenefitPage() {
    console.log('🏥 Initializing benefit page');

    // Force hide offline banner immediately for benefit pages
    hideOfflineBanner();

    // Wait a moment then hide again to ensure it stays hidden
    setTimeout(() => {
        hideOfflineBanner();
        console.log('🔄 Double-checked: offline banner should be hidden');
    }, 500);

    console.log('✅ Benefit page initialized - offline banner explicitly hidden');
}
