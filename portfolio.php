<?php
require_once 'config.php';

$profile_identifier = $_GET['u'] ?? null;

if (!$profile_identifier) {
    die("No profile specified");
}

try {
    
    $query = is_numeric($profile_identifier) 
        ? "SELECT id FROM users WHERE id = ?"
        : "SELECT id FROM users WHERE username = ?";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([$profile_identifier]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        die("Profile not found");
    }

    $user_id = $user['id'];
    $data = [];

    
    $stmt = $pdo->prepare("SELECT * FROM personal_info WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $data['personal_info'] = $stmt->fetch(PDO::FETCH_ASSOC);

    // Social Links
    $stmt = $pdo->prepare("SELECT * FROM social_links WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['social_links'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Experiences
    $stmt = $pdo->prepare("SELECT * FROM experiences WHERE user_id = ? ORDER BY id DESC");
    $stmt->execute([$user_id]);
    $data['experiences'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Education
    $stmt = $pdo->prepare("SELECT * FROM education WHERE user_id = ? ORDER BY year DESC");
    $stmt->execute([$user_id]);
    $data['education'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Projects
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['projects'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Publications
    $stmt = $pdo->prepare("SELECT * FROM publications WHERE user_id = ? ORDER BY year DESC");
    $stmt->execute([$user_id]);
    $data['publications'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Achievements
    $stmt = $pdo->prepare("SELECT * FROM achievements WHERE user_id = ? ORDER BY year DESC");
    $stmt->execute([$user_id]);
    $data['achievements'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Skills
    $stmt = $pdo->prepare("SELECT skills_list FROM skills WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $skills = $stmt->fetch(PDO::FETCH_ASSOC);
    $data['skills'] = $skills ? explode(',', $skills['skills_list']) : [];

} catch (Exception $e) {
    die("Error fetching profile data");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($data['personal_info']['full_name'] ?? 'My Profile') ?> - Resume</title>
    <link rel="icon" type="image/png" href="<?= htmlspecialchars($data['personal_info']['photo_url'] ?? 'icon.png') ?>">
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
        @media (max-width: 768px) {
            .profile-container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="profile-container">
        <div class="sidebar">
            <img src="<?= htmlspecialchars($data['personal_info']['photo_url'] ?? 'backup.png') ?>" 
                 alt="Profile Photo" class="profile-photo">
            <div class="profile-name">
                <h1><?= htmlspecialchars($data['personal_info']['full_name'] ?? 'Your Name') ?></h1>
                <p><?= htmlspecialchars($data['personal_info']['summary'] ?? 'Professional Summary') ?></p>
            </div>
            <div class="social-links">
                <?php 
                $socialIcons = [
                    'LinkedIn' => 'fab fa-linkedin',
                    'GitHub' => 'fab fa-github',
                    'Twitter' => 'fab fa-twitter',
                    'Personal Website' => 'fas fa-globe'
                ];
                foreach ($data['social_links'] as $link): 
                    $icon = $socialIcons[$link['platform']] ?? 'fas fa-link';
                ?>
                    <a href="<?= htmlspecialchars($link['url']) ?>" target="_blank" title="<?= htmlspecialchars($link['platform']) ?>">
                        <i class="<?= $icon ?>"></i>
                    </a>
                <?php endforeach; ?>
            </div>
        </div>
        
        <div class="main-content">
            <?php if (!empty($data['experiences'])): ?>
            <div id="experiences" class="section">
                <h2 class="section-title"><i class="fas fa-briefcase"></i> Experiences</h2>
                <div class="content-grid">
                    <?php foreach ($data['experiences'] as $exp): ?>
                        <div class="card timeline-item">
                            <div class="timeline-header">
                                <h3><?= htmlspecialchars($exp['position']) ?> at <?= htmlspecialchars($exp['company']) ?></h3>
                                <small><?= htmlspecialchars($exp['duration']) ?></small>
                            </div>
                            <p><?= htmlspecialchars($exp['description']) ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($data['education'])): ?>
            <div id="education" class="section">
                <h2 class="section-title"><i class="fas fa-graduation-cap"></i> Education</h2>
                <div class="content-grid">
                    <?php foreach ($data['education'] as $edu): ?>
                        <div class="card timeline-item">
                            <div class="timeline-header">
                                <h3><?= htmlspecialchars($edu['degree']) ?> - <?= htmlspecialchars($edu['field_of_study']) ?></h3>
                                <small><?= htmlspecialchars($edu['year']) ?></small>
                            </div>
                            <p><?= htmlspecialchars($edu['institution']) ?> | CGPA: <?= htmlspecialchars($edu['cgpa']) ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($data['projects'])): ?>
            <div id="projects" class="section">
                <h2 class="section-title"><i class="fas fa-project-diagram"></i> Projects</h2>
                <div class="content-grid">
                    <?php foreach ($data['projects'] as $project): ?>
                        <div class="card">
                            <div class="card-title">
                                <i class="fas fa-code"></i>
                                <h3><?= htmlspecialchars($project['title']) ?></h3>
                            </div>
                            <p><?= htmlspecialchars($project['description']) ?></p>
                            <div class="skill-tags">
                                <?php foreach (explode(',', $project['technologies']) as $tech): ?>
                                    <span class="skill-tag"><?= htmlspecialchars(trim($tech)) ?></span>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($data['publications'])): ?>
            <div id="publications" class="section">
                <h2 class="section-title"><i class="fas fa-book"></i> Publications</h2>
                <div class="content-grid">
                    <?php foreach ($data['publications'] as $pub): ?>
                        <div class="card">
                            <div class="card-title">
                                <i class="fas fa-book"></i>
                                <h3><?= htmlspecialchars($pub['title']) ?></h3>
                            </div>
                            <p>Authors: <?= htmlspecialchars($pub['authors']) ?></p>
                            <p>Venue: <?= htmlspecialchars($pub['venue']) ?></p>
                            <small>Year: <?= htmlspecialchars($pub['year']) ?></small>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (!empty($data['achievements'])): ?>
            <div id="achievements" class="section">
                <h2 class="section-title"><i class="fas fa-trophy"></i> Achievements</h2>
                <div class="content-grid">
                    <?php foreach ($data['achievements'] as $achievement): ?>
                        <div class="card">
                            <div class="card-title">
                                <i class="fas fa-trophy"></i>
                                <h3><?= htmlspecialchars($achievement['title']) ?></h3>
                            </div>
                            <p><?= htmlspecialchars($achievement['description']) ?></p>
                            <small>Year: <?= htmlspecialchars($achievement['year']) ?></small>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>