import { useEffect } from "react"
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { LayoutDashboard, Package, Tags, ShoppingBag, Users, Settings, Store, PanelLeft, EthernetPort } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
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
    checkSession();
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
            <Outlet />
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
      className="border-r"
      
    >
      <SidebarHeader className="border-b px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-none">
              Tienda Admin
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              Panel interno
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <AdminSidebarItem key={item.path} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-3">
        <div className="rounded-xl bg-muted px-3 py-3">
          <p className="text-sm font-medium">Administración</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
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
          "h-10 cursor-pointer rounded text-black",
          "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
          "data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground"
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