<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;

$emails = ['sarah.mitchell@recoveriq.com', 'james.okonkwo@recoveriq.com'];

foreach ($emails as $email) {
  $user = User::where('email', $email)->first();
  if ($user) {
    $user->email_verified_at = now();
    $user->save();
    echo "Verified: {$email}\n";
  } else {
    echo "Not found: {$email}\n";
  }
}

echo "Done.\n";
