<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class DoctorVerificationMail extends BaseRecoverIQMail
{
    public function __construct(
        public readonly User   $user,
        public readonly string $verificationUrl,
    ) {
        parent::__construct();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Verify Your RecoverIQ Doctor Profile');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.doctor-verification');
    }

    public function attachments(): array { return []; }
}
