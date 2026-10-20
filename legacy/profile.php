<?php
session_start();
include 'connect.php';
if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
    $query = "SELECT FName, LName FROM users WHERE username = :username";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $firstName = $user['FName'];
            $lastName = $user['LName'];
        } else {
            $firstName = 'Not Found';
            $lastName = 'Not Found';
        }
} else {
    $username = 'Not Found';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile Page</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="user-info-content">
        <h1>User Profile: <?php echo $username; ?></h1>
        <form action="process_update.php" method="POST" class="login-form">
            <div class="form-group">
                <label for="first-name">First Name: <?php echo $firstName ?></label>
                <input type="text" id="first-name" name="first-name" required>
            </div>
            <div class="form-group">
                <label for="last-name">Last Name: <?php echo $lastName ?></label>
                <input type="text" id="last-name" name="last-name" required>
            </div>
            <div class="form-group">
                <input type="submit" name="updateprofile" value="Update Profile">
            </div>
        </form>
    </div>
        </form>
    </div>
</body>
<?php include 'footer.php'; ?>
</html>