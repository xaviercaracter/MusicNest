<?php
session_start();

if (isset($_POST['login'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    include 'connect.php'; // Include your database connection

    $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');

    try {
        $stmt->execute(['username' => $username]);

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch();

            if (password_verify($password, $user['password'])) {
                // Action after a successful login
                $_SESSION['success'] = 'User verification successful';
                $_SESSION['username'] = $username;
                header('Location: index.php'); // Redirect to the home page
                exit();
            } else {
                // Return the values to the user
                $_SESSION['username'] = $username;
                $_SESSION['password'] = $password;
                $_SESSION['error'] = 'Incorrect password';
            }
        } else {
            // Return the values to the user
            $_SESSION['username'] = $username;
            $_SESSION['password'] = $password;
            $_SESSION['error'] = 'No account associated with the username';
        }
    } catch (PDOException $e) {
        $_SESSION['error'] = $e->getMessage();
    }
} else {
    $_SESSION['error'] = 'Fill up the login form first';
}

header('Location: login.php');
exit();
