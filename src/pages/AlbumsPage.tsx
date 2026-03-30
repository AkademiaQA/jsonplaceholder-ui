import ResourcePage from '../components/ResourcePage';
import type { Album } from '../types';

const fields = [
  { key: 'userId', label: 'User ID', type: 'number' as const, required: true },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
];

const defaultBody: Partial<Album> = { userId: 1, title: '' };

export default function AlbumsPage() {
  return (
    <ResourcePage<Album>
      resourceName="albums"
      resourceLabel="Albums"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(album, onSelect) => (
        <tr
          key={album.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(album)}
          data-testid={`row-album-${album.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{album.id}</span>
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm">{album.title}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <span className="text-xs text-gray-400">user {album.userId}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(album); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
