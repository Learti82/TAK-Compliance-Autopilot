<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class File extends Model
{
    protected $fillable = [
        'company_id', 'user_id', 'fileable_type', 'fileable_id',
        'type', 'name', 'path', 'disk', 'mime_type', 'size',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fileable()
    {
        return $this->morphTo();
    }

    public function getUrlAttribute(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function getSizeLabelAttribute(): string
    {
        if ($this->size < 1024) {
            return $this->size . ' B';
        }
        if ($this->size < 1024 * 1024) {
            return round($this->size / 1024, 1) . ' KB';
        }
        return round($this->size / (1024 * 1024), 1) . ' MB';
    }
}
