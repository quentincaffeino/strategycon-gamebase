<?php

if (getenv("APP_ENV") === 'development') {
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);
}

define('STEAM_APPREVIEW_API_ENDPOINT', 'https://store.steampowered.com/appreviews');
if (getenv("APP_ENV") === 'development') {
	define('CORS_ALLOWED_ORIGINS', ['http://localhost:8085']);
} else {
	define('CORS_ALLOWED_ORIGINS', ['https://strategycon.ru', 'http://strategycon.ru']);
}
define('CORS_ALLOWED_METHODS', ['GET', 'OPTIONS']);

//send response header
function responseHeader($code, $msg)
{
	$phpSapiName = substr(php_sapi_name(), 0, 3);
	if ($phpSapiName == 'cgi' || $phpSapiName == 'fpm') {
		header('Status: ' . $code . ' ' . $msg);
	} else {
		$protocol = isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0';
		header($protocol . ' ' . $code . ' ' . $msg);
	}
}

//catch cookies
$firstLine = null;
function catchHeaders($ch, $headerLine)
{
	global $firstLine;
	if (!$firstLine) $firstLine = $headerLine;
	return strlen($headerLine); // Needed by curl
}

//make api call
function createCurlApiRequest($path, $data, $cookie = null)
{
	$request = curl_init($path);
	//method has to be post or put
	curl_setopt($request, CURLOPT_CUSTOMREQUEST, 'POST');
	curl_setopt($request, CURLOPT_POSTFIELDS, $data);
	curl_setopt($request, CURLOPT_RETURNTRANSFER, true);
	curl_setopt(
		$request,
		CURLOPT_HTTPHEADER,
		array(
			'Content-Type: application/json',
			'Content-Length: ' . strlen($data)
		)
	);

	if ($cookie) {
		curl_setopt($request, CURLOPT_COOKIESESSION, true);
		curl_setopt($request, CURLOPT_COOKIE, $cookie);
	}
	curl_setopt($request, CURLOPT_HEADERFUNCTION, "catchHeaders");

	return $request;
}

try {
	switch ($_SERVER["REQUEST_METHOD"]) {
		case "GET":
			$body = file_get_contents('php://input');
			// $cookie = empty($_COOKIE[$cookie_name]) ? '' : $_COOKIE[$cookie_name];

			$path_parts = array_slice(explode("/", $_SERVER['PATH_INFO']), 1);
			if (count($path_parts) != 1) {
				throw new Exception("Wrong number of path arguments");
			}
			$steamGameId = (int)$path_parts[0];
			if (!$steamGameId) {
				throw new Exception("Wrong game id");
			}

			$path = STEAM_APPREVIEW_API_ENDPOINT . '/' . $steamGameId . '?json=1&language=all';

			$request = createCurlApiRequest($path, $body/*, $remote_cookie_name . '=' . $cookie*/);

			$result = curl_exec($request);
			$status = explode(" ", $firstLine, 3);
			if ($result !== false) {
				$info = curl_getinfo($request);
				responseHeader($info['http_code'], $status[2]);
				header('Content-type: ' . $info['content_type']);
				echo $result;
			} else {
				responseHeader(500, 'Failed to reach api backend.');
				echo "{}";
			}
			break;

		case "OPTIONS":
			if (!isset($_SERVER['HTTP_ORIGIN'])) {
				error_log('Missing origin');
				responseHeader(500, 'Missing origin');
				return;
			}

			$httpOrigin = $_SERVER['HTTP_ORIGIN'];

			if (!in_array($httpOrigin, CORS_ALLOWED_ORIGINS)) {
				error_log('Wrong origin');
				return;
			}

			header('Access-Control-Allow-Credentials: false');
			header('Access-Control-Allow-Origin: ' . $httpOrigin);
			header('Access-Control-Request-Method: ' . implode(', ', CORS_ALLOWED_METHODS));
			break;

		default:
			throw new Exception("Unsupported method.");
	}
} catch (Exception $e) {
	error_log($e->getMessage());
	echo json_encode(["error" => true, "message" => $e->getMessage()]);
}
