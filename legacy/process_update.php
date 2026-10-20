<?php
session_start();
include 'connect.php';

try {
    

    // Check if the form is submitted
    if (isset($_POST['updateprofile'])) {
        $username = $_SESSION['username']; // Assuming you have a user session

        // Get first name and last name from the form
        $first_name = $_POST['first-name'];
        $last_name = $_POST['last-name'];

        // Prepare and execute an SQL UPDATE statement
        $stmt = $pdo->prepare("UPDATE users SET FName = :first_name, LName = :last_name WHERE username = :username");
        $stmt->bindParam(':first_name', $first_name, PDO::PARAM_STR);
        $stmt->bindParam(':last_name', $last_name, PDO::PARAM_STR);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        echo "Profile updated successfully.";
        header('location: profile.php');
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
