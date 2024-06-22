import { createStorage, type SimpleStorage } from '@/storage'

class Auth {
    private storage: SimpleStorage

    constructor(persistent:boolean = false) {
        this.storage = createStorage(persistent)
    }

    success(response: Response, onSuccess: () => void){
        response.json().then((json) => {
            this.storage.store('token', json.token)
            this.storage.store('email', json.email)
            onSuccess()
        })
    }

    failure(response: Response | null = null, onFailure: () => void){
        if (response === null) {
            console.log("Fail to establish connection to the API server.")
        }
        onFailure()
    }

    async Login(
      email: string, 
      password: string, 
      onSuccess: () => void,
      onFailure: () => void)
    {
        // console.log(`e${email},p${password}`)
        const body = {
            login: {
                email: email,
                password: password
            }
        }

        const URL = `${import.meta.env.VITE_DELIVERY_API_URL}/sign_in`
        try {
            const response = await fetch(URL,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-API-KEY": `${import.meta.env.VITE_X_API_KEY}`
                },
                body: JSON.stringify(body)
            }).then((response) => {
                if(response.ok) this.success(response, onSuccess)
                else this.failure(response, onFailure)
            })
        } catch (error) {
            this.failure(null, onFailure)
        }
    }

    async SignUp(
      email: string, 
      password: string, 
      passwordConfirmation: string, 
      onSuccess: () => void,
      onFailure: () => void)
    {
        const userRoles = {buyer: 1, seller: 2}
        const body = {
            user: {
                email: email,
                password: password,
                password_confirmation: passwordConfirmation,
                role: userRoles["seller"],
            }
        }

        const URL = `${import.meta.env.VITE_DELIVERY_API_URL}/new`
        
        try {
            const response = await fetch(URL,{
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-API-KEY": `${import.meta.env.VITE_X_API_KEY}`
                },
                body: JSON.stringify(body)
            }).then((response) => {
                if(response.ok) this.success(response, onSuccess)
                else this.failure(response, onFailure)
            })
        } catch (error) {
            this.failure(null, onFailure)
        }
    }

    SignOut(andThen = () => {}){
        //(r) invalidate token
        let transient = createStorage(false)
        transient.remove('token')
        transient.remove('email')
        let persistent = createStorage(true)
        persistent.remove('token')
        persistent.remove('email')

        andThen()
    }

    public getFallback(key: string) : string | null {
        let transient = createStorage(false)
        let persistent = createStorage(true)

        return transient.get(key) || persistent.get(key)
    }

    isLoggedIn(){
        // console.log(`${Boolean(this.getFallback('token'))}`)
        return Boolean(this.getFallback('token'))
    }

    currentUser(){
        if(!this.isLoggedIn()) return null

        return {email: this.getFallback('email')}
    }
}

export { Auth }