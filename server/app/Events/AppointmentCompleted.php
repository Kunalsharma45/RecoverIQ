<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentCompleted implements ShouldBroadcast
{
  use Dispatchable, InteractsWithSockets, SerializesModels;

  public Appointment $appointment;
  public int $userId;

  public function __construct(Appointment $appointment, int $userId)
  {
    $this->appointment = $appointment;
    $this->userId = $userId;
  }

  public function broadcastOn()
  {
    return new PrivateChannel("user.{$this->userId}");
  }

  public function broadcastWith()
  {
    return [
      'appointment_id' => $this->appointment->id,
      'status' => $this->appointment->status,
      'slot_at' => $this->appointment->slot_at,
    ];
  }
}
