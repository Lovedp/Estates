import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { app } from "../Firebase"
import React from 'react'
import {useDispatch} from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

function Oauth() {
    const dispatch =useDispatch();
    const navigate= useNavigate();
    const handleGoogleClick = async () => {
        try {
            const provider= new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            console.log("User signed in:", result);
            
            const res = await fetch('/api/auth/google',{
                method:'POST',
                headers:{
                    'Content-type': 'application/json',
                },
                body:JSON.stringify({name:result.user.displayName, email: result.user.email, photo:result.user.photoURL}),
            })
           const data = await res.json();
           dispatch(signInSuccess(data)); 
           navigate('/');  
        } catch (error) {
            console.log("Couldn't sign in with Google", error);
        }
    };

    return (
        <button 
            onClick={handleGoogleClick} 
            type="button" 
            className="w-full bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95"
        >
            Continue with Google
        </button>
    );
}

export default Oauth;
