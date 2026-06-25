import { Suspense, useEffect } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Package, Tags, ShoppingBag, Users, Settings, Store, PanelLeft, EthernetPort } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import { useTitleStore } from "@/hooks/use-title"
import { useSession } from "@/hooks/use-session"

const navItems = [
  {
    label: "Página",
    path: "/",
    icon: EthernetPort,
    end: true,
  },
  { 
    label: "Inicio",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Productos",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Categorías",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Pedidos",
    path: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Usuarios",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Ajustes",
    path: "/admin/settings",
    icon: Settings,
  },
]

function AdminPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const checkSession = useSession((state) => state.checkSession);
  const user = useSession((state) => state.user);
  const hasCheckedSession = useSession((state) => state.hasCheckedSession);
  const title = useTitleStore((state) => state.title)
  const viewPrevButton = useTitleStore((state) => state.viewPrevButton)
  const navigate = useNavigate()

  
  useEffect(() => {
    document.title = title ? `${title} | Tienda Admin` : "Tienda Admin"
  }, [title])
  useEffect(() => {
    hasCheckedSession && !user && navigate("/login")
  }, [user])
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSession();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkSession]);

  // if (!hasCheckedSession) return null;
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
          <SidebarTrigger className="h-9 w-9">
            <PanelLeft className="h-5 w-5" />
          </SidebarTrigger>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold sm:text-lg">
              {title}
            </h1>
            {/* <p className="hidden text-xs text-muted-foreground sm:block">
              Gestiona productos, categorías, pedidos, usuarios y ajustes.
            </p> */}
          </div>
          {viewPrevButton && <div className="flex-1 flex justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Regresar
            </Button>
          </div>}
        </header>

        <main className="min-h-[calc(100vh-4rem)] bg-muted/30">
          <div className="mx-auto w-full">
            <Suspense fallback={<AdminPageSkeleton />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function AdminSidebar() {
  return (
    <Sidebar
      side="left"
      variant="inset"
      collapsible="offcanvas"
      className="border-r isolate"
    >
      <div aria-hidden className="absolute dark:brightness-50 hue-rotate-180 inset-0 z-0 bg-[url(/side-bg.jpg)] bg-cover bg-center" />
      <div aria-hidden className="absolute inset-0 z-[1] bg-sky-200/30" />

      <SidebarHeader className="relative z-10 border-b border-white/10 px-3 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none text-white">
              Tienda Admin
            </p>
            <p className="mt-1 truncate text-xs text-white/60">
              Panel interno
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="relative z-10">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Navegación</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="px-1 space-y-2">
              {navItems.map((item) => (
                <AdminSidebarItem key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="relative z-10 border-t border-white/10 p-3">
        <div className="rounded-xl bg-white/40 dark:bg-black/50 px-3 py-3 backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground">Administración</p>
          <p className="mt-1 text-xs leading-5 text-foreground/60">
            Acceso para gestionar la tienda.
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

function AdminSidebarItem({
  item,
}: {
  item: {
    label: string
    path: string
    icon: React.ElementType
    end?: boolean
  }
}) {
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  const Icon = item.icon

  const isActive = item.end
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
        variant={"outline"}
        className={cn(
          "h-10 cursor-pointer rounded bg-white/10 text-white/80",
          "hover:bg-white/20 hover:text-white",
          "data-[active=false]:bg-primary/20 data-[active=false]:text-white",
          "data-[active=false]:hover:bg-primary/40 data-[active=false]:hover:text-white",
          "data-[active=true]:bg-primary/50 data-[active=true]:text-white",
        )}
      >
        <NavLink
          to={item.path}
          end={item.end}
          onClick={() => {
            if (isMobile) {
              setOpenMobile(false)
            }
          }}
        >
          <Icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}