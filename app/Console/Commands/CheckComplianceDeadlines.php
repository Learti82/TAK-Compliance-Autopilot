<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Models\ComplianceDeadline;
use App\Services\ComplianceService;
use Illuminate\Console\Command;

class CheckComplianceDeadlines extends Command
{
    protected $signature = 'compliance:check';
    protected $description = 'Update overdue compliance deadlines and send alerts';

    public function __construct(private ComplianceService $compliance)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $companies = Company::where('status', 'active')->get();
        $updated = 0;

        foreach ($companies as $company) {
            $count = $this->compliance->updateOverdueStatuses($company);
            $updated += $count;

            // Mark 7-day alerts as sent (placeholder for email notifications)
            ComplianceDeadline::where('company_id', $company->id)
                ->where('status', 'pending')
                ->where('alert_sent', false)
                ->whereBetween('due_date', [now(), now()->addDays(7)])
                ->update([
                    'alert_sent' => true,
                    'alert_sent_at' => now(),
                ]);
        }

        $this->info("Compliance check done. {$updated} deadlines marked as overdue.");
        return Command::SUCCESS;
    }
}
