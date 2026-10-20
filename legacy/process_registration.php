<?php
    //start PHP session
    session_start();
  
    //check if register form is submitted
    if(isset($_POST['register'])){
        //assign variables to post values
        $email = $_POST['email'];
        $username = $_POST['username'];
        $password = $_POST['password'];
        $confirm = $_POST['confirm'];

        if (!preg_match($emailPattern, $email)) {
            // Return the values to the user
            $_SESSION['email'] = $email;
            $_SESSION['username'] = $username;
            $_SESSION['password'] = $password;
            $_SESSION['confirm'] = $confirm;
    
            // Display an error message for an invalid email format
            $_SESSION['error'] = 'Invalid email format';
            }
            else if($password != $confirm){ //check if password matches confirm password
                //return the values to the user
                $_SESSION['email'] = $email;
                $_SESSION['username'] = $username;
                $_SESSION['password'] = $password;
                $_SESSION['confirm'] = $confirm;
  
            //display error
            $_SESSION['error'] = 'Passwords did not match';
        }
            else{
                //include our database connection
                include 'connect.php';
    
                //check if the username is already taken
                $stmt = $pdo->prepare('SELECT * FROM users WHERE username = :username');
                $stmt->execute(['username' => $username]);
    
                if($stmt->rowCount() > 0){
                    //return the values to the user
                    $_SESSION['email'] = $email;
                    $_SESSION['username'] = $username;
                    $_SESSION['password'] = $password;
                    $_SESSION['confirm'] = $confirm;
    
                    //display error
                    $_SESSION['error'] = 'username already taken';
                } else {
                        //encrypt password using password_hash()
                        $password = password_hash($password, PASSWORD_DEFAULT);
        
                        //insert new user to our database
                        $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (:username, :email, :password)');
        
                        try{
                            $stmt->execute(['username' => $username, 'email' => $email, 'password' => $password]);
        
                            $_SESSION['success'] = 'User verified. You can <a href="login.php">login</a> now';
                        }
                        catch(PDOException $e){
                            $_SESSION['error'] = $e->getMessage();
                        }
        
                    }
  
        }
  
    }
    else{
        $_SESSION['error'] = 'Fill up registration form first';
    }
  
    header('location: login.php');
?>