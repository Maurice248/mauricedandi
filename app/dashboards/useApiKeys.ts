"use client";

import { useCallback, useEffect, useState } from "react";

import { createApiKey, deleteApiKey, fetchApiKeys, updateApiKey } from "./apiKeysClient";
import type { ApiKeyItem, ApiKeyRow } from "./types";

function mapRowToItem(row: ApiKeyRow): ApiKeyItem {
  return {
    id: row.id,
    name: row.name,
    key: row.key,
    usage: row.usage,
    limit: row.limit_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function useApiKeys() {
  const [items, setItems] = useState<ApiKeyItem[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadKeys() {
      try {
        setIsLoading(true);
        const rows = await fetchApiKeys();
        setItems(rows.map(mapRowToItem));
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load API keys.");
      } finally {
        setIsLoading(false);
      }
    }

    loadKeys();
  }, []);

  const clearError = useCallback(() => setError(""), []);

  const createKey = useCallback(async (name: string) => {
    try {
      setIsSubmitting(true);
      setError("");

      const row = await createApiKey(name);
      setItems((prev) => [mapRowToItem(row), ...prev]);
      return true;
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create API key.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateKey = useCallback(async (id: string, name: string, limit: number | null) => {
    try {
      setIsSubmitting(true);
      setError("");

      const row = await updateApiKey(id, name, limit);
      const updated = mapRowToItem(row);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return true;
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update API key.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const removeKey = useCallback(async (id: string) => {
    try {
      setIsSubmitting(true);
      setError("");

      await deleteApiKey(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete API key.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    items,
    error,
    isLoading,
    isSubmitting,
    clearError,
    createKey,
    updateKey,
    removeKey,
  };
}
