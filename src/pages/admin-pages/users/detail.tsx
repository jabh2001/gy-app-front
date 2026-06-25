import { useNavigate, useParams } from "react-router-dom"
import type { UserFormData } from "@/components/own/forms/user-form.types"
import useTitle, { useViewPrevButton } from "@/hooks/use-title"
import { useUserDetail, useUpdateUser } from "@/hooks/api/useUsers"
import UserForm from "@/components/own/forms/user-form"
import type { User } from "@/api/models"
import { showApiError } from "@/api/index"
import { toast } from "sonner"

export default function UsersAdminDetail() {
  useViewPrevButton(true)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: user } = useUserDetail(id)

  useTitle(user ? `${user.username.toUpperCase()}` : "Detalle de usuario")

  const updateUserMutation = useUpdateUser()

  const handleEdit = async (payload: Partial<User> & { password?: string }) => {
    if (!id) {
      navigate(-1)
      return
    }

    try {
      await updateUserMutation.mutateAsync({ userId: id, payload })
      toast.success('Usuario actualizado correctamente.')
      navigate(-1)
    } catch (error) {
      showApiError(error, 'No se pudo actualizar el usuario')
    }
  }

  return (
    <div className="">
      {user && (
        <UserForm
          key={user.id}
          data={mapUserToFormData(user)}
          onEdit={handleEdit}
          submitLabel="Editar usuario"
          onSave={() => { }}
        />
      )}
    </div>
  )
}

function mapUserToFormData(user: User): UserFormData {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    status: "Activo",
  }
}
