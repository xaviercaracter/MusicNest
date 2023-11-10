<?php session_start(); 
// Get the previously entered data from the session (if available)
$email = isset($_SESSION['email']) ? $_SESSION['email'] : '';
$username = isset($_SESSION['username']) ? $_SESSION['username'] : '';

// Clear session data to avoid displaying it again
unset($_SESSION['email']);
unset($_SESSION['username']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up Page</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <?php include 'signup_navbar.php';?>
    <div class="welcome-container">
        <h1>Welcome to The Music Nest</h1>
        <h2>Connect with fellow music enjoyers worldwide</h2>
        <h3>Sign Up Below!</h3>                                                
        <form id="login-form" action="process_registration.php" method="post" class="input-field">
            <label for="emal">Enter Valid Email:</label>
            <input type="text" id="email" name="email" required>
            <br>
            <label for="username">Enter New Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Enter New Password: </label>
            <input type="password" id="password" name="password" required>
            <br>
            <label for="confirm">Confirm Password: </label>
            <input type="password" id="confirm" name="confirm" required>
            <br>
            <input type="submit" name ="register"  value="Submit">
        </form>
    </div>
    <?php include 'footer.php'; ?>
</body>
</html>
