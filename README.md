# TAK Compliance Autopilot

Sistem SaaS për automatizimin e listave të pagave dhe pajtueshmërisë tatimore për bizneset e Kosovës.

## Stack

- **Backend**: Laravel 11 + PHP 8.4
- **Database**: SQLite (dev) / MySQL (production)
- **Frontend**: React 19 + Tailwind CSS v4 + Inertia.js
- **Export**: Maatwebsite Excel
- **Auth/Roles**: Laravel Sanctum + Spatie Laravel Permission

## Instalimi

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
npm run build
php artisan serve
```

## Demo Llogaritë

| Roli | Email | Fjalëkalimi |
|------|-------|-------------|
| Super Admin | admin@tak-autopilot.com | password |
| Company Admin | admin@demo.com | password |
| HR | hr@demo.com | password |

## Logjika Tatimore (Kosovo 2024)

```
Pensioni punëtor  = Pagë bruto × 5%
Pensioni punëdhënës = Pagë bruto × 5%
Të ardhura tatimore = Pagë bruto − Pensioni punëtor

PIT mujor (pas exemptimit €80/muaj):
  4%  mbi €0–€250 (pas exemptimit)
  10% mbi €250    (pas exemptimit)

Paga neto       = Të ardhura tatimore − PIT
Kosto punëdhënësi = Pagë bruto + Pensioni punëdhënës
```

## Karakteristikat

1. **Multi-tenant SaaS** – mbështetje shumë kompanish, 5 role, 3 plane abonimit (€29/€59/€149)
2. **Menaxhimi i punëtorëve** – CRUD me paralajmërim regjistrimi TAK
3. **Motori i pagave** – llogaritje automatike Kosovo: pension, PIT progresiv, neto, kosto
4. **Listat e pagave** – Draft → Aprovuar → Dorëzuar, eksport Excel + fajl TAK CSV
5. **Sistemi i pajtueshmërisë** – gjurmim afatesh, skori gjelbër/verdhë/kuq, alarme 7-ditore
6. **Gjurma e auditimit** – regjistrimi i çdo veprimi me timestamp dhe ndryshime
7. **Paneli kryesor** – grafikë, afate, aktivitet i fundit, skori
8. **Raportet** – pagat mujore/vjetore sipas punëtorit me eksportim
9. **Admin panel** – brezat tatimorë të konfigurueshëm, menaxhimi kompanive

## Struktura kryesore

```
app/Services/
  PayrollEngine.php      # Logjika tatimore Kosovo
  ComplianceService.php  # Menaxhimi afateve
  AuditService.php       # Gjurmimi veprimeve

app/Models/
  Company, Employee, PayrollRun, PayrollItem,
  TaxBracket, ComplianceDeadline, AuditLog,
  Subscription, SubscriptionPlan, File

resources/js/Pages/
  Auth/, Dashboard/, Employees/, Payroll/,
  Compliance/, Company/, Reports/, AuditLogs/, Admin/
```

## Komanda e orares

```bash
php artisan compliance:check  # Kontrolli ditor i afateve
```
