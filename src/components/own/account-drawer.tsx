import {
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
  Package,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom"
import { useSession } from "@/hooks/use-session";

interface AccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartCount?: number;
  wishlistCount?: number;
  profilePath?: string;
  logoutPath?: string;
  loginPath?: string;
  registerPath?: string;
  cartPath?: string;
  wishlistPath?: string;
}

export function AccountDrawer({
  isOpen,
  onClose,
  cartCount = 1,
  profilePath,
  logoutPath,
  loginPath,
  registerPath,
  cartPath,
}: AccountDrawerProps) {
  const user = useSession((state) => state.user);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full border-l-0 bg-[#eef1f4] p-0 sm:max-w-[400px] [&>button]:hidden"
      >
        <SheetHeader className="flex h-[82px] flex-row items-center justify-between space-y-0 border-b border-[#dfe3e8] bg-white px-4 py-0">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff9df]">
              <User className="h-5 w-5 text-black" />
            </div>

            <SheetTitle className="text-[17px] font-semibold text-black">
              {user?.username || 'Invitado'}
            </SheetTitle>
          </div>

          <SheetClose asChild>
            <button
              type="button"
              className="rounded-full p-2 text-slate-900 transition hover:bg-slate-100"
              aria-label="Cerrar cuenta"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="space-y-6 p-2 pt-[18px]">
          <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
            <MenuItem icon={<ShoppingCart />} label="Carrito" count={cartCount} to={cartPath} />
          </div>

          {!user ? (
            <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
              <MenuItem icon={<LogIn />} label="Iniciar sesión" to={loginPath} />
              <MenuItem icon={<UserPlus />} label="Registrarse" to={registerPath} />
            </div>
          ) : (
            <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
              <MenuItem icon={<User />} label="Perfil" to={profilePath} />
              <MenuItem icon={<Package />} label="Mis pedidos" to="/orders" />
              <MenuItem icon={<LogOut />} label="Cerrar sesión" to={logoutPath} />
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MenuItem({
  icon,
  label,
  count,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  count?: number;
  to?: string;
}) {
  return (

    <SheetClose asChild>
      <Link
        to={to || "#"}
        className="
        group flex h-[55px] w-full items-center gap-4 border-b border-[#e4e7eb] px-4 text-left transition-all duration-200 ease-in-out 
        hover:bg-[#eceff3] hover:border-[#dfe3e8] active:bg-[#eceff3] last:border-b-0
      "
      >
        <span
          className="
          flex h-5 w-5 items-center justify-center text-[#1d3766] transition-colors duration-200 
          group-hover:text-[#0f2550] [&>svg]:h-4 [&>svg]:w-4
        "
        >
          {icon}
        </span>

        <span
          className="
          text-[14px]
          font-medium
          text-[#142a54]
          transition-colors
          duration-200
          group-hover:text-[#0f2550]
        "
        >
          {label}
          {typeof count === "number" && ` (${count})`}
        </span>
      </Link>
    </SheetClose>
  );
}
