<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Not authenticated']);
    exit();
}

if (isset($_FILES['photo'])) {
    $file = $_FILES['photo'];
    $user_id = $_SESSION['user_id'];
    
    // Create uploads directory if it doesn't exist
    if (!file_exists('uploads')) {
        mkdir('uploads', 0777, true);
    }

    // Generate filename
    $filename = 'profile_' . $user_id . '_' . time() . '.jpg';
    $filepath = 'uploads/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        require_once 'config.php';
        
        // Update database
        $stmt = $pdo->prepare("UPDATE personal_info SET photo_url = ? WHERE user_id = ?");
        $stmt->execute([$filepath, $user_id]);

        echo json_encode(['success' => true, 'file_path' => $filepath]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to upload file']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No file uploaded']);
}
?>