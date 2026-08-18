<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

$kvUrl = getenv('KV_REST_API_URL');
$kvToken = getenv('KV_REST_API_TOKEN');

if (!$kvUrl || !$kvToken) {
    $filePath = __DIR__ . '/../data/textos.json';
    $jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if (file_put_contents($filePath, $jsonData)) {
        echo json_encode(['success' => true, 'message' => 'Guardado localmente']);
    } else {
        echo json_encode(['success' => false, 'error' => 'No se pudo guardar']);
    }
    exit;
}

$jsonData = json_encode($data);
$ch = curl_init($kvUrl . '/set/textos');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $kvToken
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true, 'message' => 'Textos guardados en Upstash Redis']);
} else {
    echo json_encode(['success' => false, 'error' => 'Error: ' . $response]);
}
?>