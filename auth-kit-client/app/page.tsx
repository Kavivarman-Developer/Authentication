"use client";

import { useState } from "react";
import useRedirect from "@/hooks/useUserRedirect";
import { useUserContext } from "@/Context/userContext";




export default function Home() {

  useRedirect("/login");
  const {logoutUser, user, handleUserInput, userState, updateUser, emailVerification} = useUserContext();
  const {name, photo, isVerified, bio} = user;

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Function for toggle
  const myToggle = () => {
    setIsOpen(!isOpen);
  }

  
  return <main className="py-[2rem] mx-[10rem]">
    <header className="flex justify-between">
      <h1 className="text-[2rem] font-bold">
        Hey there... i'm <span className="text-red-600">{name}</span>
      </h1>
      <div className="flex items-center gap-2">
        <img
           src={photo}
           alt={name}
           className="w-[40px] h-[40px] rounded-full"
        />

        {!isVerified && (
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={emailVerification}>Verified Account</button>
        )}

      </div>
      <button 
         onClick={logoutUser}
         className="px-4 bg-red-600 text-white rounded-md">Logout</button>
    </header>

    <section>
      <p className="text-[#999] text-[2rem]">{bio}</p>
      <h1>
        <button onClick={myToggle} className="px-4 py-2 bg-[#2ECC71] text-white rounded-md">Update Bio</button>
      </h1>

      { isOpen && <form className="mt-4 max-w-[400px] w-full">
            <div className="flex flex-col">
              <label htmlFor="bio" className="mb-1 text-[#999]">Bio</label>
              <textarea 
                  name="bio" 
                  defaultValue={bio} 
                  onChange={ (e) => handleUserInput('bio')(e)}
                  className="px-4 py-3 border-[2rem] rounded-md outline-[#2ECC71]"
                  >
              </textarea>
              <button 
                   type="submit"
                   onClick={(e) => updateUser(e, { bio: userState.bio }) }
                  className="px-4 mt-4 border-[2px] bg-blue-500 text-white p-[1rem] rounded-md"
                  >
                Update Bio
              </button>
            </div>
         </form>
      }

    </section>

  </main>
}
