import { authRepository } from './auth.repository'
import { User } from '../model/user'
import { Role } from '@/model/role'

class UserService {

    private readonly urlBase = 'http://localhost:3030/users'

    private getHeaders() {
        const logged = authRepository.getLoggedUser()
        const token = logged ? logged.token : ''
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    private async getData(response: Response) {
        if (response.ok) {
            return await response.json()
        } else {
            if (response.status === 401 || response.status === 403) return null
            
            if (response.status === 400) {
                throw new Error('Usuário já existe!')
            } else {
                throw new Error(response.statusText, { cause: response.status })
            }
        }
    }

    public async getList() {
        const response = await fetch(this.urlBase, {
            method: 'GET',
            headers: this.getHeaders()
        })

        const data = await this.getData(response)
        if (data) {
            return data as User[]
        } else {
            return null
        }
    }

    public async get(id: number) {
        const response = await fetch(`${this.urlBase}/${id}`, {
            method: 'GET',
            headers: this.getHeaders()
        })

        const data = await this.getData(response)
        if (data) {
            return data as User
        } else {
            return null
        }
    }

    public async create(user: User) {
        const response = await fetch(this.urlBase, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(user)
        })

        const data = await this.getData(response)
        if (data) {
            const saved: User = data
            return (saved && saved.id) ? true : false
        } else {
            return null
        }
    }

    public async update(id: number, name: string, roles:string[] | undefined) {
        const response = await fetch(`${this.urlBase}/${id}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify({ name, roles })
        })

        const data = await this.getData(response)
        if (data) {
            return !!data
        } else {
            return null
        }
    }

    public async delete(id: number) {
        const response = await fetch(`${this.urlBase}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        })

        if (response.ok) {
            return Boolean(await response.text())
        } else {
            if (response.status === 401 || response.status === 403) return null
            
            if (response.status === 400) {
                throw new Error('Falha ao deletar Usuário')
            } else {
                throw new Error(response.statusText, { cause: response.status })
            }
        }
    }
}

export const userService = new UserService()