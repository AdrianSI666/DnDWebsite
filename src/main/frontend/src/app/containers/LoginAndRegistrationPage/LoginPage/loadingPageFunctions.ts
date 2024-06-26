import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthenticationControllerService, LoginForm } from "../../../../services/openapi";




export function LoginFunction(){
    const queryClient = useQueryClient()

    const authenticate = useMutation({
        mutationFn:AuthenticationControllerService.authenticateAndGetToken,
    })


    async function getAuthJWT(email:string,password:string): Promise<string>{
        let LoginForm:LoginForm ={
            email:email,
            password:password
        }
        
        

        return authenticate.mutateAsync(JSON.parse(`{email:${email},password:${password}}`)).then(res =>{
            return res
        })
    }

    return{
        getAuthJWT
    }
}