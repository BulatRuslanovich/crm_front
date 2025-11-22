'use client';

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext";

const NavBar = () => {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  return (
    <header>
        <nav>
            <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="logo" width={24} height={24}></Image>

                <p>Farm CRM</p>
            </Link>

            <ul className="flex items-center gap-6">
                {!isLoading && user ? (
                    <>
                      <Link href="/activ" className="hover:text-primary transition">
                        Активности
                      </Link>

                      <button 
                        onClick={async () => {
                          await logout();
                          router.push('/login');
                        }} 
                        className="text-red-400 hover:underline transition"
                      >
                        Выйти
                      </button>
                    </>
                ) : !isLoading ? (
                    <>
                    <Link href="/login" className="hover:text-primary transition">
                      Войти
                    </Link>
                    <Link href="/register" className="hover:text-primary transition">
                      Зарегистрироваться
                    </Link>
                    </>
                ) : (
                    <span className="text-light-200">Загрузка...</span>
                )
                }
            </ul>
        </nav>
    </header>
  )
}

export default NavBar