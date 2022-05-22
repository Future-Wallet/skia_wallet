import { UsersIcon } from '@heroicons/react/outline';

export default function BottomNavigationBar(): JSX.Element {
  return (
    <div
      id={BottomNavigationBar.name}
      className="md:hidden flex justify-between h-16 bg-emerald-400"
    >
      <button
        type="button"
        className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <UsersIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
}
