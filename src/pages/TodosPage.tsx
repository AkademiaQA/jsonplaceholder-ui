import ResourcePage from '../components/ResourcePage';
import type { Todo } from '../types';

const fields = [
  { key: 'userId', label: 'User ID', type: 'number' as const, required: true },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'completed', label: 'Completed', type: 'checkbox' as const },
];

const defaultBody: Partial<Todo> = { userId: 1, title: '', completed: false };

export default function TodosPage() {
  return (
    <ResourcePage<Todo>
      resourceName="todos"
      resourceLabel="Todos"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(todo, onSelect) => (
        <tr
          key={todo.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(todo)}
          data-testid={`row-todo-${todo.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{todo.id}</span>
          </td>
          <td className="px-4 py-3 w-10 text-center">
            <span
              className={`inline-block w-4 h-4 rounded border-2 ${
                todo.completed
                  ? 'bg-green-500 border-green-500'
                  : 'bg-white border-gray-300'
              }`}
              title={todo.completed ? 'Completed' : 'Not completed'}
            >
              {todo.completed && (
                <svg className="w-3 h-3 text-white m-auto" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M10 3L5 8.5 2 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : 'text-gray-900 font-medium'}`}>
              {todo.title}
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            <span className="text-xs text-gray-400">user {todo.userId}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(todo); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
