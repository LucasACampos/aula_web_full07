import React from 'react'
import { useRouter } from 'next/navigation'

import TextInput from '@/components/TextInput'
import { authService } from '../../services/auth.service'
import styles from './styles.module.scss'

export default function LoginPage() {

    const router = useRouter()

    let username: string = ''
    let password: string = ''

    async function login() {
        const isLogged = await authService.login(username, password)
        if (isLogged) {
            router.replace('users')
        } else {
            alert('Usuário/senha inválido(a)')
        }
    }

    return (
        <div className={styles.login}>
            <header>
                <h2>Acesso ao Sistema</h2>
            </header>
            <main>
                <TextInput
                    type='text'
                    label='Usuário'
                    change={value => username = value}
                />
                <TextInput
                    type='password'
                    label='Senha'
                    change={value => password = value}
                />
            </main>

            <footer>
                <button className='confirmButton' onClick={login}>Entrar</button>
            </footer>
        </div>
    )

}