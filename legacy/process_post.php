<?php
session_start();
include 'connect.php';

if (isset($_SESSION['username']) && !empty($_POST['post_content'])) {
    $username = $_SESSION['username'];
    $post_content = $_POST['post_content'];

    // Replace the following code with your PDO database connection.
    // Example using PDO:

    try {
        

        // Insert the post into the database
        $stmt = $pdo->prepare("INSERT INTO posts (username, content) VALUES (:username, :post_content)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':post_content', $post_content);

        if ($stmt->execute()) {
            // Redirect back to the homepage or display a success message
            header("Location: index.php");
            exit;
        } else {
            echo "Error inserting the post.";
        }
    } catch (PDOException $e) {
        echo "Database Error: " . $e->getMessage();
    }
} else {
    // Handle validation errors or unauthorized access
    echo "Invalid input or unauthorized access.";
}
