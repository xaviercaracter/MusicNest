<?php
session_start();
include 'connect.php';
if (isset($_SESSION['username'])) {
    $username = $_SESSION['username'];
} else {
    $username = '';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" href="favicon.ico" type="image/x-icon">
</head>
<body>
    <?php include 'header.php'; ?>
    <div class="content-wrapper">
        <div class="left-list">
            <h4>Current Favorite Genre List</h4>
            <ul>
                <li>Rap</li>
                <li>Rock</li>
                <li>Country</li>
                <li>Pop</li>
            </ul>
        </div>

        <div class="main-content">
            <h3>Your Nest <?php echo $username; ?></h3>
            <form action="process_post.php" method="post">
                <textarea name="post_content" rows="4" cols="50" placeholder="Enter your post here"></textarea>
                <br>
                <input type="submit" value="Create Post">
            </form>

            <div class="user-posts">
                <?php
                $stmt = $pdo->prepare("SELECT users.username AS user_username, posts.username AS post_username, content, posts.created_at AS post_created_at FROM posts INNER JOIN users ON posts.username = users.username ORDER BY post_created_at DESC");
                $stmt->execute();

                while ($row = $stmt->fetch()) {
                    echo "<div class='post'>";
                    echo "<div class='user-info'>";
                    echo "<h3>" . $row['user_username'] . "</h3>"; // Use the alias to access the 'username' column from the 'users' table
                    echo "</div>";
                    echo "<p class='post-content'>" . $row['content'] . "</p>";
                    echo "</div>";
                }
                ?>
            </div>
        </div>

        <div class="right-list">
            <ul>
                <li>Search Genres and Music</li>
            </ul>
        </div>
    </div>
    <?php include 'footer.php'; ?>
</body>
</html>
