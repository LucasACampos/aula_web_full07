import { User } from "@/model/user"
import { Route } from "next"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import { NextRouter, useRouter } from "next/router"

class AuthRepository {

    private readonly storeKey = '@auth:LOGGED_USER'

    public getLoggedUser() {
        const json = localStorage.getItem(this.storeKey)
        if (json) return JSON.parse(json) as User
        return null
    }

    public setLoggedUser(user: User) {
        localStorage.setItem(this.storeKey, JSON.stringify(user))
    }

    public removeLoggedUser() {
        localStorage.removeItem(this.storeKey)
    }

    public logOut(router: NextRouter | AppRouterInstance) {
        authRepository.removeLoggedUser()
        router.replace('login')
    }

}

export const authRepository = new AuthRepository()