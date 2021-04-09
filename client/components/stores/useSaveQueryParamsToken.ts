import { useEffect } from "react"
import {useRouter} from 'next/router'
import useToken from "./useToken";


export default () => {
    const router = useRouter();
    useEffect(() => {
        const { jwtTok } = router.query
        if(jwtTok && jwtTok!==""){
            useToken.getState().setToken(jwtTok);
            router.push("/home")
        }
    },[router.query,router.push])
}