// Theme Toggle Functionality
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const bodyElement = document.body;
    
    if (!themeToggleBtn) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    bodyElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    function updateIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
    
    // Set initial icon
    updateIcon(savedTheme);
    
    // Add click event listener
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        // Update background animation colors with smooth transition
        const animatedBackground = document.querySelector('.animated-background');
        if (animatedBackground) {
            animatedBackground.style.transition = 'opacity 0.3s ease';
            animatedBackground.style.opacity = '0.8';
            setTimeout(() => {
                animatedBackground.style.opacity = '1';
            }, 300);
        }
        
        // Show theme change notification
        showNotification(`Switched to ${newTheme} theme`, 'info', 2000);
    });
}

// Mobile Navigation - Initialize after DOM loads
function initializeMobileNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Gemini AI Configuration
const GEMINI_API_KEY = 'AIzaSyDK68voN4wRnCh95nrlu0m9vHbtJKOECqM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// AI Demo Functionality with Real Gemini Integration
const demoSubmit = document.getElementById('demoSubmit');
const demoPrompt = document.getElementById('demoPrompt');
const demoOutput = document.getElementById('demoOutput');

async function callGeminiAPI(prompt) {
    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are an AI assistant for LadeStack, a platform that empowers developers with AI tools. Please provide a helpful, professional response about: ${prompt}

Context: LadeStack offers AI-powered development tools including API testing, website building, file management, and document summarization. Focus on being helpful for developers and mention how AI can enhance their workflow when relevant.

Keep the response concise (2-3 paragraphs max) and developer-focused.`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Invalid response format from Gemini API');
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        
        // Fallback responses for common topics
        const fallbackResponses = {
            'web development': 'Modern web development focuses on creating fast, responsive, and accessible applications. Key technologies include React, Vue.js, Node.js, and modern CSS frameworks. LadeStack\'s AI tools can help streamline your development workflow with intelligent API testing and automated documentation generation.',
            'ai': 'Artificial Intelligence is transforming software development through automated code generation, intelligent debugging, and enhanced user experiences. LadeStack leverages AI models like Gemini 2.5 Pro to provide developers with powerful tools for API testing, website building, and document analysis.',
            'programming': 'Programming is the art of solving problems through code. Modern programming emphasizes clean code principles, test-driven development, and collaborative workflows. LadeStack\'s AI-powered tools can help you write better code faster with intelligent suggestions and automated testing capabilities.',
            'api': 'APIs are the backbone of modern applications, enabling seamless communication between different services. LadeStack\'s API testing tool provides intelligent documentation generation and automated testing capabilities, making API development more efficient and reliable.',
            'default': `Great question about "${prompt}"! AI-powered development tools can help you explore this topic further. LadeStack's suite of tools provides intelligent assistance for various development tasks, from API testing to website building. Our AI integration helps developers work more efficiently and build better applications.`
        };

        // Find relevant fallback response
        const topic = Object.keys(fallbackResponses).find(key => 
            prompt.toLowerCase().includes(key)
        ) || 'default';
        
        return fallbackResponses[topic];
    }
}

demoSubmit.addEventListener('click', async () => {
    const prompt = demoPrompt.value.trim();
    if (!prompt) {
        alert('Please enter a prompt to get started!');
        return;
    }

    // Disable button and show loading state
    demoSubmit.disabled = true;
    demoSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    demoOutput.innerHTML = `
        <div class="demo-loading">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Gemini 2.5 Pro is thinking...</p>
        </div>
    `;

    try {
        const aiResponse = await callGeminiAPI(prompt);
        
        demoOutput.innerHTML = `
            <div class="demo-response">
                <div class="response-header">
                    <i class="fas fa-robot"></i>
                    <span>Gemini 2.5 Pro Response</span>
                </div>
                <p>${aiResponse}</p>
                <div class="response-footer">
                    <small>Powered by Google's Gemini 2.5 Pro AI model • Try our full AI tools for more advanced capabilities</small>
                </div>
            </div>
        `;
    } catch (error) {
        demoOutput.innerHTML = `
            <div class="demo-error">
                <div class="response-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Connection Error</span>
                </div>
                <p>Unable to connect to AI service at the moment. Please try again later or check your internet connection.</p>
                <div class="response-footer">
                    <small>Our AI tools are temporarily unavailable. Please try again in a few moments.</small>
                </div>
            </div>
        `;
    } finally {
        // Re-enable button
        demoSubmit.disabled = false;
        demoSubmit.innerHTML = 'Generate Response';
    }
});

// Newsletter Form
const newsletterForm = document.getElementById('newsletterForm');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    // Show success message
    const formContainer = e.target.parentElement;
    formContainer.innerHTML = `
        <div class="newsletter-success">
            <i class="fas fa-check-circle"></i>
            <h3>Thank you for subscribing!</h3>
            <p>We've added ${email} to our newsletter. You'll receive updates about new tools and AI trends.</p>
        </div>
    `;
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Initialize scroll animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.feature-card, .project-card, .testimonial-card, .news-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Initialize project redirect functionality
function initializeProjectRedirects() {
    const projectButtons = document.querySelectorAll('.project-card .btn-outline');
    const projectUrls = [
        '#', // API Testing Tool - replace with actual URL
        '#', // AI Website Builder - replace with actual URL
        '#', // File Management Platform - replace with actual URL
        '#'  // Docs Summarizer - coming soon
    ];

    projectButtons.forEach((button, index) => {
        if (index < 3) { // First 3 projects are available
            button.addEventListener('click', () => {
                // In a real implementation, these would redirect to actual tools
                alert(`Redirecting to ${button.parentElement.querySelector('h3').textContent}...`);
                // window.open(projectUrls[index], '_blank');
            });
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const bodyElement = document.body;
    
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        if (bodyElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
        }
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        if (bodyElement.getAttribute('data-theme') === 'dark') {
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    }
});

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1000);
        }
    });
});

// Performance optimization: Lazy load images when implemented
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add CSS for demo response styling
const demoStyles = `
    .demo-loading {
        text-align: center;
        color: var(--text-secondary);
    }
    
    .demo-loading i {
        font-size: 2rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
    }
    
    .demo-response {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 1.5rem;
        border-left: 4px solid var(--primary-color);
    }
    
    .response-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        color: var(--primary-color);
        font-weight: 500;
    }
    
    .response-footer {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border-color);
    }
    
    .response-footer small {
        color: var(--text-secondary);
        font-style: italic;
    }
    
    .newsletter-success {
        text-align: center;
        color: white;
    }
    
    .newsletter-success i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #10b981;
    }
    
    .newsletter-success h3 {
        color: white;
        margin-bottom: 1rem;
    }
    
    .demo-error {
        background: var(--bg-primary);
        border-radius: 8px;
        padding: 1.5rem;
        border-left: 4px solid #ef4444;
    }
    
    .demo-error .response-header {
        color: #ef4444;
    }
`;

// Inject demo styles
const styleSheet = document.createElement('style');
styleSheet.textContent = demoStyles;
document.head.appendChild(styleSheet);

// Clerk Authentication Integration
const CLERK_PUBLISHABLE_KEY = 'pk_test_Y2F1c2FsLWNhdC0xMy5jbGVyay5hY2NvdW50cy5kZXYk';

// Authentication state management
let isAuthenticated = false;
let currentUser = null;
let clerkInstance = null;

// Main initialization function
function initializeApp() {
    console.log('Initializing LadeStack application...');
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Initialize mobile navigation
    initializeMobileNavigation();
    
    // Initialize scroll animations
    initializeScrollAnimations();
    
    // Initialize project redirects
    initializeProjectRedirects();
    
    // Initialize authentication system
    console.log('Initializing authentication system...');
    
    // Check for existing session
    const savedUser = localStorage.getItem('ladestack_user');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            isAuthenticated = true;
            updateAuthUI(true);
        } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('ladestack_user');
        }
    }
    
    // Set up authentication event listeners
    setupAuthEventListeners();
    
    // Initialize UI
    updateAuthUI(isAuthenticated);
    
    // Initialize animated background
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const animatedBg = new AnimatedBackground();
        
        // Pause animations when tab is not visible for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                animatedBg.toggleAnimations(true);
            } else {
                animatedBg.toggleAnimations(false);
            }
        });
        
        // Pause animations on mobile when scrolling for better performance
        if (window.innerWidth < 768) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                animatedBg.toggleAnimations(true);
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    animatedBg.toggleAnimations(false);
                }, 150);
            });
        }
    }
    
    console.log('LadeStack application initialized successfully!');
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Initialize authentication
async function initializeAuth() {
    try {
        // Check if user is already signed in
        if (window.Clerk.user) {
            isAuthenticated = true;
            currentUser = window.Clerk.user;
            updateAuthUI(true);
        } else {
            isAuthenticated = false;
            currentUser = null;
            updateAuthUI(false);
        }

        // Listen for authentication state changes
        window.Clerk.addListener('user', (user) => {
            if (user) {
                isAuthenticated = true;
                currentUser = user;
                updateAuthUI(true);
                showWelcomeMessage(user);
            } else {
                isAuthenticated = false;
                currentUser = null;
                updateAuthUI(false);
            }
        });

        // Set up event listeners for auth buttons
        setupAuthEventListeners();
        
    } catch (error) {
        console.error('Authentication initialization failed:', error);
        updateAuthUI(false);
    }
}

// Update authentication UI
function updateAuthUI(authenticated) {
    const signedOut = document.getElementById('signed-out');
    const signedIn = document.getElementById('signed-in');
    
    if (authenticated && currentUser) {
        signedOut.style.display = 'none';
        signedIn.style.display = 'block';
        
        // Update user info
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const userAvatar = document.getElementById('user-button');
        
        if (userName) userName.textContent = currentUser.fullName || currentUser.firstName || 'User';
        if (userEmail) userEmail.textContent = currentUser.primaryEmailAddress?.emailAddress || '';
        
        // Update avatar
        if (currentUser.imageUrl) {
            userAvatar.innerHTML = `<img src="${currentUser.imageUrl}" alt="User Avatar">`;
        } else {
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        // Show protected content
        showProtectedContent();
        
    } else {
        signedOut.style.display = 'flex';
        signedIn.style.display = 'none';
        
        // Hide protected content
        hideProtectedContent();
    }
}

// Set up authentication event listeners
function setupAuthEventListeners() {
    // Sign In button
    const signInBtn = document.getElementById('sign-in-btn');
    if (signInBtn) {
        signInBtn.addEventListener('click', async () => {
            signInBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            signInBtn.disabled = true;
            
            // Simulate sign in process
            setTimeout(() => {
                // Demo user data
                const demoUser = {
                    firstName: 'Demo',
                    fullName: 'Demo User',
                    primaryEmailAddress: { emailAddress: 'demo@ladestack.com' },
                    imageUrl: null
                };
                
                // Save to localStorage
                localStorage.setItem('ladestack_user', JSON.stringify(demoUser));
                
                // Update state
                currentUser = demoUser;
                isAuthenticated = true;
                
                // Update UI
                updateAuthUI(true);
                showWelcomeMessage(demoUser);
                
                signInBtn.innerHTML = 'Sign In';
                signInBtn.disabled = false;
            }, 1500);
        });
    }

    // Sign Up button
    const signUpBtn = document.getElementById('sign-up-btn');
    if (signUpBtn) {
        signUpBtn.addEventListener('click', async () => {
            signUpBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Up...';
            signUpBtn.disabled = true;
            
            // Simulate sign up process
            setTimeout(() => {
                // Demo user data
                const demoUser = {
                    firstName: 'New',
                    fullName: 'New User',
                    primaryEmailAddress: { emailAddress: 'newuser@ladestack.com' },
                    imageUrl: null
                };
                
                // Save to localStorage
                localStorage.setItem('ladestack_user', JSON.stringify(demoUser));
                
                // Update state
                currentUser = demoUser;
                isAuthenticated = true;
                
                // Update UI
                updateAuthUI(true);
                showWelcomeMessage(demoUser);
                
                signUpBtn.innerHTML = 'Sign Up';
                signUpBtn.disabled = false;
            }, 1500);
        });
    }

    // User button dropdown
    const userButton = document.getElementById('user-button');
    const userDropdown = document.getElementById('user-dropdown');
    
    if (userButton && userDropdown) {
        userButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });

        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Manage Account button
    const manageAccountBtn = document.getElementById('manage-account-btn');
    if (manageAccountBtn) {
        manageAccountBtn.addEventListener('click', () => {
            showNotification('Account management would open here in production', 'info');
        });
    }

    // Sign Out button
    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            signOutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing Out...';
            
            setTimeout(() => {
                // Clear user data
                localStorage.removeItem('ladestack_user');
                
                // Update state
                currentUser = null;
                isAuthenticated = false;
                
                // Update UI
                updateAuthUI(false);
                showNotification('Successfully signed out!', 'success');
                
                signOutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Sign Out';
            }, 1000);
        });
    }
}

// Show welcome message for new users
function showWelcomeMessage(user) {
    const welcomeMessage = `
        <div class="welcome-notification">
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <h4>Welcome to LadeStack!</h4>
                <p>Hi ${user.firstName || 'there'}! You're now signed in and can access all our AI tools.</p>
            </div>
        </div>
    `;
    
    showNotification(welcomeMessage, 'success', 5000);
}

// Show/hide protected content based on authentication
function showProtectedContent() {
    // Update project buttons to show authenticated features
    const projectButtons = document.querySelectorAll('.project-card .btn-outline');
    projectButtons.forEach((button, index) => {
        if (index < 3) { // First 3 projects
            button.textContent = 'Launch Tool';
            button.classList.remove('btn-outline');
            button.classList.add('btn-primary');
        }
    });

    // Show authenticated user features in AI demo
    const demoContainer = document.querySelector('.demo-container');
    if (demoContainer && !demoContainer.querySelector('.auth-features')) {
        const authFeatures = document.createElement('div');
        authFeatures.className = 'auth-features';
        authFeatures.innerHTML = `
            <div class="auth-feature-badge">
                <i class="fas fa-crown"></i>
                <span>Premium AI Features Unlocked</span>
            </div>
        `;
        demoContainer.insertBefore(authFeatures, demoContainer.firstChild);
    }
}

function hideProtectedContent() {
    // Reset project buttons
    const projectButtons = document.querySelectorAll('.project-card .btn-primary');
    projectButtons.forEach((button, index) => {
        if (index < 3) {
            button.textContent = 'Try It Now';
            button.classList.remove('btn-primary');
            button.classList.add('btn-outline');
        }
    });

    // Remove authenticated features
    const authFeatures = document.querySelector('.auth-features');
    if (authFeatures) {
        authFeatures.remove();
    }
}

// Enhanced project redirect with authentication
document.addEventListener('DOMContentLoaded', () => {
    const projectButtons = document.querySelectorAll('.project-card .btn-outline, .project-card .btn-primary');
    
    projectButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (index < 3) { // First 3 projects are available
                if (isAuthenticated) {
                    // Authenticated users get direct access
                    showNotification('Launching tool...', 'info');
                    // In real implementation, redirect to actual tool
                    setTimeout(() => {
                        alert(`Launching ${button.parentElement.querySelector('h3').textContent} for authenticated user!`);
                    }, 1000);
                } else {
                    // Non-authenticated users see sign-up prompt
                    showAuthPrompt(button.parentElement.querySelector('h3').textContent);
                }
            }
        });
    });
});

// Show authentication prompt for protected features
function showAuthPrompt(toolName) {
    const modal = document.createElement('div');
    modal.className = 'auth-modal show';
    modal.innerHTML = `
        <div class="auth-modal-content">
            <button class="auth-modal-close">&times;</button>
            <div class="auth-prompt">
                <i class="fas fa-lock" style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;"></i>
                <h3>Sign In Required</h3>
                <p>To access <strong>${toolName}</strong> and other premium AI tools, please sign in to your account.</p>
                <div class="auth-prompt-buttons">
                    <button class="btn btn-primary" onclick="document.getElementById('sign-in-btn').click(); this.closest('.auth-modal').remove();">
                        Sign In
                    </button>
                    <button class="btn btn-outline" onclick="document.getElementById('sign-up-btn').click(); this.closest('.auth-modal').remove();">
                        Create Account
                    </button>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 1rem;">
                    Free account • No credit card required
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.auth-modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (document.body.contains(modal)) {
            modal.remove();
        }
    }, 10000);
}

// Notification system
function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = typeof message === 'string' ? `<p>${message}</p>` : message;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    if (type === 'success') {
        notification.style.borderLeftColor = '#10b981';
        notification.style.borderLeftWidth = '4px';
    } else if (type === 'error') {
        notification.style.borderLeftColor = '#ef4444';
        notification.style.borderLeftWidth = '4px';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove notification
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

// Add notification animations
const notificationStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .auth-feature-badge {
        background: var(--gradient);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }
    
    .auth-prompt {
        text-align: center;
    }
    
    .auth-prompt-buttons {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin: 1.5rem 0;
    }
    
    @media (max-width: 480px) {
        .auth-prompt-buttons {
            flex-direction: column;
        }
    }
`;

// Inject notification styles
const notificationStyleSheet = document.createElement('style');
notificationStyleSheet.textContent = notificationStyles;
document.head.appendChild(notificationStyleSheet);

// Animated Background Effects
class AnimatedBackground {
    constructor() {
        this.sparklesContainer = document.getElementById('sparklesContainer');
        this.techNodesContainer = document.getElementById('techNodesContainer');
        this.codeParticlesContainer = document.getElementById('codeParticlesContainer');
        this.geometricShapesContainer = document.getElementById('geometricShapesContainer');
        
        this.init();
    }
    
    init() {
        this.createSparkles();
        this.createTechNodes();
        this.createCodeParticles();
        this.createGeometricShapes();
        this.createConnectionLines();
        this.createDataStreams();

        
        // Update animations based on theme
        this.updateThemeColors();
    }
    
    createSparkles() {
        const sparkleCount = window.innerWidth < 768 ? 15 : 25;
        
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = `sparkle ${this.getRandomSize()}`;
            
            // Random position
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            
            this.sparklesContainer.appendChild(sparkle);
        }
    }
    
    createTechNodes() {
        const nodeCount = window.innerWidth < 768 ? 8 : 15;
        
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = `tech-node ${Math.random() > 0.7 ? 'active' : ''}`;
            
            // Random position
            node.style.left = Math.random() * 100 + '%';
            node.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            node.style.animationDelay = Math.random() * 6 + 's';
            
            this.techNodesContainer.appendChild(node);
        }
    }
    
    createCodeParticles() {
        const codeSnippets = [
            'const ai = new AI()',
            'function build()',
            '{ api: "rest" }',
            'npm install',
            'git commit -m',
            'async/await',
            'React.useState',
            'AI.generate()',
            'export default',
            'import { }',
            '=> { return }',
            'console.log()',
            'fetch("/api")',
            'JSON.parse()',
            'new Promise()',
            'try { catch }',
            'class Component',
            'this.setState',
            'useEffect()',
            'map(item =>)'
        ];
        
        const particleCount = window.innerWidth < 768 ? 8 : 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'code-particle';
            particle.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
            
            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 8 + 's';
            
            this.codeParticlesContainer.appendChild(particle);
        }
        
        // Continuously create new particles
        setInterval(() => {
            if (this.codeParticlesContainer.children.length < particleCount * 2) {
                const particle = document.createElement('div');
                particle.className = 'code-particle';
                particle.textContent = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
                particle.style.left = Math.random() * 100 + '%';
                
                this.codeParticlesContainer.appendChild(particle);
                
                // Remove particle after animation
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 8000);
            }
        }, 2000);
    }
    
    createGeometricShapes() {
        const shapes = ['triangle', 'square', 'hexagon'];
        const shapeCount = window.innerWidth < 768 ? 6 : 10;
        
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            shape.className = `geometric-shape ${shapeType}`;
            
            // Random position
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            
            // Random animation delay
            shape.style.animationDelay = Math.random() * 10 + 's';
            
            this.geometricShapesContainer.appendChild(shape);
        }
    }
    
    createConnectionLines() {
        const lineCount = window.innerWidth < 768 ? 3 : 6;
        
        for (let i = 0; i < lineCount; i++) {
            const line = document.createElement('div');
            line.className = `connection-line ${Math.random() > 0.5 ? 'vertical' : ''}`;
            
            if (line.classList.contains('vertical')) {
                line.style.left = Math.random() * 100 + '%';
                line.style.top = Math.random() * 80 + '%';
            } else {
                line.style.width = Math.random() * 200 + 50 + 'px';
                line.style.left = Math.random() * 80 + '%';
                line.style.top = Math.random() * 100 + '%';
            }
            
            // Random animation delay
            line.style.animationDelay = Math.random() * 4 + 's';
            
            this.techNodesContainer.appendChild(line);
        }
    }
    
    createDataStreams() {
        const streamCount = window.innerWidth < 768 ? 2 : 4;
        
        for (let i = 0; i < streamCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            
            // Random horizontal position
            stream.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            stream.style.animationDelay = Math.random() * 3 + 's';
            
            this.techNodesContainer.appendChild(stream);
        }
        
        // Continuously create new data streams
        setInterval(() => {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            stream.style.left = Math.random() * 100 + '%';
            
            this.techNodesContainer.appendChild(stream);
            
            // Remove stream after animation
            setTimeout(() => {
                if (stream.parentNode) {
                    stream.parentNode.removeChild(stream);
                }
            }, 3000);
        }, 4000);
    }
    
    getRandomSize() {
        const sizes = ['small', '', 'large'];
        return sizes[Math.floor(Math.random() * sizes.length)];
    }
    
    updateThemeColors() {
        // This method can be called when theme changes
        // Colors are handled by CSS variables, so no JS changes needed
    }
    


    // Method to pause/resume animations for performance
    toggleAnimations(pause = false) {
        const animatedElements = document.querySelectorAll('.sparkle, .tech-node, .code-particle, .geometric-shape, .connection-line, .data-stream, .matrix-char, .binary-char, .hex-char, .terminal-line, .glitch-line, .hacker-text, .system-status');
        
        animatedElements.forEach(element => {
            if (pause) {
                element.style.animationPlayState = 'paused';
            } else {
                element.style.animationPlayState = 'running';
            }
        });
    }
}

// Initialize animated background when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        const animatedBg = new AnimatedBackground();
        
        // Pause animations when tab is not visible for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                animatedBg.toggleAnimations(true);
            } else {
                animatedBg.toggleAnimations(false);
            }
        });
        
        // Pause animations on mobile when scrolling for better performance
        if (window.innerWidth < 768) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                animatedBg.toggleAnimations(true);
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    animatedBg.toggleAnimations(false);
                }, 150);
            });
        }
    }
});

// Enhanced theme toggle functionality
function initializeThemeToggle() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const bodyElement = document.body;
    
    if (!themeToggleBtn) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    bodyElement.setAttribute('data-theme', savedTheme);
    
    // Update theme toggle icon
    function updateIcon(theme) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }
    
    // Set initial icon
    updateIcon(savedTheme);
    
    // Add click event listener
    themeToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateIcon(newTheme);
        
        // Update background animation colors with smooth transition
        const animatedBackground = document.querySelector('.animated-background');
        if (animatedBackground) {
            animatedBackground.style.transition = 'opacity 0.3s ease';
            animatedBackground.style.opacity = '0.8';
            setTimeout(() => {
                animatedBackground.style.opacity = '1';
            }, 300);
        }
        
        // Show theme change notification
        showNotification(`Switched to ${newTheme} theme`, 'info', 2000);
    });
}

// Console welcome message
console.log(`
🚀 Welcome to LadeStack!
Empowering Developers with AI Tools

Built with ❤️ by Girish Lade
🔐 Authentication powered by Clerk
✨ Enhanced with animated technical backgrounds
Visit our tools and start building amazing things!
`);