<?php

require_once 'core.php';

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Viewer</title>
</head>
<body>

    <fieldset>
        <legend>GET</legend>
        <form action="index.php" method="get">
            <input type="text" name="username" id="">
            <input type="password" name="password" id="">
            <input type="date" name="date" id="">
            <input type="submit" value="Submit">
        </form>
    </fieldset>

    <fieldset>
        <legend>POST</legend>
        <form action="index.php" method="post">
            <input type="text" name="username" id="">
            <input type="password" name="password" id="">
            <input type="date" name="date" id="">
            <input type="submit" value="Submit">
        </form>
    </fieldset>
    
</body>
</html>