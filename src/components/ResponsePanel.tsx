import type { ApiResponse } from '../types';

interface Props<T> {
  response: ApiResponse<T> | null;
}

const methodColors: Record<string, string> = {
  GET: 'bg-blue-100 text-blue-700',
  POST: 'bg-green-100 text-green-700',
  PUT: 'bg-orange-100 text-orange-700',
  PATCH: 'bg-yellow-100 text-yellow-700',
  DELETE: 'bg-red-100 text-red-700',
};

const statusColor = (s: number) => {
  if (s >= 200 && s < 300) return 'text-green-600';
  if (s >= 400) return 'text-red-600';
  return 'text-gray-600';
};

export default function ResponsePanel<T>({ response }: Props<T>) {
  if (!response) return null;

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden" data-testid="response-panel">
      {/* Header bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${methodColors[response.method] ?? 'bg-gray-100 text-gray-600'}`}
        >
          {response.method}
        </span>
        <span className="text-sm text-gray-600 font-mono truncate flex-1">{response.url}</span>
        <span className={`text-sm font-semibold ${statusColor(response.status)}`}>
          {response.status === 0 ? 'ERROR' : `${response.status}`}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 bg-gray-900 overflow-auto max-h-80">
        {response.error ? (
          <p className="text-red-400 text-sm">{response.error}</p>
        ) : (
          <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
