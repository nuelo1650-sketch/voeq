import {
  Home,
  Compass,
  Heart,
  Users,
  MessageSquare,
  User,
  Settings,
  Store,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** shown in the mobile bottom bar */
  primary?: boolean;
}

/** Shared across the desktop sidebar and the mobile bottom nav. */
export const NAV_ITEMS: NavItem[] = [
  { href: '/home', label: 'Home', icon: Home, primary: true },
  { href: '/browse', label: 'Browse', icon: Compass, primary: true },
  { href: '/wishlist', label: 'Wishlist', icon: Heart, primary: true },
  { href: '/following', label: 'Following', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/profile', label: 'Profile', icon: User, primary: true },
  { href: '/settings', label: 'Settings', icon: Settings },
];

/** The single conversion CTA pinned in the sidebar. */
export const BECOME_VENDOR: NavItem = {
  href: '/become-vendor',
  label: 'Become a vendor',
  icon: Store,
};
