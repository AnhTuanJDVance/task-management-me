export class MailTemplate {

    static forgotPassword(

        fullName: string,

        otp: string

    ) {

        return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

</head>

<body style="

margin:0;

padding:0;

background:#f4f6f9;

font-family:Arial,sans-serif;

">

<div style="

max-width:600px;

margin:40px auto;

background:white;

border-radius:12px;

overflow:hidden;

box-shadow:0 10px 30px rgba(0,0,0,.1);

">

<div style="

background:#2563eb;

padding:30px;

text-align:center;

color:white;

">

<h1>

Task Management

</h1>

<p>

Forgot Password

</p>

</div>

<div style="padding:40px;">

<h2>

Hello ${fullName}

</h2>

<p>

We received a request to reset your password.

</p>

<p>

Your OTP is

</p>

<div style="

text-align:center;

margin:30px 0;

">

<span style="

padding:20px 40px;

background:#2563eb;

color:white;

font-size:36px;

font-weight:bold;

letter-spacing:10px;

border-radius:10px;

display:inline-block;

">

${otp}

</span>

</div>

<p>

OTP expires in

<strong>

5 minutes

</strong>

</p>

<p>

If you didn't request this,

please ignore this email.

</p>

</div>

<div style="

padding:20px;

background:#f8fafc;

text-align:center;

font-size:12px;

color:#777;

">

© Task Management

</div>

</div>

</body>

</html>

`;

    }

}