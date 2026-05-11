<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class AppointmentConfirmationMail extends BaseRecoverIQMail
{
    public function __construct(
        public readonly Appointment $appointment,
        /**
         * Recipient name — could be a registered patient or a public guest.
         * Pass the display name directly so we don't need to conditionally
         * resolve the relationship here.
         */
        public readonly string $recipientName,
    ) {
        parent::__construct();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Appointment Confirmed — RecoverIQ');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.appointment-confirmation');
    }

    public function attachments(): array { return []; }
}
