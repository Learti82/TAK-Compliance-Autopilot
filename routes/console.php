<?php

use Illuminate\Support\Facades\Schedule;

// Run compliance check daily at 8:00 AM
Schedule::command('compliance:check')->dailyAt('08:00');
