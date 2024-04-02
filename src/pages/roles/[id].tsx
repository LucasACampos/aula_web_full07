"use client"
import TextInput from "@/components/TextInput";
import { Role } from "@/model/role";
import { roleService } from "@/services/roles.service";
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from "react"

export default function RolePage() {

    const params = useParams();
    const router = useRouter();

    const [role, setRole] = useState<Role>(
        {
            id: undefined,
            name: "",
            description: ""
        }
    );

    function goBack() {
        router.back();
    }

    useEffect(() => {
        if (params && params.id && params.id !== 'create') {
            roleService.get(Number(params.id)).then(
                roleFromDatabase => {
                    if (roleFromDatabase) setRole(roleFromDatabase);
                    else goBack();
                }
            )
        }
    }, []);

    async function save() {

        if (role?.id) {
            await roleService.update(role);
            goBack();
            
        }else{
            await roleService.save(role);
            goBack();
        }

    }

    return (
        <div>
            <header>
                <h2>
                    {role.id ?
                        `Editar Role ${role.id}-${role.name}`
                        :
                        "Cadastrar nova Role"
                    }</h2>
            </header>
            
            <TextInput
                type="text"
                label="Nome"
                value={role.name}
                change={value => setRole({ ...role, name: value })}
            />
            <TextInput
                type="text"
                label="Descrição"
                value={role.description}
                change={value => setRole({ ...role, description: value })}
            />
            <div>
                <button onClick={goBack}>Cancelar</button>
                <button onClick={save}>Salvar</button>
            </div>
            

        </div>
    )

}