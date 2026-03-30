import { Link } from 'react-router-dom';

const resources = [
  {
    path: '/posts',
    label: 'Posts',
    icon: '📝',
    count: 100,
    desc: 'Blog posts with title and body',
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    badge: 'bg-blue-100',
  },
  {
    path: '/comments',
    label: 'Comments',
    icon: '💬',
    count: 500,
    desc: 'Comments linked to posts with email',
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    badge: 'bg-purple-100',
  },
  {
    path: '/albums',
    label: 'Albums',
    icon: '🖼️',
    count: 100,
    desc: 'Photo albums belonging to users',
    color: 'bg-pink-50 border-pink-200 text-pink-700',
    badge: 'bg-pink-100',
  },
  {
    path: '/photos',
    label: 'Photos',
    icon: '📷',
    count: 5000,
    desc: 'Photos with thumbnail URLs inside albums',
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    badge: 'bg-orange-100',
  },
  {
    path: '/todos',
    label: 'Todos',
    icon: '✅',
    count: 200,
    desc: 'Task list items with completion status',
    color: 'bg-green-50 border-green-200 text-green-700',
    badge: 'bg-green-100',
  },
  {
    path: '/users',
    label: 'Users',
    icon: '👤',
    count: 10,
    desc: 'Users with address, phone and company',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    badge: 'bg-indigo-100',
  },
];

const methods = [
  { verb: 'GET', desc: 'Fetch all resources or a single one by ID', color: 'bg-blue-100 text-blue-700' },
  { verb: 'POST', desc: 'Create a new resource', color: 'bg-green-100 text-green-700' },
  { verb: 'PUT', desc: 'Replace the entire resource', color: 'bg-orange-100 text-orange-700' },
  { verb: 'PATCH', desc: 'Update selected fields only', color: 'bg-yellow-100 text-yellow-700' },
  { verb: 'DELETE', desc: 'Remove a resource by ID', color: 'bg-red-100 text-red-700' },
];

export default function HomePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JSONPlaceholder Explorer</h1>
        <p className="text-gray-500">
          Interactive demo of the{' '}
          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 hover:underline font-mono"
          >
            jsonplaceholder.typicode.com
          </a>{' '}
          fake REST API. Perfect for Playwright API mocking demos.
        </p>
      </div>

      {/* HTTP Methods */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        {methods.map(m => (
          <div key={m.verb} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
            <span className={`text-xs font-bold px-2 py-1 rounded ${m.color} w-14 text-center`}>{m.verb}</span>
            <span className="text-sm text-gray-600">{m.desc}</span>
          </div>
        ))}
      </div>

      {/* Resources grid */}
      <h2 className="text-lg font-semibold text-gray-800 mb-3">Available Resources</h2>
      <div className="grid grid-cols-2 gap-4">
        {resources.map(r => (
          <Link
            key={r.path}
            to={r.path}
            className={`block p-4 rounded-xl border ${r.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{r.icon}</span>
                <span className="font-semibold text-base">{r.label}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.badge}`}>
                {r.count.toLocaleString()}
              </span>
            </div>
            <p className="text-xs opacity-75">{r.desc}</p>
            <p className="text-xs font-mono mt-2 opacity-60">/api{r.path}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500">
        <span className="font-medium text-gray-700">Note:</span> JSONPlaceholder simulates write operations (POST, PUT, PATCH, DELETE) — responses look real but data is not persisted.
      </div>
    </div>
  );
}
