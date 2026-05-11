<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

/**
 * Base class for all RecoverIQ mailables.
 * Provides shared config: from address, brand identity, helpers.
 */
abstract class BaseRecoverIQMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * All RecoverIQ mails share the same from address configured in .env.
     * Subclasses only need to define envelope() subject and content() view.
     */
    public function __construct()
    {
        $this->from(
            config('mail.from.address'),
            config('mail.from.name')
        );
    }
}
