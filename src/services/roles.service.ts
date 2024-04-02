import { Role } from "@/model/role"
import { authRepository } from "./auth.repository"

class RolesService {

    private readonly urlBase = 'http://localhost:3030/roles'

    private getHeaders() {
        const logged = authRepository.getLoggedUser()
        const token = logged ? logged.token : ''
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }

    private async getData(response: Response) {
        const json = response.json();
        json.then(data => console.log(data));

        if (response.ok) {
            return await json;
        } else {
            if (response.status === 401 || response.status === 403) return null
            
            if (response.status === 400) {
                throw new Error('Role já existe!')
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
            return data as Role[]
        } else {
            return null
        }
    }

    public async delete(id: number){
        const response = await fetch(`${this.urlBase}/${id}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
        })

        if (response.ok) {
            return Boolean(await response.text())
        } else {
            if (response.status === 401 || response.status === 403) return null
            
            if (response.status === 400) {
                throw new Error('Falha ao deletar Role')
            } else {
                throw new Error(response.statusText, { cause: response.status })
            }
        }
    }

    public async get(id:number){
        const response = await fetch(
            `${this.urlBase}/${id}`,
            {
                method: "GET",
                headers: this.getHeaders()
            }
        )
        const data = this.getData(response);
        if(data){
            return data as unknown as Role;
        }else{
            return null;
        }
        
    }

    public async save(role: Role){
        const response = await fetch(
            `${this.urlBase}`,
            {
                method:"POST",
                headers: this.getHeaders(),
                body: JSON.stringify(role)
            }
        )

        return response.status > 200 && response.status <= 299
    }

    public async update(role: Role){
        const response = await fetch(
            `${this.urlBase}/${role.id}`,
            {
                method:"PUT",
                headers: this.getHeaders(),
                body: JSON.stringify({...role, id: undefined})
            }
        )
        
        console.log(response);

        return response.status > 200 && response.status <= 299
    }
}
export const roleService = new RolesService();