import { useEffect } from "react"
import {useRouter} from 'next/router'
import useToken from "./useToken";


const useSaveQueryParamsToken = () => {
    const router = useRouter();
    useEffect(() => {
        const { jwtTok } = router.query
        if(jwtTok && jwtTok!==""){
            useToken.getState().setToken(jwtTok as string);
            router.push("/home")
        }
    },[router.query,router.push])
}

export default useSaveQueryParamsToken;