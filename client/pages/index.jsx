import React from 'react'
import useSaveQueryParamsToken from '../components/stores/useSaveQueryParamsToken'

export default function Login() {
    useSaveQueryParamsToken();
    return (
        <div>
            <a href={`${process.env.NEXT_PUBLIC_SERVER}/api/auth/oauth`}>Sign in with google</a>
        </div>
    )
}
