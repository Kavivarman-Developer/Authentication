import { useUserContext } from "@/Context/userContext"
import { useRouter } from "next/navigation";
import { useEffect } from "react";


const useRedirect =  (redirect: string) => {
   const { userLoginStatus } = useUserContext();
   const router = useRouter();

   useEffect(() => {
    const redirectUser = async () => {
        try {
            const isLoggedUser = await userLoginStatus();
            // console.log('isLogged user', isLoggedUser);
            
            if(!isLoggedUser) {
                router.push(redirect)
            }

        }catch(error) {
            console.log('Error in redircting user', error);
        }
    };
    
    redirectUser();

   }, [redirect, userLoginStatus, router]);

};

export default useRedirect;