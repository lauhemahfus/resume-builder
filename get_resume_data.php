<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't display errors to browser
header('Content-Type: application/json'); // Set content type to JSON

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit();
}

try {
    require_once 'config.php'; // Include database configuration
    
    $user_id = $_SESSION['user_id'];
    $data = [];

    // Get Personal Info
    $stmt = $pdo->prepare("SELECT * FROM personal_info WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $data['personal_info'] = $stmt->fetch(PDO::FETCH_ASSOC);
    
    

    // Get Social Links
    $stmt = $pdo->prepare("SELECT * FROM social_links WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['social_links'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Experiences
    $stmt = $pdo->prepare("SELECT * FROM experiences WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['experiences'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Education
    $stmt = $pdo->prepare("SELECT * FROM education WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['education'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Projects
    $stmt = $pdo->prepare("SELECT * FROM projects WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['projects'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Publications
    $stmt = $pdo->prepare("SELECT * FROM publications WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['publications'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Achievements
    $stmt = $pdo->prepare("SELECT * FROM achievements WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $data['achievements'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get Skills
    $stmt = $pdo->prepare("SELECT * FROM skills WHERE user_id = ? ORDER BY id DESC LIMIT 1");
    $stmt->execute([$user_id]);
    $data['skills'] = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $data]);

} catch (Exception $e) {
    error_log("Error in get_resume_data.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>