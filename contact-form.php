<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

function clean_text(?string $value): string
{
    $value = trim((string)$value);
    $value = strip_tags($value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    return mb_substr($value, 0, 1000);
}

$name = clean_text($_POST['name'] ?? '');
$email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = clean_text($_POST['phone'] ?? '');
$company = clean_text($_POST['company'] ?? '');
$service = clean_text($_POST['service'] ?? '');
$timeline = clean_text($_POST['timeline'] ?? '');
$budget = clean_text($_POST['budget'] ?? '');
$message = clean_text($_POST['message'] ?? '');

if ($name === '' || !$email || $company === '' || $service === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please complete all required fields.']);
    exit;
}

$to = 'hello@quantixglobalsolutions.com';
$subject = 'New website inquiry: ' . $service;

$bodyLines = [
    'Name: ' . $name,
    'Email: ' . $email,
    'Phone: ' . ($phone !== '' ? $phone : 'Not provided'),
    'Company: ' . $company,
    'Service: ' . $service,
    'Timeline: ' . ($timeline !== '' ? $timeline : 'Not provided'),
    'Budget: ' . ($budget !== '' ? $budget : 'Not provided'),
    '',
    'Message:',
    $message,
];

$body = implode("\n", $bodyLines);
$headers = "From: Quantix Global Solutions <hello@quantixglobalsolutions.com>\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Thank you. Your request was sent successfully.']);
    exit;
}

http_response_code(500);
echo json_encode(['success' => false, 'message' => 'Unable to send your request right now. Please email hello@quantixglobalsolutions.com.']);
