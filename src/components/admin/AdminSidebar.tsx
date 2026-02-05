import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { BuildVersionBadge } from "./BuildVersionBadge";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  FileText,
  PenSquare,
  Headphones,
  Music,
  Upload,
  Settings,
  Mic,
  Mail,
  Image,
  Download,
  FileEdit,
  Wrench,
  LogOut,
  ExternalLink,
  Highlighter,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Контент",
    items: [
      { title: "Книги", href: "/admin/books", icon: Library },
      { title: "Scripture Manager", href: "/admin/scripture", icon: BookOpen },
      { title: "Експорт книг", href: "/admin/book-export", icon: Download },
    ],
  },
  {
    title: "Блог",
    items: [
      { title: "Пости", href: "/admin/blog-posts", icon: PenSquare },
      { title: "Категорії", href: "/admin/blog-categories", icon: FileText },
      { title: "Теги", href: "/admin/blog-tags", icon: Hash },
    ],
  },
  {
    title: "Аудіо",
    items: [
      { title: "Плейлісти", href: "/admin/audio-playlists", icon: Headphones },
      { title: "Категорії", href: "/admin/audio-categories", icon: Music },
      { title: "LRC Editor", href: "/admin/lrc-editor", icon: Music },
      { title: "Аудіокниги", href: "/admin/audiobooks", icon: Headphones },
    ],
  },
  {
    title: "Бібліотека",
    items: [
      { title: "Лекції", href: "/admin/lectures", icon: Mic },
      { title: "Листи", href: "/admin/letters", icon: Mail },
    ],
  },
  {
    title: "Імпорт",
    items: [
      { title: "Універсальний імпорт", href: "/admin/universal-import", icon: Upload },
      { title: "BBT імпорт", href: "/admin/bbt-import", icon: Upload },
      { title: "Імпорт лекцій", href: "/admin/lecture-import", icon: Upload },
      { title: "Імпорт листів", href: "/admin/letter-import", icon: Upload },
    ],
  },
  {
    title: "Налаштування",
    items: [
      { title: "Сторінки", href: "/admin/pages", icon: FileEdit },
      { title: "Статичні сторінки", href: "/admin/static-pages", icon: FileEdit },
      { title: "Банери", href: "/admin/site-banners", icon: Image },
    ],
  },
  {
    title: "Dev Tools",
    items: [
      { title: "Normalize Texts", href: "/admin/normalize-texts", icon: Wrench },
      { title: "Fix RLS Policies", href: "/admin/fix-rls-policies", icon: Wrench },
      { title: "Highlights", href: "/admin/highlights", icon: Highlighter },
      { title: "Merge NOI", href: "/admin/merge-noi", icon: Wrench },
      { title: "NumCal", href: "/admin/numcal", icon: Hash },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const { getLocalizedPath } = useLanguage();

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return location.pathname === "/admin" || location.pathname === "/admin/dashboard";
    }
    return location.pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = getLocalizedPath("/");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <Link to="/admin/dashboard" className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="h-5 w-5" />
            <span>Адмін-панель</span>
          </Link>
        </div>
        <div className="px-2 pb-2">
          <BuildVersionBadge />
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard link */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/admin/dashboard")}>
                <Link to="/admin/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation groups */}
        {navGroups.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive(item.href)}>
                      <Link to={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to={getLocalizedPath("/")} target="_blank">
                <ExternalLink className="h-4 w-4" />
                <span>Відкрити сайт</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              <span>Вийти</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
