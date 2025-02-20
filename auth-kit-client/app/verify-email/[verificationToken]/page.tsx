"use client"
import { useUserContext } from '@/Context/userContext';
import React from 'react'

interface Props {
    params: {
        verificationToken: string;
    }
}

function page ({params}: Props)  {
    const {verificationToken} = params;

    const { verifyUser } = useUserContext();
 
  return <div className='auth-name flex flex-col items-center justify-center'>
    <div className="bg-white flex flex-col justify-center px-[3rem] py-[4rem] rounded-md gap-[2rem]">
    <h1 className='text-[#999] text-[2rem]'>Verify Your Account</h1>
    <button className='px-4 py-2 bg-blue-500 text-white self-center rounded-md'
       onClick={() => {
        verifyUser(verificationToken);
       }}
    >Verify</button>
    </div>
  </div>

}

export default page;