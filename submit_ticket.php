<?php
header('Content-Type: application/json');
require 'config.php';

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Only POST requests allowed', 405);
    }

    // Validate required fields
    $required = ['name', 'email', 'issue', 'priority'];
    foreach ($required as $field) {
        if (empty($_POST[$field])) {
            throw new Exception("Missing required field: $field", 400);
        }
    }

    // Generate ticket ID
    $ticketId = 'HDY-' . strtoupper(bin2hex(random_bytes(2))) . '-' . rand(100, 999);

    // Get database connection
    $pdo = getPDO();

    // Prepare and execute query
    $stmt = $pdo->prepare("INSERT INTO tickets 
        (ticket_id, name, email, issue, priority) 
        VALUES (:id, :name, :email, :issue, :priority)");
    
    $stmt->execute([
        ':id' => $ticketId,
        ':name' => $_POST['name'],
        ':email' => $_POST['email'],
        ':issue' => $_POST['issue'],
        ':priority' => $_POST['priority']
    ]);

    echo json_encode([
        'success' => true,
        'ticketId' => $ticketId
    ]);

} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>