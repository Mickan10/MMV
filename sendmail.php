<?php
header("Content-Type: application/json");

// Läs in JSON från POST
$input = file_get_contents("php://input");
$data = json_decode($input, true);

// Kolla om data finns
if (!$data || !isset($data["name"]) || !isset($data["email"])) {
    echo json_encode(["success" => false, "message" => "Ogiltig data"]);
    exit;
}

$name = htmlspecialchars($data["name"]);
$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);

// === SKICKA TILL ADMIN ===
$to = "info@lokstallet.se"; // ändra vid behov
$subject = "Ny bokningsförfrågan från $name";

// Bygg upp admin-mail i HTML
$message = "<h2>Ny bokningsförfrågan</h2>";
$message .= "<p><strong>Namn:</strong> $name<br>";
$message .= "<strong>E-post:</strong> $email</p>";
$message .= "<h3>Detaljer:</h3><ul>";

foreach ($data as $key => $value) {
    $safeKey = ucfirst(htmlspecialchars($key));
    $safeVal = nl2br(htmlspecialchars($value));
    $message .= "<li><strong>$safeKey:</strong> $safeVal</li>";
}

$message .= "</ul>";

// Headers för HTML-mail
$headers = "From: no-reply@lokstallet.se\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$mailSent = mail($to, $subject, $message, $headers);

// === SKICKA BEKRÄFTELSE TILL KUND ===
if ($mailSent) {
    $confirmSubject = "Tack för din bokningsförfrågan hos Lokstallet";
    
    // URL till loggan på servern (byt ut mot korrekt path)
    $logoUrl = "https://www.lokstallett.se//assets/lokstalletheader.png"; 

    $confirmMessage = "<div style='font-family:Arial,sans-serif;'>";
    $confirmMessage .= "<img src='$logoUrl' alt='Lokstallet' style='max-width:300px; margin-bottom:20px;'><br>";
    $confirmMessage .= "<h2>Hej $name!</h2>";
    $confirmMessage .= "<p>Tack för din förfrågan om att boka <strong>Lokstallet</strong>. 
    Vi återkommer så snart som möjligt med mer information.</p>";
    $confirmMessage .= "<h3>Vi har mottagit följande uppgifter:</h3><ul>";

    foreach ($data as $key => $value) {
        $safeKey = ucfirst(htmlspecialchars($key));
        $safeVal = nl2br(htmlspecialchars($value));
        $confirmMessage .= "<li><strong>$safeKey:</strong> $safeVal</li>";
    }

    $confirmMessage .= "</ul>";
    $confirmMessage .= "<p>Med vänliga hälsningar,<br><strong>Lokstallet Teamet</strong></p>";
    $confirmMessage .= "</div>";

    $confirmHeaders = "From: info@lokstallet.se\r\n";
    $confirmHeaders .= "Reply-To: info@lokstallet.se\r\n";
    $confirmHeaders .= "MIME-Version: 1.0\r\n";
    $confirmHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

    mail($email, $confirmSubject, $confirmMessage, $confirmHeaders);
}


echo json_encode(["success" => $mailSent]);
?>
