{{-- Shared branded layout for all RecoverIQ emails --}}
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'RecoverIQ' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background-color: #f5f2ec; font-family: 'Helvetica Neue', Arial, sans-serif; color: #2d2d2d; }
        .wrapper { max-width: 600px; margin: 40px auto; padding: 0 16px 60px; }
        .card { background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }

        /* Header */
        .header { background: #3d6b4f; padding: 32px 40px; text-align: center; }
        .header-logo { color: #ffffff; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
        .header-tagline { color: #a8c9b5; font-size: 13px; margin-top: 4px; }

        /* Body */
        .body { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #1e3829; margin-bottom: 16px; }
        .text { font-size: 15px; line-height: 1.7; color: #555; margin-bottom: 16px; }

        /* Info box */
        .info-box { background: #f0f4f0; border-left: 4px solid #3d6b4f; border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
        .info-row { display: flex; gap: 12px; margin-bottom: 10px; font-size: 14px; }
        .info-row:last-child { margin-bottom: 0; }
        .info-label { color: #888; min-width: 110px; font-weight: 500; }
        .info-value { color: #1e3829; font-weight: 600; }
        .info-code { background: #fff; border: 1px solid #d6e4d6; padding: 4px 12px; border-radius: 6px; font-family: monospace; font-size: 15px; color: #3d6b4f; letter-spacing: 1px; }

        /* CTA Button */
        .btn-wrap { text-align: center; margin: 32px 0 24px; }
        .btn { display: inline-block; background: #3d6b4f; color: #ffffff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-size: 15px; font-weight: 600; letter-spacing: 0.2px; }
        .btn:hover { background: #2f5440; }

        /* Warning/note */
        .note { background: #fffbea; border: 1px solid #f0d96e; border-radius: 8px; padding: 14px 18px; font-size: 13px; color: #7a6200; margin: 20px 0; }

        /* Footer */
        .footer { background: #f9f7f3; padding: 24px 40px; text-align: center; border-top: 1px solid #eee; }
        .footer p { font-size: 12px; color: #aaa; line-height: 1.6; }
        .footer a { color: #3d6b4f; text-decoration: none; }

        /* Divider */
        .divider { border: none; border-top: 1px solid #eee; margin: 24px 0; }

        @media (max-width: 600px) {
            .body { padding: 24px 20px; }
            .header { padding: 24px 20px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="card">
            <!-- Header -->
            <div class="header">
                <div class="header-logo">RecoverIQ</div>
                <div class="header-tagline">Your Recovery Journey Starts Here</div>
            </div>

            <!-- Body (injected by each template) -->
            <div class="body">
                @yield('content')
            </div>

            <!-- Footer -->
            <div class="footer">
                <p>
                    This email was sent by <strong>RecoverIQ</strong>.<br>
                    If you did not expect this email, you can safely ignore it.<br>
                    &copy; {{ date('Y') }} RecoverIQ. All rights reserved.
                </p>
            </div>
        </div>
    </div>
</body>
</html>
