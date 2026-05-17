@extends('emails.layout')

@section('content')
<p class="greeting">Welcome, {{ $user->name }}! 👋</p>

<p class="text">
    Your patient account has been created on <strong>RecoverIQ</strong>. Use the temporary login details below to access your dashboard and view your appointment updates.
</p>

@if($appointment)
<div class="info-box" style="margin-top: 20px; background: #f0f7f4; border-color: #d1e7dd;">
    <p style="margin: 0 0 10px 0; font-weight: bold; color: #234032;">📅 Appointment Request</p>
    <div class="info-row">
        <span class="info-label">Date & Time</span>
        <span class="info-value">{{ $appointment->slot_at->format('M d, Y \a\t h:i A') }} (IST)</span>
    </div>
</div>
@endif

<div class="info-box" style="margin-top: 20px;">
    <div class="info-row">
        <span class="info-label">Email</span>
        <span class="info-value">{{ $user->email }}</span>
    </div>
    <div class="info-row">
        <span class="info-label">Password</span>
        <span class="info-code">{{ $plainPassword }}</span>
    </div>
</div>

<div class="note">
    ⚠️ This is a temporary password. Please change it immediately after your first login.
</div>

<p class="text">
    Once logged in, you'll be able to track your recovery milestones, view your program timeline,
    and book appointments with your assigned doctor.
</p>

<div class="btn-wrap">
    <a href="{{ config('app.frontend_url') }}/login" class="btn">Log In to RecoverIQ →</a>
</div>

<hr class="divider">

<p class="text" style="font-size: 13px; color: #999;">
    Need help? Contact your doctor or the RecoverIQ support team.
</p>
@endsection