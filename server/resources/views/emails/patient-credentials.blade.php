@extends('emails.layout')

@section('content')
    <p class="greeting">Welcome, {{ $user->name }}! 👋</p>

    <p class="text">
        Your doctor has enrolled you in a recovery program on <strong>RecoverIQ</strong>.
        Use the credentials below to access your patient dashboard.
    </p>

    <div class="info-box">
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
