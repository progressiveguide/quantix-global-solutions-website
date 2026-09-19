<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method not allowed.']); exit; }
function clean($value) { return trim(strip_tags($value ?? '')); }
$name=clean($_POST['name']); $email=filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL); $company=clean($_POST['company']); $service=clean($_POST['service']); $message=clean($_POST['message']);
if (!$name || !$email || !$service || !$message) { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Please complete all required fields.']); exit; }
$to='hello@quantixglobalsolutions.com';
$subject='New Quantix website inquiry: '.$service;
$body="Name: $name\nEmail: $email\nCompany: ".($company ?: 'Not provided')."\nService: $service\n\nMessage:\n$message\n";
$headers="From: Quantix Global Solutions <hello@quantixglobalsolutions.com>\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8\r\n";
if (mail($to,$subject,$body,$headers)) echo json_encode(['success'=>true,'message'=>'Thank you — your request has been sent. We will be in touch soon.']); else { http_response_code(500); echo json_encode(['success'=>false,'message'=>'We could not send your request. Please email hello@quantixglobalsolutions.com.']); }
?>