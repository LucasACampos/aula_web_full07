import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import TextInput from '@/components/TextInput'
import { userService } from '@/services/user.service'
import styles from './styles.module.scss'
import { User } from '@/model/user'
import { roleService } from '@/services/roles.service'
import { Role } from '@/model/role'

export default function UserPage() {

    const router = useRouter()
    const params = useParams()

    const [user, setUser] = React.useState<User>({
        name: '', username: '', password: '', roles: []
    })

    const [rolesFromDatabase, setRolesFromDatabase] = useState<Role[]>([]);
    const [radioForRoles, setRadioForRoles] = useState<React.JSX.Element[]>();
    const [reloadCheckbox, setReloadCheckbox] = useState<boolean>();

    let confirmPass: string = ''

    React.useEffect(() => {
        if (params && params.id && params.id !== 'create') {
            userService.get(Number(params.id)).then(saved => {
                if (saved) setUser(saved)
                else goBack()
            })
        }
    }, [params?.id])

    useEffect(() => {
        roleService.getList().then(response => setRolesFromDatabase(response || []));
    }, []);

    function setRolesForUser(){
        const selectedRoles = document.querySelectorAll(".js-select-roles > .js-option-role:checked");
        const values = Array.prototype.map.call(selectedRoles, (role)=>role.getAttribute("value"));
        user.roles = values as string[]
    }

    useEffect(()=>{
        setRadioForRoles(
            rolesFromDatabase.map(
                (role, index) =>{ 
                    return (
                        <div key={index}>
                            <label>{role.name}</label>
                            <input
                                value={role.name}
                                checked={user.roles?.includes(role.name)}
                                type='checkbox'
                                onChange={()=>{
                                    if(user.roles?.includes(role.name)){
                                        user.roles.splice(user.roles.indexOf(role.name), 1);
                                    }else{
                                        user.roles?.push(role.name);
                                    }
                                    setReloadCheckbox(!reloadCheckbox);
                                }}
                            />
                        </div>
                    ) 
                }
            )
        )
    }, [user.id, user, reloadCheckbox, rolesFromDatabase]);

    function goBack() {
        router.back()
    }

    function save() {
        if (!user.name || user.name.trim() === '') {
            alert('Nome é obrigatório!')
            return
        }

        if (user.id) {
            userService.update(user.id!, user.name, user.roles).then(isSaved => {
                if (isSaved) {
                    goBack()
                } else {
                    router.replace('login')
                }
            }).catch(error => {
                alert(error.message)
            })

        } else {
            if (!user.username || user.username.trim() === '') {
                alert('Login é obrigatório!')
                return
            }
            if (!user.password || user.password.trim() === '') {
                alert('Senha é obrigatório!')
                return
            }
            if (user.password !== confirmPass) {
                alert('Senha não confere!')
                return
            }

            userService.create(user).then(isSaved => {
                if (isSaved) {
                    goBack()
                } else {
                    router.replace('login')
                }
            }).catch(error => {
                alert(error.message)
            })
        }
    }

    return (
        <div className={styles.user}>
            <header>
                <h2>{user.id ? `Editar Usuário Id ${user.id}` : 'Cadastrar Usuário'}</h2>
            </header>
            <main>
                <TextInput
                    type="text"
                    label='Nome'
                    value={user.name}
                    change={value => setUser({ ...user, name: value })}
                />

                <TextInput
                    type="text"
                    label='Login'
                    disable={!!user.id}
                    value={user.username}
                    change={value => setUser({ ...user, username: value })}
                />

                {!user.id && (
                    <>
                        <TextInput
                            type="password"
                            label='Senha'
                            change={value => setUser({ ...user, password: value })}
                        />

                        <TextInput
                            type="password"
                            label='Confirmar Senha'
                            change={value => confirmPass = value}
                        />
                    </>
                )}

                {radioForRoles}
            </main>

            <footer>
                <button onClick={goBack}>Cancelar</button>
                <button className='confirmButton' onClick={save}>Salvar</button>
            </footer>
        </div>
    )

}