<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Successful</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <div class="welcome-container">
        <h1>Registration Successful</h1>
        <p>Thank you for registering!</p>
    </div>

    <script type="text/javascript">
        //JS to redirect
        setTimeout(function() {
            window.location.href = "index.php"; 
        }, 2000); //2 seconds
    </script>
</body>
</html>
