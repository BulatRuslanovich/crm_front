import Link from "next/link"
import Image from "next/image"

const NavBar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="logo" width={24} height={24}></Image>

                <p>Farm CRM</p>
            </Link>

            <ul>
                <Link href="/login">Залогиниться</Link>
                <Link href="/register">Зарегаться</Link>
                <Link href="/">На три буквы</Link>
            </ul>
        </nav>
    </header>
  )
}

export default NavBar