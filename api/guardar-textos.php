<?php
/**
 * guardar-textos.php
 * Guarda los textos en Upstash Redis (Vercel)
 */

// =============================================
// 1. CONFIGURACIÓN CORS
// =============================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Content-Type: application/json');

// Responder a solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// =============================================
// 2. VERIFICAR QUE SEA POST
// =============================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

// =============================================
// 3. OBTENER DATOS ENVIADOS
// =============================================
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null) {
    echo json_encode(['success' => false, 'error' => 'Datos inválidos']);
    exit;
}

// =============================================
// 4. CONFIGURACIÓN DE UPASTASH REDIS
// =============================================
$kvUrl = getenv('KV_REST_API_URL');
$kvToken = getenv('KV_REST_API_TOKEN');

// Verificar que las variables de entorno existen
if (!$kvUrl || !$kvToken) {
    echo json_encode([
        'success' => false, 
        'error' => 'Variables de entorno no configuradas'
    ]);
    exit;
}

// =============================================
// 5. GUARDAR EN UPASTASH REDIS (¡CORREGIDO!)
// =============================================
$jsonData = json_encode($data);

// ⚠️ IMPORTANTE: La URL correcta para guardar en Upstash es:
// $kvUrl . '/set/textos'  (NO 'set/textos' sin barra)
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
$curlError = curl_error($ch);
curl_close($ch);

// =============================================
// 6. RESPONDER AL CLIENTE
// =============================================
if ($httpCode === 200 || $httpCode === 201) {
    echo json_encode(['success' => true, 'message' => 'Textos guardados en Upstash Redis']);
} else {
    echo json_encode([
        'success' => false, 
        'error' => 'Error HTTP: ' . $httpCode, 
        'response' => $response,
        'curl_error' => $curlError
    ]);
}
?>