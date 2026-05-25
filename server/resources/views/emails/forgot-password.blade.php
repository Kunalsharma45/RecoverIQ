@extends('emails.layout')

@section('content')
<p class="greeting">Reset Your Password 🔐</p>

<p class="text">
    Hi <strong>{{ $user->name }}</strong>, we received a request to reset the password
    for your RecoverIQ account. Click the button below to set a new password.
</p>

<p class="text">
    Your reset code is:
</p>

<div class="note" style="font-size: 20px; font-weight: 700; letter-spacing: 2px; text-align: center;">
    {{ $resetToken }}
</div>

<div class="btn-wrap">
    <a href="{{ config('app.frontend_url') }}/reset-password?token={{ $resetToken }}&email={{ urlencode($user->email) }}"
        class="btn">Reset My Password →</a>
</div>

<div class="note">
    ⏱️ This link expires in <strong>60 minutes</strong>. If you did not request a password reset,
    no action is needed — your account remains secure.
</div>

<hr class="divider">

<p class="text" style="font-size: 13px; color: #999;">
    If the button above doesn't work, copy and paste this link into your browser:<br>
    <span style="word-break: break-all; color: #3d6b4f;">
        {{ config('app.frontend_url') }}/reset-password?token={{ $resetToken }}&email={{ urlencode($user->email) }}
    </span>
</p>
@endsection