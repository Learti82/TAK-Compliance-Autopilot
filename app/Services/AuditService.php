<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditService
{
    public function log(
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?string $entityLabel = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?string $description = null
    ): AuditLog {
        return AuditLog::log(
            $action,
            $entityType,
            $entityId,
            $entityLabel,
            $oldValues,
            $newValues,
            $description
        );
    }

    public function logCreated(string $entityType, int $entityId, string $entityLabel, array $values = []): AuditLog
    {
        return $this->log('created', $entityType, $entityId, $entityLabel, null, $values);
    }

    public function logUpdated(string $entityType, int $entityId, string $entityLabel, array $old, array $new): AuditLog
    {
        // Only include changed fields
        $changed_old = [];
        $changed_new = [];
        foreach ($new as $key => $value) {
            if (($old[$key] ?? null) != $value) {
                $changed_old[$key] = $old[$key] ?? null;
                $changed_new[$key] = $value;
            }
        }
        return $this->log('updated', $entityType, $entityId, $entityLabel, $changed_old, $changed_new);
    }

    public function logDeleted(string $entityType, int $entityId, string $entityLabel): AuditLog
    {
        return $this->log('deleted', $entityType, $entityId, $entityLabel);
    }

    public function logAction(string $action, string $entityType, int $entityId, string $entityLabel, ?string $description = null): AuditLog
    {
        return $this->log($action, $entityType, $entityId, $entityLabel, null, null, $description);
    }
}
