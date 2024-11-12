/**
 * Global State Management
 */
let currentUser = null;

/**
 * Cookie Management
 */
function setCookie(c_name, value, expiredays) {
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = `${c_name}=${escape(value)}; expires=${exdate.toGMTString()}; path=/`;
}

function getCookie(c_name) {
    const nameEQ = c_name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
}

function deleteCookie(c_name) {
    document.cookie = `${c_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

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
        const lastVisit = getCookie("lastVisit");

        if (!fullNameSpan || !compactNameSpan) {
            throw new Error('Name span elements not found');
        }

        const greeting = `Welcome back, ${name}!${lastVisit ? ` Last visit: ${lastVisit}` : ''}`;
        fullNameSpan.textContent = greeting;
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
                        <button class="user-dropdown-item" onclick="clearData()">Clear My Data</button>
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
        setCookie("username", name, 365);
        setCookie("lastVisit", new Date().toLocaleString(), 365); // store the visit date
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
 * Data Reset Function
 */
function clearData() {
    deleteCookie("username");
    deleteCookie("lastVisit");
    currentUser = null;
    updateUserProfile();
    updateWelcomeMessages('Guest');
    alert("Your data has been cleared.");
}

/**
 * App Initialization
 */
async function initializeApp() {
    try {
        // Load existing user data from cookies if available
        const name = getCookie("username");
        if (name) {
            currentUser = name;
            updateUserProfile();
            updateWelcomeMessages(name);
        } else {
            await handleSignIn(); // Prompt if no existing user
        }

        // Initialize tab and link states
        addLearnMoreListeners();
        initializeLinks();

        const currentTab = window.location.hash.slice(1) || 'home';
        switchTab(currentTab);
    } catch (error) {
        console.error('Error initializing app:', error);
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
 * Visited Links Management
 */
const visitedLinks = new Set();

function markAsVisited(linkId) {
    try {
        const link = document.querySelector(`.nav-link[onclick="switchTab('${linkId}')"]`);
        if (link) {
            visitedLinks.add(linkId);
            link.style.color = 'green';
        }
    } catch (error) {
        console.error('Error marking link as visited:', error);
    }
}

// Update switchTab function to include visited link tracking
function switchTab(tabId) {
    try {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            link.style.color = 'blue';
        });

        const selectedTab = document.getElementById(tabId);
        if (!selectedTab) throw new Error(`Tab ${tabId} not found`);
        selectedTab.classList.add('active');

        const navLink = document.querySelector(`.nav-link[onclick="switchTab('${tabId}')"]`);
        if (navLink) {
            navLink.classList.add('active');
            markAsVisited(tabId);
        }

        updateWelcomeMessageVisibility(tabId);

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
        document.querySelectorAll('.nav-link').forEach(link => {
            link.style.color = 'blue';
        });

        markAsVisited('home');
    } catch (error) {
        console.error('Error initializing links:', error);
    }
}

// Initialize the application
initializeApp();
