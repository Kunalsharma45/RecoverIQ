<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class ForgotPasswordMail extends BaseRecoverIQMail
{
    public function __construct(
        public readonly User   $user,
        public readonly string $resetToken,
    ) {
        parent::__construct();
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Reset Your RecoverIQ Password');
    }

    public function content(): Content
    {
        return new Content(view: 'emails.forgot-password');
    }

    public function attachments(): array { return []; }
}
