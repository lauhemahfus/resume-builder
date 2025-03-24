<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: index.html");
    exit();
}

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Builder</title>
    <link rel="icon" type="image/png" href="icon.png">
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css">
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</head>

<body>
    <nav class="navbar">
        <div class="nav-brand">
            <a href="index.php" class="logo">
                <i class="fas fa-file-alt"></i> Resume Builder
            </a>
        </div>
        <div class="nav-buttons">
            <button onclick="saveAllData()" class="nav-btn save-btn">
                <i class="fas fa-save"></i> Save Resume
            </button>
            <button onclick="downloadPDF()" class="nav-btn download-btn">
                <i class="fas fa-download"></i> Download PDF
            </button>
            <select id="templateSelect" onchange="updateResume()" class="template-select">
                <option value="classic">Classic Template</option>
                <option value="modern">Modern Template</option>
                <option value="minimal">Minimal Template</option>
                <option value="professional">Professional Template</option>
                <option value="creative">Creative Template</option>
                <option value="executive">Executive Template</option>
            </select>
            <button onclick="copyPublicProfileLink()" class="nav-btn save-btn" title="Copy Public Profile Link">
                <i class="fas fa-link"></i> Copy Profile Link
            </button>
            <a href="profile.php" class="nav-btn save-btn" title="Profile Settings">
                <i class="fas fa-user"></i> <?php echo $_SESSION['username'] ?? ''; ?>
            </a>
            <a href="logout.php" class="nav-btn logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>
    </nav>


    

    <div class="container">
        <div class="input-section">
            <!-- Personal Information -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Personal Information</h3>
                </div>
                <div class="section-content">
                    <label for="name">Full Name:</label>
                    <input type="text" id="name" oninput="updateResume()">

                    <label for="email">Email:</label>
                    <input type="email" id="email" oninput="updateResume()">

                    <label for="phone">Phone:</label>
                    <input type="tel" id="phone" oninput="updateResume()">

                    <label for="summary">Professional Summary:</label>
                    <textarea id="summary" rows="4" oninput="updateResume()"></textarea>
                </div>
            </div>

            <!-- Photo Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Profile Photo</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="photoToggle" checked> Include Photo
                    </label>
                </div>
                <div class="section-content" id="photoSection">
                    <div class="photo-upload">
                        <label for="photo">Upload Photo:</label>
                        <input type="file" id="photo" accept="image/*" onchange="previewImage(event)">
                        <img id="photoPreview" src="#" alt="Preview" style="display: none;">
                    </div>
                </div>
            </div>

            <!-- Social Media Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Social Media & Links</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="socialLinksToggle" checked> Include Social Links
                    </label>
                </div>
                <div class="section-content">
                    <div id="socialLinksFields">
                        <!-- Default social links -->
                        <div class="social-link-item">
                            <label>Platform:</label>
                            <select class="social-platform" onchange="updateResume()">
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="GitHub">GitHub</option>
                                <option value="Twitter">Twitter</option>
                                <option value="Portfolio">Portfolio</option>
                                <option value="Other">Other</option>
                            </select>
                            <div class="other-platform" style="display: none;">
                                <label>Specify Platform:</label>
                                <input type="text" class="other-platform-name" oninput="updateResume()">
                            </div>
                            <label>Username/Handle:</label>
                            <input type="text" class="social-username" oninput="updateResume()">
                            <label>URL:</label>
                            <input type="url" class="social-url" oninput="updateResume()">
                            <button onclick="removeSocialLink(this)" class="remove-button">Remove</button>
                        </div>
                    </div>
                    <button onclick="addSocialLink()" class="add-button"><i class="fas fa-plus"></i>Add Social Link</button>
                </div>
            </div>

            <!-- Experience Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Experience</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="experienceToggle" checked> Include Experience
                    </label>
                </div>
                <div class="section-content">
                    <div id="experienceFields"></div>
                    <button onclick="addExperience()" class="add-button"><i class="fas fa-plus"></i>Add Experience</button>
                </div>
            </div>

            <!-- Education Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Education</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="educationToggle" checked> Include Education
                    </label>
                </div>
                <div class="section-content">
                    <div id="educationFields"></div>
                    <button onclick="addEducation()" class="add-button"><i class="fas fa-plus"></i>Add Education</button>
                </div>
            </div>
            <!-- Projects Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Projects</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="projectsToggle" checked> Include Projects
                    </label>
                </div>
                <div class="section-content">
                    <div id="projectFields"></div>
                    <button onclick="addProject()" class="add-button"><i class="fas fa-plus"></i>Add Project</button>
                </div>
            </div>

            <!-- Publications Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Publications</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="publicationsToggle" checked> Include Publications
                    </label>
                </div>
                <div class="section-content">
                    <div id="publicationFields"></div>
                    <button onclick="addPublication()" class="add-button"><i class="fas fa-plus"></i>Add Publication</button>
                </div>
            </div>

            <!-- Achievements Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Achievements</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="achievementsToggle" checked> Include Achievements
                    </label>
                </div>
                <div class="section-content">
                    <div id="achievementFields"></div>
                    <button onclick="addAchievement()" class="add-button"><i class="fas fa-plus"></i>Add Achievement</button>
                </div>
            </div>

            <!-- Skills Section -->
            <div class="input-field">
                <div class="section-header">
                    <h3>Skills</h3>
                    <label class="checkbox-label">
                        <input type="checkbox" id="skillsToggle" checked> Include Skills
                    </label>
                </div>
                <div class="section-content">
                    <label for="skills">Skills (comma-separated):</label>
                    <textarea id="skills" rows="3" oninput="updateResume()"></textarea>
                </div>
            </div>
        </div>

        <div class="preview-section",>
            <div id="resumePreview"></div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
<script>
    function copyPublicProfileLink() {
        const username = "<?php echo $_SESSION['username'] ?? ''; ?>";
        const publicProfileLink = `http://localhost/resume-builder/portfolio.php?u=${username}`;
        // Create a temporary textarea to copy the link
        const tempInput = document.createElement('textarea');
        tempInput.value = publicProfileLink;
        document.body.appendChild(tempInput);
        tempInput.select();

        try {
            // Copy the text to clipboard
            document.execCommand('copy');
            alert('Public profile link copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy link', err);
            alert('Failed to copy link. Please copy manually.');
        }

        // Remove the temporary input
        document.body.removeChild(tempInput);
    }
</script>

</html>