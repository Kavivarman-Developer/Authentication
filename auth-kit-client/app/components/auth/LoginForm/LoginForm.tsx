"use client"
import { useUserContext } from '@/Context/userContext';
import React from 'react';

const LoginForm = () => {

  const { LoginUser, userState, handleUserInput } = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form className='m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]'>
      <div className='relative z-10'>
        <h1 className='mb-2 text-center text-[1.35rem] font-medium'>Login your account</h1>
        <p className='mb-8 px-[2rem] text-center text-[#999] text-[14px]'>
          Login Now. Don't have an account? {" "}
          <a
            href="/register"
            className='font-bold text-[#2ECC71] hover:text-[#7263F3] transition-all duration-300'
          >
            Register here
          </a>
        </p>
        <div className='flex flex-col mt-[1rem]'>
          <label htmlFor="name" className='mb-1 text-[#999]'>Email</label>
          <input type="text"
            id='email'
            value={email}
            onChange={(e) => handleUserInput('email')(e)}
            name='email'
            className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71]'
            placeholder='KaviLve@gmail.com'

          />
        </div>
        <div className='relative flex flex-col mt-[1rem]'>
          <label htmlFor="name" className='mb-1 text-[#999]'>Password</label>
          <input 
            type={showPassword ? 'text' : 'password'}
            id='password'
            value={password}
            onChange={(e) => handleUserInput('password')(e)}
            name='password'
            className='px-4 py-3 border-[2px] rounded-md outline-[#2ECC71]'
            placeholder='Password'
          />
          <button type='button' className='absolute p-1 right-4 top-[43%] text-[22px] opacity-45'>
            {
              showPassword ? (<i className='fas fa-eye-slash' onClick={togglePassword}></i>) 
              : (<i className='fas fa-eye' onClick={togglePassword}></i>)
            }
          </button>
        </div>
        <div className='mt-4 flex justify-end'>
          <a
            href="/forgot-password"
            className='font-bold text-[#2ECC71] text-[14px] hover:text-[#7263F3] transition-all duration-300'
          >
            Forgot Password
          </a>
        </div>
        <div className='flex'>
          <button
            type='submit'
            disabled={!email || !password}
            onClick={LoginUser}
            className='mt-[1.5rem] flex-1 px-3 py-2 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] trasition-colors'>
            Login Now
          </button>
        </div>
      </div>
    </form>
  )
}

export default LoginForm;