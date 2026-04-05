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

if (!$data) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Ogiltig data"]);
  exit;
}

$adminTo = "info@lokstallett.se";
$type = isset($data["type"]) ? $data["type"] : "booking";

$name  = isset($data["name"])  ? htmlspecialchars(trim($data["name"]))  : "";
$email = isset($data["email"]) ? filter_var(trim($data["email"]), FILTER_SANITIZE_EMAIL) : "";

if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "Namn och e-post krävs"]);
  exit;
}

$headers  = "From: Lokstallet <no-reply@lokstallett.se>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

// ── Hjälpfunktion: oversätt nycklar till svenska ─────────────────
function labelFor($key) {
  $labels = [
    "name"             => "Namn",
    "email"            => "E-post",
    "local"            => "Lokal",
    "antalPersoner"    => "Antal personer",
    "mobling"          => "Möblering",
    "eventType"        => "Evenemangstyp",
    "otherEventDescription" => "Beskrivning",
    "audioTech"        => "Ljudtekniker",
    "lightTech"        => "Ljustekniker",
    "extraPersonnel"   => "Extra personal",
    "catering"         => "Catering",
    "estimatedPrice"   => "Beräknat pris",
    "price"            => "Pris",
    "date"             => "Datum",
    "phone"            => "Telefon",
    "customerType"     => "Kundtyp",
    "orgNumber"        => "Organisationsnummer",
  ];
  return isset($labels[$key]) ? $labels[$key] : ucfirst($key);
}

$skipKeys = ["type"];

// ── Bygg detaljtabell ────────────────────────────────────────────
function buildTable($data, $skipKeys) {
  $rows = "";
  foreach ($data as $key => $value) {
    if (in_array($key, $skipKeys)) continue;
    $label = labelFor($key);
    $val   = nl2br(htmlspecialchars((string)$value));
    if ($key === "estimatedPrice" || $key === "price") {
      $val = number_format((float)$value, 0, ",", " ") . " SEK";
    }
    $rows .= "<tr>
      <td style='padding:6px 12px 6px 0;font-weight:600;color:#7a5c2e;white-space:nowrap;vertical-align:top;'>$label</td>
      <td style='padding:6px 0;color:#382615;'>$val</td>
    </tr>";
  }
  return "<table style='border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;'>$rows</table>";
}

$table = buildTable($data, $skipKeys);

// ════════════════════════════════════════════════════════════════
//  LEAD – någon beräknade pris men har inte bokat
// ════════════════════════════════════════════════════════════════
if ($type === "lead") {
  $subject = "Prisförfrågan (ej bokning) – $name";

  $adminMsg  = "<div style='font-family:Arial,sans-serif;color:#382615;'>";
  $adminMsg .= "<h2 style='color:#7a5c2e;'>🔔 Prisförfrågan – ingen bokning ännu</h2>";
  $adminMsg .= "<p><strong>$name</strong> ($email) kollade pris men slutförde ingen bokning.</p>";
  $adminMsg .= $table;
  $adminMsg .= "<p style='margin-top:16px;font-size:13px;color:#888;'>Detta är ett automatiskt lead-mejl från bokningssidan.</p>";
  $adminMsg .= "</div>";

  $sent = mail($adminTo, $subject, $adminMsg, $headers);
  echo json_encode(["success" => (bool)$sent]);
  exit;
}

// ════════════════════════════════════════════════════════════════
//  BOOKING – fullständig bokningsförfrågan
// ════════════════════════════════════════════════════════════════
$subject   = "Bokningsförfrågan – $name";

// Mejl till Lokstallet
$adminMsg  = "<div style='font-family:Arial,sans-serif;color:#382615;'>";
$adminMsg .= "<h2 style='color:#7a5c2e;'>📅 Ny bokningsförfrågan</h2>";
$adminMsg .= "<p>Från: <strong>$name</strong> ($email)</p>";
$adminMsg .= $table;
$adminMsg .= "</div>";

$adminSent = mail($adminTo, $subject, $adminMsg, $headers);

// Bekräftelsemejl till kunden
if ($adminSent) {
  $logoUrl = "https://www.lokstallett.se/assets/lokstalletheader.png";

  $confirmSubject = "Tack för din bokningsförfrågan – Lokstallet";

  $confirmHeaders  = "From: Lokstallet <info@lokstallett.se>\r\n";
  $confirmHeaders .= "Reply-To: info@lokstallett.se\r\n";
  $confirmHeaders .= "MIME-Version: 1.0\r\n";
  $confirmHeaders .= "Content-Type: text/html; charset=UTF-8\r\n";

  $confirmMsg  = "<div style='font-family:Arial,sans-serif;color:#382615;max-width:600px;'>";
  $confirmMsg .= "<img src='$logoUrl' alt='Lokstallet' style='max-width:260px;margin-bottom:20px;'><br>";
  $confirmMsg .= "<h2>Hej $name!</h2>";
  $confirmMsg .= "<p>Tack för din bokningsförfrågan. Vi återkommer så snart som möjligt.</p>";
  $confirmMsg .= "<h3 style='color:#7a5c2e;'>Dina uppgifter:</h3>";
  $confirmMsg .= $table;
  $confirmMsg .= "<p style='margin-top:24px;'>Med vänliga hälsningar,<br><strong>Lokstallet</strong></p>";
  $confirmMsg .= "</div>";

  mail($email, $confirmSubject, $confirmMsg, $confirmHeaders);
}

echo json_encode(["success" => (bool)$adminSent]);
?>
