// import { useEffect, useState } from "react"


// export const useAuth = () => {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [userLogin, setUserLogin] = useState<string | null>(null);

//     useEffect(() => {
//         const checkAuth = () => {
//             const storedUserId = localStorage.getItem('userId');
//             const storedUserLogin = localStorage.getItem('userLogin');

//             if (storedUserId) {
//                 setIsLoggedIn(true);
//                 setUserLogin(storedUserLogin);
//             } else {
//                 setIsLoggedIn(false);
//                 setUserLogin(null);
//             }
//         };

//         checkAuth();
        
//         window.addEventListener('storage', checkAuth);

//         return () => window.removeEventListener('storage', checkAuth);
//     }, []);

//     const logout = () => {
//         localStorage.removeItem('userId');
//         localStorage.removeItem('userLogin');
//         setIsLoggedIn(false);
//         setUserLogin(null);
//     };

//     return { isLoggedIn, userLogin, logout };
// } 