"use client"

import { useUserContext } from '@/Context/userContext';
import React, { useState } from 'react'

const ForgotPasswordForm = () => {

    const { forgorPasswordEmail } = useUserContext();

    // state
   const [email, setEmail] = useState("");

   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
   }

   const handleSubmit = (e:any) => {
    e.preventDefault();
    forgorPasswordEmail(email);
    
    // Clear input
    setEmail("");

   }

  return (
    <form className='m-[2rem] px-10 py-14 rounded-lg bg-white max-w-[520px] w-full'>
        <div className='relative z-10'>
            <h1 className='mb-2 text-center text-[1.35rem] font-medium'>
                Enter Email To Reset Password
            </h1>
            <div className='mt-[1rem] flex flex-col'>
                <label htmlFor="email" className='mb-1 text-[#999]'>Email</label>
                <input type="email"
                   value={email}
                   onChange={handleEmailChange}
                   name='email'
                   placeholder='Enter email'
                   className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71]'
                />
            </div>
            <div className='flex'>
                <button 
                  type='submit'
                  onClick={handleSubmit}
                  className='mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors'
                >
                    Reset Password
                </button>
            </div>
        </div>
    </form>
  )
}

export default ForgotPasswordForm;