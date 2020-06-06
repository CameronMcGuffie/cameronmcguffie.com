<?php
	// Written By Cameron McGuffie
    // This is a script to show some PHP concepts
    
    // This is where the configuration comes from
    include("config.php");

    // Decode the data coming from Angular
    $_POST = (array) json_decode(file_get_contents('php://input'), true);

    // I"m going to add slashes here to try avoid injection attacks
    // I might do SQL later so it"s worth it.
	$from_email = addslashes($_POST["from"]);
	$subject = addslashes($_POST["subject"]);
	$body = addslashes($_POST["body"]);

	function fnSendMail($to, $from, $subject, $body) {    
        // Grab the senders IP address
        $sender_ip = $_SERVER["REMOTE_ADDR"];

        // Build a subject
    	$subject = "[Web Enquiry] " . $subject;
    
        // I"m going to make this plain text
        // It won"t look fancy but we don"t want
        // someone sending malicious code.
    	$header = "From: " . $from . "\r\n";
        $header .= "MIME-Version: 1.0\r\n";
        $header .= "Content-type: text/plain\r\n";

        // Append the IP address of the sender to the body
        $body = "Web enquiry from " . $sender_ip . "\n" . $body;

        // Send the mail and grab the result
        $mail_result = mail($to, $subject, $message, $body);

        if($mail_result) {
            // Return a HTTP OK
            http_response_code(200);
        } else {
            // Return an error
            http_response_code(400);
        }
    }

    // Perform some basic verification of the data coming in
    if($from_email && $subject && $body) {
        fnSendMail($EMAIL_RECIEVER, $from_email, $subject, $body);
    } else {
        // Something is missing
        http_response_code(400);
    }
?>