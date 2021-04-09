import React from 'react'
import useSaveQueryParamsToken from '../components/stores/useSaveQueryParamsToken'

const Login: React.FC = () => {
    useSaveQueryParamsToken();
    return (
        <div>
            <a href={`${process.env.NEXT_PUBLIC_SERVER}/api/auth/oauth`}>Sign in with google</a>
        </div>
    )
}

export default Login;
