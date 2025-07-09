// Language Support for MigrantConnect

// Language data
const languages = {
    en: null, // Will be loaded from JSON
    hi: null,
    bn: null,
    te: null,
    ta: null,
    mr: null,
    gu: null,
    kn: null,
    ml: null,
    pa: null,
    or: null
};

// Current language
let currentLanguage = 'en';

// Load language from JSON file
async function loadLanguage(langCode) {
    try {
        if (!languages[langCode]) {
            const response = await fetch(`assets/lang/${langCode}.json`);
            if (response.ok) {
                languages[langCode] = await response.json();
            } else {
                console.warn(`Language file for ${langCode} not found, using fallback`);
                languages[langCode] = getFallbackTranslations(langCode);
            }
        }

        currentLanguage = langCode;
        localStorage.setItem('selectedLanguage', langCode);
        applyTranslations();
    } catch (error) {
        console.error('Error loading language:', error);
        languages[langCode] = getFallbackTranslations(langCode);
        applyTranslations();
    }
}

// Apply translations to the page
function applyTranslations() {
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

// Get translation for a key
function getTranslation(key) {
    if (languages[currentLanguage] && languages[currentLanguage][key]) {
        return languages[currentLanguage][key];
    }

    // Fallback to English
    if (currentLanguage !== 'en' && languages.en && languages.en[key]) {
        return languages.en[key];
    }

    // Return key if no translation found
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Change language
function changeLanguage(langCode) {
    loadLanguage(langCode);
}

// Get fallback translations (hardcoded for offline support)
function getFallbackTranslations(langCode) {
    const translations = {
        en: {
            // Common
            "language": "Language",
            "back_to_dashboard": "Back to Dashboard",
            "logout": "Logout",
            "need_help": "Need Help?",
            "helpline": "Helpline",
            "website": "Website",
            "email": "Email",
            "quick_actions": "Quick Actions",
            "available_services": "Available Services",
            "date": "Date",
            "status": "Status",
            "amount": "Amount",
            "active": "Active",
            "pending": "Pending",
            "apply": "Apply",
            "view_details": "View Details",
            "download_card": "Download Card",
            "find_center": "Find Center",
            "apply_now": "Apply Now",
            "report_issue": "Report Issue",
            "start_transfer": "Start Transfer Process",
            "offline_warning": "⚠️ You're offline – showing cached data",

            // Login Page
            "login_subtitle": "Your Gateway to Portable Services",
            "migrant_id_label": "Aadhaar/Migrant ID",
            "select_user": "Select User",
            "language_label": "Language",
            "login_button": "Login",
            "footer_text": "Bridging Services Across States",

            // Dashboard
            "your_benefits": "Your Portable Benefits",
            "food_benefits": "Food Benefits",
            "food_description": "Access subsidized food grains across states",
            "health_benefits": "Healthcare",
            "health_description": "Access medical services anywhere in India",
            "education_benefits": "Education",
            "education_description": "School admissions and scholarships",
            "finance_benefits": "Financial Services",
            "finance_description": "Banking and financial assistance",
            "download_cards": "Download All Cards",
            "qr_code": "QR Code",
            "support": "Support",

            // Food Benefits
            "food_subtitle": "Public Distribution System (PDS)",
            "your_entitlement": "Your Entitlement",
            "monthly_allocation": "Monthly Allocation",
            "rice_amount": "5kg",
            "wheat_amount": "5kg",
            "sugar_amount": "1kg",
            "oil_amount": "1 Liter",
            "current_status": "Current Status",
            "used_this_month": "Used this month: 75% of allocation",
            "recent_usage": "Recent Usage",
            "shop_location": "Shop/Location",
            "items": "Items",
            "pds_card": "PDS Card Access",
            "antyodaya": "Antyodaya Anna Yojana",
            "portability": "Interstate Portability",
            "midday_meal": "Midday Meal (Children)",
            "find_nearest_shop": "Find Nearest Shop",
            "transfer_benefits": "Transfer Benefits",
            "transfer_description": "Moving to a new state? Transfer your benefits seamlessly.",

            // Health Benefits
            "health_subtitle": "Ayushman Bharat & Other Schemes",
            "health_card_status": "Health Card Status",
            "card_details": "Card Details",
            "card_number": "Card Number",
            "coverage": "Coverage",
            "family_members": "Family Members",
            "valid_till": "Valid Till",
            "usage_status": "Usage Status",
            "used_this_year": "Used this year: ₹1,25,000 of ₹5,00,000",
            "recent_medical_history": "Recent Medical History",
            "hospital": "Hospital",
            "treatment": "Treatment",
            "cashless_treatment": "Cashless Treatment",
            "emergency_services": "Emergency Services",
            "maternity_benefits": "Maternity Benefits",
            "medicine_coverage": "Medicine Coverage",
            "book_appointment": "Book Appointment",
            "find_hospital": "Find Nearest Hospital",
            "emergency": "Emergency Contact",
            "medicine_reminder": "Medicine Reminder",
            "reminder_description": "Set reminders for your medications",
            "set_reminder": "Set Reminder",

            // Education Benefits
            "education_subtitle": "School Admissions & Scholarships",
            "children_education": "Children's Education Status",
            "enrolled_children": "Enrolled Children",
            "scholarship_status": "Scholarship Status",
            "merit_scholarship": "Merit Scholarship",
            "minority_scholarship": "Minority Scholarship",
            "recent_applications": "Recent Applications",
            "school_name": "School Name",
            "class": "Class",
            "school_admission": "School Admission",
            "scholarship_programs": "Scholarship Programs",
            "free_textbooks": "Free Textbooks",
            "transport_allowance": "Transport Allowance",
            "uniform_allowance": "Uniform Allowance",
            "apply_admission": "Apply for Admission",
            "apply_scholarship": "Apply for Scholarship",
            "find_schools": "Find Nearby Schools",
            "download_certificates": "Download Certificates",
            "school_transfer": "School Transfer",

            // Finance Benefits
            "finance_subtitle": "Banking & Financial Assistance",
            "account_details": "Account Details",
            "primary_account": "Primary Account",
            "bank_name": "Bank",
            "account_number": "Account No",
            "ifsc_code": "IFSC",
            "balance": "Balance",
            "benefits_received": "Benefits Received",
            "pm_kisan": "PM-KISAN",
            "pension": "Pension",
            "insurance": "Insurance",
            "loans": "Loans",
            "recent_transactions": "Recent Transactions",
            "description": "Description",
            "type": "Type",
            "zero_balance_account": "Zero Balance Account",
            "money_transfer": "Money Transfer",
            "micro_loans": "Micro Loans",
            "insurance_schemes": "Insurance Schemes",
            "pension_schemes": "Pension Schemes",
            "digital_payments": "Digital Payments",
            "check_balance": "Check Balance",
            "transfer_money": "Transfer Money",
            "apply_loan": "Apply for Loan",
            "find_bank": "Find Nearest Bank",
            "financial_literacy": "Financial Literacy",
            "literacy_description": "Learn about financial planning and savings",
            "access_resources": "Access Resources",
            "investment_options": "Investment Options",
            "investment_description": "Explore safe investment options",
            "explore_investments": "Explore Investments",

            // QR Code
            "digital_identity": "Digital Identity",
            "how_to_use": "How to Use",
            "qr_instruction_1": "• Show this QR code at service centers",
            "qr_instruction_2": "• Scan for instant benefit verification",
            "qr_instruction_3": "• Works even without internet connection",
            "qr_instruction_4": "• Keep this code secure and private",
            "download_qr": "Download QR Code",
            "share_qr": "Share",
            "print_qr": "Print",
            "accessible_benefits": "Accessible Benefits",
            "food": "Food",
            "healthcare": "Healthcare",
            "education": "Education",
            "finance": "Finance",
            "security_notice": "Security Notice",
            "security_tip_1": "• Never share your QR code on social media",
            "security_tip_2": "• Only show to authorized service providers",
            "security_tip_3": "• Report any suspicious activity immediately",
            "security_tip_4": "• QR code expires every 30 days for security"
        },

        hi: {
            // Common
            "language": "भाषा",
            "back_to_dashboard": "डैशबोर्ड पर वापस जाएं",
            "logout": "लॉगआउट",
            "need_help": "मदद चाहिए?",
            "helpline": "हेल्पलाइन",
            "website": "वेबसाइट",
            "email": "ईमेल",
            "quick_actions": "त्वरित कार्य",
            "available_services": "उपलब्ध सेवाएं",
            "date": "तारीख",
            "status": "स्थिति",
            "amount": "राशि",
            "active": "सक्रिय",
            "pending": "लंबित",
            "apply": "आवेदन करें",
            "view_details": "विवरण देखें",
            "download_card": "कार्ड डाउनलोड करें",
            "find_center": "केंद्र खोजें",
            "apply_now": "अभी आवेदन करें",
            "report_issue": "समस्या रिपोर्ट करें",
            "start_transfer": "स्थानांतरण प्रक्रिया शुरू करें",
            "offline_warning": "⚠️ आप ऑफलाइन हैं - कैश्ड डेटा दिखाया जा रहा है",

            // Login Page
            "login_subtitle": "पोर्टेबल सेवाओं के लिए आपका गेटवे",
            "migrant_id_label": "आधार/प्रवासी ID",
            "select_user": "उपयोगकर्ता चुनें",
            "language_label": "भाषा",
            "login_button": "लॉगिन",
            "footer_text": "हैकाथॉन प्रोजेक्ट - राज्यों के बीच सेवाओं को जोड़ना",

            // Dashboard
            "your_benefits": "आपके पोर्टेबल लाभ",
            "food_benefits": "खाद्य लाभ",
            "food_description": "राज्यों में सब्सिडी वाले खाद्य अनाज तक पहुंच",
            "health_benefits": "स्वास्थ्य सेवा",
            "health_description": "भारत में कहीं भी चिकित्सा सेवाओं तक पहुंच",
            "education_benefits": "शिक्षा",
            "education_description": "स्कूल प्रवेश और छात्रवृत्ति",
            "finance_benefits": "वित्तीय सेवाएं",
            "finance_description": "बैंकिंग और वित्तीय सहायता",
            "download_cards": "सभी कार्ड डाउनलोड करें",
            "qr_code": "QR कोड",
            "support": "सहायता",

            // Food Benefits
            "food_subtitle": "सार्वजनिक वितरण प्रणाली (PDS)",
            "your_entitlement": "आपका अधिकार",
            "monthly_allocation": "मासिक आवंटन",
            "rice_amount": "5 किलो",
            "wheat_amount": "5 किलो",
            "sugar_amount": "1 किलो",
            "oil_amount": "1 लीटर",
            "current_status": "वर्तमान स्थिति",
            "used_this_month": "इस महीने उपयोग: 75% आवंटन का",
            "recent_usage": "हाल का उपयोग",
            "shop_location": "दुकान/स्थान",
            "items": "वस्तुएं",
            "pds_card": "PDS कार्ड पहुंच",
            "antyodaya": "अंत्योदय अन्न योजना",
            "portability": "अंतर्राज्यीय पोर्टेबिलिटी",
            "midday_meal": "मध्याह्न भोजन (बच्चे)",
            "find_nearest_shop": "निकटतम दुकान खोजें",
            "transfer_benefits": "लाभ स्थानांतरित करें",
            "transfer_description": "नए राज्य में जा रहे हैं? अपने लाभ को सहजता से स्थानांतरित करें।",

            // Health Benefits
            "health_subtitle": "आयुष्मान भारत और अन्य योजनाएं",
            "health_card_status": "स्वास्थ्य कार्ड स्थिति",
            "card_details": "कार्ड विवरण",
            "card_number": "कार्ड नंबर",
            "coverage": "कवरेज",
            "family_members": "परिवार के सदस्य",
            "valid_till": "वैध तक",
            "usage_status": "उपयोग की स्थिति",
            "used_this_year": "इस वर्ष उपयोग: ₹1,25,000 में से ₹5,00,000",
            "recent_medical_history": "हाल का चिकित्सा इतिहास",
            "hospital": "अस्पताल",
            "treatment": "उपचार",
            "cashless_treatment": "कैशलेस उपचार",
            "emergency_services": "आपातकालीन सेवाएं",
            "maternity_benefits": "मातृत्व लाभ",
            "medicine_coverage": "दवा कवरेज",
            "book_appointment": "अपॉइंटमेंट बुक करें",
            "find_hospital": "निकटतम अस्पताल खोजें",
            "emergency": "आपातकालीन संपर्क",
            "medicine_reminder": "दवा रिमाइंडर",
            "reminder_description": "अपनी दवाओं के लिए रिमाइंडर सेट करें",
            "set_reminder": "रिमाइंडर सेट करें",

            // Education Benefits
            "education_subtitle": "स्कूल प्रवेश और छात्रवृत्ति",
            "children_education": "बच्चों की शिक्षा स्थिति",
            "enrolled_children": "नामांकित बच्चे",
            "scholarship_status": "छात्रवृत्ति स्थिति",
            "merit_scholarship": "मेरिट छात्रवृत्ति",
            "minority_scholarship": "अल्पसंख्यक छात्रवृत्ति",
            "recent_applications": "हाल के आवेदन",
            "school_name": "स्कूल का नाम",
            "class": "कक्षा",
            "school_admission": "स्कूल प्रवेश",
            "scholarship_programs": "छात्रवृत्ति कार्यक्रम",
            "free_textbooks": "मुफ्त पाठ्यपुस्तकें",
            "transport_allowance": "परिवहन भत्ता",
            "uniform_allowance": "वर्दी भत्ता",
            "apply_admission": "प्रवेश के लिए आवेदन करें",
            "apply_scholarship": "छात्रवृत्ति के लिए आवेदन करें",
            "find_schools": "नजदीकी स्कूल खोजें",
            "download_certificates": "प्रमाणपत्र डाउनलोड करें",
            "school_transfer": "स्कूल स्थानांतरण",

            // Finance Benefits
            "finance_subtitle": "बैंकिंग और वित्तीय सहायता",
            "account_details": "खाता विवरण",
            "primary_account": "मुख्य खाता",
            "bank_name": "बैंक",
            "account_number": "खाता नंबर",
            "ifsc_code": "IFSC",
            "balance": "शेष राशि",
            "benefits_received": "प्राप्त लाभ",
            "pm_kisan": "PM-KISAN",
            "pension": "पेंशन",
            "insurance": "बीमा",
            "loans": "ऋण",
            "recent_transactions": "हाल के लेनदेन",
            "description": "विवरण",
            "type": "प्रकार",
            "zero_balance_account": "जीरो बैलेंस खाता",
            "money_transfer": "मनी ट्रांसफर",
            "micro_loans": "माइक्रो ऋण",
            "insurance_schemes": "बीमा योजनाएं",
            "pension_schemes": "पेंशन योजनाएं",
            "digital_payments": "डिजिटल भुगतान",
            "check_balance": "शेष राशि जांचें",
            "transfer_money": "पैसे ट्रांसफर करें",
            "apply_loan": "ऋण के लिए आवेदन करें",
            "find_bank": "निकटतम बैंक खोजें",
            "financial_literacy": "वित्तीय साक्षरता",
            "literacy_description": "वित्तीय योजना और बचत के बारे में जानें",
            "access_resources": "संसाधन पहुंच",
            "investment_options": "निवेश विकल्प",
            "investment_description": "सुरक्षित निवेश विकल्प खोजें",
            "explore_investments": "निवेश खोजें",

            // QR Code
            "digital_identity": "डिजिटल पहचान",
            "how_to_use": "उपयोग कैसे करें",
            "qr_instruction_1": "• सेवा केंद्रों पर यह QR कोड दिखाएं",
            "qr_instruction_2": "• तुरंत लाभ सत्यापन के लिए स्कैन करें",
            "qr_instruction_3": "• इंटरनेट कनेक्शन के बिना भी काम करता है",
            "qr_instruction_4": "• इस कोड को सुरक्षित और निजी रखें",
            "download_qr": "QR कोड डाउनलोड करें",
            "share_qr": "साझा करें",
            "print_qr": "प्रिंट करें",
            "accessible_benefits": "पहुंच योग्य लाभ",
            "food": "खाद्य",
            "healthcare": "स्वास्थ्य सेवा",
            "education": "शिक्षा",
            "finance": "वित्त",
            "security_notice": "सुरक्षा सूचना",
            "security_tip_1": "• अपना QR कोड सोशल मीडिया पर कभी साझा न करें",
            "security_tip_2": "• केवल अधिकृत सेवा प्रदाताओं को दिखाएं",
            "security_tip_3": "• किसी भी संदिग्ध गतिविधि की तुरंत रिपोर्ट करें",
            "security_tip_4": "• सुरक्षा के लिए QR कोड हर 30 दिनों में समाप्त हो जाता है"
        },

        bn: {
            // Common
            "language": "ভাষা",
            "back_to_dashboard": "ড্যাশবোর্ডে ফিরে যান",
            "logout": "লগআউট",
            "need_help": "সাহায্য প্রয়োজন?",
            "helpline": "হেল্পলাইন",
            "website": "ওয়েবসাইট",
            "email": "ইমেইল",
            "quick_actions": "দ্রুত কর্ম",
            "available_services": "উপলব্ধ সেবা",
            "date": "তারিখ",
            "status": "অবস্থা",
            "amount": "পরিমাণ",
            "active": "সক্রিয়",
            "pending": "মুলতুবি",
            "apply": "আবেদন করুন",
            "view_details": "বিস্তারিত দেখুন",
            "download_card": "কার্ড ডাউনলোড করুন",
            "find_center": "কেন্দ্র খুঁজুন",
            "apply_now": "এখনই আবেদন করুন",
            "report_issue": "সমস্যার রিপোর্ট করুন",
            "start_transfer": "স্থানান্তর প্রক্রিয়া শুরু করুন",
            "offline_warning": "⚠️ আপনি অফলাইন আছেন - ক্যাশড ডেটা দেখানো হচ্ছে",

            // Login Page
            "login_subtitle": "পোর্টেবল সেবার জন্য আপনার গেটওয়ে",
            "migrant_id_label": "আধার/প্রবাসী আইডি",
            "select_user": "ব্যবহারকারী নির্বাচন করুন",
            "language_label": "ভাষা",
            "login_button": "লগইন",
            "footer_text": "হ্যাকাথন প্রকল্প - রাজ্যের মধ্যে সেবা সংযোগ",

            // Dashboard
            "your_benefits": "আপনার পোর্টেবল সুবিধা",
            "food_benefits": "খাদ্য সুবিধা",
            "food_description": "রাজ্যে ভর্তুকি খাদ্য শস্যের অ্যাক্সেস",
            "health_benefits": "স্বাস্থ্যসেবা",
            "health_description": "ভারতের যেকোনো স্থানে চিকিৎসা সেবার অ্যাক্সেস",
            "education_benefits": "শিক্ষা",
            "education_description": "স্কুলে ভর্তি এবং বৃত্তি",
            "finance_benefits": "আর্থিক সেবা",
            "finance_description": "ব্যাংকিং এবং আর্থিক সহায়তা",
            "download_cards": "সব কার্ড ডাউনলোড করুন",
            "qr_code": "QR কোড",
            "support": "সহায়তা",

            // Food Benefits
            "food_subtitle": "পাবলিক ডিস্ট্রিবিউশন সিস্টেম (PDS)",
            "your_entitlement": "আপনার অধিকার",
            "monthly_allocation": "মাসিক বরাদ্দ",
            "rice_amount": "৫ কেজি",
            "wheat_amount": "৫ কেজি",
            "sugar_amount": "১ কেজি",
            "oil_amount": "১ লিটার",
            "current_status": "বর্তমান অবস্থা",
            "used_this_month": "এই মাসে ব্যবহৃত: ৭৫% বরাদ্দের",
            "recent_usage": "সাম্প্রতিক ব্যবহার",
            "shop_location": "দোকান/স্থান",
            "items": "আইটেম",
            "pds_card": "PDS কার্ড অ্যাক্সেস",
            "antyodaya": "অন্ত্যোদয় অন্ন যোজনা",
            "portability": "আন্তঃরাজ্য পোর্টেবিলিটি",
            "midday_meal": "মধ্যাহ্নভোজন (শিশু)",
            "find_nearest_shop": "নিকটতম দোকান খুঁজুন",
            "transfer_benefits": "সুবিধা স্থানান্তর",
            "transfer_description": "নতুন রাজ্যে যাচ্ছেন? আপনার সুবিধা মসৃণভাবে স্থানান্তর করুন।",

            // Health Benefits
            "health_subtitle": "আয়ুষ্মান ভারত এবং অন্যান্য স্কিম",
            "health_card_status": "স্বাস্থ্য কার্ডের অবস্থা",
            "card_details": "কার্ডের বিবরণ",
            "card_number": "কার্ড নম্বর",
            "coverage": "কভারেজ",
            "family_members": "পরিবারের সদস্য",
            "valid_till": "বৈধ পর্যন্ত",
            "usage_status": "ব্যবহারের অবস্থা",
            "used_this_year": "এই বছর ব্যবহৃত: ₹১,২৫,০০০ এর মধ্যে ₹৫,০০,০০০",
            "recent_medical_history": "সাম্প্রতিক চিকিৎসা ইতিহাস",
            "hospital": "হাসপাতাল",
            "treatment": "চিকিৎসা",
            "cashless_treatment": "ক্যাশলেস চিকিৎসা",
            "emergency_services": "জরুরি সেবা",
            "maternity_benefits": "মাতৃত্বকালীন সুবিধা",
            "medicine_coverage": "ওষুধ কভারেজ",
            "book_appointment": "অ্যাপয়েন্টমেন্ট বুক করুন",
            "find_hospital": "নিকটতম হাসপাতাল খুঁজুন",
            "emergency": "জরুরি যোগাযোগ",
            "medicine_reminder": "ওষুধ রিমাইন্ডার",
            "reminder_description": "আপনার ওষুধের জন্য রিমাইন্ডার সেট করুন",
            "set_reminder": "রিমাইন্ডার সেট করুন",

            // Education Benefits
            "education_subtitle": "স্কুল ভর্তি এবং বৃত্তি",
            "children_education": "শিশুদের শিক্ষার অবস্থা",
            "enrolled_children": "ভর্তি শিশু",
            "scholarship_status": "বৃত্তির অবস্থা",
            "merit_scholarship": "মেধা বৃত্তি",
            "minority_scholarship": "সংখ্যালঘু বৃত্তি",
            "recent_applications": "সাম্প্রতিক আবেদন",
            "school_name": "স্কুলের নাম",
            "class": "শ্রেণী",
            "school_admission": "স্কুল ভর্তি",
            "scholarship_programs": "বৃত্তি কর্মসূচি",
            "free_textbooks": "বিনামূল্যে পাঠ্যবই",
            "transport_allowance": "পরিবহন ভাতা",
            "uniform_allowance": "ইউনিফর্ম ভাতা",
            "apply_admission": "ভর্তির জন্য আবেদন করুন",
            "apply_scholarship": "বৃত্তির জন্য আবেদন করুন",
            "find_schools": "নিকটবর্তী স্কুল খুঁজুন",
            "download_certificates": "সার্টিফিকেট ডাউনলোড করুন",
            "school_transfer": "স্কুল স্থানান্তর",

            // Finance Benefits
            "finance_subtitle": "ব্যাংকিং এবং আর্থিক সহায়তা",
            "account_details": "অ্যাকাউন্টের বিবরণ",
            "primary_account": "প্রাথমিক অ্যাকাউন্ট",
            "bank_name": "ব্যাংক",
            "account_number": "অ্যাকাউন্ট নম্বর",
            "ifsc_code": "IFSC",
            "balance": "ব্যালেন্স",
            "benefits_received": "প্রাপ্ত সুবিধা",
            "pm_kisan": "PM-KISAN",
            "pension": "পেনশন",
            "insurance": "বীমা",
            "loans": "ঋণ",
            "recent_transactions": "সাম্প্রতিক লেনদেন",
            "description": "বিবরণ",
            "type": "প্রকার",
            "zero_balance_account": "জিরো ব্যালেন্স অ্যাকাউন্ট",
            "money_transfer": "মানি ট্রান্সফার",
            "micro_loans": "মাইক্রো ঋণ",
            "insurance_schemes": "বীমা স্কিম",
            "pension_schemes": "পেনশন স্কিম",
            "digital_payments": "ডিজিটাল পেমেন্ট",
            "check_balance": "ব্যালেন্স চেক করুন",
            "transfer_money": "টাকা ট্রান্সফার করুন",
            "apply_loan": "ঋণের জন্য আবেদন করুন",
            "find_bank": "নিকটতম ব্যাংক খুঁজুন",
            "financial_literacy": "আর্থিক সাক্ষরতা",
            "literacy_description": "আর্থিক পরিকল্পনা এবং সঞ্চয় সম্পর্কে জানুন",
            "access_resources": "সম্পদ অ্যাক্সেস",
            "investment_options": "বিনিয়োগ বিকল্প",
            "investment_description": "নিরাপদ বিনিয়োগ বিকল্প অন্বেষণ করুন",
            "explore_investments": "বিনিয়োগ অন্বেষণ",

            // QR Code
            "digital_identity": "ডিজিটাল পরিচয়",
            "how_to_use": "কিভাবে ব্যবহার করবেন",
            "qr_instruction_1": "• সেবা কেন্দ্রে এই QR কোড দেখান",
            "qr_instruction_2": "• তাৎক্ষণিক সুবিধা যাচাইয়ের জন্য স্ক্যান করুন",
            "qr_instruction_3": "• ইন্টারনেট সংযোগ ছাড়াই কাজ করে",
            "qr_instruction_4": "• এই কোড নিরাপদ এবং গোপনীয় রাখুন",
            "download_qr": "QR কোড ডাউনলোড করুন",
            "share_qr": "শেয়ার করুন",
            "print_qr": "প্রিন্ট করুন",
            "accessible_benefits": "অ্যাক্সেসযোগ্য সুবিধা",
            "food": "খাদ্য",
            "healthcare": "স্বাস্থ্যসেবা",
            "education": "শিক্ষা",
            "finance": "অর্থ",
            "security_notice": "নিরাপত্তা বিজ্ঞপ্তি",
            "security_tip_1": "• আপনার QR কোড কখনো সোশ্যাল মিডিয়ায় শেয়ার করবেন না",
            "security_tip_2": "• শুধুমাত্র অনুমোদিত সেবা প্রদানকারীদের দেখান",
            "security_tip_3": "• যেকোনো সন্দেহজনক কার্যকলাপের তাৎক্ষণিক রিপোর্ট করুন",
            "security_tip_4": "• নিরাপত্তার জন্য QR কোড প্রতি ৩০ দিনে মেয়াদ শেষ হয়"
        }
    };

    return translations[langCode] || translations.en;
}

// Initialize language system
document.addEventListener('DOMContentLoaded', function () {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    loadLanguage(savedLanguage);
});
