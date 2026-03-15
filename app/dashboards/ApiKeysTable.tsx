import IconButton from "./IconButton";
import type { ApiKeyItem } from "./types";

type ApiKeysTableProps = {
  items: ApiKeyItem[];
  editingId: string | null;
  editingName: string;
  isSubmitting: boolean;
  visibleKeys: Record<string, boolean>;
  onStartEditing: (item: ApiKeyItem) => void;
  onCancelEditing: () => void;
  onSaveEditing: (id: string) => void;
  onEditingNameChange: (value: string) => void;
  onToggleVisibility: (id: string) => void;
  onCopyKey: (key: string) => void;
  onDeleteItem: (id: string) => void;
};

function maskKey(value: string) {
  if (value.length <= 12) return "************";
  return `${value.slice(0, 8)}${"*".repeat(value.length - 12)}${value.slice(-4)}`;
}

export default function ApiKeysTable({
  items,
  editingId,
  editingName,
  isSubmitting,
  visibleKeys,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onEditingNameChange,
  onToggleVisibility,
  onCopyKey,
  onDeleteItem,
}: ApiKeysTableProps) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">API Key</th>
            <th className="px-3 py-2 font-medium">Created</th>
            <th className="px-3 py-2 font-medium">Updated</th>
            <th className="px-3 py-2 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isEditing = editingId === item.id;
            const isVisible = Boolean(visibleKeys[item.id]);

            return (
              <tr key={item.id} className="border-b border-zinc-100 dark:border-zinc-900">
                <td className="px-3 py-3 align-top">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(event) => onEditingNameChange(event.target.value)}
                      className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  ) : (
                    <span>{item.name}</span>
                  )}
                </td>
                <td className="px-3 py-3 align-top font-mono text-xs">{isVisible ? item.key : maskKey(item.key)}</td>
                <td className="px-3 py-3 align-top text-zinc-600 dark:text-zinc-400">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
                <td className="px-3 py-3 align-top text-zinc-600 dark:text-zinc-400">
                  {new Date(item.updatedAt).toLocaleString()}
                </td>
                <td className="px-3 py-3 align-top">
                  <div className="flex flex-wrap gap-2">
                    {isEditing ? (
                      <>
                        <IconButton label="Save" onClick={() => onSaveEditing(item.id)} disabled={!editingName.trim() || isSubmitting}>
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path
                              d="M4.5 10.5L8.2 14.2L15.5 5.8"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </IconButton>
                        <IconButton label="Cancel" onClick={onCancelEditing}>
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                        </IconButton>
                      </>
                    ) : (
                      <IconButton label="Edit" onClick={() => onStartEditing(item)}>
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path
                            d="M4 13.6V16h2.4l7.1-7.1l-2.4-2.4L4 13.6Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinejoin="round"
                          />
                          <path d="M10.6 7L13 9.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                      </IconButton>
                    )}

                    <IconButton label={isVisible ? "Hide key" : "Show key"} onClick={() => onToggleVisibility(item.id)}>
                      {isVisible ? (
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path d="M3.5 3.5L16.5 16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          <path
                            d="M8.8 8.8C8.5 9.1 8.3 9.5 8.3 10C8.3 11 9 11.7 10 11.7C10.5 11.7 10.9 11.5 11.2 11.2"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M5.2 6C4.3 6.8 3.6 7.7 3 10C4.2 13 6.9 15 10 15C11.3 15 12.5 14.6 13.6 13.9"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12.8C16 12 16.8 11 17 10C15.8 7 13.1 5 10 5C9.2 5 8.5 5.1 7.8 5.3"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                          <path
                            d="M3 10C4.2 7 6.9 5 10 5C13.1 5 15.8 7 17 10C15.8 13 13.1 15 10 15C6.9 15 4.2 13 3 10Z"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle cx="10" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
                        </svg>
                      )}
                    </IconButton>

                    {!isEditing ? (
                      <>
                        <IconButton label="Copy key" onClick={() => onCopyKey(item.key)}>
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <rect x="7" y="7" width="9" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
                            <path d="M5 12V5.6C5 4.7 5.7 4 6.6 4H13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                          </svg>
                        </IconButton>

                        <IconButton label="Delete key" onClick={() => onDeleteItem(item.id)} disabled={isSubmitting} danger>
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path
                              d="M4.5 6H15.5M8 6V4.8C8 4.4 8.4 4 8.8 4H11.2C11.6 4 12 4.4 12 4.8V6M7 8V14M10 8V14M13 8V14M6.5 6L7 15.2C7 15.7 7.4 16 7.8 16H12.2C12.6 16 13 15.7 13 15.2L13.5 6"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </IconButton>
                      </>
                    ) : null}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
