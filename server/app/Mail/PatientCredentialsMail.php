<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PatientCredentialsMail extends BaseRecoverIQMail
{
    public function __construct(
        public readonly User   $user,
        public readonly string $plainPassword,
        public readonly ?\App\Models\Appointment $appointment = null,
    ) {
        parent::__construct();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Welcome to RecoverIQ — Your Account Credentials');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.patient-credentials');
    }

    public function attachments(): array { return []; }
}
