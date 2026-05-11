@extends('emails.layout')

@section('content')
    <p class="greeting">Verify Your Doctor Profile 🩺</p>

    <p class="text">
        Hi <strong>{{ $user->name }}</strong>, welcome to RecoverIQ!
        Your doctor account has been created by an administrator. Please verify your email address
        to activate your profile and start managing patients.
    </p>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Account</span>
            <span class="info-value">{{ $user->email }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Role</span>
            <span class="info-value">Doctor</span>
        </div>
    </div>

    <div class="btn-wrap">
        <a href="{{ $verificationUrl }}" class="btn">Verify My Profile →</a>
    </div>

    <div class="note">
        ⏱️ This verification link expires in <strong>24 hours</strong>.
        After verifying, you can log in using the credentials shared by your administrator.
    </div>

    <hr class="divider">

    <p class="text" style="font-size: 13px; color: #999;">
        If you did not expect this email, please contact the RecoverIQ administrator.
        This link can only be used once.
    </p>
@endsection
