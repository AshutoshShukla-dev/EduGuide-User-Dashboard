// Profile state with purchased courses and selected course
const profileState = {
    name: 'Ashutosh Shukla',
    email: 'ashu738807@gmail.com',
    profilePic: 'https://via.placeholder.com/100',
    purchasedCourses: [
        { id: 'web-dev', name: 'Web Development', progress: 75, purchaseDate: '2025-01-15' },
        { id: 'data-science', name: 'Data Science', progress: 40, purchaseDate: '2025-02-01' },
        { id: 'ui-ux', name: 'UI/UX Design', progress: 60, purchaseDate: '2025-03-10' }
    ],
    selectedCourseId: null
};

// DOM elements
const profileForm = document.getElementById('profile-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const profilePicInput = document.getElementById('profile-pic');
const errorMessage = document.getElementById('form-error');
const successMessage = document.getElementById('success-message');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarMenu = document.getElementById('sidebar-menu');
const purchasedCourseList = document.getElementById('purchased-course-list');
const selectedCourseName = document.getElementById('selected-course-name');
const selectedCourseProgress = document.getElementById('selected-course-progress');
const profileImage = document.getElementById('profile-image');

// Function to update UI with profile state
function updateProfileUI() {
    document.getElementById('profile-name').textContent = profileState.name;
    document.getElementById('welcome-name').textContent = profileState.name.split(' ')[0];
    profileImage.style.opacity = '0';
    setTimeout(() => {
        profileImage.src = profileState.profilePic;
        profileImage.style.opacity = '1';
    }, 300);
    nameInput.value = profileState.name;
    emailInput.value = profileState.email;
    updatePurchasedCourses();
    updateSelectedCourse();
}

// Function to update purchased courses list
function updatePurchasedCourses() {
    purchasedCourseList.innerHTML = '';
    profileState.purchasedCourses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = 'course-item';
        courseItem.innerHTML = `
                    <input type="radio" name="selected-course" id="${course.id}" value="${course.id}"
                           ${profileState.selectedCourseId === course.id ? 'checked' : ''}>
                    <label for="${course.id}"><i class="fas fa-book fa-icon" aria-hidden="true"></i> ${course.name} (Purchased: ${course.purchaseDate})</label>
                `;
        const radio = courseItem.querySelector('input');
        radio.addEventListener('change', () => {
            profileState.selectedCourseId = course.id;
            updateSelectedCourse();
            addActivityLog(`Selected ${course.name} as focused course`);
        });
        purchasedCourseList.appendChild(courseItem);
    });
}

// Function to update selected course in overview
function updateSelectedCourse() {
    const selectedCourse = profileState.purchasedCourses.find(
        course => course.id === profileState.selectedCourseId
    );
    if (selectedCourse) {
        selectedCourseName.textContent = selectedCourse.name;
        selectedCourseProgress.textContent = `${selectedCourse.progress}% Complete`;
    } else {
        selectedCourseName.textContent = 'No Course Selected';
        selectedCourseProgress.textContent = 'Select a course from your profile';
    }
}

// Initialize UI
updateProfileUI();

// Section navigation
document.querySelectorAll('.section-link, .nav-section-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.toggle('active', section.id === sectionId);
        });
        document.querySelectorAll('.section-link').forEach(l => {
            l.classList.toggle('active', l === link);
            l.setAttribute('aria-current', l === link ? 'page' : 'false');
        });
        if (sectionId === 'profile') updateProfileUI();
        document.getElementById('navLinks').classList.remove('active');
        document.getElementById('hamburger').classList.remove('active');
        document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
    });
});

// Profile form submission
profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newName = nameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const file = profilePicInput.files[0];

    if (!newName || !newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
        errorMessage.classList.add('active');
        setTimeout(() => errorMessage.classList.remove('active'), 3000);
        return;
    }

    profileState.name = newName;
    profileState.email = newEmail;

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            profileState.profilePic = reader.result;
            updateProfileUI();
            showSuccessMessage();
            addActivityLog('Updated profile information');
        };
        reader.onerror = () => {
            console.error('Error reading file');
            errorMessage.textContent = 'Failed to upload profile picture.';
            errorMessage.classList.add('active');
            setTimeout(() => errorMessage.classList.remove('active'), 3000);
        };
        reader.readAsDataURL(file);
    } else {
        updateProfileUI();
        showSuccessMessage();
        addActivityLog('Updated profile information');
    }
});

// Function to show success message
function showSuccessMessage() {
    successMessage.classList.add('active');
    setTimeout(() => successMessage.classList.remove('active'), 3000);
}

// Function to add activity log
function addActivityLog(message) {
    const activityList = document.getElementById('activity-list');
    const newActivity = document.createElement('div');
    newActivity.className = 'activity-card';
    newActivity.style.opacity = '0';
    newActivity.innerHTML = `
                <span class="activity-icon" aria-hidden="true">✏️</span>
                <div class="activity-content">
                    <p>${message}</p>
                    <span>Just now</span>
                </div>
            `;
    activityList.prepend(newActivity);
    setTimeout(() => newActivity.style.opacity = '1', 100);
}

// Toggle navigation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const topnav = document.getElementById('topnav');

hamburger.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
});

// Close menu when clicking a nav link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Scroll effect for topnav
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        topnav.classList.add('scrolled');
    } else {
        topnav.classList.remove('scrolled');
    }
});

// Sidebar toggle for tablets
sidebarToggle.addEventListener('click', () => {
    sidebarMenu.classList.toggle('active');
});