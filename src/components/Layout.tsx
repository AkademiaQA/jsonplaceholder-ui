import { NavLink, Outlet } from 'react-router-dom';

const resources = [
  { path: '/posts', label: 'Posts', icon: '📝', count: '100' },
  { path: '/comments', label: 'Comments', icon: '💬', count: '500' },
  { path: '/albums', label: 'Albums', icon: '🖼️', count: '100' },
  { path: '/photos', label: 'Photos', icon: '📷', count: '5000' },
  { path: '/todos', label: 'Todos', icon: '✅', count: '200' },
  { path: '/users', label: 'Users', icon: '👤', count: '10' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm font-bold">JP</div>
            <div>
              <div className="font-semibold text-sm leading-tight">JSONPlaceholder</div>
              <div className="text-xs text-gray-400">API Explorer</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
            Resources
          </div>
          {resources.map((r) => (
            <NavLink
              key={r.path}
              to={r.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <span>{r.icon}</span>
                <span className="font-medium">{r.label}</span>
              </span>
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                {r.count}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span>🔗</span>
            <span>jsonplaceholder.typicode.com</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
