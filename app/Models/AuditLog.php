<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    public $timestamps = true;
    const UPDATED_AT = null;

    protected $fillable = [
        'user_id', 'company_id', 'action', 'entity_type', 'entity_id',
        'entity_label', 'old_values', 'new_values', 'ip_address', 'user_agent', 'description',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function getActionLabelAttribute(): string
    {
        return match ($this->action) {
            'created' => 'Krijuar',
            'updated' => 'Përditësuar',
            'deleted' => 'Fshirë',
            'approved' => 'Aprovuar',
            'submitted' => 'Dorëzuar',
            'exported' => 'Eksportuar',
            'login' => 'Hyrje',
            'logout' => 'Dalje',
            default => $this->action,
        };
    }

    public static function log(
        string $action,
        string $entityType,
        ?int $entityId,
        ?string $entityLabel = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): static {
        return static::create([
            'user_id' => auth()->id(),
            'company_id' => auth()->user()?->company_id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'entity_label' => $entityLabel,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'description' => $description,
        ]);
    }
}
