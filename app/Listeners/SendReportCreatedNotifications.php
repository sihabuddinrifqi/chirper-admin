<?php

namespace App\Listeners;

use App\Events\ReportCreated;
use App\Models\User;
use App\Notifications\NewReport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendReportCreatedNotifications
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(ReportCreated $event): void
    {
        // untuk semua admin
        $users = User::whereHas('roles', function($query) {
           $query->where('roles.id', 1); // admin
        })->get();

        foreach($users as $user) {
            $user->notify(new NewReport($event->report));
        }
    }
}
