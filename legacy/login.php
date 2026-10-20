<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log In Page</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <?php include 'login_navbar.php'; ?>
    <div class="welcome-container">
        <h1>Welcome to The Music Nest</h1>
        <h2>Log In or Sign Up Below</h2>                                         
        <form id="login-form" action="process_login.php" method="post" class="input-field">
            <label for="username">Enter Username:</label>
            <input type="text" id="username" name="username" required>
            <br>
            <label for="password">Enter Password: </label>
            <input type="password" id="password" name="password" required>
            <br>
            <input type="submit" name="login" value="Submit">
        </form>
        <br>
        <a href="signup.php">Sign Up</a>
    </div>
    
    <?php include 'footer.php'; ?>
</body>
</html>
