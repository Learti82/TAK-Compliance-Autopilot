<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Services\AuditService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function __construct(private AuditService $audit) {}

    public function show(): Response
    {
        $company = auth()->user()->company()->with('activeSubscription.plan')->first();

        if (!$company) {
            abort(404);
        }

        return Inertia::render('Company/Show', ['company' => $company]);
    }

    public function edit(): Response
    {
        $company = auth()->user()->company;
        return Inertia::render('Company/Edit', ['company' => $company]);
    }

    public function update(Request $request): RedirectResponse
    {
        $company = auth()->user()->company;

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'industry' => ['nullable', 'string', 'max:100'],
            'tak_username' => ['nullable', 'string', 'max:100'],
        ]);

        $old = $company->toArray();
        $company->update($data);
        $this->audit->logUpdated('company', $company->id, $company->name, $old, $company->toArray());

        return redirect()->route('company.show')->with('success', 'Të dhënat e kompanisë u përditësuan.');
    }

    // Super-admin: list all companies
    public function adminIndex(Request $request): Response
    {
        $companies = Company::with('activeSubscription.plan')
            ->when($request->search, fn($q) => $q->where('name', 'like', "%{$request->search}%")
                ->orWhere('fiscal_number', 'like', "%{$request->search}%"))
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters' => $request->only(['search']),
        ]);
    }
}
