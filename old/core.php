<?php

// logsAdd(200, "test", "INFO");

logs("test.log", "test");

/**
 * Logs a message with various details to a specified file.
 *
 * @param string $pathLogs The path to the log file.
 * @param string $message The message to be logged. Defaults to "-".
 * @param int $statusCode The HTTP status code. Defaults to 200.
 * @param string $logType The type of log. Defaults to "INFO".
 * @return void
 */
function logs($pathLogs, $message = "-", $statusCode = 200, $logType = "INFO")
{

    $uniqid = uniqid();
    $timestamp = date("Y-m-d H:i:s.u");
    $ipv4 = isValidIpAddress($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : "-";

    $httpMethod = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'HTTPS' : 'HTTP';

    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' ? 'https://' : 'http://';
    $pathShow = isset($_SERVER['REQUEST_URI']) ? $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'] : "-";
    $pathShowWithoutQuery = isset($_SERVER['REQUEST_URI']) ? $protocol . $_SERVER['HTTP_HOST'] . parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : "-";
    $pathReal = isset($_SERVER['SCRIPT_NAME']) ? $protocol . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_NAME'] : "-";
    if ($pathShowWithoutQuery === $pathReal) {
        $pathReal = "-";
    }

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $requestMethod = "GET";
            // $_GET peut être vide même si la méthode est GET
            $data = !empty($_GET) ? $_GET : '-';
            break;

        case 'POST':
            $requestMethod = "POST";
            // $_POST peut également être vide même si la méthode est POST
            $data = !empty($_POST) ? $_POST : '-';
            break;

        case 'PUT':
            $requestMethod = "PUT";
            // Récupérer les données de la requête PUT
            $putData = file_get_contents('php://input');
            parse_str($putData, $data);
            $data = !empty($data) ? $data : '-';
            break;

        case 'DELETE':
            $requestMethod = "DELETE";
            // Récupérer les données de la requête DELETE
            $deleteData = file_get_contents('php://input');
            parse_str($deleteData, $data);
            $data = !empty($data) ? $data : '-';
            break;

        default:
            $requestMethod = "-";
            $data = "-";
            break;
    }

    if($data != "-"){
        $response = [
            'data' => $data
        ];
    
        $responseOutput = json_encode($response);
    } else{
        $responseOutput = "-";
    }

    $contentToAdd = "[$statusCode] [$uniqid] $timestamp $ipv4 [$logType] $message [$httpMethod] [$pathShow] ($pathReal) $requestMethod $responseOutput";

    prependToFile($pathLogs, $contentToAdd);
}

/**
 * Checks if the given IP address is valid.
 *
 * @param string $ip The IP address to validate.
 * @return bool Returns true if the IP address is valid, false otherwise.
 */
function isValidIpAddress($ip)
{
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false) {
        return true;
    }
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) !== false) {
        return true;
    }
    return false;
}

/**
 * Prepends new content to the beginning of a file.
 *
 * @param string $filePath The path to the file.
 * @param string $newContent The content to be prepended.
 * @return bool Returns true if the content was successfully prepended, false otherwise.
 */
function prependToFile($filePath, $newContent)
{
    if (!file_exists($filePath)) {
        return false;
    }
    $currentContent = file_get_contents($filePath);
    $file = fopen($filePath, 'w');
    if ($file === false) {
        return false;
    }
    fwrite($file, $newContent . PHP_EOL);
    fwrite($file, $currentContent);
    fclose($file);
    return true;
}














// function logsAdd($statusCode, $message, $logType, $url = null, $ip = "-", $data = [])
// {
//     $path = "test.log";
//     $uniqueId = uniqid();
//     $timestamp = date("Y-m-d H:i:s") . '.' . str_pad(mt_rand(0, 999), 3, '0', STR_PAD_LEFT);

//     // Récupération automatique du chemin du fichier
//     $filePath = $_SERVER['SCRIPT_NAME'];

//     // Récupération automatique de la méthode HTTP
//     if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
//         $httpMethod = 'HTTPS';
//     } else {
//         $httpMethod = 'HTTP';
//     }

//     // Préparer l'IP
//     $ip = !empty($ip) ? $ip : "-";

//     // Préparer les données GET/POST
//     $dataString = "-";
//     if (!empty($data)) {
//         $jsonEncodedData = json_encode($data);
//         $dataString = $httpMethod == 'POST' ? "json" . $jsonEncodedData : "json" . $jsonEncodedData;
//     }

//     // Préparer l'URL, si différente de celle par défaut
//     $formattedUrl = ($url && $url !== $filePath) ? " ($url)" : "";

//     // Format du log
//     $logEntry = sprintf(
//         "[%d] [%s] %s %s [%s] %s [%s] [%s]%s [%s] %s",
//         $statusCode,
//         $uniqueId,
//         $timestamp,
//         $ip,
//         strtoupper($logType),
//         $message,
//         strtoupper($httpMethod),
//         $filePath,
//         $formattedUrl,
//         $httpMethod,
//         $dataString
//     );

//     // Lire le contenu actuel du fichier
//     $currentContent = file_exists($path) ? file_get_contents($path) : "";

//     // Préparer le nouveau contenu avec le log au début
//     $newContent = $logEntry . PHP_EOL . $currentContent;

//     // Écrire le nouveau contenu dans le fichier
//     file_put_contents($path, $newContent);
// }
