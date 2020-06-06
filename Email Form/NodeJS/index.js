const http = require('http');
const nodemailer = require('nodemailer');

async function sendEmail(to, from, subject, body) {
    return new Promise(function (resolve, reject) {
        // Thanks to https://stackabuse.com/how-to-send-emails-with-node-js/
        // This page gave me the info for nodemailer.

        let transport = nodemailer.createTransport({
            host: '192.168.100.12',
            port: 25,
            // auth: {
            //    user: 'put_your_username_here',
            //    pass: 'put_your_password_here'
            // },
            tls: {
                rejectUnauthorized: false // This is only for debugging! I added it because my cert isn't signed. Do not use in prod!
            }
        });

        const message = {
            from: from,
            to: to,
            subject: subject,
            text: body
        };

        transport.sendMail(message, function (err, info) {
            if (err) {
                console.log('Error sending message ' + err);
                resolve(false);
            } else {
                console.log('Message sent');
                resolve(true);
            }
        });
    });
}

async function runServer() {
    const emailPOSTServer = async function (request, response) {
        // We want them to post the data
        if (request.method == 'POST') {
            // Create a blank var to store the post.
            var body = ''

            // As data streams in, collect it.
            request.on('data', function (data) {
                body += data;
            })

            /*
                I'm expecting a JSON post from Angular like this:

                { 
                    "from": "E-mail address",
                    "subject": "A name or subject",
                    "body": "Body"
                }
            */
            request.on('end', async function () {
                try {
                    // Parse the JSON data so we can use it.
                    post_data = JSON.parse(body);

                    // Do some basic validation to make sure we got data back
                    if (post_data['from'] && post_data['subject'] && post_data['body']) {
                        // Log the info to the terminal for debgging.
                        console.log('E-mail: ' + post_data['from']);
                        console.log('Subject: ' + post_data['subject']);
                        console.log('Body: ' + post_data['body']);

                        // We use a promise so we can make sure nothing fails
                        var sendOK = await sendEmail('to_address', post_data['from'], post_data['subject'], post_data['body'])

                        // Check if our promise failed or not
                        if (sendOK == true) {
                            // Tell the sender the action was processed ok
                            response.writeHead(200, { 'Content-Type': 'text/html' });
                            response.end();
                        } else {
                            // Something went wrong and we couldn't send the message
                            console.log('Couldn\'t send message...');
                            response.writeHead(500);
                            response.end();
                        }
                    } else {
                        // We are missing some data
                        response.writeHead(400);
                        response.end();
                    }
                } catch {
                    // Something went wrong
                    response.writeHead(500);
                    response.end();
                }
            })
        } else {
            // They didn't send a post request
            response.writeHead(400);
            response.end();
        }
    }

    const server = http.createServer(emailPOSTServer);

    console.log('Listening on port 8080...');
    server.listen(8080);
}

runServer();