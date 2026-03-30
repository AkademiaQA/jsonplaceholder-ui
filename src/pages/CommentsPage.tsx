import ResourcePage from '../components/ResourcePage';
import type { Comment } from '../types';

const fields = [
  { key: 'postId', label: 'Post ID', type: 'number' as const, required: true },
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'email', label: 'Email', type: 'text' as const, required: true },
  { key: 'body', label: 'Body', type: 'textarea' as const, required: true },
];

const defaultBody: Partial<Comment> = { postId: 1, name: '', email: '', body: '' };

export default function CommentsPage() {
  return (
    <ResourcePage<Comment>
      resourceName="comments"
      resourceLabel="Comments"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(comment, onSelect) => (
        <tr
          key={comment.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(comment)}
          data-testid={`row-comment-${comment.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{comment.id}</span>
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm truncate max-w-xs">{comment.name}</div>
            <div className="text-xs text-indigo-500 mt-0.5">{comment.email}</div>
            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{comment.body}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <span className="text-xs text-gray-400">post {comment.postId}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(comment); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
