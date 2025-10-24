/*
 * BWP401 - City Events Guide Custom JavaScript
 * This file handles all interactivity requirements from the homework.
 */

// Wait for the page to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', function () {

    const langToggleButton = document.getElementById('langToggle');

    /**
     * This is the main function that translates the page.
     * @param {string} lang - The language to switch to ('en' or 'ar').
     */
    function setLanguage(lang) {
        // 1. Set attributes on the <html> tag
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

        // 2. Update the toggle button text
        if (langToggleButton) {
            langToggleButton.textContent = (lang === 'ar') ? 'English' : 'العربية';
        }

        // 3. Translate all elements with [data-en] or [data-ar]
        const elements = document.querySelectorAll('[data-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                el.textContent = text;
            }
        });

        // 4. Translate all placeholders
        const placeholders = document.querySelectorAll('[data-en-placeholder]');
        placeholders.forEach(el => {
            const text = el.getAttribute(`data-${lang}-placeholder`);
            if (text) {
                el.placeholder = text;
            }
        });

        // 5. Save the user's preference in localStorage 
        localStorage.setItem('language', lang);
    }

    /**
     * Event listener for the language toggle button.
     */
    if (langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'ar';
            const newLang = (currentLang === 'ar') ? 'en' : 'ar';
            setLanguage(newLang);
        });
    }

    /**
     * This function validates the contact form.
     * Fulfills homework requirement 
     */
    function initializeContactFormValidation() {
        const contactForm = document.getElementById('contactForm');
        
        if (!contactForm) {
            return; // Exit if we are not on the contact page
        }

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Stop the form from submitting
            
            let isValid = true;

            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');
            const privacy = document.getElementById('privacy');
            
            // --- Validation Logic ---

            // Check name
            if (name.value.trim() === '') {
                isValid = false;
                console.log('Name is required');
            }

            // Check email  
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.value)) {
                isValid = false;
                console.log('Email is invalid');
            }
            
            // Check subject
            if (subject.value === '') {
                isValid = false;
                console.log('Subject is required');
            }

            // Check message
            if (message.value.trim() === '') {
                isValid = false;
                console.log('Message is required');
            }

            // Check privacy policy checkbox
            if (!privacy.checked) {
                isValid = false;
                console.log('Privacy policy must be accepted');
            }

            // --- Show Success/Error Alert ---
            // Fulfills homework requirement 
            
            // Remove any old alert
            const oldAlert = document.getElementById('formAlert');
            if (oldAlert) {
                oldAlert.remove();
            }

            // Create new alert
            const alertDiv = document.createElement('div');
            alertDiv.id = 'formAlert';
            
            if (isValid) {
                // Success
                alertDiv.className = 'alert alert-success mt-4';
                alertDiv.role = 'alert';
                alertDiv.textContent = (localStorage.getItem('language') === 'en') ? 'Message sent successfully! We will get back to you soon.' : 'تم إرسال الرسالة بنجاح! سنتواصل معك قريباً.';
                contactForm.parentNode.insertBefore(alertDiv, contactForm);
                contactForm.reset();
            } else {
                // Error
                alertDiv.className = 'alert alert-danger mt-4';
                alertDiv.role = 'alert';
                alertDiv.textContent = (localStorage.getItem('language') === 'en') ? 'Please fill out all required fields correctly.' : 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.';
                contactForm.parentNode.insertBefore(alertDiv, contactForm);
            }
        });
    }


    /**
     * This function initializes the event filtering logic.
     * Fulfills homework requirement 
     */
    function initializeEventFiltering() {
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const dateFilter = document.getElementById('dateFilter');
        const locationFilter = document.getElementById('locationFilter');
        const eventsContainer = document.getElementById('eventsContainer');
        const noResults = document.getElementById('noResults');

        if (!eventsContainer) {
            return; // Exit if we are not on the events page
        }

        const allEvents = eventsContainer.querySelectorAll('.event-card');

        function filterEvents() {
            const searchTerm = searchInput.value.toLowerCase();
            const categoryValue = categoryFilter.value;
            const dateValue = dateFilter.value;
            const locationValue = locationFilter.value;
            
            let resultsFound = false;

            allEvents.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const category = card.getAttribute('data-category');
                const date = card.getAttribute('data-date');
                const location = card.getAttribute('data-location');

                // Check for matches
                const matchesSearch = title.includes(searchTerm);
                const matchesCategory = (categoryValue === '') || (category === categoryValue);
                const matchesDate = (dateValue === '') || (date === dateValue);
                const matchesLocation = (locationValue === '') || (location.includes(locationValue));

                // Show or hide the card
                if (matchesSearch && matchesCategory && matchesDate && matchesLocation) {
                    card.parentElement.style.display = 'block'; 
                    resultsFound = true;
                } else {
                    card.parentElement.style.display = 'none'; 
                }
            });

            // Show or hide the "No Results" message
            noResults.style.display = resultsFound ? 'none' : 'block';
        }

        // Add event listeners to all filter inputs
        searchInput.addEventListener('keyup', filterEvents);
        categoryFilter.addEventListener('change', filterEvents);
        dateFilter.addEventListener('change', filterEvents);
        locationFilter.addEventListener('change', filterEvents);
    }
    
    
    // --- Helper Functions for Event Pages (Bonus) ---

    // Fulfills 'Add to Calendar' button  
    window.addToCalendar = function(title, date, location) {
        alert(`(Demo) Adding "${title}" on ${date} at ${location} to your calendar.`);
        console.log("Add to Calendar clicked:", title, date, location);
    }

    // Fulfills 'Share' button  
    window.shareEvent = function(title, url) {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Check out this event: ${title}`,
                url: url,
            }).catch(console.error);
        } else {
            alert(`(Demo) Share this event: ${title}\n${url}`);
        }
    }
    
    // Fulfills 'Booking Modal' bonus  
    window.openBookingModal = function(eventId) {
        var bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
        bookingModal.show();
        console.log("Booking modal opened for event ID:", eventId);
    }


    // --- INITIALIZE EVERYTHING ON PAGE LOAD ---

    // 1. Get the user's saved language, or default to Arabic ('ar')
    const savedLang = localStorage.getItem('language') || 'ar';
    
    // 2. Translate the page to the saved language immediately
    setLanguage(savedLang);

    // 3. Set up the contact form validation 
    initializeContactFormValidation();

    // 4. Set up the event filtering
    initializeEventFiltering();

});