<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\AuditService;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function __construct(
        private AuditService $audit,
        private ComplianceService $compliance
    ) {}

    public function index(Request $request): Response
    {
        $companyId = auth()->user()->company_id;

        $query = Employee::where('company_id', $companyId)
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('first_name', 'like', "%{$request->search}%")
                    ->orWhere('last_name', 'like', "%{$request->search}%")
                    ->orWhere('personal_number', 'like', "%{$request->search}%")
                    ->orWhere('position', 'like', "%{$request->search}%");
            }))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->department, fn($q) => $q->where('department', $request->department))
            ->orderBy('last_name')
            ->orderBy('first_name');

        $employees = $query->paginate(20)->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'status', 'department']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Employees/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'personal_number' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:150'],
            'department' => ['nullable', 'string', 'max:100'],
            'contract_type' => ['required', 'in:full_time,part_time,contract'],
            'gross_salary' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'tak_registered_at' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $employee = Employee::create([
            ...$data,
            'company_id' => auth()->user()->company_id,
            'status' => 'active',
        ]);

        // Create registration compliance deadline
        $this->compliance->createEmployeeRegistrationDeadline($employee);

        $this->audit->logCreated('employee', $employee->id, $employee->full_name, $data);

        return redirect()->route('employees.show', $employee)
            ->with('success', "Punëtori {$employee->full_name} u shtua me sukses.");
    }

    public function show(Employee $employee): Response
    {
        $this->authorizeCompany($employee->company_id);

        $employee->load(['payrollItems.payrollRun', 'complianceDeadlines']);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'warning_unregistered' => $employee->needsRegistrationWarning(),
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $this->authorizeCompany($employee->company_id);
        return Inertia::render('Employees/Edit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorizeCompany($employee->company_id);

        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'personal_number' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'birth_date' => ['nullable', 'date'],
            'address' => ['nullable', 'string'],
            'bank_account' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:100'],
            'position' => ['nullable', 'string', 'max:150'],
            'department' => ['nullable', 'string', 'max:100'],
            'contract_type' => ['required', 'in:full_time,part_time,contract'],
            'gross_salary' => ['required', 'numeric', 'min:0'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date'],
            'tak_registered_at' => ['nullable', 'date'],
            'status' => ['required', 'in:active,inactive,terminated'],
            'notes' => ['nullable', 'string'],
        ]);

        $old = $employee->toArray();
        $employee->update($data);
        $this->audit->logUpdated('employee', $employee->id, $employee->full_name, $old, $employee->toArray());

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Të dhënat e punëtorit u përditësuan.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $this->authorizeCompany($employee->company_id);
        $name = $employee->full_name;
        $employee->delete();
        $this->audit->logDeleted('employee', $employee->id, $name);
        return redirect()->route('employees.index')->with('success', "Punëtori {$name} u fshi.");
    }

    private function authorizeCompany(int $companyId): void
    {
        if (!auth()->user()->isSuperAdmin() && auth()->user()->company_id !== $companyId) {
            abort(403);
        }
    }
}
