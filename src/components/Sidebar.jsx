import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Info,
  Users,
  FileText,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../utils/helpers';

const sidebarLinks = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/about', label: 'About', icon: Info },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const secondaryLinks = [
  { to: '/users', label: 'Users', icon: Users },
  { to: '/posts', label: 'Posts', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function SidebarLink({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
          isActive
            ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
        )
      }
    >
      <Icon size={16} className="shrink-0" />
      <span className="flex-1">{label}</span>
      <ChevronRight
        size={14}
        className="opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0"
      />
    </NavLink>
  );
}

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-1">
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Navigation
        </p>
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}

        <p className="mb-1 mt-5 px-3 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
          Management
        </p>
        {secondaryLinks.map((link) => (
          <SidebarLink key={link.to} {...link} />
        ))}
      </div>
    </aside>
  );
}
