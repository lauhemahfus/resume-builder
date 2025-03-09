<?php
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit();
}

try {
    $user_id = $_SESSION['user_id'];
    $data = json_decode(file_get_contents('php://input'), true);

    $pdo->beginTransaction();

    // Save Personal Info
    $stmt = $pdo->prepare("INSERT INTO personal_info (user_id, full_name, email, phone, summary, photo_url) 
                          VALUES (?, ?, ?, ?, ?, ?) 
                          ON DUPLICATE KEY UPDATE 
                          full_name = VALUES(full_name),
                          email = VALUES(email),
                          phone = VALUES(phone),
                          summary = VALUES(summary),
                          photo_url = VALUES(photo_url)");
    $stmt->execute([
        $user_id,
        $data['name'],
        $data['email'],
        $data['phone'],
        $data['summary'],
        $data['photo_url']
    ]);

    // Save Social Links
    $stmt = $pdo->prepare("DELETE FROM social_links WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['social_links'])) {
        foreach ($data['social_links'] as $link) {
            $stmt = $pdo->prepare("INSERT INTO social_links (user_id, platform, username, url) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $link['platform'], $link['username'], $link['url']]);
        }
    }

    // Save Experiences
    $stmt = $pdo->prepare("DELETE FROM experiences WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['experiences'])) {
        foreach ($data['experiences'] as $exp) {
            $stmt = $pdo->prepare("INSERT INTO experiences (user_id, company, position, duration, description) 
                                VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $exp['company'], $exp['position'], $exp['duration'], $exp['description']]);
        }
    }

    // Save Education
    $stmt = $pdo->prepare("DELETE FROM education WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['education'])) {
        foreach ($data['education'] as $edu) {
            $stmt = $pdo->prepare("INSERT INTO education (user_id, institution, degree, field_of_study, cgpa, year) 
                                VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $user_id,
                $edu['institution'],
                $edu['degree'],
                $edu['field_of_study'],
                $edu['cgpa'],
                $edu['year']
            ]);
        }
    }

    // Save Projects
    $stmt = $pdo->prepare("DELETE FROM projects WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['projects'])) {
        foreach ($data['projects'] as $proj) {
            $stmt = $pdo->prepare("INSERT INTO projects (user_id, title, description, technologies, project_url, duration) 
                                VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $user_id,
                $proj['title'],
                $proj['description'],
                $proj['technologies'],
                $proj['project_url'],
                $proj['duration']
            ]);
        }
    }

    // Save Publications
    $stmt = $pdo->prepare("DELETE FROM publications WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['publications'])) {
        foreach ($data['publications'] as $pub) {
            $stmt = $pdo->prepare("INSERT INTO publications (user_id, title, authors, venue, year) 
                                VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$user_id, $pub['title'], $pub['authors'], $pub['venue'], $pub['year']]);
        }
    }

    // Save Achievements
    $stmt = $pdo->prepare("DELETE FROM achievements WHERE user_id = ?");
    $stmt->execute([$user_id]);

    if (!empty($data['achievements'])) {
        foreach ($data['achievements'] as $achieve) {
            $stmt = $pdo->prepare("INSERT INTO achievements (user_id, title, description, year) 
                                VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $achieve['title'], $achieve['description'], $achieve['year']]);
        }
    }

    // Save Skills
    $stmt = $pdo->prepare("INSERT INTO skills (user_id, skills_list) 
                          VALUES (?, ?) 
                          ON DUPLICATE KEY UPDATE 
                          skills_list = VALUES(skills_list)");
    $stmt->execute([$user_id, $data['skills']]);

    $pdo->commit();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>