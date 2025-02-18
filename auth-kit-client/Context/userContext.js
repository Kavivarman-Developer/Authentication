"use client"
import axios from "axios";
import { useRouter } from "next/navigation";
import React, {createContext, useContext, UseContext, useEffect, useState} from "react";
import toast from "react-hot-toast";


const UserContext = React.createContext();

export const UserContextProvider = ( {children} ) => {

    const serverUrl = "http://localhost:8080";

    const router = useRouter();

    const [user, setUser] = useState(null);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);


    // register user
    const registerUser = async (e) => {
        e.preventDefault();
        if(!userState.email.includes('@') || !userState.password || userState.password.length < 6) {
            toast.error('Please enter the valid email and password Min 6 Chars!');
            return;
        }

        try {
            const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
            console.log('user resgister succefully', res.data);
            toast.success('User registered successfully');

            // Clear the form
            setUserState({
                name: "",
                email: "",
                password: "",
            });
            
            // redirect the login page
            router.push('/login'); 

        } catch(error){
            console.log('Error registering user', error);
            toast.error(error.response.data.message);
        }
    };

    // Get user logged in status
    const userLoginStatus = async () => {
    
        let loggedIn = false;
       
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login-status`, {
                withCredentials: true, // send cookies to the server
            });
    
            // coerce the string  to boolean
            loggedIn = !!res.data;
            setLoading(false);
    
            if(!loggedIn) {
                router.push('/login');
            }
        }catch(error) {
            console.log('Error getting user login status', error);
        }

        //console.log('userlogged status', loggedIn);
        return loggedIn;
    };

    // dynamic form handler
    const handleUserInput = (name) => (e) => {
        const value = e.target.value;

        setUserState((pre) => ({
            ...pre,
            [name]: value
        }));
    }


    // Login the user
    const LoginUser = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`, {
                email: userState.email,
                password: userState.password,
            }, {
                withCredentials: true, // send cookies the server
            });

            toast.success('User logged in successfully');

            // clear the form
            setUserState({
                email: "",
                password: "",
            });

            // push user the dashboard page
            router.push('/');

        }catch(error) {
            console.log('Error logging in user', error);
            toast.error(error.response.message);
        }
    }

    // Logout user
    const logoutUser = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true, // send cookies to the server
            });
            toast.success('User logged out successfully');

            // redirect to the login page
            router.push('/login');

        }catch(error) {
            console.log('Error logged user', error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(() => {
        userLoginStatus();
    }, []);


    return (
        <UserContext.Provider value = {{
            registerUser,
            userState,
            handleUserInput,
            LoginUser,
            logoutUser,
        }} >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
}



