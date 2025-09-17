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

$name = strip_tags($data["name"]);
$email = filter_var($data["email"], FILTER_SANITIZE_EMAIL);

// Spara i en fil (enkelt, byt till databas sen om du vill)
$file = __DIR__ . "/leads.txt";
$line = date("Y-m-d H:i") . " | $name | $email\n";
file_put_contents($file, $line, FILE_APPEND);

echo json_encode(["success" => true, "message" => "Lead sparad"]);
?>
