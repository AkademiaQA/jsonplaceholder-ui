import ResourcePage from '../components/ResourcePage';
import type { User } from '../types';

const fields = [
  { key: 'name', label: 'Name', type: 'text' as const, required: true },
  { key: 'username', label: 'Username', type: 'text' as const, required: true },
  { key: 'email', label: 'Email', type: 'text' as const, required: true },
  { key: 'phone', label: 'Phone', type: 'text' as const },
  { key: 'website', label: 'Website', type: 'text' as const },
  { key: 'address.street', label: 'Street', type: 'text' as const },
  { key: 'address.suite', label: 'Suite', type: 'text' as const },
  { key: 'address.city', label: 'City', type: 'text' as const },
  { key: 'address.zipcode', label: 'Zip Code', type: 'text' as const },
  { key: 'address.geo.lat', label: 'Geo Lat', type: 'text' as const },
  { key: 'address.geo.lng', label: 'Geo Lng', type: 'text' as const },
  { key: 'company.name', label: 'Company Name', type: 'text' as const },
  { key: 'company.catchPhrase', label: 'Catch Phrase', type: 'text' as const },
  { key: 'company.bs', label: 'Business', type: 'text' as const },
];

const defaultBody: Partial<User> = {
  name: '',
  username: '',
  email: '',
  phone: '',
  website: '',
  address: {
    street: '',
    suite: '',
    city: '',
    zipcode: '',
    geo: { lat: '', lng: '' },
  },
  company: {
    name: '',
    catchPhrase: '',
    bs: '',
  },
};

export default function UsersPage() {
  return (
    <ResourcePage<User>
      resourceName="users"
      resourceLabel="Users"
      fields={fields}
      defaultBody={defaultBody}
      renderRow={(user, onSelect) => (
        <tr
          key={user.id}
          className="hover:bg-indigo-50 cursor-pointer transition-colors"
          onClick={() => onSelect(user)}
          data-testid={`row-user-${user.id}`}
        >
          <td className="px-4 py-3 w-12 text-center">
            <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{user.id}</span>
          </td>
          <td className="px-4 py-3 w-10">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0)}
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="font-medium text-gray-900 text-sm">{user.name}</div>
            <div className="text-xs text-gray-400">@{user.username} · {user.email}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="text-xs text-gray-400">{user.company.name}</div>
            <div className="text-xs text-gray-400">{user.address.city}</div>
          </td>
          <td className="px-4 py-3 text-right">
            <button
              className="text-xs text-indigo-600 hover:underline"
              onClick={e => { e.stopPropagation(); onSelect(user); }}
            >
              View →
            </button>
          </td>
        </tr>
      )}
    />
  );
}
