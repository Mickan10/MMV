<?php
// Ställ in rätt headers för CORS om behövs (kan behövas i vissa fall)
// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json; charset=UTF-8");

// Läs in JSON-data från POST
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Ingen data mottagen"]);
    exit;
}

// Hämta variabler
$local = $data['local'] ?? '';
$eventType = $data['eventType'] ?? '';
$otherEventDescription = $data['otherEventDescription'] ?? '';
$audioTech = $data['audioTech'] ?? '';
$lightTech = $data['lightTech'] ?? '';
$extraPersonnel = $data['extraPersonnel'] ?? 0;
$catering = $data['catering'] ?? '';
$price = $data['price'] ?? 0;
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$customerType = $data['customerType'] ?? '';
$orgNumber = $data['orgNumber'] ?? '';
$phone = $data['phone'] ?? '';

// Validering (t.ex. kolla så viktiga fält finns)
if (!$name || !$email) {
    echo json_encode(["success" => false, "message" => "Namn och e-post krävs"]);
    exit;
}

// Skapa mailinnehåll
$to = "info@lokstallet.se";
$subject = "Bokningsförfrågan från webbplatsen";

$message = "Bokningsförfrågan:\n\n";
$message .= "Lokal: $local\n";
$message .= "Evenemangstyp: $eventType\n";
if ($eventType === "annat") {
    $message .= "Beskrivning: $otherEventDescription\n";
}
$message .= "Ljudtekniker: $audioTech\n";
$message .= "Ljustekniker: $lightTech\n";
$message .= "Extra personal: $extraPersonnel\n";
$message .= "Catering: $catering\n";
$message .= "Totalpris: $price SEK\n\n";
$message .= "Kontaktuppgifter:\n";
$message .= "Namn: $name\n";
$message .= "E-post: $email\n";
$message .= "Typ av kund: $customerType\n";
$message .= "Organisationsnummer: $orgNumber\n";
$message .= "Telefon: $phone\n";

// Sätt header för från-adress
$headers = "From: $email\r\n";
$headers .= "Reply-To: $email\r\n";

$mailSent = mail($to, $subject, $message, $headers);

if ($mailSent) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Misslyckades att skicka e-post"]);
}
?>
