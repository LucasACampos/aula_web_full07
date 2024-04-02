import axios from 'axios'

import { User } from "@/model/user"
import { authRepository } from './auth.repository'

class AuthService {

    private readonly api = axios.create({ baseURL: 'http://localhost:3030/auth' })

    public async login(username: string, password: string) {
        try {
            const response = await this.api.post('login', { username, password })
            const logged: User = response.data

            if (logged && logged.token) {
                authRepository.setLoggedUser(logged)
                return true
            } else {
                return false
            }
        } catch (error) {
            return false
        }
    }

}

export const authService = new AuthService()
