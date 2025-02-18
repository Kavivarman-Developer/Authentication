"use client"
import React from 'react'
import {UserContextProvider} from "../Context/userContext";

interface Props {
    children: React.ReactNode;
}

function UserProvider({ children } : Props) {
    return <UserContextProvider>{children}</UserContextProvider>
}

export default UserProvider;
