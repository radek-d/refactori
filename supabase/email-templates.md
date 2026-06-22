# Refactori — Supabase Email Templates

Customize your project verification and transaction emails in the Supabase Dashboard.
Go to: **Supabase Dashboard > Project > Auth > Email Templates**

---

## ✉️ Confirm Signup (Potwierdzenie rejestracji)

### Subject
`Welcome to Refactori! Confirm your account`

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Signup</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0d19;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: #111428;
      border: 1px solid #22294f;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: #7c5cfc;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .content p {
      color: #cbd5e1;
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      background-color: #7c5cfc;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(124, 92, 252, 0.35);
      transition: background-color 0.2s ease;
    }
    .footer {
      padding: 24px 30px;
      background: #0d1020;
      border-top: 1px solid #1a1e3a;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
      color: #7c5cfc;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Refactori</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for signing up for Refactori. We use AI to refactor your CV to perfectly match specific IT job postings and bypass ATS systems.</p>
      <p>Please confirm your email address by clicking the button below:</p>
      <div class="btn-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Confirm Email Address</a>
      </div>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>Best regards,<br>The Refactori Team</p>
    </div>
    <div class="footer">
      &copy; 2026 Refactori. All rights reserved.<br>
      Automated Resume Refactoring for Tech Professionals.
    </div>
  </div>
</body>
</html>
```

---

## ✉️ Magic Link (Logowanie linkiem)

### Subject
`Your Refactori Magic Login Link`

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magic Login Link</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0d19;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: #111428;
      border: 1px solid #22294f;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: #7c5cfc;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .content p {
      color: #cbd5e1;
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      background-color: #7c5cfc;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(124, 92, 252, 0.35);
    }
    .footer {
      padding: 24px 30px;
      background: #0d1020;
      border-top: 1px solid #1a1e3a;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Refactori</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Use the link below to sign in to your Refactori account securely. This link is valid for 15 minutes and can only be used once.</p>
      <div class="btn-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Log In to Refactori</a>
      </div>
      <p>If you didn't request this link, you can safely ignore this email.</p>
      <p>Best regards,<br>The Refactori Team</p>
    </div>
    <div class="footer">
      &copy; 2026 Refactori. All rights reserved.
    </div>
  </div>
</body>
</html>
```

---

## ✉️ Reset Password (Reset hasła)

### Subject
`Reset your Refactori password`

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b0d19;
      color: #e2e8f0;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 580px;
      margin: 40px auto;
      background: #111428;
      border: 1px solid #22294f;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: #7c5cfc;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .content {
      padding: 40px 30px;
      line-height: 1.6;
    }
    .content p {
      color: #cbd5e1;
      font-size: 16px;
      margin-top: 0;
      margin-bottom: 24px;
    }
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }
    .btn {
      display: inline-block;
      background-color: #7c5cfc;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(124, 92, 252, 0.35);
    }
    .footer {
      padding: 24px 30px;
      background: #0d1020;
      border-top: 1px solid #1a1e3a;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Refactori</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset the password for your Refactori account. Click the button below to choose a new password:</p>
      <div class="btn-container">
        <a href="{{ .ConfirmationURL }}" class="btn">Reset Password</a>
      </div>
      <p>If you didn't request a password reset, you can safely ignore this email and your password will remain unchanged.</p>
      <p>Best regards,<br>The Refactori Team</p>
    </div>
    <div class="footer">
      &copy; 2026 Refactori. All rights reserved.
    </div>
  </div>
</body>
</html>
```
