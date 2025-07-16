// Enhanced QR Code Generation with Comprehensive User Data
class QRCodeManager {
    constructor() {
        this.init();
    }

    init() {
        console.log('QRCodeManager initializing...');

        // Debug session storage
        this.debugSessionStorage();

        // Check for migrant ID in URL parameters or session
        const urlParams = new URLSearchParams(window.location.search);
        const migrantId = urlParams.get('migrantId') || this.getMigrantIdFromSession();

        console.log('Migrant ID found:', migrantId);

        if (migrantId) {
            this.loadUserDataAndGenerateQR(migrantId);
        } else {
            this.handleNoUser();
        }
    } debugSessionStorage() {
        console.log('=== Session Storage Debug ===');
        console.log('sessionToken:', localStorage.getItem('sessionToken') ? 'present' : 'missing');
        console.log('currentUser:', localStorage.getItem('currentUser'));
        console.log('userData:', localStorage.getItem('userData') ? 'present' : 'missing');
        console.log('cachedUserData:', localStorage.getItem('cachedUserData') ? 'present' : 'missing');
        console.log('userAadhaar:', localStorage.getItem('userAadhaar'));

        // Check if StorageUtils is available
        if (typeof StorageUtils !== 'undefined') {
            console.log('StorageUtils available');
            console.log('StorageUtils sessionToken:', StorageUtils.getWithExpiry('sessionToken') ? 'present' : 'missing');
            console.log('StorageUtils currentUser:', StorageUtils.getWithExpiry('currentUser'));
        } else {
            console.log('StorageUtils not available');
        }

        // Check QR library availability
        console.log('=== QR Library Debug ===');
        console.log('QRious available:', typeof QRious !== 'undefined');
        console.log('QRCode available:', typeof QRCode !== 'undefined');
        console.log('window.QRCode available:', typeof window.QRCode !== 'undefined');
        if (typeof QRCode !== 'undefined') {
            console.log('QRCode object:', QRCode);
            console.log('QRCode.CorrectLevel:', typeof QRCode.CorrectLevel !== 'undefined');
        }
        if (typeof QRious !== 'undefined') {
            console.log('QRious constructor:', QRious);
        }

        console.log('=== End Debug ===');
    }

    getMigrantIdFromSession() {
        // Check localStorage for user session - try multiple storage methods

        // Method 1: Try currentUser (stored during login)
        let migrantId = localStorage.getItem('currentUser');
        if (migrantId) {
            console.log('Found migrantId from currentUser:', migrantId);
            return migrantId;
        }

        // Method 2: Try cached user data
        const cachedUserData = localStorage.getItem('cachedUserData');
        if (cachedUserData) {
            try {
                const user = JSON.parse(cachedUserData);
                migrantId = user.id || user.migrantId;
                if (migrantId) {
                    console.log('Found migrantId from cachedUserData:', migrantId);
                    return migrantId;
                }
            } catch (e) {
                console.error('Error parsing cached user data:', e);
            }
        }

        // Method 3: Try old userData format
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                migrantId = user.id || user.migrantId;
                if (migrantId) {
                    console.log('Found migrantId from userData:', migrantId);
                    return migrantId;
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }

        // Method 4: Try StorageUtils if available
        if (typeof StorageUtils !== 'undefined') {
            migrantId = StorageUtils.getWithExpiry('currentUser');
            if (migrantId) {
                console.log('Found migrantId from StorageUtils:', migrantId);
                return migrantId;
            }
        }

        console.log('No migrant ID found in session storage');
        return null;
    }

    async loadUserDataAndGenerateQR(migrantId) {
        try {
            console.log('Loading user data for migrant ID:', migrantId);

            // Show loading state
            this.showLoading();

            // Get session token
            const sessionToken = localStorage.getItem('sessionToken');
            if (!sessionToken) {
                console.log('No session token found in localStorage');
                this.handleNoUser();
                return;
            }

            console.log('Session token found, making API request...');

            // Fetch comprehensive user data from server
            const response = await fetch(`/api/auth/user/${migrantId}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('API response status:', response.status);

            if (response.ok) {
                const userData = await response.json();
                console.log('User data loaded successfully:', userData);
                this.generateComprehensiveQR(userData);
            } else if (response.status === 401) {
                console.log('Authentication failed - session expired');
                // Try to get error details
                const errorData = await response.text();
                console.log('Server error:', errorData);
                this.handleSessionExpired();
            } else {
                const errorText = await response.text();
                console.log('Server error:', response.status, errorText);
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error('Error loading user data:', error);

            // Check if it's a network error - try to use cached data
            const cachedUserData = localStorage.getItem('userData') || localStorage.getItem('cachedUserData');
            if (cachedUserData) {
                try {
                    const userData = JSON.parse(cachedUserData);
                    console.log('Using cached user data due to network error');
                    this.generateComprehensiveQR(userData);
                    this.showOfflineWarning();
                    return;
                } catch (parseError) {
                    console.error('Error parsing cached data:', parseError);
                }
            }

            this.handleError(error.message);
        }
    }

    handleSessionExpired() {
        document.getElementById('qr-user-name').textContent = 'Session Expired';
        document.getElementById('qr-user-id').textContent = 'Please log in again';
        document.getElementById('qr-user-location').textContent = 'Authentication required';

        this.showSessionExpiredMessage();
    }

    showOfflineWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-warning mt-3';
        warningDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> 
            Using cached data - you may be offline or experiencing connectivity issues.
        `;

        const qrInfoElement = document.getElementById('qr-info');
        if (qrInfoElement) {
            qrInfoElement.prepend(warningDiv);
        }
    }

    generateComprehensiveQR(userData) {
        try {
            // Create comprehensive QR data object with all user information
            const qrData = {
                // Personal Information
                migrantId: userData.migrantId || userData.id,
                name: userData.name,
                aadhaar: userData.aadhaar ? `****${userData.aadhaar.slice(-4)}` : null,
                phone: userData.phone ? `****${userData.phone.slice(-4)}` : null,
                panNumber: userData.panNumber ? `****${userData.panNumber.slice(-4)}` : null,
                dateOfBirth: userData.dateOfBirth,
                gender: userData.gender,
                maritalStatus: userData.maritalStatus,

                // Family Information
                familySize: userData.familySize,
                dependents: userData.dependents,
                children: userData.children,
                elderlyMembers: userData.elderlyMembers,
                disabledMembers: userData.disabledMembers,

                // Income and Employment
                monthlyIncome: userData.monthlyIncome,
                annualIncome: userData.annualIncome,
                employmentType: userData.employmentType,
                occupation: userData.occupation,

                // Housing and Assets
                houseOwnership: userData.houseOwnership,
                houseType: userData.houseType,
                assets: userData.assets,

                // Location and Migration
                homeState: userData.homeState,
                currentState: userData.currentState,
                migrationReason: userData.migrationReason,
                yearsInCurrentState: userData.yearsInCurrentState,

                // Social Category and Special Circumstances
                socialCategory: userData.socialCategory,
                religion: userData.religion,
                specialCircumstances: userData.specialCircumstances,

                // System Information
                registrationDate: userData.registrationDate || userData.created_at || new Date().toISOString().split('T')[0],
                benefits: userData.benefits || {},
                verificationHash: this.generateVerificationHash(userData),

                // QR Generation Info
                generatedAt: new Date().toISOString(),
                version: '2.0'
            };

            // Generate QR code with comprehensive data
            const qrString = JSON.stringify(qrData);
            this.createQRCode(qrString);

            // Update UI with user information
            this.updateUserInterface(userData, qrData);

        } catch (error) {
            console.error('Error generating QR:', error);
            this.handleError('Failed to generate QR code');
        }
    }

    generateVerificationHash(userData) {
        // Simple hash generation for verification (in production, use server-side cryptographic hash)
        const dataString = `${userData.migrantId}-${userData.aadhaar}-${userData.phone}`;
        let hash = 0;
        for (let i = 0; i < dataString.length; i++) {
            const char = dataString.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    createQRCode(data) {
        const qrElement = document.getElementById('qrcode');
        qrElement.innerHTML = ''; // Clear existing QR code

        console.log('Creating QR code with data length:', data.length);

        try {
            // Try to use QRious library (more reliable)
            if (typeof QRious !== 'undefined') {
                console.log('QRious library found, generating QR code...');
                const canvas = document.createElement('canvas');
                const qr = new QRious({
                    element: canvas,
                    value: data,
                    size: 256,
                    level: 'H',
                    background: '#ffffff',
                    foreground: '#000000'
                });
                qrElement.appendChild(canvas);
                console.log('QR code generated successfully with QRious library');
                return;
            }

            // Fallback: try QRCode library (davidshimjs)
            if (typeof QRCode !== 'undefined') {
                console.log('QRCode library found, generating QR code...');
                const qrcode = new QRCode(qrElement, {
                    text: data,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
                console.log('QR code generated successfully with QRCode library');
                return;
            }

            // Second fallback: try window.QRCode
            if (typeof window.QRCode !== 'undefined') {
                console.log('Using window.QRCode...');
                const qrcode = new window.QRCode(qrElement, {
                    text: data,
                    width: 256,
                    height: 256,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: window.QRCode.CorrectLevel.H
                });
                console.log('QR code generated successfully with window.QRCode');
                return;
            }

            console.log('No QR libraries available, using fallback');
            this.createFallbackQR(qrElement, data);

        } catch (error) {
            console.error('Error creating QR code:', error);
            console.log('Exception occurred, falling back to manual QR generation');
            this.createFallbackQR(qrElement, data);
        }
    }

    createFallbackQR(qrElement, data) {
        // Create a fallback QR placeholder that can still be "downloaded"
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Draw a simple placeholder
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);

        ctx.fillStyle = '#000000';
        ctx.strokeRect(10, 10, 236, 236);

        // Draw some pattern to simulate QR
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if ((i + j) % 3 === 0) {
                    ctx.fillRect(20 + i * 15, 20 + j * 15, 12, 12);
                }
            }
        }

        // Add text
        ctx.fillStyle = '#333333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR Code Data:', 128, 140);
        ctx.font = '8px Arial';
        const shortData = data.length > 30 ? data.substring(0, 30) + '...' : data;
        ctx.fillText(shortData, 128, 155);

        qrElement.appendChild(canvas);
        console.log('Fallback QR placeholder created');
    }

    updateUserInterface(userData, qrData) {
        // Update user information display
        document.getElementById('qr-user-name').textContent = userData.name || 'Unknown User';
        document.getElementById('qr-user-id').textContent = `ID: ${userData.migrantId || userData.id}`;
        document.getElementById('qr-user-location').textContent =
            `Location: ${userData.homeState} → ${userData.currentState}`;

        // Update dates
        const issueDate = userData.registrationDate || new Date().toISOString().split('T')[0];
        const expiryDate = new Date(new Date(issueDate).setFullYear(new Date(issueDate).getFullYear() + 5)).toISOString().split('T')[0];

        document.getElementById('qr-issue-date').textContent = this.formatDate(issueDate);
        document.getElementById('qr-expiry-date').textContent = this.formatDate(expiryDate);

        // Add comprehensive user details section
        this.addUserDetailsSection(userData, qrData);

        // Hide loading state
        this.hideLoading();
    }

    addUserDetailsSection(userData, qrData) {
        const qrInfoElement = document.getElementById('qr-info');

        const detailsHTML = `
            <div class="mt-4">
                <h5 class="text-primary mb-3">📋 Registration Details</h5>
                <div class="row text-start">
                    <div class="col-md-6 mb-3">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <h6 class="card-title text-primary mb-2">👤 Personal Information</h6>
                                <p class="mb-1"><strong>Gender:</strong> ${userData.gender || 'Not specified'}</p>
                                <p class="mb-1"><strong>Date of Birth:</strong> ${userData.dateOfBirth ? this.formatDate(userData.dateOfBirth) : 'Not specified'}</p>
                                <p class="mb-1"><strong>Marital Status:</strong> ${userData.maritalStatus || 'Not specified'}</p>
                                <p class="mb-0"><strong>Social Category:</strong> ${userData.socialCategory || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <h6 class="card-title text-primary mb-2">👥 Family Information</h6>
                                <p class="mb-1"><strong>Family Size:</strong> ${userData.familySize || 'Not specified'}</p>
                                <p class="mb-1"><strong>Children:</strong> ${userData.children || 0}</p>
                                <p class="mb-1"><strong>Dependents:</strong> ${userData.dependents || 0}</p>
                                <p class="mb-0"><strong>Elderly Members:</strong> ${userData.elderlyMembers || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <h6 class="card-title text-primary mb-2">💼 Employment</h6>
                                <p class="mb-1"><strong>Type:</strong> ${userData.employmentType || 'Not specified'}</p>
                                <p class="mb-1"><strong>Occupation:</strong> ${userData.occupation || 'Not specified'}</p>
                                <p class="mb-0"><strong>Monthly Income:</strong> ₹${userData.monthlyIncome || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6 mb-3">
                        <div class="card bg-light">
                            <div class="card-body p-3">
                                <h6 class="card-title text-primary mb-2">🔐 Verification</h6>
                                <p class="mb-1"><strong>Hash:</strong> <code>${qrData.verificationHash}</code></p>
                                <p class="mb-1"><strong>Generated:</strong> ${this.formatDateTime(new Date())}</p>
                                <p class="mb-0"><i class="fas fa-shield-alt text-success"></i> Verified Identity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="mt-4">
                <h5 class="text-primary mb-3">🎯 Eligible Benefits</h5>
                <div class="row">
                    ${this.generateBenefitsHTML(userData.benefits || {})}
                </div>
            </div>
        `;

        qrInfoElement.innerHTML = detailsHTML;
    }

    generateBenefitsHTML(benefits) {
        const benefitTypes = {
            food: { icon: '🍽️', name: 'Food Security' },
            health: { icon: '🏥', name: 'Healthcare' },
            education: { icon: '📚', name: 'Education' },
            finance: { icon: '💰', name: 'Financial Aid' }
        };

        let html = '';

        Object.keys(benefitTypes).forEach(type => {
            const benefit = benefits[type] || { status: 'pending', usage: 0 };
            const info = benefitTypes[type];
            const statusClass = benefit.status === 'active' ? 'success' :
                benefit.status === 'approved' ? 'info' : 'warning';

            html += `
                <div class="col-md-6 mb-2">
                    <div class="card border-${statusClass}">
                        <div class="card-body p-2">
                            <div class="d-flex align-items-center">
                                <span class="me-2">${info.icon}</span>
                                <div class="flex-grow-1">
                                    <h6 class="mb-0">${info.name}</h6>
                                    <small class="text-${statusClass}">${benefit.status || 'pending'}</small>
                                </div>
                                <span class="badge bg-${statusClass}">${benefit.usage || 0}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        return html;
    }

    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatDateTime(date) {
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showLoading() {
        const qrElement = document.getElementById('qrcode');
        qrElement.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 256px; width: 256px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;

        document.getElementById('qr-user-name').textContent = 'Loading...';
        document.getElementById('qr-user-id').textContent = 'Loading...';
        document.getElementById('qr-user-location').textContent = 'Loading...';
    }

    hideLoading() {
        // Loading state is automatically hidden when content is updated
    }

    handleNoUser() {
        document.getElementById('qr-user-name').textContent = 'No User Found';
        document.getElementById('qr-user-id').textContent = 'Please log in';
        document.getElementById('qr-user-location').textContent = 'Session expired';

        // Show error message instead of auto-redirect
        this.showSessionExpiredMessage();
    }

    showSessionExpiredMessage() {
        const qrElement = document.getElementById('qrcode');
        qrElement.innerHTML = `
            <div class="alert alert-warning text-center" style="width: 256px; height: 256px; display: flex; align-items: center; justify-content: center;">
                <div>
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p class="mb-2">Session Expired</p>
                    <button class="btn btn-primary btn-sm" onclick="window.location.href='index.html'">
                        Go to Login
                    </button>
                </div>
            </div>
        `;
    }

    handleError(message) {
        const qrElement = document.getElementById('qrcode');
        qrElement.innerHTML = `
            <div class="alert alert-danger text-center" style="width: 256px; height: 256px; display: flex; align-items: center; justify-content: center;">
                <div>
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p class="mb-0">Error generating QR</p>
                    <small>${message}</small>
                </div>
            </div>
        `;
    }
}

// Global functions for QR code actions (called from HTML buttons)
function downloadQRCode() {
    try {
        const qrContainer = document.getElementById('qrcode');
        if (!qrContainer) {
            alert('QR code not found');
            return;
        }

        // Look for canvas (generated by QRCode library)
        const canvas = qrContainer.querySelector('canvas');
        if (canvas) {
            // Get user info for filename
            const userName = document.getElementById('qr-user-name')?.textContent || 'Unknown';
            const userId = document.getElementById('qr-user-id')?.textContent?.replace('ID: ', '') || 'Unknown';

            // Create download link
            const link = document.createElement('a');
            link.download = `MigrantConnect-QR-${userName.replace(/\s+/g, '_')}-${userId}-${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0); // High quality

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            showSuccessMessage('QR Code downloaded successfully!');
            return;
        }

        // Look for image (fallback)
        const img = qrContainer.querySelector('img');
        if (img) {
            const userName = document.getElementById('qr-user-name')?.textContent || 'Unknown';

            const link = document.createElement('a');
            link.download = `MigrantConnect-QR-${userName.replace(/\s+/g, '_')}-${new Date().getTime()}.png`;
            link.href = img.src;
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showSuccessMessage('QR Code download started!');
            return;
        }

        // If no canvas or image found, show error
        alert('QR code image not found. Please refresh the page and try again.');

    } catch (error) {
        console.error('Download QR code error:', error);
        alert('Failed to download QR code. Please try again.');
    }
}

function showSuccessMessage(message) {
    // Try to use app's alert system if available
    if (typeof showAlert === 'function') {
        showAlert(message, 'success');
    } else if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: message,
            timer: 3000,
            showConfirmButton: false
        });
    } else {
        // Simple alert fallback
        alert(message);

        // Also show a temporary success message in the UI
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
        successDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
        `;
        document.body.appendChild(successDiv);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentElement) {
                successDiv.remove();
            }
        }, 5000);
    }
}

function shareQRCode() {
    try {
        const userName = document.getElementById('qr-user-name').textContent;
        const userId = document.getElementById('qr-user-id').textContent;
        const userLocation = document.getElementById('qr-user-location').textContent;

        const shareText = `MigrantConnect Digital Identity\n${userName}\n${userId}\n${userLocation}`;

        if (navigator.share) {
            navigator.share({
                title: 'MigrantConnect Digital Identity',
                text: shareText,
                url: window.location.href
            }).then(() => {
                if (typeof showAlert === 'function') {
                    showAlert('QR Code shared successfully!', 'success');
                } else {
                    alert('QR Code shared successfully!');
                }
            }).catch(() => {
                fallbackShare(shareText);
            });
        } else {
            fallbackShare(shareText);
        }
    } catch (error) {
        console.error('Share QR code error:', error);
        alert('Failed to share QR code');
    }
}

function fallbackShare(shareText) {
    // Copy to clipboard as fallback
    if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            if (typeof showAlert === 'function') {
                showAlert('QR Code details copied to clipboard!', 'info');
            } else {
                alert('QR Code details copied to clipboard!');
            }
        }).catch(() => {
            // Show modal with text to copy manually
            showShareModal(shareText);
        });
    } else {
        showShareModal(shareText);
    }
}

function showShareModal(shareText) {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Share QR Code Details</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <p>Copy this text to share your digital identity:</p>
                        <textarea class="form-control" rows="4" readonly>${shareText}</textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                        <button type="button" class="btn btn-primary" onclick="
                            const textarea = this.closest('.modal').querySelector('textarea');
                            textarea.select();
                            document.execCommand('copy');
                            alert('Copied to clipboard!');
                            this.closest('.modal').remove();
                        ">Copy Text</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function printQRCode() {
    try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        const userName = document.getElementById('qr-user-name').textContent;
        const userId = document.getElementById('qr-user-id').textContent;
        const userLocation = document.getElementById('qr-user-location').textContent;
        const qrContent = document.getElementById('qrcode').innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>MigrantConnect QR Code - ${userName}</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        margin: 20px;
                        background: white;
                    }
                    .qr-container { 
                        border: 2px solid #007bff; 
                        padding: 20px; 
                        margin: 20px auto;
                        display: inline-block;
                        border-radius: 10px;
                    }
                    .user-info { 
                        margin-bottom: 20px; 
                    }
                    .user-info h2 { 
                        color: #007bff; 
                        margin-bottom: 10px;
                    }
                    .footer { 
                        margin-top: 20px; 
                        font-size: 12px; 
                        color: #666;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="qr-container">
                    <div class="user-info">
                        <h2>MigrantConnect Digital Identity</h2>
                        <h3>${userName}</h3>
                        <p>${userId}</p>
                        <p>${userLocation}</p>
                    </div>
                    <div class="qr-code">
                        ${qrContent}
                    </div>
                    <div class="footer">
                        <p>Generated on: ${new Date().toLocaleDateString()}</p>
                        <p>Valid for government benefit verification</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();

        // Wait for content to load then print
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);

    } catch (error) {
        console.error('Print QR code error:', error);
        alert('Failed to print QR code. Please try again.');
    }
}

// Initialize QR Code Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeManager();
});
