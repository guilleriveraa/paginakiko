<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$kvUrl = getenv('KV_REST_API_URL');
$kvToken = getenv('KV_REST_API_TOKEN');

if (!$kvUrl || !$kvToken) {
    $filePath = __DIR__ . '/../data/textos.json';
    if (file_exists($filePath)) {
        echo file_get_contents($filePath);
    } else {
        $defaultFile = __DIR__ . '/../data/textos-default.json';
        if (file_exists($defaultFile)) {
            echo file_get_contents($defaultFile);
        } else {
            echo json_encode(['error' => 'No hay datos']);
        }
    }
    exit;
}

$ch = curl_init($kvUrl . '/get/textos');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $kvToken
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 && $response) {
    echo $response;
} else {
    $defaultFile = __DIR__ . '/../data/textos-default.json';
    if (file_exists($defaultFile)) {
        echo file_get_contents($defaultFile);
    } else {
        echo json_encode(['error' => 'No hay datos disponibles']);
    }
}
?>