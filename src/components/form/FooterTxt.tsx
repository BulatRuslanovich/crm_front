import Link from "next/link";

export default function FooterTxt({ isFromLogin }: { isFromLogin: boolean }) {
  return (
    <div>
      <p className="mt-4 text-center text-sm text-muted-foreground font-medium">
        {isFromLogin ? "Нет учетной записи?" : "Есть учетная запись?"}{" "}
        <Link
          href={isFromLogin ? "/signup" : "/login"}
          prefetch={false}
          replace={true}
          className=" hover:underline text-black font-extrabold dark:text-gray-200"
        >
          {isFromLogin ? "Зарегистрироваться" : "Войти"}
        </Link>
      </p>
    </div>
  );
}
