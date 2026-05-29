import {
  LogIn,
  LogOut,
  ShoppingCart,
  User,
  UserPlus,
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
  const hasCheckedSession = useSession((state) => state.hasCheckedSession);
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
              Guest
            </SheetTitle>
          </div>

          <SheetClose asChild>
            <button
              type="button"
              className="rounded-full p-2 text-slate-900 transition hover:bg-slate-100"
              aria-label="Close account drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="space-y-6 p-2 pt-[18px]">
          
            
            { !hasCheckedSession && <div className="size-full aspect-square grid place-center">
                <svg aria-hidden="true" className="size-12  m-auto aspect-square text-gray-500 animate-spin fill-primary stroke-2" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div>
          }

          { hasCheckedSession && <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
            <MenuItem
              icon={<ShoppingCart />}
              label="Carrito"
              count={cartCount}
              to={cartPath}
            />
          </div>}

          { hasCheckedSession && !user && <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
            <MenuItem icon={<LogIn />} label="Iniciar sesión" to={loginPath} />
            <MenuItem icon={<UserPlus />} label="Registrarse" to={registerPath} />
          </div>}
          { hasCheckedSession && user && <div className="overflow-hidden rounded-[4px] border border-[#dfe3e8] bg-white">
            <MenuItem icon={<User />} label="Perfil" to={profilePath} />
            <MenuItem icon={<LogOut />} label="Cerrar sesión" to={logoutPath} />
          </div>}
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
