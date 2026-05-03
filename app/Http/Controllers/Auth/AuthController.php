<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Company;
use App\Models\User;
use App\Services\ComplianceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'Email ose fjalëkalimi i pasaktë.',
            ]);
        }

        $request->session()->regenerate();
        AuditLog::log('login', 'user', auth()->id(), auth()->user()->name);

        return redirect()->intended(route('dashboard'));
    }

    public function showRegister(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function register(Request $request, ComplianceService $compliance): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'company_name' => ['required', 'string', 'max:255'],
            'fiscal_number' => ['required', 'string', 'max:50', 'unique:companies'],
        ]);

        $company = Company::create([
            'name' => $data['company_name'],
            'fiscal_number' => $data['fiscal_number'],
            'status' => 'active',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'company_id' => $company->id,
        ]);

        $user->assignRole('company_admin');
        Auth::login($user);
        $request->session()->regenerate();

        // Seed compliance deadlines
        $compliance->seedDeadlines($company);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request): RedirectResponse
    {
        AuditLog::log('logout', 'user', auth()->id(), auth()->user()?->name);
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
