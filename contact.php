<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
const CONTACT_TO = 'ammar.rajabi.web@gmail.com';
const CONTACT_FROM = 'portfolio@ammar-rajabi.com';
const SITE_NAME = 'Portfolio Ammar Rajabi';
function respond(bool $success,string $message,int $status=200):void{http_response_code($status);echo json_encode(['success'=>$success,'message'=>$message],JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);exit;}
function clean_field(string $value,int $max=5000):string{$value=trim($value);$value=preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u','',$value)??'';$value=strip_tags($value);if(function_exists('mb_substr'))$value=mb_substr($value,0,$max,'UTF-8');else $value=substr($value,0,$max);return $value;}
function clean_header(string $value,int $max=180):string{return str_replace(["\r","\n"],' ',clean_field($value,$max));}
if(($_SERVER['REQUEST_METHOD']??'')!=='POST')respond(false,'Method not allowed.',405);
if(trim((string)($_POST['website']??''))!=='')respond(true,'Message sent.');
$first=clean_header((string)($_POST['first_name']??''),80);$last=clean_header((string)($_POST['last_name']??''),80);$email=clean_header((string)($_POST['email']??''),180);$subject=clean_header((string)($_POST['subject']??''),120);$message=clean_field((string)($_POST['message']??''),5000);$lang=clean_header((string)($_POST['lang']??'fr'),5);
if($first===''||$last===''||$email===''||$message==='')respond(false,'Required fields are missing.',422);if(!filter_var($email,FILTER_VALIDATE_EMAIL))respond(false,'Invalid email address.',422);$len=function_exists('mb_strlen')?mb_strlen($message,'UTF-8'):strlen($message);if($len<10)respond(false,'Message is too short.',422);
$name=trim($first.' '.$last);$mailSubject='[Portfolio] '.($subject!==''?$subject:'New contact message');$body=implode("\n",['New message from ammar-rajabi.com','','Name: '.$name,'Email: '.$email,'Language: '.strtoupper($lang),'Subject: '.($subject!==''?$subject:'Not specified'),'','Message:',$message,'','Sent from: https://ammar-rajabi.com/','Date: '.date('Y-m-d H:i:s')]);$headers=['MIME-Version: 1.0','Content-Type: text/plain; charset=UTF-8','From: '.SITE_NAME.' <'.CONTACT_FROM.'>','Reply-To: '.$name.' <'.$email.'>','X-Mailer: PHP/'.phpversion()];$sent=mail(CONTACT_TO,$mailSubject,$body,implode("\r\n",$headers));if(!$sent)respond(false,'The server could not send the email.',500);respond(true,'Message sent.');
