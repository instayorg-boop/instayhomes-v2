import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Home, Ticket, Users, PenLine, ArrowUpRight } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarInset, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import { adminHead } from "@/components/admin-ui";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/admin")({
  head: () => adminHead("Admin", "Manage listings, promo codes, subscribers and blog posts."),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/listings", label: "Listings", icon: Home },
  { to: "/admin/promos", label: "Promo codes", icon: Ticket },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/blog", label: "Blog posts", icon: PenLine },
] as const;

function AdminLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-5">
          <Link to="/admin" className="text-lg font-bold text-foreground">
            Instayhomes <span className="text-primary">admin</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {nav.map((item) => {
                const active = "exact" in item ? path === item.to || path === "/admin/" : path.startsWith(item.to);
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild isActive={active} className="h-10">
                      <Link to={item.to}><item.icon /> {item.label}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View website <ArrowUpRight className="size-4" />
          </Link>
          <p className="text-xs text-muted-foreground">Sample data. Changes aren't saved.</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="bg-muted/40">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-4 md:hidden">
          <SidebarTrigger />
          <span className="font-semibold text-foreground">Admin</span>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-6 md:px-8 md:py-10">
          <Outlet />
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
