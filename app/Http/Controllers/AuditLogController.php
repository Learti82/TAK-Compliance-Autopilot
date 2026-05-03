<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $companyId = auth()->user()->company_id;

        $logs = AuditLog::where('company_id', $companyId)
            ->with('user:id,name')
            ->when($request->action, fn($q) => $q->where('action', $request->action))
            ->when($request->entity_type, fn($q) => $q->where('entity_type', $request->entity_type))
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('entity_label', 'like', "%{$request->search}%")
                    ->orWhere('description', 'like', "%{$request->search}%");
            }))
            ->orderByDesc('created_at')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('AuditLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['action', 'entity_type', 'search']),
        ]);
    }
}
