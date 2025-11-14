export interface NavigationItem {
  label: string;
  href: string;
  id?: string;
}

export interface NavigationConfig {
  items: NavigationItem[];
}

