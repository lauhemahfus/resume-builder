
<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume Builder - Profile</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Poppins', sans-serif;
        }
        body {
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
            padding-top: 70px; /* Added to accommodate fixed navbar */
        }
        .profile-container {
            max-width: 1200px;
            margin: 40px auto;
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 30px;
            background: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            border-radius: 15px;
            overflow: hidden;
        }
        .sidebar {
            background: linear-gradient(45deg, #00214d, #002966);
            color: white;
            padding: 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .profile-photo {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            border: 5px solid #FF416C;
            margin-bottom: 20px;
        }
        .profile-name {
            text-align: center;
            margin-bottom: 15px;
        }
        .profile-name h1 {
            font-size: 1.8rem;
            margin-bottom: 10px;
        }
        .profile-name p {
            color: rgba(255,255,255,0.7);
            font-size: 0.9rem;
        }
        .social-links {
            display: flex;
            gap: 15px;
            margin-top: 20px;
        }
        .social-links a {
            color: white;
            font-size: 1.5rem;
            transition: color 0.3s ease;
        }
        .social-links a:hover {
            color: #FF416C;
        }
        .main-content {
            padding: 30px;
        }
        .section-title {
            border-bottom: 3px solid #FF416C;
            padding-bottom: 10px;
            margin-bottom: 20px;
            color: #00214d;
        }
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        .card {
            background: #f9f9f9;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: transform 0.3s ease;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .card-title {
            color: #00214d;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
        }
        .card-title i {
            margin-right: 10px;
            color: #FF416C;
        }
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .skill-tag {
            background: #00214d;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        .timeline-item {
            border-left: 3px solid #FF416C;
            padding-left: 20px;
            margin-bottom: 20px;
            position: relative;
        }
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -11px;
            top: 0;
            width: 20px;
            height: 20px;
            background: #FF416C;
            border-radius: 50%;
        }
        .timeline-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .edit-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background: #FF416C;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .edit-btn:hover {
            background: #ff2c55;
        }
        .public-profile-controls {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-bottom: 20px;
        }
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
            margin-right: 15px;
        }
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
        }
        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }
        input:checked + .slider {
            background-color: #FF416C;
        }
        input:checked + .slider:before {
            transform: translateX(26px);
        }
        .copy-btn {
            background: #00214d;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .copy-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .navbar {
            background: linear-gradient(45deg, #00214d, #002966);
            padding: 10px 10px 10px 10px; 
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed; 
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .logo {
            margin-left: 40px;
            font-size: 22px; 
            font-weight: bold;
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo i {
            font-size: 24px; 
        }

        .nav-buttons {
            display: flex;
            gap: 20px;
            align-items: center;
        }

        .nav-btn {
            padding: 8px 20px; 
            border-radius: 25px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }

        .nav-btn i {
            font-size: 16px;
        }

        .save-btn {
            color: white;
            border: 2px solid white;
            background: transparent;
        }

        .save-btn:hover {
            background: white;
            color: #002966;
            transform: translateY(-2px);
        }

        .download-btn {
            color: white;
            border: 2px solid white;
            background: transparent;
        }

        .download-btn:hover {
            background: white;
            color: #002966;
            transform: translateY(-2px);
        }

        .template-select {
            padding: 10px 25px;
            border-radius: 25px;
            border: 2px solid white;
            background: transparent;
            color: white;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            appearance: none;
            -webkit-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 15px center;
            padding-right: 35px;
        }

        .template-select:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        .template-select option {
            background: #002966;
            color: white;
        }

        .logout-btn {
            margin-right: 60px;
            color: white;
            border: 2px solid white;
            background: transparent;
        }

        .logout-btn:hover {
            background: white;
            color: #002966;
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            .profile-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">
            <a href="index.php" class="logo">
                <i class="fas fa-file-alt"></i> Resume Builder
            </a>
        </div>
        <div class="nav-buttons">
            <a href="builder.php" class="nav-btn save-btn" title="Go to Resume Builder">
                <i class="fas fa-edit"></i> Resume Builder
            </a>
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
    <div class="profile-container" id="profile-container">
        <div class="sidebar" id="sidebar">
        </div>
        <div class="main-content">
            
            <div id="experiences" class="section">
                <h2 class="section-title"><i class="fas fa-briefcase"></i> Experiences</h2>
                <div class="content-grid" id="experiences-grid"></div>
            </div>
            
            <div id="education" class="section">
                <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Education</h2>
                <div class="content-grid" id="education-grid"></div>
            </div>
            
            <div id="projects" class="section">
                <h2 class="section-title"><i class="fas fa-project-diagram"></i> Projects</h2>
                <div class="content-grid" id="projects-grid"></div>
            </div>
            
            <div id="publications" class="section">
                <h2 class="section-title"><i class="fas fa-book"></i> Publications</h2>
                <div class="content-grid" id="publications-grid"></div>
            </div>
            
            <div id="achievements" class="section">
                <h2 class="section-title"><i class="fas fa-trophy"></i> Achievements</h2>
                <div class="content-grid" id="achievements-grid"></div>
            </div>
        </div>
    </div>

    <script>
        // Mapping function for social platform icons
        const socialIcons = {
            'LinkedIn': 'fab fa-linkedin',
            'GitHub': 'fab fa-github',
            'Twitter': 'fab fa-twitter',
            'Personal Website': 'fas fa-globe'
        };

        // Fetch user profile data
        fetch('get_resume_data.php')
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    const data = result.data;
                    populateSidebar(data.personal_info, data.social_links);
                    populateSection('experiences', data.experiences);
                    populateSection('education', data.education);
                    populateSection('projects', data.projects);
                    populateSection('publications', data.publications);
                    populateSection('achievements', data.achievements);
                } else {
                    console.error('Failed to fetch data');
                }
            })
            .catch(error => console.error('Error:', error));

        function populateSidebar(personalInfo, socialLinks) {
            const sidebar = document.getElementById('sidebar');
            
            // Profile Photo
            const photoUrl = personalInfo?.photo_url || 'https://via.placeholder.com/200';
            
            // Sidebar HTML
            sidebar.innerHTML = `
                <img src="${photoUrl}" alt="Profile Photo" class="profile-photo">
                <div class="profile-name">
                    <h1>${personalInfo?.full_name || 'Your Name'}</h1>
                    <p>${personalInfo?.summary || 'Professional Summary'}</p>
                </div>
                <div class="social-links">
                    ${socialLinks.map(link => `
                        <a href="${link.url}" target="_blank" title="${link.platform}">
                            <i class="${socialIcons[link.platform] || 'fas fa-link'}"></i>
                        </a>
                    `).join('')}
                </div>
            `;
        }

        function populateSection(sectionId, data) {
            const grid = document.getElementById(`${sectionId}-grid`);
            const section = document.getElementById(sectionId);
            
            // Hide section if no data
            if (!data || data.length === 0) {
                section.style.display = 'none';
                return;
            }

            // Populate grid based on section
            grid.innerHTML = data.map(item => {
                switch(sectionId) {
                    case 'experiences':
                        return `
                            <div class="card timeline-item">
                                <div class="timeline-header">
                                    <h3>${item.position} at ${item.company}</h3>
                                    <small>${item.duration}</small>
                                </div>
                                <p>${item.description}</p>
                            </div>
                        `;
                    case 'education':
                        return `
                            <div class="card timeline-item">
                                <div class="timeline-header">
                                    <h3>${item.degree} - ${item.field_of_study}</h3>
                                    <small>${item.year}</small>
                                </div>
                                <p>${item.institution} | CGPA: ${item.cgpa}</p>
                            </div>
                        `;
                    case 'projects':
                        return `
                            <div class="card">
                                <div class="card-title">
                                    <i class="fas fa-code"></i>
                                    <h3>${item.title}</h3>
                                </div>
                                <p>${item.description}</p>
                                <div class="skill-tags">
                                    ${item.technologies.split(',').map(tech => 
                                        `<span class="skill-tag">${tech.trim()}</span>`
                                    ).join('')}
                                </div>
                            </div>
                        `;
                    case 'publications':
                        return `
                            <div class="card">
                                <div class="card-title">
                                    <i class="fas fa-book"></i>
                                    <h3>${item.title}</h3>
                                </div>
                                <p>Authors: ${item.authors}</p>
                                <p>Venue: ${item.venue}</p>
                                <small>Year: ${item.year}</small>
                            </div>
                        `;
                    case 'achievements':
                        return `
                            <div class="card">
                                <div class="card-title">
                                    <i class="fas fa-trophy"></i>
                                    <h3>${item.title}</h3>
                                </div>
                                <p>${item.description}</p>
                                <small>Year: ${item.year}</small>
                            </div>
                        `;
                }
            }).join('');
        }
    </script>
    <script>
    
</script>

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
</body>
</html>