import { Outlet } from "react-router-dom"

export default function AdminLayout(){

    return (
        <div className="body">
            <h2>admin</h2>
            <Outlet />
        </div>
    )
}