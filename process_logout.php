<?php
session_start(); // Start or resume the session

// Check if the user is already logged in
if (!isset($_SESSION['username'])) {
    header("Location: login.php"); // Redirect to the login page if not logged in
    exit();
}

// If the user is logged in, destroy the session and logout
session_unset(); // Unset all session variables
session_destroy(); // Destroy the session data

header("Location: login.php"); // Redirect to the login page after logging out
exit();
?>