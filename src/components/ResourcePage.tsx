import { useState, useCallback } from 'react';
import { api } from '../api/client';
import type { ApiResponse } from '../types';
import ResponsePanel from './ResponsePanel';
import Spinner from './Spinner';

type Tab = 'list' | 'getById' | 'post' | 'put' | 'patch' | 'delete';

function flattenObject(obj: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, path));
    } else {
      result[path] = value;
    }
  }
  return result;
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc: unknown, key) => {
    if (acc !== null && acc !== undefined && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj as unknown);
}

function buildNestedBody(flat: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(flat)) {
    const keys = path.split('.');
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (current[key] === undefined || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
    current[keys.at(-1)!] = value;
  }
  return result;
}

interface FieldDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'checkbox';
  required?: boolean;
}

interface Props<T extends object> {
  resourceName: string;         // e.g. "posts"
  resourceLabel: string;        // e.g. "Posts"
  fields: FieldDef[];           // fields for PUT/PATCH forms
  renderRow: (item: T, onSelect: (item: T) => void) => React.ReactNode;
  defaultBody: Partial<T>;      // default values for PUT form
}

export default function ResourcePage<T extends object>({
  resourceName,
  resourceLabel,
  fields,
  renderRow,
  defaultBody,
}: Props<T>) {
  const [tab, setTab] = useState<Tab>('list');

  // List state
  const [listData, setListData] = useState<T[] | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [listResponse, setListResponse] = useState<ApiResponse<T[]> | null>(null);

  // GetById state
  const [byIdValue, setByIdValue] = useState('1');
  const [byIdLoading, setByIdLoading] = useState(false);
  const [byIdResponse, setByIdResponse] = useState<ApiResponse<T> | null>(null);

  // POST state
  const [postBody, setPostBody] = useState<Record<string, unknown>>(() => flattenObject(defaultBody as Record<string, unknown>));
  const [postLoading, setPostLoading] = useState(false);
  const [postResponse, setPostResponse] = useState<ApiResponse<T> | null>(null);

  // PUT state
  const [putId, setPutId] = useState('1');
  const [putBody, setPutBody] = useState<Record<string, unknown>>(() => flattenObject(defaultBody as Record<string, unknown>));
  const [putLoading, setPutLoading] = useState(false);
  const [putResponse, setPutResponse] = useState<ApiResponse<T> | null>(null);

  // PATCH state
  const [patchId, setPatchId] = useState('1');
  const [patchBody, setPatchBody] = useState<Record<string, unknown>>({});
  const [patchLoading, setPatchLoading] = useState(false);
  const [patchResponse, setPatchResponse] = useState<ApiResponse<T> | null>(null);

  // DELETE state
  const [deleteId, setDeleteId] = useState('1');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState<ApiResponse<Record<string, never>> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handleGetAll = useCallback(async () => {
    setListLoading(true);
    const res = await api.getAll<T>(resourceName);
    setListResponse(res);
    setListData(res.data);
    setListLoading(false);
  }, [resourceName]);

  const handleGetById = useCallback(async () => {
    const id = parseInt(byIdValue);
    if (!id) return;
    setByIdLoading(true);
    const res = await api.getById<T>(resourceName, id);
    setByIdResponse(res);
    setByIdLoading(false);
  }, [resourceName, byIdValue]);

  const handlePost = useCallback(async () => {
    setPostLoading(true);
    const res = await api.post<T>(resourceName, buildNestedBody(postBody) as Partial<T>);
    setPostResponse(res);
    setPostLoading(false);
  }, [resourceName, postBody]);

  const handlePut = useCallback(async () => {
    const id = parseInt(putId);
    if (!id) return;
    setPutLoading(true);
    const res = await api.put<T>(resourceName, id, buildNestedBody(putBody) as T);
    setPutResponse(res);
    setPutLoading(false);
  }, [resourceName, putId, putBody]);

  const handlePatch = useCallback(async () => {
    const id = parseInt(patchId);
    if (!id) return;
    setPatchLoading(true);
    const res = await api.patch<T>(resourceName, id, buildNestedBody(patchBody) as Partial<T>);
    setPatchResponse(res);
    setPatchLoading(false);
  }, [resourceName, patchId, patchBody]);

  const handleDelete = useCallback(async () => {
    const id = parseInt(deleteId);
    if (!id) return;
    setDeleteLoading(true);
    const res = await api.delete(resourceName, id);
    setDeleteResponse(res);
    setDeleteLoading(false);
    setDeleteConfirm(false);
  }, [resourceName, deleteId]);

  const selectItem = useCallback((item: T) => {
    const id = String((item as { id?: number }).id ?? '');
    setByIdValue(id);
    setPutId(id);
    setPatchId(id);
    setDeleteId(id);
    const bodyFields: Record<string, unknown> = {};
    fields.forEach(f => { bodyFields[f.key] = getNestedValue(item as Record<string, unknown>, f.key) ?? ''; });
    setPutBody(bodyFields);
    setTab('getById');
    setByIdResponse({ data: item, status: 200, method: 'GET', url: `https://jsonplaceholder.typicode.com/${resourceName}/${id}`, error: null });
  }, [fields, resourceName]);

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: 'list', label: 'GET All' },
    { id: 'getById', label: 'GET by ID' },
    { id: 'post', label: 'POST' },
    { id: 'put', label: 'PUT' },
    { id: 'patch', label: 'PATCH' },
    { id: 'delete', label: 'DELETE' },
  ];

  const tabBadgeColors: Record<Tab, string> = {
    list:    'bg-blue-500',
    getById: 'bg-blue-500',
    post:    'bg-green-500',
    put:     'bg-orange-500',
    patch:   'bg-yellow-500',
    delete:  'bg-red-500',
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{resourceLabel}</h1>
        <p className="text-sm text-gray-500 mt-1 font-mono">
          https://jsonplaceholder.typicode.com/{resourceName}
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white shadow text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            data-testid={`tab-${t.id}`}
          >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${tabBadgeColors[t.id]}`} />
            {t.label}
          </button>
        ))}
      </div>

      {/* --- LIST TAB --- */}
      {tab === 'list' && (
        <div>
          <button
            onClick={handleGetAll}
            disabled={listLoading}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg text-sm transition-colors"
            data-testid="btn-get-all"
          >
            {listLoading ? 'Loading…' : `GET /${resourceName}`}
          </button>
          {listLoading && <Spinner />}
          {listData && !listLoading && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {listData.length} items returned
                </span>
                <span className="text-xs text-gray-400 font-mono">GET 200</span>
              </div>
              <div className="overflow-auto max-h-96">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {listData.map(item => renderRow(item, selectItem))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <ResponsePanel response={listResponse} />
        </div>
      )}

      {/* --- GET BY ID TAB --- */}
      {tab === 'getById' && (
        <div>
          <div className="flex gap-3 items-end mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Resource ID</label>
              <input
                type="number"
                min={1}
                value={byIdValue}
                onChange={e => setByIdValue(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="input-get-id"
              />
            </div>
            <button
              onClick={handleGetById}
              disabled={byIdLoading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg text-sm transition-colors"
              data-testid="btn-get-by-id"
            >
              {byIdLoading ? 'Loading…' : `GET /${resourceName}/${byIdValue}`}
            </button>
          </div>
          {byIdLoading && <Spinner />}
          {byIdResponse?.data && !byIdLoading && (
            <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden mb-4">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  1 item returned
                </span>
                <span className="text-xs text-gray-400 font-mono">GET 200</span>
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {renderRow(byIdResponse.data, selectItem)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <ResponsePanel response={byIdResponse} />
        </div>
      )}

      {/* --- POST TAB --- */}
      {tab === 'post' && (
        <div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-800">
            <strong>POST</strong> creates a new resource. JSONPlaceholder simulates this — data is not actually persisted.
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-4">
              {fields.map(f => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={postBody[f.key]}
                  onChange={v => setPostBody(prev => ({ ...prev, [f.key]: v }))}
                  testIdPrefix="post"
                />
              ))}
            </div>
            <button
              onClick={handlePost}
              disabled={postLoading}
              className="mt-5 px-5 py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg text-sm transition-colors"
              data-testid="btn-post"
            >
              {postLoading ? 'Sending…' : `POST /${resourceName}`}
            </button>
          </div>
          <ResponsePanel response={postResponse} />
        </div>
      )}

      {/* --- PUT TAB --- */}
      {tab === 'put' && (
        <div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4 text-sm text-orange-800">
            <strong>PUT</strong> replaces the entire resource. All fields are required.
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Resource ID</label>
              <input
                type="number"
                min={1}
                value={putId}
                onChange={e => setPutId(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-orange-500"
                data-testid="input-put-id"
              />
            </div>
            <div className="space-y-4">
              {fields.map(f => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={putBody[f.key]}
                  onChange={v => setPutBody(prev => ({ ...prev, [f.key]: v }))}
                  testIdPrefix="put"
                />
              ))}
            </div>
            <button
              onClick={handlePut}
              disabled={putLoading}
              className="mt-5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-medium rounded-lg text-sm transition-colors"
              data-testid="btn-put"
            >
              {putLoading ? 'Sending…' : `PUT /${resourceName}/${putId}`}
            </button>
          </div>
          <ResponsePanel response={putResponse} />
        </div>
      )}

      {/* --- PATCH TAB --- */}
      {tab === 'patch' && (
        <div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
            <strong>PATCH</strong> updates only the provided fields. Leave fields empty to skip them.
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Resource ID</label>
              <input
                type="number"
                min={1}
                value={patchId}
                onChange={e => setPatchId(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                data-testid="input-patch-id"
              />
            </div>
            <div className="space-y-4">
              {fields.map(f => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={patchBody[f.key]}
                  onChange={v => {
                    setPatchBody(prev => {
                      const next = { ...prev };
                      if (v === '' || v === undefined) {
                        delete next[f.key];
                      } else {
                        next[f.key] = v;
                      }
                      return next;
                    });
                  }}
                  testIdPrefix="patch"
                  optional
                />
              ))}
            </div>
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 mb-1 font-medium">Request body preview:</p>
              <pre className="text-xs text-gray-700 font-mono">
                {JSON.stringify(patchBody, null, 2)}
              </pre>
            </div>
            <button
              onClick={handlePatch}
              disabled={patchLoading || Object.keys(patchBody).length === 0}
              className="mt-5 px-5 py-2.5 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 text-white font-medium rounded-lg text-sm transition-colors"
              data-testid="btn-patch"
            >
              {patchLoading ? 'Sending…' : `PATCH /${resourceName}/${patchId}`}
            </button>
          </div>
          <ResponsePanel response={patchResponse} />
        </div>
      )}

      {/* --- DELETE TAB --- */}
      {tab === 'delete' && (
        <div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-800">
            <strong>DELETE</strong> removes the resource. JSONPlaceholder simulates this — data is not actually deleted.
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="mb-5">
              <label className="block text-xs font-medium text-gray-600 mb-1">Resource ID</label>
              <input
                type="number"
                min={1}
                value={deleteId}
                onChange={e => { setDeleteId(e.target.value); setDeleteConfirm(false); }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-red-500"
                data-testid="input-delete-id"
              />
            </div>
            {!deleteConfirm ? (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="px-5 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-medium rounded-lg text-sm transition-colors border border-red-200"
                data-testid="btn-delete-confirm"
              >
                Request DELETE /{resourceName}/{deleteId}
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-red-700 font-medium">Are you sure?</span>
                <button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-medium rounded-lg text-sm transition-colors"
                  data-testid="btn-delete-execute"
                >
                  {deleteLoading ? 'Deleting…' : 'Yes, DELETE'}
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-2.5 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <ResponsePanel response={deleteResponse} />
        </div>
      )}
    </div>
  );
}

/* --- Field input helper --- */

interface FieldInputProps {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
  testIdPrefix: string;
  optional?: boolean;
}

function FieldInput({ field, value, onChange, testIdPrefix, optional }: FieldInputProps) {
  const inputClass =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500';
  const testId = `${testIdPrefix}-field-${field.key}`;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {field.label}
        {optional && <span className="ml-1 text-gray-400">(optional)</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          rows={3}
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
          data-testid={testId}
        />
      ) : field.type === 'checkbox' ? (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={e => onChange(e.target.checked)}
            className="w-4 h-4 rounded"
            data-testid={testId}
          />
          <span className="text-sm text-gray-700">{field.label}</span>
        </label>
      ) : field.type === 'number' ? (
        <input
          type="number"
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          className={`${inputClass} w-28`}
          data-testid={testId}
        />
      ) : (
        <input
          type="text"
          value={String(value ?? '')}
          onChange={e => onChange(e.target.value)}
          className={inputClass}
          data-testid={testId}
        />
      )}
    </div>
  );
}
