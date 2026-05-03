<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaxBracket extends Model
{
    protected $fillable = [
        'type', 'min_amount', 'max_amount', 'rate', 'tax_year', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'min_amount' => 'decimal:2',
            'max_amount' => 'decimal:2',
            'rate' => 'decimal:4',
            'is_active' => 'boolean',
        ];
    }

    public static function getActivePitBrackets(int $year): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('type', 'pit')
            ->where('tax_year', $year)
            ->where('is_active', true)
            ->orderBy('min_amount')
            ->get();
    }

    public function getRateLabelAttribute(): string
    {
        return number_format($this->rate * 100, 1) . '%';
    }
}
