<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Upload-Token");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Enkel skyddsnyckel – ändra detta till något eget
define("UPLOAD_TOKEN", "lokstallet-upload-2024");

$token = $_SERVER["HTTP_X_UPLOAD_TOKEN"] ?? "";
if ($token !== UPLOAD_TOKEN) {
    http_response_code(403);
    echo json_encode(["error" => "Ej behörig."]);
    exit();
}

if (!isset($_FILES["image"])) {
    http_response_code(400);
    echo json_encode(["error" => "Ingen fil skickades."]);
    exit();
}

$file = $_FILES["image"];

// Validera filtyp
$allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file["tmp_name"]);
finfo_close($finfo);

if (!in_array($mime, $allowed)) {
    http_response_code(400);
    echo json_encode(["error" => "Otillåten filtyp. Använd JPG, PNG, WebP eller GIF."]);
    exit();
}

// Max 5 MB
if ($file["size"] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(["error" => "Filen är för stor. Max 5 MB."]);
    exit();
}

// Skapa mapp om den inte finns
$uploadDir = __DIR__ . "/bilder/event/";
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Unikt filnamn
$ext = pathinfo($file["name"], PATHINFO_EXTENSION);
$filename = uniqid("event-", true) . "." . strtolower($ext);
$dest = $uploadDir . $filename;

if (!move_uploaded_file($file["tmp_name"], $dest)) {
    http_response_code(500);
    echo json_encode(["error" => "Kunde inte spara filen."]);
    exit();
}

$baseUrl = "https://www.lokstallett.se/bilder/event/" . $filename;
echo json_encode(["url" => $baseUrl]);
