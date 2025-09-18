<?php
// Kontaktformulär – PHP-mailhantering

// Tillåt fetch från alla domäner (för test)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Läs in JSON-data från POST
$data = json_decode(file_get_contents("php://input"), true);

// Kontrollera att fälten finns
if (!$data || !isset($data['namn'], $data['email'], $data['meddelande'])) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Ogiltig förfrågan"]);
    exit;
}

// Mottagare
$to = "mikaela.e.an@gmail.com"; // hit kommer mejlet
$subject = "Kontaktformulär - Lokstallet";

// Skapa meddelandet
$message = "Namn: " . $data['namn'] . "\n";
$message .= "E-post: " . $data['email'] . "\n";
$message .= "Meddelande:\n" . $data['meddelande'];

// Viktigt: From måste vara en adress på din domän
$headers = "From: info@lokstallet.se\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";

$mailSent = mail($to, $subject, $message, $headers);

if ($mailSent) {
    echo json_encode(["success" => true, "message" => "Meddelandet skickades!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Något gick fel, försök igen."]);
}
?>
