/**
 * Global State Management
 */
let currentUser = null;

/**
 * Tab Management
 */
function switchTab(tabId) {
    try {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Show selected tab content
        const selectedTab = document.getElementById(tabId);
        if (!selectedTab) throw new Error(`Tab ${tabId} not found`);
        selectedTab.classList.add('active');
        
        // Find and activate the corresponding nav link
        const navLink = document.querySelector(`.nav-link[onclick="switchTab('${tabId}')"]`);
        if (navLink) navLink.classList.add('active');

        // Update welcome message visibility
        updateWelcomeMessageVisibility(tabId);
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

/**
 * Welcome Message Management
 */
function updateWelcomeMessageVisibility(tabId) {
    try {
        const fullWelcome = document.querySelector('.welcome-message.full');
        const compactWelcome = document.querySelector('.welcome-message.compact');

        if (!fullWelcome || !compactWelcome) {
            throw new Error('Welcome message elements not found');
        }

        if (tabId === 'home') {
            fullWelcome.style.display = 'block';
            compactWelcome.style.display = 'none';
        } else {
            fullWelcome.style.display = 'none';
            compactWelcome.style.display = 'block';
        }
    } catch (error) {
        console.error('Error updating welcome message:', error);
    }
}

function updateWelcomeMessages(name) {
    try {
        const fullNameSpan = document.getElementById('fullNameSpan');
        const compactNameSpan = document.getElementById('compactNameSpan');

        if (!fullNameSpan || !compactNameSpan) {
            throw new Error('Name span elements not found');
        }

        fullNameSpan.textContent = name;
        compactNameSpan.textContent = name;
    } catch (error) {
        console.error('Error updating welcome messages:', error);
    }
}

/**
 * User Profile Management
 */
function updateUserProfile() {
    try {
        const userProfileSection = document.getElementById('userProfileSection');
        if (!userProfileSection) throw new Error('User profile section not found');

        if (currentUser) {
            userProfileSection.innerHTML = `
                <div class="user-menu">
                    <div style="display: flex; align-items: center; gap: 1rem; cursor: pointer" onclick="toggleUserMenu()">
                        <span class="user-name">${currentUser}</span>
                        <div class="user-avatar">${currentUser.charAt(0).toUpperCase()}</div>
                    </div>
                    <div class="user-dropdown" id="userDropdown">
                        <div class="user-dropdown-item">
                            <div style="font-weight: bold">${currentUser}</div>
                            <div style="font-size: 0.8rem; opacity: 0.7">Signed in</div>
                        </div>
                        <hr style="border-color: rgba(255,255,255,0.1); margin: 0.5rem 0">
                        <button class="user-dropdown-item" onclick="handleSignOut()">Sign Out</button>
                    </div>
                </div>
            `;
        } else {
            userProfileSection.innerHTML = `
                <button class="sign-in-button" onclick="handleSignIn()">Sign In</button>
            `;
        }
    } catch (error) {
        console.error('Error updating user profile:', error);
    }
}

/**
 * Dialog Management
 */
function createDialog() {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        
        const title = document.createElement('h2');
        title.textContent = 'Welcome!';
        title.style.color = 'var(--primary)';
        title.style.marginBottom = '1rem';
        
        const text = document.createElement('p');
        text.textContent = 'Please enter your name to proceed:';
        text.style.marginLeft = '0';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Your name';
        
        const button = document.createElement('button');
        button.className = 'button';
        button.textContent = 'Continue';
        
        dialog.appendChild(title);
        dialog.appendChild(text);
        dialog.appendChild(input);
        dialog.appendChild(button);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        input.focus();

        const handleSubmit = () => {
            const name = input.value.trim();
            if (name) {
                overlay.remove();
                resolve(name);
            } else {
                input.style.outline = '2px solid #ef4444';
                input.placeholder = 'Name is required';
            }
        };

        button.onclick = handleSubmit;
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleSubmit();
        };
    });
}

/**
 * User Authentication Handlers
 */
async function handleSignIn() {
    try {
        const name = await createDialog();
        currentUser = name;
        updateUserProfile();
        updateWelcomeMessages(name);
        
        // Set initial welcome message visibility
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab) {
            updateWelcomeMessageVisibility(activeTab.id);
        }
    } catch (error) {
        console.error('Error during sign in:', error);
    }
}

function handleSignOut() {
    try {
        currentUser = null;
        updateUserProfile();
        updateWelcomeMessages('Guest');
    } catch (error) {
        console.error('Error during sign out:', error);
    }
}

function toggleUserMenu() {
    try {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown) throw new Error('Dropdown menu not found');

        dropdown.classList.toggle('active');

        // Close dropdown when clicking outside
        const handleClickOutside = (e) => {
            if (!e.target.closest('.user-menu')) {
                dropdown.classList.remove('active');
                document.removeEventListener('click', handleClickOutside);
            }
        };

        document.addEventListener('click', handleClickOutside);
    } catch (error) {
        console.error('Error toggling user menu:', error);
    }
}

/**
 * Learn More Button Management
 */
function addLearnMoreListeners() {
    try {
        // Service card buttons
        document.querySelectorAll('.service-card .button').forEach(button => {
            button.onclick = () => {
                switchTab('about');
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            };
        });

        // Home page button
        const homeButton = document.getElementById('homeLearnMore');
        if (homeButton) {
            homeButton.onclick = () => {
                switchTab('about');
                document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
            };
        }
    } catch (error) {
        console.error('Error adding learn more listeners:', error);
    }
}

/**
 * Contact Form Management
 */
function showSuccessDialog() {
    try {
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'dialog-overlay';
        
        const dialog = document.createElement('div');
        dialog.className = 'success-dialog';
        
        dialog.innerHTML = `
            <div class="success-icon">✓</div>
            <h2 style="color: var(--primary); margin-bottom: 0.5rem;">Message Sent!</h2>
            <p style="margin-bottom: 1.5rem; opacity: 0.9; font-size: 0.9rem;">
                Thank you for reaching out. Our team will be in contact with you shortly.
            </p>
            <button class="button" onclick="this.closest('.dialog-overlay').remove()">
                Close
            </button>
        `;
        
        dialogOverlay.appendChild(dialog);
        document.body.appendChild(dialogOverlay);
    } catch (error) {
        console.error('Error showing success dialog:', error);
    }
}

function handleSubmit(event) {
    try {
        event.preventDefault();
        showSuccessDialog();
        event.target.reset();
    } catch (error) {
        console.error('Error handling form submission:', error);
    }
}

/**
 * Visited Links Management
 */
const visitedLinks = new Set(); // Store visited link states

// Function to mark a link as visited
function markAsVisited(linkId) {
    try {
        const link = document.querySelector(`.nav-link[onclick="switchTab('${linkId}')"]`);
        if (link) {
            visitedLinks.add(linkId);
            link.style.color = 'green'; // Change to green when visited
        }
    } catch (error) {
        console.error('Error marking link as visited:', error);
    }
}

// Update switchTab function to include visited link tracking
function switchTab(tabId) {
    try {
        // Existing tab switching logic
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            // Reset all links to blue first
            link.style.color = 'blue';
        });
        
        const selectedTab = document.getElementById(tabId);
        if (!selectedTab) throw new Error(`Tab ${tabId} not found`);
        selectedTab.classList.add('active');
        
        // Mark the clicked link as visited and active
        const navLink = document.querySelector(`.nav-link[onclick="switchTab('${tabId}')"]`);
        if (navLink) {
            navLink.classList.add('active');
            markAsVisited(tabId);
        }

        // Update welcome message visibility
        updateWelcomeMessageVisibility(tabId);

        // Show previously visited links in green
        visitedLinks.forEach(visitedId => {
            const visitedLink = document.querySelector(`.nav-link[onclick="switchTab('${visitedId}')"]`);
            if (visitedLink) {
                visitedLink.style.color = 'green';
            }
        });
    } catch (error) {
        console.error('Error switching tabs:', error);
    }
}

// Function to initialize link states
function initializeLinks() {
    try {
        // Set all links to blue initially
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.color = 'blue';
        });

        // Mark home as visited initially since it's the default tab
        markAsVisited('home');
    } catch (error) {
        console.error('Error initializing links:', error);
    }
}

// Update the initialization
function initializeApp() {
    try {
        // Add event listeners
        window.addEventListener('load', async () => {
            await handleSignIn();
            addLearnMoreListeners();
            initializeLinks(); // Initialize link states
        });

        // Handle initial tab state
        const currentTab = window.location.hash.slice(1) || 'home';
        switchTab(currentTab);

    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// Initialize the application
initializeApp();