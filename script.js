// bangla-skill-hub/script.js

// ===== GLOBAL VARIABLES =====
const API_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // আপনার Google Apps Script URL

// ===== UTILITY FUNCTIONS =====
function showAlert(message, type = 'info') {
    const alertBox = document.createElement('div');
    alertBox.className = `alert alert-${type}`;
    alertBox.innerHTML = `
        ${message}
        <span class="alert-close">&times;</span>
    `;
    
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.classList.add('show');
    }, 10);
    
    alertBox.querySelector('.alert-close').addEventListener('click', () => {
        alertBox.classList.remove('show');
        setTimeout(() => {
            alertBox.remove();
        }, 300);
    });
    
    setTimeout(() => {
        if (alertBox.parentNode) {
            alertBox.classList.remove('show');
            setTimeout(() => {
                alertBox.remove();
            }, 300);
        }
    }, 5000);
}

// ===== NAVIGATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking link
    if (navLinks) {
        const navItems = navLinks.querySelectorAll('a');
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar && window.scrollY > 50) {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else if (navbar) {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
});

// ===== LOCAL STORAGE MANAGEMENT =====
class StorageManager {
    static setUser(userData) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
    }
    
    static getUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    
    static clearUser() {
        localStorage.removeItem('currentUser');
    }
    
    static setCourse(courseData) {
        localStorage.setItem('selectedCourse', JSON.stringify(courseData));
    }
    
    static getCourse() {
        const course = localStorage.getItem('selectedCourse');
        return course ? JSON.parse(course) : null;
    }
    
    static clearCourse() {
        localStorage.removeItem('selectedCourse');
    }
    
    static setPayment(paymentData) {
        localStorage.setItem('paymentData', JSON.stringify(paymentData));
    }
    
    static getPayment() {
        const payment = localStorage.getItem('paymentData');
        return payment ? JSON.parse(payment) : null;
    }
    
    static clearPayment() {
        localStorage.removeItem('paymentData');
    }
}

// ===== VALIDATION FUNCTIONS =====
class Validator {
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    static validatePhone(phone) {
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        return regex.test(phone);
    }
    
    static validateName(name) {
        return name.length >= 2;
    }
    
    static validatePassword(password) {
        return password.length >= 6;
    }
    
    static validateAge(age) {
        return age >= 13 && age <= 100;
    }
    
    static validateBkashNumber(number) {
        const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
        return regex.test(number);
    }
    
    static validateTrxID(trxId) {
        return trxId.length >= 8;
    }
}

// ===== FORM HANDLING =====
function setupFormValidation(formId, rules) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        rules.forEach(rule => {
            const element = form.querySelector(rule.selector);
            const value = element.value.trim();
            
            // Check required fields
            if (rule.required && !value) {
                isValid = false;
                showError(element, `${rule.fieldName} প্রয়োজন`);
                errors.push(`${rule.fieldName} প্রয়োজন`);
                return;
            }
            
            // Validate based on type
            if (value) {
                if (rule.type === 'email' && !Validator.validateEmail(value)) {
                    isValid = false;
                    showError(element, 'বৈধ ইমেইল দিন');
                    errors.push('বৈধ ইমেইল দিন');
                } else if (rule.type === 'phone' && !Validator.validatePhone(value)) {
                    isValid = false;
                    showError(element, 'বৈধ মোবাইল নম্বর দিন (01XXXXXXXXX)');
                    errors.push('বৈধ মোবাইল নম্বর দিন');
                } else if (rule.type === 'password' && !Validator.validatePassword(value)) {
                    isValid = false;
                    showError(element, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
                    errors.push('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
                } else if (rule.type === 'name' && !Validator.validateName(value)) {
                    isValid = false;
                    showError(element, 'নাম কমপক্ষে ২ অক্ষর হতে হবে');
                    errors.push('নাম কমপক্ষে ২ অক্ষর হতে হবে');
                } else {
                    showSuccess(element);
                }
            }
        });
        
        if (isValid) {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Handle form submission
            handleFormSubmit(formId, data);
        } else {
            showAlert('দয়া করে সব তথ্য সঠিকভাবে দিন', 'error');
        }
    });
    
    // Real-time validation
    rules.forEach(rule => {
        const element = form.querySelector(rule.selector);
        if (element) {
            element.addEventListener('blur', function() {
                const value = this.value.trim();
                
                if (rule.required && !value) {
                    showError(this, `${rule.fieldName} প্রয়োজন`);
                } else if (value) {
                    if (rule.type === 'email' && !Validator.validateEmail(value)) {
                        showError(this, 'বৈধ ইমেইল দিন');
                    } else if (rule.type === 'phone' && !Validator.validatePhone(value)) {
                        showError(this, 'বৈধ মোবাইল নম্বর দিন');
                    } else if (rule.type === 'password' && !Validator.validatePassword(value)) {
                        showError(this, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে');
                    } else if (rule.type === 'name' && !Validator.validateName(value)) {
                        showError(this, 'নাম কমপক্ষে ২ অক্ষর হতে হবে');
                    } else {
                        showSuccess(this);
                    }
                }
            });
        }
    });
}

function showError(element, message) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) return;
    
    element.classList.add('error-input');
    element.classList.remove('success-input');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function showSuccess(element) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) return;
    
    element.classList.remove('error-input');
    element.classList.add('success-input');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// ===== GOOGLE SHEETS INTEGRATION =====
async function saveToGoogleSheets(data, sheetName) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'saveData',
                sheetName: sheetName,
                data: data
            })
        });
        
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Error saving to Google Sheets:', error);
        return false;
    }
}

async function getFromGoogleSheets(sheetName) {
    try {
        const response = await fetch(`${API_URL}?action=getData&sheetName=${sheetName}`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Error getting from Google Sheets:', error);
        return null;
    }
}

// ===== COURSE MANAGEMENT =====
class CourseManager {
    static async getCourses() {
        try {
            // Try to get from localStorage first
            const cached = localStorage.getItem('courses');
            if (cached) {
                return JSON.parse(cached);
            }
            
            // If not in cache, try to fetch from Google Sheets
            const courses = await getFromGoogleSheets('courses');
            if (courses) {
                localStorage.setItem('courses', JSON.stringify(courses));
                return courses;
            }
            
            // Fallback to default courses
            return this.getDefaultCourses();
        } catch (error) {
            console.error('Error getting courses:', error);
            return this.getDefaultCourses();
        }
    }
    
    static getDefaultCourses() {
        return [
            {
                id: 'javascript-mastery',
                name: 'জাভাস্ক্রিপ্ট মাস্টারি',
                category: 'web',
                level: 'beginner',
                price: 1999,
                originalPrice: 3999,
                duration: '40 ঘন্টা',
                students: 5200,
                rating: 4.8,
                instructor: 'আহমেদ হাসান',
                description: 'শূন্য থেকে এডভান্সড জাভাস্ক্রিপ্ট শিখুন',
                active: true
            },
            {
                id: 'figma-design',
                name: 'Figma UI/UX ডিজাইন',
                category: 'design',
                level: 'beginner',
                price: 1499,
                originalPrice: 2999,
                duration: '35 ঘন্টা',
                students: 3800,
                rating: 4.7,
                instructor: 'তাসনিমা আহমেদ',
                description: 'প্রফেশনাল UI/UX ডিজাইনার হন',
                active: true
            }
        ];
    }
    
    static async updateCoursePrices(prices) {
        try {
            // Update localStorage
            const courses = await this.getCourses();
            const updatedCourses = courses.map(course => {
                if (prices[course.id]) {
                    return { ...course, ...prices[course.id] };
                }
                return course;
            });
            
            localStorage.setItem('courses', JSON.stringify(updatedCourses));
            
            // Try to update Google Sheets
            await saveToGoogleSheets(prices, 'course_prices');
            
            return true;
        } catch (error) {
            console.error('Error updating course prices:', error);
            return false;
        }
    }
}

// ===== USER MANAGEMENT =====
class UserManager {
    static async register(userData) {
        try {
            // Save to localStorage
            StorageManager.setUser(userData);
            
            // Save to Google Sheets
            const success = await saveToGoogleSheets({
                ...userData,
                registeredAt: new Date().toISOString(),
                status: 'active'
            }, 'users');
            
            if (success) {
                showAlert('সাইনআপ সফল! এখন আপনি লগইন করতে পারেন', 'success');
                return true;
            } else {
                showAlert('সাইনআপ সম্পন্ন হয়েছে কিন্তু ডেটা সেভ করা যায়নি', 'warning');
                return true; // Still return true because user is saved locally
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('সাইনআপে সমস্যা হয়েছে', 'error');
            return false;
        }
    }
    
    static async login(email, password) {
        try {
            // For demo, check localStorage
            const users = await getFromGoogleSheets('users');
            
            if (users) {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    StorageManager.setUser(user);
                    showAlert('লগইন সফল!', 'success');
                    return user;
                }
            }
            
            // Fallback to localStorage
            const storedUser = localStorage.getItem('users');
            if (storedUser) {
                const users = JSON.parse(storedUser);
                const user = users.find(u => u.email === email && u.password === password);
                if (user) {
                    StorageManager.setUser(user);
                    showAlert('লগইন সফল!', 'success');
                    return user;
                }
            }
            
            showAlert('ইমেইল বা পাসওয়ার্ড ভুল', 'error');
            return null;
        } catch (error) {
            console.error('Login error:', error);
            showAlert('লগইনে সমস্যা হয়েছে', 'error');
            return null;
        }
    }
    
    static logout() {
        StorageManager.clearUser();
        window.location.href = 'index.html';
    }
    
    static isLoggedIn() {
        return StorageManager.getUser() !== null;
    }
    
    static getCurrentUser() {
        return StorageManager.getUser();
    }
}

// ===== PAYMENT MANAGEMENT =====
class PaymentManager {
    static async processPayment(paymentData) {
        try {
            // Validate payment data
            if (!paymentData.method || !paymentData.amount) {
                throw new Error('Invalid payment data');
            }
            
            // Generate transaction ID
            const transactionId = 'TRX' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
            
            const completePaymentData = {
                ...paymentData,
                transactionId: transactionId,
                status: 'completed',
                paidAt: new Date().toISOString()
            };
            
            // Save to localStorage
            StorageManager.setPayment(completePaymentData);
            
            // Save to Google Sheets
            const success = await saveToGoogleSheets(completePaymentData, 'payments');
            
            if (success) {
                return {
                    success: true,
                    transactionId: transactionId,
                    message: 'পেমেন্ট সফল হয়েছে'
                };
            } else {
                return {
                    success: false,
                    message: 'পেমেন্ট সম্পন্ন হয়েছে কিন্তু ডেটা সেভ করা যায়নি'
                };
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            return {
                success: false,
                message: 'পেমেন্টে সমস্যা হয়েছে'
            };
        }
    }
    
    static validateBkashPayment(bkashNumber, trxId) {
        if (!Validator.validateBkashNumber(bkashNumber)) {
            return { valid: false, message: 'বৈধ bKash নম্বর দিন (01XXXXXXXXX)' };
        }
        
        if (!Validator.validateTrxID(trxId)) {
            return { valid: false, message: 'ট্রানজেকশন আইডি কমপক্ষে ৮ অক্ষর হতে হবে' };
        }
        
        return { valid: true, message: 'ভ্যালিডেশন সফল' };
    }
    
    static validateNagadPayment(nagadNumber, trxId) {
        if (!Validator.validatePhone(nagadNumber)) {
            return { valid: false, message: 'বৈধ Nagad নম্বর দিন (01XXXXXXXXX)' };
        }
        
        if (!Validator.validateTrxID(trxId)) {
            return { valid: false, message: 'ট্রানজেকশন আইডি কমপক্ষে ৮ অক্ষর হতে হবে' };
        }
        
        return { valid: true, message: 'ভ্যালিডেশন সফল' };
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const currentUser = UserManager.getCurrentUser();
    
    if (currentUser) {
        // Update UI for logged in user
        const loginLinks = document.querySelectorAll('.login-link, .auth-buttons');
        loginLinks.forEach(link => {
            if (link.parentNode) {
                link.parentNode.innerHTML = `
                    <span style="margin-right: 15px;">স্বাগতম, ${currentUser.name}</span>
                    <a href="dashboard.html" class="btn btn-secondary">ড্যাশবোর্ড</a>
                    <button onclick="UserManager.logout()" class="btn btn-outline" style="margin-left: 10px;">
                        লগ আউট
                    </button>
                `;
            }
        });
    }
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = tooltipText;
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 10) + 'px';
            tooltipEl.style.left = (rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2) + 'px';
            
            this.tooltipElement = tooltipEl;
        });
        
        tooltip.addEventListener('mouseleave', function() {
            if (this.tooltipElement) {
                this.tooltipElement.remove();
            }
        });
    });
});

// ===== GLOBAL EXPORTS =====
window.StorageManager = StorageManager;
window.Validator = Validator;
window.CourseManager = CourseManager;
window.UserManager = UserManager;
window.PaymentManager = PaymentManager;
window.showAlert = showAlert;
window.setupFormValidation = setupFormValidation;
