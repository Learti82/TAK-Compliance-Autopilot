<?php

namespace App\Http\Controllers;

use App\Models\TaxBracket;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxBracketController extends Controller
{
    public function __construct(private AuditService $audit) {}

    public function index(): Response
    {
        $brackets = TaxBracket::orderBy('tax_year', 'desc')
            ->orderBy('type')
            ->orderBy('min_amount')
            ->get();

        return Inertia::render('Admin/TaxBrackets/Index', ['brackets' => $brackets]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'type' => ['required', 'in:pit,pension_employee,pension_employer'],
            'min_amount' => ['required', 'numeric', 'min:0'],
            'max_amount' => ['nullable', 'numeric', 'gt:min_amount'],
            'rate' => ['required', 'numeric', 'min:0', 'max:1'],
            'tax_year' => ['required', 'integer', 'min:2020', 'max:2100'],
        ]);

        $bracket = TaxBracket::create($data);
        $this->audit->logCreated('tax_bracket', $bracket->id, "{$bracket->type} {$bracket->tax_year}", $data);

        return back()->with('success', 'Brezimi tatimor u shtua.');
    }

    public function update(Request $request, TaxBracket $taxBracket): RedirectResponse
    {
        $data = $request->validate([
            'rate' => ['required', 'numeric', 'min:0', 'max:1'],
            'is_active' => ['boolean'],
        ]);

        $old = $taxBracket->toArray();
        $taxBracket->update($data);
        $this->audit->logUpdated('tax_bracket', $taxBracket->id, "{$taxBracket->type} {$taxBracket->tax_year}", $old, $taxBracket->toArray());

        return back()->with('success', 'Brezimi tatimor u përditësua.');
    }

    public function destroy(TaxBracket $taxBracket): RedirectResponse
    {
        $taxBracket->delete();
        return back()->with('success', 'Brezimi tatimor u fshi.');
    }
}
