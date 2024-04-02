import React from 'react'
import { useRouter } from 'next/navigation'

import { userService } from '@/services/user.service'
import { authRepository } from '@/services/auth.repository'
import { User } from '@/model/user'

import RowItem from '@/components/RowItem'
import styles from './styles.module.scss'

export default function UsersPage() {

    const router = useRouter()

    const [users, setUsers] = React.useState<User[]>([])

    function createNewUser() {
        router.push(`users/create`)
    }

    function fetchUsers() {
        userService.getList().then(list => {
            if (list) {
                setUsers(list)
            } else {
                authRepository.logOut(router)
            }
        }).catch((error: Error) => {
            console.error('Error: ', error)
        })
    }

    function edit(id: number) {
        router.push(`users/${id}`)
    }

    function remove(id: number) {
        userService.delete(id).then(isSaved => {
            if (isSaved === null) authRepository.logOut(router)
            if (isSaved) fetchUsers()
        })
    }

    React.useEffect(() => {
        fetchUsers()
    }, [])

    return (
        <div className={styles.users}>
            <header>
                <h2>Usuários</h2>
                <div className={styles.actions}>
                    <button onClick={createNewUser}>Add</button>
                    <button onClick={()=>router.push("roles")}>Roles</button>
                    <button onClick={()=>authRepository.logOut(router)}>Sair</button>
                </div>
            </header>
            <main>
                {
                    users.map(user => (
                        <RowItem 
                            key={user.id} 
                            title={user.name}
                            subTitle={user.username}
                            modelId={user.id}
                            edit={edit} 
                            remove={remove} 
                        />
                    ))
                }
            </main>
        </div>
    )

}