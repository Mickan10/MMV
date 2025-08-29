<?php
// Kontaktformulär – PHP-mailhantering

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['namn'], $data['email'], $data['meddelande'])) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Ogiltig förfrågan"]);
  exit;
}

$to = "mikaela.e.an@gmail.com"; 
$subject = "Kontaktformulär - Lokstallet";
$message = "Namn: " . $data['namn'] . "\n";
$message .= "E-post: " . $data['email'] . "\n";
$message .= "Meddelande:\n" . $data['meddelande'];
$headers = "From: " . $data['email'];

if (mail($to, $subject, $message, $headers)) {
  echo json_encode(["success" => true, "message" => "Meddelandet skickades!"]);
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Något gick fel, försök igen."]);
}
?>
