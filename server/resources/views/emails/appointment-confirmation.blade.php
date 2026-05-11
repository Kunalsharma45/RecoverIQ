@extends('emails.layout')

@section('content')
    <p class="greeting">Appointment Confirmed ✅</p>

    <p class="text">
        Hi <strong>{{ $recipientName }}</strong>, your appointment with
        <strong>Dr. {{ $appointment->doctor->user->name }}</strong> has been booked.
        Here are the details:
    </p>

    <div class="info-box">
        <div class="info-row">
            <span class="info-label">Doctor</span>
            <span class="info-value">Dr. {{ $appointment->doctor->user->name }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Specialization</span>
            <span class="info-value">{{ $appointment->doctor->specialization }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Date & Time</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($appointment->slot_at)->format('D, d M Y \a\t h:i A') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value" style="text-transform: capitalize;">{{ $appointment->status }}</span>
        </div>
        @if($appointment->notes)
        <div class="info-row">
            <span class="info-label">Notes</span>
            <span class="info-value">{{ $appointment->notes }}</span>
        </div>
        @endif
    </div>

    <p class="text">
        Please arrive 10 minutes before your scheduled time. If you need to reschedule or cancel,
        contact us as soon as possible.
    </p>

    @if($appointment->patient_id)
    <div class="btn-wrap">
        <a href="{{ config('app.frontend_url') }}/patient/appointments" class="btn">View My Appointments →</a>
    </div>
    @endif

    <hr class="divider">

    <p class="text" style="font-size: 13px; color: #999;">
        Appointment ID: #{{ $appointment->id }}. Keep this email for your records.
    </p>
@endsection
