import { useNavigate, useParams } from "react-router-dom"
import type { UserFormData } from "@/components/own/forms/user-form"
import useTitle, { useViewPrevButton } from "@/hooks/use-title"
// Asegúrate de importar desde el archivo correcto donde guardaste tus hooks de usuarios
import { useUserDetail, useUpdateUser } from "@/hooks/api/useUsers" 
import UserForm from "@/components/own/forms/user-form"
import type { User } from "@/api/models"

export default function UsersAdminDetail() {
  useViewPrevButton(true)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const { data: user } = useUserDetail(id)
  
  // Muestra el nombre de usuario en el título superior
  useTitle(user ? `${user.username.toUpperCase()}` : "Detalle de usuario")
  
  const updateUserMutation = useUpdateUser()
  
  const handleEdit = async (payload: Partial<User>) => {
    if (!id) {
      navigate(-1)
      return
    }

    try {
      await updateUserMutation.mutateAsync({ userId: id, payload })
      navigate(-1)
    } catch (error) {
      console.error("Error al actualizar el usuario:", error)
    }
  }

  return (
    <div className="">
      {user && (
        <UserForm
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
  }
}