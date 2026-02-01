<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["success" => false, "message" => "Only POST allowed"]);
  exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['namn'], $data['email'], $data['meddelande'])) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Alla fält måste fyllas i"]);
  exit;
}

$namn = trim($data['namn']);
$email = trim($data['email']);
$meddelande = trim($data['meddelande']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Ogiltig e-postadress"]);
  exit;
}

$to = "info@lokstallett.se";
$subject = "Kontaktformulär – Lokstallet";

$message =
  "Namn: $namn\n" .
  "E-post: $email\n\n" .
  "Meddelande:\n$meddelande\n";

$headers = "From: Lokstallet <info@lokstallett.se>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $message, $headers);

if ($sent) {
  echo json_encode(["success" => true]);
  exit;
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Kunde inte skicka mail"]);
  exit;
}
