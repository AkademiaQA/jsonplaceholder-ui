import ResourcePage from '../components/ResourcePage';
import type { Photo } from '../types';

const fields = [
  { key: 'albumId', label: 'Album ID', type: 'number' as const, required: true },
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'url', label: 'URL', type: 'text' as const, required: true },
  { key: 'thumbnailUrl', label: 'Thumbnail URL', type: 'text' as const, required: true },
];

const defaultBody: Partial<Photo> = {
  albumId: 1,
  title: '',
  url: 'https://via.placeholder.com/600/92c952',
  thumbnailUrl: 'https://via.placeholder.com/150/92c952',
};

export default function PhotosPage() {
  return (
    <ResourcePage<Photo>
      resourceName="photos"
      resourceLabel="Photos"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(photo, onSelect) => (
        <tr
          key={photo.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(photo)}
          data-testid={`row-photo-${photo.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{photo.id}</span>
          </td>
          <td className="px-4 py-3 w-16">
            <img
              src={photo.thumbnailUrl}
              alt={photo.title}
              className="w-10 h-10 rounded object-cover bg-gray-100"
              loading="lazy"
            />
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm truncate max-w-xs">{photo.title}</div>
            <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{photo.url}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <span className="text-xs text-gray-400">album {photo.albumId}</span>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(photo); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
