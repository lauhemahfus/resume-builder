let experienceCount = 0;
let educationCount = 0;
let publicationCount = 0;
let achievementCount = 0;
let projectCount = 0;
let autoSaveTimeout;

function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(saveResumeData, 300000); // Save after 5 minute of inactivity
}

function saveResumeData() {
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        summary: document.getElementById('summary').value,
        photo_url: document.getElementById('photoPreview').src,
        social_links: getSocialLinksData(),
        experiences: getExperiencesData(),
        education: getEducationData(),
        projects: getProjectsData(),
        publications: getPublicationsData(),
        achievements: getAchievementsData(),
        skills: document.getElementById('skills').value
    };

    fetch('save_resume.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Resume data saved successfully');
        }
    })
    .catch(error => console.error('Error saving resume data:', error));
}


function loadSavedData() {
    fetch('get_resume_data.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); 
        })
        .then(text => {
            try {
                return JSON.parse(text); 
            } catch (e) {
                console.error('Server response:', text); 
                throw new Error('Invalid JSON response from server');
            }
        })
        .then(response => {
            if (response.success) {
                const data = response.data;
                
                // Reset all counters
                experienceCount = 0;
                educationCount = 0;
                projectCount = 0;
                publicationCount = 0;
                achievementCount = 0;

                // Clear existing fields
                document.getElementById('socialLinksFields').innerHTML = '';
                document.getElementById('experienceFields').innerHTML = '';
                document.getElementById('educationFields').innerHTML = '';
                document.getElementById('projectFields').innerHTML = '';
                document.getElementById('publicationFields').innerHTML = '';
                document.getElementById('achievementFields').innerHTML = '';

                // Fill Personal Info
                if (data.personal_info) {
                    document.getElementById('name').value = data.personal_info.full_name || '';
                    document.getElementById('email').value = data.personal_info.email || '';
                    document.getElementById('phone').value = data.personal_info.phone || '';
                    document.getElementById('summary').value = data.personal_info.summary || '';
                    if (data.personal_info.photo_url && data.personal_info.photo_url !== '#') {
                        document.getElementById('photoPreview').src = data.personal_info.photo_url;
                        document.getElementById('photoPreview').style.display = 'block';
                    }
                }

                // Clear existing fields
                console.log('Clearing existing fields');
                document.getElementById('socialLinksFields').innerHTML = '';
                document.getElementById('experienceFields').innerHTML = '';
                document.getElementById('educationFields').innerHTML = '';
                document.getElementById('projectFields').innerHTML = '';
                document.getElementById('publicationFields').innerHTML = '';
                document.getElementById('achievementFields').innerHTML = '';

                // Fill Social Links
                if (data.social_links && data.social_links.length > 0) {
                    console.log('Loading social links:', data.social_links);
                    data.social_links.forEach(link => {
                        addSocialLink(link);
                    });
                }

                // Fill Experiences
                if (data.experiences && data.experiences.length > 0) {
                    console.log('Loading experiences:', data.experiences);
                    data.experiences.forEach(exp => {
                        addExperience(exp);
                    });
                }

                // Fill Education
                if (data.education && data.education.length > 0) {
                    console.log('Loading education:', data.education);
                    data.education.forEach(edu => {
                        addEducation(edu);
                    });
                }

                // Fill Projects
                if (data.projects && data.projects.length > 0) {
                    console.log('Loading projects:', data.projects);
                    data.projects.forEach(proj => {
                        addProject(proj);
                    });
                }

                // Fill Publications
                if (data.publications && data.publications.length > 0) {
                    console.log('Loading publications:', data.publications);
                    data.publications.forEach(pub => {
                        addPublication(pub);
                    });
                }

                // Fill Achievements
                if (data.achievements && data.achievements.length > 0) {
                    console.log('Loading achievements:', data.achievements);
                    data.achievements.forEach(achieve => {
                        addAchievement(achieve);
                    });
                }

                // Fill Skills
                if (data.skills && data.skills.skills_list) {
                    console.log('Loading skills:', data.skills);
                    document.getElementById('skills').value = data.skills.skills_list;
                }

                // Update checkboxes
                console.log('Updating checkboxes');
                document.getElementById('photoToggle').checked = !!data.personal_info?.photo_url;
                document.getElementById('socialLinksToggle').checked = data.social_links?.length > 0;
                document.getElementById('experienceToggle').checked = data.experiences?.length > 0;
                document.getElementById('educationToggle').checked = data.education?.length > 0;
                document.getElementById('projectsToggle').checked = data.projects?.length > 0;
                document.getElementById('publicationsToggle').checked = data.publications?.length > 0;
                document.getElementById('achievementsToggle').checked = data.achievements?.length > 0;
                document.getElementById('skillsToggle').checked = !!data.skills?.skills_list;

                // Update visibility
                const toggles = document.querySelectorAll('input[type="checkbox"][id$="Toggle"]');
                toggles.forEach(toggle => {
                    const sectionContent = toggle.closest('.input-field')?.querySelector('.section-content');
                    if (sectionContent) {
                        sectionContent.style.display = toggle.checked ? 'block' : 'none';
                    }
                });

                // Update the resume preview
                console.log('Updating resume preview');

                updateResume();
            } else {
                console.error('Server returned error:', response.error);
                showErrorMessage('Failed to load data: ' + response.error);
            }
        })
        .catch(error => {
            console.error('Error loading resume data:', error);
            showErrorMessage('Failed to load resume data. Please refresh the page.');
        });
}

function showErrorMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-div error';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 5000);
}

 // Initialize when document is ready
 document.addEventListener('DOMContentLoaded', function() {
     console.log('Document loaded, initializing...');
     loadSavedData();
 });

// Helper function to safely escape HTML content
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
function saveAllData() {
    saveResumeData();
    // // Show loading indicator
    // showLoadingMessage('Saving resume data...');

    // const data = {
    //     personal_info: {
    //         full_name: document.getElementById('name').value,
    //         email: document.getElementById('email').value,
    //         phone: document.getElementById('phone').value,
    //         summary: document.getElementById('summary').value,
    //         photo_url: document.getElementById('photoPreview').src
    //     },
    //     social_links: getSocialLinksData(),
    //     experiences: getExperiencesData(),
    //     education: getEducationData(),
    //     projects: getProjectsData(),
    //     publications: getPublicationsData(),
    //     achievements: getAchievementsData(),
    //     skills: {
    //         skills_list: document.getElementById('skills').value
    //     }
    // };

    // fetch('save_resume.php', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(result => {
    //     if (!result.success) {
    //         showErrorMessage('Failed to save resume: ' + (result.error || 'Unknown error'));
    //     }
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
    // showSuccessMessage('Resume saved successfully!');
}

// Helper functions to get section data
function getSocialLinksData() {
    const socialLinks = [];
    document.querySelectorAll('.social-link-item').forEach(item => {
        const platform = item.querySelector('.social-platform').value;
        const username = item.querySelector('.social-username').value;
        const url = item.querySelector('.social-url').value;
        
        if (username && url) {
            socialLinks.push({
                platform: platform,
                username: username,
                url: url
            });
        }
    });
    return socialLinks;
}

function getExperiencesData() {
    const experiences = [];
    for (let i = 0; i < experienceCount; i++) {
        const company = document.getElementById(`company${i}`);
        const position = document.getElementById(`position${i}`);
        const duration = document.getElementById(`duration${i}`);
        const description = document.getElementById(`expDescription${i}`);
        
        if (company && position && company.value && position.value) {
            experiences.push({
                company: company.value,
                position: position.value,
                duration: duration ? duration.value : '',
                description: description ? description.value : ''
            });
        }
    }
    return experiences;
}

function getEducationData() {
    const education = [];
    for (let i = 0; i < educationCount; i++) {
        const institution = document.getElementById(`institution${i}`);
        const degree = document.getElementById(`degree${i}`);
        const fieldOfStudy = document.getElementById(`fieldOfStudy${i}`);
        const cgpa = document.getElementById(`cgpa${i}`);
        const year = document.getElementById(`year${i}`);
        
        if (institution && degree && institution.value && degree.value) {
            education.push({
                institution: institution.value,
                degree: degree.value,
                field_of_study: fieldOfStudy ? fieldOfStudy.value : '',
                cgpa: cgpa ? cgpa.value : '',
                year: year ? year.value : ''
            });
        }
    }
    return education;
}

function getProjectsData() {
    const projects = [];
    for (let i = 0; i < projectCount; i++) {
        const title = document.getElementById(`projectTitle${i}`);
        const desc = document.getElementById(`projectDesc${i}`);
        const tech = document.getElementById(`projectTech${i}`);
        const link = document.getElementById(`projectLink${i}`);
        const duration = document.getElementById(`projectDuration${i}`);
        
        if (title && desc && title.value) {
            projects.push({
                title: title.value,
                description: desc ? desc.value : '',
                technologies: tech ? tech.value : '',
                project_url: link ? link.value : '',
                duration: duration ? duration.value : ''
            });
        }
    }
    return projects;
}

function getPublicationsData() {
    const publications = [];
    for (let i = 0; i < publicationCount; i++) {
        const title = document.getElementById(`pubTitle${i}`);
        const authors = document.getElementById(`pubAuthors${i}`);
        const venue = document.getElementById(`pubVenue${i}`);
        const year = document.getElementById(`pubYear${i}`);
        
        if (title && authors && title.value) {
            publications.push({
                title: title.value,
                authors: authors.value,
                venue: venue ? venue.value : '',
                year: year ? year.value : ''
            });
        }
    }
    return publications;
}

function getAchievementsData() {
    const achievements = [];
    for (let i = 0; i < achievementCount; i++) {
        const title = document.getElementById(`achieveTitle${i}`);
        const desc = document.getElementById(`achieveDesc${i}`);
        const year = document.getElementById(`achieveYear${i}`);
        
        if (title && desc && title.value) {
            achievements.push({
                title: title.value,
                description: desc.value,
                year: year ? year.value : ''
            });
        }
    }
    return achievements;
}

// Message display functions
function showLoadingMessage(message) {
    let messageDiv = document.getElementById('messageDiv');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'messageDiv';
        document.body.appendChild(messageDiv);
    }
    messageDiv.className = 'message-div loading';
    messageDiv.textContent = message;
}

function showSuccessMessage(message) {
    let messageDiv = document.getElementById('messageDiv');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'messageDiv';
        document.body.appendChild(messageDiv);
    }
    messageDiv.className = 'message-div success';
    messageDiv.textContent = message;
    setTimeout(() => messageDiv.remove(), 3000);
}

function showErrorMessage(message) {
    let messageDiv = document.getElementById('messageDiv');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'messageDiv';
        document.body.appendChild(messageDiv);
    }
    messageDiv.className = 'message-div error';
    messageDiv.textContent = message;
    setTimeout(() => messageDiv.remove(), 3000);
}


// Initialize event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for all toggle checkboxes
    loadSavedData();
    const toggles = document.querySelectorAll('input[type="checkbox"][id$="Toggle"]');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            const sectionContent = this.closest('.input-field').querySelector('.section-content');
            if (sectionContent) {
                if (this.checked) {
                    sectionContent.style.display = 'block';
                } else {
                    sectionContent.style.display = 'none';
                }
            }
            updateResume();
        });
    });

    // Initialize sections visibility
    toggles.forEach(toggle => {
        const sectionContent = toggle.closest('.input-field').querySelector('.section-content');
        if (sectionContent) {
            sectionContent.style.display = toggle.checked ? 'block' : 'none';
        }
    });
    updateResume();
});

function previewImage(event) {
    const preview = document.getElementById('photoPreview');
    const previewInResume = document.querySelector('.profile-image'); // Add this line to get the preview image in resume
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = function() {
        // Update both preview images
        preview.src = reader.result;
        preview.style.display = 'block';
        if(previewInResume) {
            previewInResume.src = reader.result;
        }
        updateResume(); // Add this to update the resume preview
    }
    reader.readAsDataURL(file);

    // Upload the file
    fetch('upload_image.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update both preview images with the uploaded file path
            preview.src = data.file_path;
            if(previewInResume) {
                previewInResume.src = data.file_path;
            }
            updateResume(); // Update resume preview again after successful upload
            console.log('Image uploaded successfully');
        } else {
            console.error('Upload failed:', data.error);
        }
    })
    .catch(error => console.error('Error:', error));
}

function addExperience(data = null) {
    const container = document.getElementById('experienceFields');
    const experienceDiv = document.createElement('div');
    experienceDiv.className = 'input-field';
    experienceDiv.innerHTML = `
        <h4>Experience ${experienceCount + 1}</h4>
        <label>Company:</label>
        <input type="text" id="company${experienceCount}" 
            value="${data ? escapeHtml(data.company) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Position:</label>
        <input type="text" id="position${experienceCount}" 
            value="${data ? escapeHtml(data.position) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Duration:</label>
        <input type="text" id="duration${experienceCount}" 
            value="${data ? escapeHtml(data.duration) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Description:</label>
        <textarea id="expDescription${experienceCount}" rows="3" 
            oninput="updateResume(); autoSave()">${data ? escapeHtml(data.description) : ''}</textarea>
        <button onclick="removeExperience(this)" class="remove-button"><i class="fas fa-trash"></i>Remove</button>
    `;
    container.appendChild(experienceDiv);
    experienceCount++;
    updateResume();
    autoSave();
}

function addEducation(data = null) {
    const container = document.getElementById('educationFields');
    const educationDiv = document.createElement('div');
    educationDiv.className = 'input-field';
    educationDiv.innerHTML = `
        <h4>Education ${educationCount + 1}</h4>
        <label>Institution:</label>
        <input type="text" id="institution${educationCount}" 
            value="${data ? escapeHtml(data.institution) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Degree:</label>
        <input type="text" id="degree${educationCount}" 
            value="${data ? escapeHtml(data.degree) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Field of Study:</label>
        <input type="text" id="fieldOfStudy${educationCount}" 
            value="${data ? escapeHtml(data.field_of_study) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>CGPA/Percentage:</label>
        <input type="text" id="cgpa${educationCount}" 
            value="${data ? escapeHtml(data.cgpa) : ''}" 
            oninput="updateResume(); autoSave()" 
            placeholder="e.g., 3.8/4.0 or 85%">
        <label>Year:</label>
        <input type="text" id="year${educationCount}" 
            value="${data ? escapeHtml(data.year) : ''}" 
            oninput="updateResume(); autoSave()">
        <button onclick="removeProject(this)" class="remove-button"><i class="fas fa-trash"></i>Remove</button>
    `;
    container.appendChild(educationDiv);
    educationCount++;
    updateResume();
    autoSave();
}

function addProject(data = null) {
    const container = document.getElementById('projectFields');
    const projectDiv = document.createElement('div');
    projectDiv.className = 'input-field';
    projectDiv.innerHTML = `
        <h4>Project ${projectCount + 1}</h4>
        <label>Project Title:</label>
        <input type="text" id="projectTitle${projectCount}" 
            value="${data ? escapeHtml(data.title) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Description:</label>
        <textarea id="projectDesc${projectCount}" rows="3" 
            oninput="updateResume(); autoSave()">${data ? escapeHtml(data.description) : ''}</textarea>
        <label>Technologies Used:</label>
        <input type="text" id="projectTech${projectCount}" 
            value="${data ? escapeHtml(data.technologies) : ''}" 
            oninput="updateResume(); autoSave()" 
            placeholder="e.g., Python, React, Node.js">
        <label>Project Link (Optional):</label>
        <input type="url" id="projectLink${projectCount}" 
            value="${data ? escapeHtml(data.project_url) : ''}" 
            oninput="updateResume(); autoSave()" 
            placeholder="https://github.com/username/project">
        <label>Duration:</label>
        <input type="text" id="projectDuration${projectCount}" 
            value="${data ? escapeHtml(data.duration) : ''}" 
            oninput="updateResume(); autoSave()" 
            placeholder="e.g., Jan 2023 - Mar 2023">
        <button onclick="removeProject(this)" class="remove-button"><i class="fas fa-trash"></i>Remove</button>
    `;
    container.appendChild(projectDiv);
    projectCount++;
    updateResume();
    autoSave();
}

function addPublication(data = null) {
    const container = document.getElementById('publicationFields');
    const publicationDiv = document.createElement('div');
    publicationDiv.className = 'input-field';
    publicationDiv.innerHTML = `
        <h4>Publication ${publicationCount + 1}</h4>
        <label>Title:</label>
        <input type="text" id="pubTitle${publicationCount}" 
            value="${data ? escapeHtml(data.title) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Authors:</label>
        <input type="text" id="pubAuthors${publicationCount}" 
            value="${data ? escapeHtml(data.authors) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Journal/Conference:</label>
        <input type="text" id="pubVenue${publicationCount}" 
            value="${data ? escapeHtml(data.venue) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Year:</label>
        <input type="text" id="pubYear${publicationCount}" 
            value="${data ? escapeHtml(data.year) : ''}" 
            oninput="updateResume(); autoSave()">
        <button onclick="removePublication(this)" class="remove-button"><i class="fas fa-trash"></i>Remove</button>
    `;
    container.appendChild(publicationDiv);
    publicationCount++;
    updateResume();
    autoSave();
}

function addAchievement(data = null) {
    const container = document.getElementById('achievementFields');
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'input-field';
    achievementDiv.innerHTML = `
        <h4>Achievement ${achievementCount + 1}</h4>
        <label>Title:</label>
        <input type="text" id="achieveTitle${achievementCount}" 
            value="${data ? escapeHtml(data.title) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>Description:</label>
        <textarea id="achieveDesc${achievementCount}" rows="2" 
            oninput="updateResume(); autoSave()">${data ? escapeHtml(data.description) : ''}</textarea>
        <label>Year:</label>
        <input type="text" id="achieveYear${achievementCount}" 
            value="${data ? escapeHtml(data.year) : ''}" 
            oninput="updateResume(); autoSave()">
        <button onclick="removeAchievement(this)" class="remove-button">Remove</button>
    `;
    container.appendChild(achievementDiv);
    achievementCount++;
    updateResume();
    autoSave();
}

function addSocialLink(data = null) {
    const container = document.getElementById('socialLinksFields');
    const socialDiv = document.createElement('div');
    socialDiv.className = 'social-link-item';
    socialDiv.innerHTML = `
        <label>Platform:</label>
        <select class="social-platform" onchange="handlePlatformChange(this); updateResume(); autoSave()">
            <option value="LinkedIn">LinkedIn</option>
            <option value="GitHub">GitHub</option>
            <option value="Twitter">Twitter</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Other">Other</option>
        </select>
        <div class="other-platform" style="display: none;">
            <label>Specify Platform:</label>
            <input type="text" class="other-platform-name" 
                value="${data && data.platform === 'Other' ? escapeHtml(data.other_platform) : ''}" 
                oninput="updateResume(); autoSave()">
        </div>
        <label>Username/Handle:</label>
        <input type="text" class="social-username" 
            value="${data ? escapeHtml(data.username) : ''}" 
            oninput="updateResume(); autoSave()">
        <label>URL:</label>
        <input type="url" class="social-url" 
            value="${data ? escapeHtml(data.url) : ''}" 
            oninput="updateResume(); autoSave()">
        <button onclick="removeSocialLink(this)" class="remove-button">Remove</button>
    `;
    container.appendChild(socialDiv);

    if (data && data.platform) {
        const platformSelect = socialDiv.querySelector('.social-platform');
        platformSelect.value = data.platform;
        handlePlatformChange(platformSelect);
    }

    updateResume();
    autoSave();
}

// Remove functions
function removeExperience(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}

function removeEducation(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}

function removeProject(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}


function removePublication(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}

function removeAchievement(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}

function removeSocialLink(button) {
    button.parentElement.remove();
    updateResume();
    autoSave();
}

function handlePlatformChange(select) {
    const otherPlatformDiv = select.parentElement.querySelector('.other-platform');
    otherPlatformDiv.style.display = select.value === 'Other' ? 'block' : 'none';
}

function updateResume() {
    const template = document.getElementById('templateSelect').value;
    switch(template) {
        case 'modern':
            updateModernTemplate();
            break;
        case 'minimal':
            updateMinimalTemplate();
            break;
        case 'professional':
            updateProfessionalTemplate();
            break;
        case 'creative':
            updateCreativeTemplate();
            break;
        case 'executive':
            updateExecutiveTemplate();
            break;
        default:
            updateClassicTemplate();
    }
}

function updateClassicTemplate() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    // Header section
    html += '<div class="resume-header">';
    if (document.getElementById('photoToggle').checked &&
        document.getElementById('photoPreview').src !== '#' &&
        document.getElementById('photoPreview').style.display !== 'none') {  
        html += `<img src="${document.getElementById('photoPreview').src}" class="profile-image" alt="Profile Photo">`;
    }
    html += '<div class="header-info">';
    html += `<div class="resume-name">${document.getElementById('name').value}</div>`;
    html += `<div>${document.getElementById('email').value}</div>`;
    html += `<div>${document.getElementById('phone').value}</div>`;
    html += '</div></div>';

    // Summary section
    const summary = document.getElementById('summary').value.trim();
    if (summary) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Professional Summary</div>';
        html += `<div>${summary}</div>`;
        html += '</div>';
    }

    // Social Links section
    if (document.getElementById('socialLinksToggle').checked) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Connect</div>';
        html += '<div class="social-links">';
        
        const socialItems = document.querySelectorAll('.social-link-item');
        socialItems.forEach(item => {
            const platform = item.querySelector('.social-platform').value;
            const otherPlatform = item.querySelector('.other-platform-name')?.value;
            const username = item.querySelector('.social-username').value;
            const url = item.querySelector('.social-url').value;
            
            if (username && url) {
                const displayPlatform = platform === 'Other' ? otherPlatform : platform;
                html += `<div class="social-link">`;
                html += `<span class="platform">${displayPlatform}:</span> `;
                html += `<a href="${url}" target="_blank">${username}</a>`;
                html += `</div>`;
            }
        });
        
        html += '</div></div>';
    }

    // Experience section
    if (document.getElementById('experienceToggle').checked) {
        const experienceElements = document.querySelectorAll('#experienceFields .input-field');
        if (experienceElements.length > 0) {
            html += '<div class="resume-section">';
            html += '<div class="section-title">Experience</div>';
            for (let i = 0; i < experienceCount; i++) {
                const company = document.getElementById(`company${i}`);
                const position = document.getElementById(`position${i}`);
                const duration = document.getElementById(`duration${i}`);
                const description = document.getElementById(`expDescription${i}`);
                if (company && position && duration && description) {
                    html += '<div class="experience-item">';
                    html += `<strong>${position.value}</strong> at ${company.value}<br>`;
                    html += `${duration.value}<br>`;
                    html += `${description.value}`;
                    html += '</div>';
                }
            }
            html += '</div>';
        }
    }

    // Education section
    if (document.getElementById('educationToggle').checked) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Education</div>';
        for (let i = 0; i < educationCount; i++) {
            const institution = document.getElementById(`institution${i}`);
            const degree = document.getElementById(`degree${i}`);
            const fieldOfStudy = document.getElementById(`fieldOfStudy${i}`);
            const cgpa = document.getElementById(`cgpa${i}`);
            const year = document.getElementById(`year${i}`);
            
            if (institution && degree && year) {
                html += '<div class="education-item">';
                html += `<strong>${degree.value}</strong>`;
                if (fieldOfStudy && fieldOfStudy.value) {
                    html += ` in ${fieldOfStudy.value}`;
                }
                html += `<br>${institution.value} - ${year.value}`;
                if (cgpa && cgpa.value) {
                    html += `<br>CGPA: ${cgpa.value}`;
                }
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Projects section
    if (document.getElementById('projectsToggle').checked) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Projects</div>';
        for (let i = 0; i < projectCount; i++) {
            const title = document.getElementById(`projectTitle${i}`);
            const desc = document.getElementById(`projectDesc${i}`);
            const tech = document.getElementById(`projectTech${i}`);
            const link = document.getElementById(`projectLink${i}`);
            const duration = document.getElementById(`projectDuration${i}`);
            
            if (title && desc && tech) {
                html += '<div class="project-item">';
                html += `<div class="project-title">${title.value}`;
                if (link && link.value) {
                    html += ` <a href="${link.value}" target="_blank">[Link]</a>`;
                }
                html += `</div>`;
                if (duration && duration.value) {
                    html += `<div class="project-duration">${duration.value}</div>`;
                }
                html += `<div class="project-tech">Technologies: ${tech.value}</div>`;
                html += `<div class="project-description">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Publications section
    if (document.getElementById('publicationsToggle').checked) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Publications</div>';
        for (let i = 0; i < publicationCount; i++) {
            const title = document.getElementById(`pubTitle${i}`);
            const authors = document.getElementById(`pubAuthors${i}`);
            const venue = document.getElementById(`pubVenue${i}`);
            const year = document.getElementById(`pubYear${i}`);
            if (title && authors && venue && year) {
                html += '<div class="publication-item">';
                html += `<div class="publication-title">${title.value}</div>`;
                html += `<div class="publication-authors">${authors.value}</div>`;
                html += `<div>${venue.value} (${year.value})</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Achievements section
    if (document.getElementById('achievementsToggle').checked) {
        html += '<div class="resume-section">';
        html += '<div class="section-title">Achievements</div>';
        for (let i = 0; i < achievementCount; i++) {
            const title = document.getElementById(`achieveTitle${i}`);
            const desc = document.getElementById(`achieveDesc${i}`);
            const year = document.getElementById(`achieveYear${i}`);
            if (title && desc && year) {
                html += '<div class="achievement-item">';
                html += `<strong>${title.value}</strong> (${year.value})<br>`;
                html += `${desc.value}`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Skills section
    if (document.getElementById('skillsToggle').checked) {
        const skills = document.getElementById('skills').value.trim();
        if (skills) {
            html += '<div class="resume-section">';
            html += '<div class="section-title">Skills</div>';
            html += `<div>${skills.split(',').map(skill => skill.trim()).filter(skill => skill).join(', ')}</div>`;
            html += '</div>';
        }
    }

    preview.innerHTML = html;
}

function updateModernTemplate() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    // Header Section
    html += '<div class="modern-header">';
    if (document.getElementById('photoToggle').checked &&
        document.getElementById('photoPreview').src !== '#' &&
        document.getElementById('photoPreview').style.display !== 'none') {
        html += `<img src="${document.getElementById('photoPreview').src}" class="modern-profile" alt="Profile Photo">`;
    }
    html += '<div class="modern-header-content">';
    html += `<h1 class="modern-name">${document.getElementById('name').value}</h1>`;
    html += '<div class="modern-contact">';
    html += `<div>${document.getElementById('email').value}</div>`;
    html += `<div>${document.getElementById('phone').value}</div>`;
    html += '</div>';

    // Social Links
    if (document.getElementById('socialLinksToggle').checked) {
        html += '<div class="modern-social">';
        const socialItems = document.querySelectorAll('.social-link-item');
        socialItems.forEach(item => {
            const platform = item.querySelector('.social-platform').value;
            const username = item.querySelector('.social-username').value;
            const url = item.querySelector('.social-url').value;
            if (username && url) {
                html += `<a href="${url}" target="_blank" class="modern-social-link">${platform}: ${username}</a>`;
            }
        });
        html += '</div>';
    }
    html += '</div></div>'; // Close header

    // Main Content Layout
    html += '<div class="modern-layout">';
    
    // Left Column
    html += '<div class="modern-main">';

    // Professional Summary
    const summary = document.getElementById('summary').value.trim();
    if (summary) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Professional Summary</h2>';
        html += `<div class="modern-summary">${summary}</div>`;
        html += '</div>';
    }

    // Experience Section
    if (document.getElementById('experienceToggle').checked) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Professional Experience</h2>';
        for (let i = 0; i < experienceCount; i++) {
            const company = document.getElementById(`company${i}`);
            const position = document.getElementById(`position${i}`);
            const duration = document.getElementById(`duration${i}`);
            const description = document.getElementById(`expDescription${i}`);
            if (company && position) {
                html += '<div class="modern-experience">';
                html += `<div class="modern-role">${position.value}</div>`;
                html += `<div class="modern-company">${company.value}</div>`;
                html += `<div class="modern-duration">${duration.value}</div>`;
                html += `<div class="modern-description">${description.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Projects Section
    if (document.getElementById('projectsToggle').checked) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Projects</h2>';
        for (let i = 0; i < projectCount; i++) {
            const title = document.getElementById(`projectTitle${i}`);
            const desc = document.getElementById(`projectDesc${i}`);
            const tech = document.getElementById(`projectTech${i}`);
            const link = document.getElementById(`projectLink${i}`);
            const duration = document.getElementById(`projectDuration${i}`);
            
            if (title && desc) {
                html += '<div class="modern-project">';
                html += '<div class="modern-project-header">';
                html += `<div class="modern-project-title">${title.value}</div>`;
                if (duration && duration.value) {
                    html += `<div class="modern-project-duration">${duration.value}</div>`;
                }
                html += '</div>';
                if (tech && tech.value) {
                    html += `<div class="modern-project-tech">Technologies: ${tech.value}</div>`;
                }
                html += `<div class="modern-project-description">${desc.value}</div>`;
                if (link && link.value) {
                    html += `<a href="${link.value}" target="_blank" class="modern-project-link">View Project →</a>`;
                }
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Publications Section
    if (document.getElementById('publicationsToggle').checked) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Publications</h2>';
        for (let i = 0; i < publicationCount; i++) {
            const title = document.getElementById(`pubTitle${i}`);
            const authors = document.getElementById(`pubAuthors${i}`);
            const venue = document.getElementById(`pubVenue${i}`);
            const year = document.getElementById(`pubYear${i}`);
            if (title && authors) {
                html += '<div class="modern-publication">';
                html += `<div class="modern-pub-title">${title.value}</div>`;
                html += `<div class="modern-pub-authors">${authors.value}</div>`;
                html += `<div class="modern-pub-venue">${venue.value} (${year.value})</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    html += '</div>'; // Close modern-main

    // Right Column
    html += '<div class="modern-sidebar">';

    // Education Section
    if (document.getElementById('educationToggle').checked) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Education</h2>';
        for (let i = 0; i < educationCount; i++) {
            const institution = document.getElementById(`institution${i}`);
            const degree = document.getElementById(`degree${i}`);
            const fieldOfStudy = document.getElementById(`fieldOfStudy${i}`);
            const cgpa = document.getElementById(`cgpa${i}`);
            const year = document.getElementById(`year${i}`);
            
            if (institution && degree) {
                html += '<div class="modern-education">';
                html += `<div class="modern-degree">${degree.value}</div>`;
                if (fieldOfStudy && fieldOfStudy.value) {
                    html += `<div class="modern-field">${fieldOfStudy.value}</div>`;
                }
                html += `<div class="modern-institution">${institution.value}</div>`;
                html += `<div class="modern-edu-details">`;
                if (year && year.value) html += `<span>${year.value}</span>`;
                if (cgpa && cgpa.value) html += `<span>CGPA: ${cgpa.value}</span>`;
                html += '</div>';
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Skills Section
    if (document.getElementById('skillsToggle').checked) {
        const skills = document.getElementById('skills').value.trim();
        if (skills) {
            html += '<div class="modern-section">';
            html += '<h2 class="modern-section-title">Skills</h2>';
            html += '<div class="modern-skills">';
            skills.split(',').map(skill => skill.trim()).filter(skill => skill)
                .forEach(skill => {
                    html += `<span class="modern-skill">${skill}</span>`;
                });
            html += '</div></div>';
        }
    }

    // Achievements Section
    if (document.getElementById('achievementsToggle').checked) {
        html += '<div class="modern-section">';
        html += '<h2 class="modern-section-title">Achievements</h2>';
        for (let i = 0; i < achievementCount; i++) {
            const title = document.getElementById(`achieveTitle${i}`);
            const desc = document.getElementById(`achieveDesc${i}`);
            const year = document.getElementById(`achieveYear${i}`);
            if (title && desc) {
                html += '<div class="modern-achievement">';
                html += `<div class="modern-achieve-title">${title.value}</div>`;
                if (year && year.value) {
                    html += `<div class="modern-achieve-year">${year.value}</div>`;
                }
                html += `<div class="modern-achieve-desc">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    html += '</div>'; // Close modern-sidebar
    html += '</div>'; // Close modern-layout

    preview.innerHTML = html;
}

function updateMinimalTemplate() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    // Header Section
    html += '<div class="minimal-header">';
    if (document.getElementById('photoToggle').checked &&
        document.getElementById('photoPreview').src !== '#' &&
        document.getElementById('photoPreview').style.display !== 'none') {
        html += `<img src="${document.getElementById('photoPreview').src}" class="minimal-profile" alt="Profile Photo">`;
    }
    html += `<div class="minimal-name">${document.getElementById('name').value}</div>`;
    html += '<div class="minimal-contact">';
    html += `<span>${document.getElementById('email').value}</span>`;
    if (document.getElementById('phone').value) {
        html += ` • <span>${document.getElementById('phone').value}</span>`;
    }
    html += '</div>';

    // Social Links
    if (document.getElementById('socialLinksToggle').checked) {
        html += '<div class="minimal-social">';
        const socialItems = document.querySelectorAll('.social-link-item');
        socialItems.forEach(item => {
            const platform = item.querySelector('.social-platform').value;
            const url = item.querySelector('.social-url').value;
            const username = item.querySelector('.social-username').value;
            if (url && username) {
                html += `<a href="${url}" target="_blank" class="minimal-social-link">${platform}: ${username}</a>`;
            }
        });
        html += '</div>';
    }
    html += '</div>'; // Close header

    // Summary Section
    const summary = document.getElementById('summary').value.trim();
    if (summary) {
        html += '<div class="minimal-section">';
        html += '<div class="minimal-summary">';
        html += `<p>${summary}</p>`;
        html += '</div>';
        html += '</div>';
    }

    // Experience Section
    if (document.getElementById('experienceToggle').checked) {
        html += '<div class="minimal-section">';
        html += '<h2 class="minimal-section-title">Experience</h2>';
        for (let i = 0; i < experienceCount; i++) {
            const company = document.getElementById(`company${i}`);
            const position = document.getElementById(`position${i}`);
            const duration = document.getElementById(`duration${i}`);
            const description = document.getElementById(`expDescription${i}`);
            if (company && position) {
                html += '<div class="minimal-experience">';
                html += '<div class="minimal-experience-header">';
                html += `<div class="minimal-position">${position.value}</div>`;
                html += `<div class="minimal-duration">${duration.value}</div>`;
                html += '</div>';
                html += `<div class="minimal-company">${company.value}</div>`;
                html += `<div class="minimal-description">${description.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Education Section
    if (document.getElementById('educationToggle').checked) {
        html += '<div class="minimal-section">';
        html += '<h2 class="minimal-section-title">Education</h2>';
        for (let i = 0; i < educationCount; i++) {
            const institution = document.getElementById(`institution${i}`);
            const degree = document.getElementById(`degree${i}`);
            const fieldOfStudy = document.getElementById(`fieldOfStudy${i}`);
            const cgpa = document.getElementById(`cgpa${i}`);
            const year = document.getElementById(`year${i}`);
            
            if (institution && degree) {
                html += '<div class="minimal-education">';
                html += `<div class="minimal-degree">${degree.value}`;
                if (fieldOfStudy && fieldOfStudy.value) {
                    html += ` in ${fieldOfStudy.value}`;
                }
                html += '</div>';
                html += '<div class="minimal-education-details">';
                html += `<span class="minimal-institution">${institution.value}</span>`;
                if (year && year.value) {
                    html += `<span class="minimal-year">${year.value}</span>`;
                }
                html += '</div>';
                if (cgpa && cgpa.value) {
                    html += `<div class="minimal-cgpa">CGPA: ${cgpa.value}</div>`;
                }
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Projects Section
    if (document.getElementById('projectsToggle').checked) {
        html += '<div class="minimal-section">';
        html += '<h2 class="minimal-section-title">Projects</h2>';
        for (let i = 0; i < projectCount; i++) {
            const title = document.getElementById(`projectTitle${i}`);
            const desc = document.getElementById(`projectDesc${i}`);
            const tech = document.getElementById(`projectTech${i}`);
            const link = document.getElementById(`projectLink${i}`);
            const duration = document.getElementById(`projectDuration${i}`);
            
            if (title && desc) {
                html += '<div class="minimal-project">';
                html += '<div class="minimal-project-header">';
                html += `<div class="minimal-project-title">${title.value}`;
                if (link && link.value) {
                    html += `<a href="${link.value}" target="_blank" class="minimal-project-link">↗</a>`;
                }
                html += '</div>';
                if (duration && duration.value) {
                    html += `<div class="minimal-project-duration">${duration.value}</div>`;
                }
                html += '</div>';
                if (tech && tech.value) {
                    html += `<div class="minimal-project-tech">${tech.value}</div>`;
                }
                html += `<div class="minimal-project-description">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Publications Section
    if (document.getElementById('publicationsToggle').checked) {
        html += '<div class="minimal-section">';
        html += '<h2 class="minimal-section-title">Publications</h2>';
        for (let i = 0; i < publicationCount; i++) {
            const title = document.getElementById(`pubTitle${i}`);
            const authors = document.getElementById(`pubAuthors${i}`);
            const venue = document.getElementById(`pubVenue${i}`);
            const year = document.getElementById(`pubYear${i}`);
            if (title && authors) {
                html += '<div class="minimal-publication">';
                html += `<div class="minimal-pub-title">${title.value}</div>`;
                html += `<div class="minimal-pub-authors">${authors.value}</div>`;
                html += `<div class="minimal-pub-venue">${venue.value} (${year.value})</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Skills Section
    if (document.getElementById('skillsToggle').checked) {
        const skills = document.getElementById('skills').value.trim();
        if (skills) {
            html += '<div class="minimal-section">';
            html += '<h2 class="minimal-section-title">Skills</h2>';
            html += '<div class="minimal-skills">';
            skills.split(',').map(skill => skill.trim()).filter(skill => skill)
                .forEach(skill => {
                    html += `<span class="minimal-skill">${skill}</span>`;
                });
            html += '</div></div>';
        }
    }

    // Achievements Section
    if (document.getElementById('achievementsToggle').checked) {
        html += '<div class="minimal-section">';
        html += '<h2 class="minimal-section-title">Achievements</h2>';
        for (let i = 0; i < achievementCount; i++) {
            const title = document.getElementById(`achieveTitle${i}`);
            const desc = document.getElementById(`achieveDesc${i}`);
            const year = document.getElementById(`achieveYear${i}`);
            if (title && desc) {
                html += '<div class="minimal-achievement">';
                html += '<div class="minimal-achievement-header">';
                html += `<div class="minimal-achieve-title">${title.value}</div>`;
                if (year && year.value) {
                    html += `<div class="minimal-achieve-year">${year.value}</div>`;
                }
                html += '</div>';
                html += `<div class="minimal-achieve-desc">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    preview.innerHTML = html;
}

function updateProfessionalTemplate() {
    const preview = document.getElementById('resumePreview');
    let html = '';

    // Professional Header
    html += '<div class="prof-header">';
    html += '<div class="prof-header-content">';
    if (document.getElementById('photoToggle').checked &&
        document.getElementById('photoPreview').src !== '#' &&
        document.getElementById('photoPreview').style.display !== 'none') {
        html += `<img src="${document.getElementById('photoPreview').src}" class="prof-photo" alt="Profile Photo">`;
    }
    html += '<div class="prof-title-section">';
    html += `<h1 class="prof-name">${document.getElementById('name').value}</h1>`;
    html += '<div class="prof-contact-info">';
    html += `<div class="prof-contact-item"><i class="prof-icon">📧</i>${document.getElementById('email').value}</div>`;
    html += `<div class="prof-contact-item"><i class="prof-icon">📱</i>${document.getElementById('phone').value}</div>`;
    html += '</div>';

    // Social Links
    if (document.getElementById('socialLinksToggle').checked) {
        html += '<div class="prof-social-links">';
        const socialItems = document.querySelectorAll('.social-link-item');
        socialItems.forEach(item => {
            const platform = item.querySelector('.social-platform').value;
            const url = item.querySelector('.social-url').value;
            const username = item.querySelector('.social-username').value;
            if (url && username) {
                html += `<a href="${url}" target="_blank" class="prof-social-link">
                    <span class="prof-social-platform">${platform}:</span> ${username}
                </a>`;
            }
        });
        html += '</div>';
    }
    html += '</div></div>'; // Close prof-title-section and prof-header-content

    // Professional Summary
    const summary = document.getElementById('summary').value.trim();
    if (summary) {
        html += '<div class="prof-summary">';
        html += `<p>${summary}</p>`;
        html += '</div>';
    }
    html += '</div>'; // Close prof-header

    // Main Content Container
    html += '<div class="prof-container">';

    // Left Column
    html += '<div class="prof-main-column">';

    // Experience Section
    if (document.getElementById('experienceToggle').checked) {
        html += '<div class="prof-section">';
        html += '<h2 class="prof-section-title">Professional Experience</h2>';
        for (let i = 0; i < experienceCount; i++) {
            const company = document.getElementById(`company${i}`);
            const position = document.getElementById(`position${i}`);
            const duration = document.getElementById(`duration${i}`);
            const description = document.getElementById(`expDescription${i}`);
            
            if (company && position) {
                html += '<div class="prof-experience">';
                html += '<div class="prof-experience-header">';
                html += `<h3 class="prof-position">${position.value}</h3>`;
                html += `<span class="prof-duration">${duration.value}</span>`;
                html += '</div>';
                html += `<div class="prof-company">${company.value}</div>`;
                html += `<div class="prof-description">${description.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Projects Section
    if (document.getElementById('projectsToggle').checked) {
        html += '<div class="prof-section">';
        html += '<h2 class="prof-section-title">Key Projects</h2>';
        for (let i = 0; i < projectCount; i++) {
            const title = document.getElementById(`projectTitle${i}`);
            const desc = document.getElementById(`projectDesc${i}`);
            const tech = document.getElementById(`projectTech${i}`);
            const link = document.getElementById(`projectLink${i}`);
            const duration = document.getElementById(`projectDuration${i}`);
            
            if (title && desc) {
                html += '<div class="prof-project">';
                html += '<div class="prof-project-header">';
                html += `<h3 class="prof-project-title">${title.value}`;
                if (link && link.value) {
                    html += `<a href="${link.value}" target="_blank" class="prof-project-link">View Project →</a>`;
                }
                html += '</h3>';
                if (duration && duration.value) {
                    html += `<span class="prof-project-duration">${duration.value}</span>`;
                }
                html += '</div>';
                if (tech && tech.value) {
                    html += `<div class="prof-project-tech">Technologies: ${tech.value}</div>`;
                }
                html += `<div class="prof-project-description">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Publications Section
    if (document.getElementById('publicationsToggle').checked) {
        html += '<div class="prof-section">';
        html += '<h2 class="prof-section-title">Publications</h2>';
        for (let i = 0; i < publicationCount; i++) {
            const title = document.getElementById(`pubTitle${i}`);
            const authors = document.getElementById(`pubAuthors${i}`);
            const venue = document.getElementById(`pubVenue${i}`);
            const year = document.getElementById(`pubYear${i}`);
            
            if (title && authors) {
                html += '<div class="prof-publication">';
                html += `<div class="prof-pub-title">${title.value}</div>`;
                html += `<div class="prof-pub-authors">${authors.value}</div>`;
                html += `<div class="prof-pub-venue">${venue.value} (${year.value})</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    html += '</div>'; // Close prof-main-column

    // Right Column
    html += '<div class="prof-side-column">';

    // Education Section
    if (document.getElementById('educationToggle').checked) {
        html += '<div class="prof-section">';
        html += '<h2 class="prof-section-title">Education</h2>';
        for (let i = 0; i < educationCount; i++) {
            const institution = document.getElementById(`institution${i}`);
            const degree = document.getElementById(`degree${i}`);
            const fieldOfStudy = document.getElementById(`fieldOfStudy${i}`);
            const cgpa = document.getElementById(`cgpa${i}`);
            const year = document.getElementById(`year${i}`);
            
            if (institution && degree) {
                html += '<div class="prof-education">';
                html += `<div class="prof-degree">${degree.value}</div>`;
                if (fieldOfStudy && fieldOfStudy.value) {
                    html += `<div class="prof-field">${fieldOfStudy.value}</div>`;
                }
                html += `<div class="prof-institution">${institution.value}</div>`;
                html += '<div class="prof-edu-details">';
                if (year && year.value) {
                    html += `<span class="prof-year">${year.value}</span>`;
                }
                if (cgpa && cgpa.value) {
                    html += `<span class="prof-cgpa">CGPA: ${cgpa.value}</span>`;
                }
                html += '</div>';
                html += '</div>';
            }
        }
        html += '</div>';
    }

    // Skills Section
    if (document.getElementById('skillsToggle').checked) {
        const skills = document.getElementById('skills').value.trim();
        if (skills) {
            html += '<div class="prof-section">';
            html += '<h2 class="prof-section-title">Core Competencies</h2>';
            html += '<div class="prof-skills">';
            skills.split(',').map(skill => skill.trim()).filter(skill => skill)
                .forEach(skill => {
                    html += `<div class="prof-skill">${skill}</div>`;
                });
            html += '</div></div>';
        }
    }

    // Achievements Section
    if (document.getElementById('achievementsToggle').checked) {
        html += '<div class="prof-section">';
        html += '<h2 class="prof-section-title">Achievements</h2>';
        for (let i = 0; i < achievementCount; i++) {
            const title = document.getElementById(`achieveTitle${i}`);
            const desc = document.getElementById(`achieveDesc${i}`);
            const year = document.getElementById(`achieveYear${i}`);
            
            if (title && desc) {
                html += '<div class="prof-achievement">';
                html += `<div class="prof-achieve-title">${title.value}</div>`;
                if (year && year.value) {
                    html += `<div class="prof-achieve-year">${year.value}</div>`;
                }
                html += `<div class="prof-achieve-desc">${desc.value}</div>`;
                html += '</div>';
            }
        }
        html += '</div>';
    }

    html += '</div>'; // Close prof-side-column
    html += '</div>'; // Close prof-container

    preview.innerHTML = html;
}

async function downloadPDF() {
    try {
        // Show loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = 'Generating PDF...';
        document.body.appendChild(loadingIndicator);

        const element = document.getElementById('resumePreview');
        
        // Create a clone of the element
        const clone = element.cloneNode(true);
        document.body.appendChild(clone);
        clone.style.width = '794px'; // A4 width in pixels
        
        // Make links absolute and visible
        const links = clone.getElementsByTagName('a');
        for (let link of links) {
            link.style.color = '#0000EE';
            link.style.textDecoration = 'underline';
            link.href = link.href; // Convert to absolute URL
        }

        // Render with better quality
        const canvas = await html2canvas(clone, {
            scale: 10, // Higher scale for better quality
            useCORS: true,
            logging: false,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt', // Use points for better precision
            format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add pages if content exceeds one page
        let heightLeft = imgHeight;
        let position = 0;
        let pageNumber = 1;

        while (heightLeft >= 0) {
            if (position !== 0) {
                pdf.addPage();
            }
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
            heightLeft -= pageHeight;
            position -= pageHeight;
            pageNumber++;
        }

        // Add clickable links
        const scale = pageWidth / element.offsetWidth;
        Array.from(links).forEach(link => {
            const rect = link.getBoundingClientRect();
            pdf.link(
                rect.left * scale,
                rect.top * scale,
                rect.width * scale,
                rect.height * scale,
                { url: link.href }
            );
        });

        pdf.save('resume.pdf');
        clone.remove();
        loadingIndicator.remove();

    } catch (error) {
        alert('Error generating PDF. Please try again.');
    }
}

