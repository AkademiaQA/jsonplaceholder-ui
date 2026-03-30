import ResourcePage from '../components/ResourcePage';
import type { Post } from '../types';

const fields = [
  { key: 'userId', label: 'User ID', type: 'number' as const, required: true },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'body', label: 'Body', type: 'textarea' as const, required: true },
];

const defaultBody: Partial<Post> = { userId: 1, title: '', body: '' };

export default function PostsPage() {
  return (
    <ResourcePage<Post>
      resourceName="posts"
      resourceLabel="Posts"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(post, onSelect) => (
        <tr
          key={post.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(post)}
          data-testid={`row-post-${post.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{post.id}</span>
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm truncate max-w-xs">{post.title}</div>
            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{post.body}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <span className="text-xs text-gray-400">user {post.userId}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(post); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
