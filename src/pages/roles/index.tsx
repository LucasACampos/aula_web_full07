import RowItem from "@/components/RowItem";
import { Role } from "@/model/role";
import { authRepository } from "@/services/auth.repository";
import { roleService } from "@/services/roles.service";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";

export default function RolesPage() {

    const router = useRouter();

    const [roles, setRoules] = useState<Role[]>()

    function fetchRoles() {
        const listOfRoles = roleService.getList();

        listOfRoles.then(list => {
            if (list) {
                setRoules(list)
            } else {
                authRepository.logOut(router)
            }
        });
    }

    useEffect(() => fetchRoles(),[]);

    function deleteRow(id: number){
        roleService.delete(id).then(isSaved =>{
            if(isSaved === null) authRepository.logOut(router);
            else if(isSaved) fetchRoles();
        })
    }

    function edit(id: number){
        router.push(`roles/${id}`)
    }

    return (
        <>
            <div>
                <button onClick={() => router.replace("/users")}>Users</button>
                <button onClick={() => router.push("roles/create")}>NovaRole</button>
            </div>
            <div>
                <h2>Roles</h2>
                {
                    roles?.map( role => (
                        <RowItem
                            key={role.id}
                            title={role.name}
                            subTitle={role.description}
                            modelId={role.id}
                            edit={()=>{edit(role.id || 0)}}
                            remove={()=>{deleteRow(role.id || 0)}}
                        />
                    ))
                }
            </div>
        </>
    )
}