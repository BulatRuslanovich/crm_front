"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ChangeEvent, useState } from "react";
import { FormState, type SignUpCredentials } from "@/types/auth";
import { toast } from "sonner";
import { delay } from "@/lib/delay";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/features/auth/authSlice";
import InputField from "@/components/form/InputField";
import ORLine from "@/components/form/ORLine";
import FooterTxt from "@/components/form/FooterTxt";
import FormHeader from "@/components/form/FormHeader";
import SubmitBtn from "../form/SubmitBtn";
import Background from "../marketing/ui/Background";
import { ShineBorder } from "../ui/shine-border";
import { lastDayOfDecade } from "date-fns";

export default function SignupPage() {
  return (
    <div className="   min-h-screen px-4 md:px-0 bg-background flex items-center justify-center w-full">
      <Background />
      <Card className="shadow-md max-w-lg w-full rounded-lg  bg-transparent border relative overflow-hidden">
        <ShineBorder duration={20} shineColor="#ff008078" />
        <FormHeader title="Регистрация" subTitle="Введите данные для регистрацийй" />

        <CardContent>
          <ORLine text="Зарегистрируйтесь" />
          <MainForm />
          <FooterTxt isFromLogin={false} />
        </CardContent>
      </Card>
    </div>
  );
}

function MainForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<SignUpCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState<FormState>("IDLE");

  const updateForm = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const requestFormReset = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setStatus("IDLE");
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimedData = trimeData(formData);

    // try to login
    try {
      setStatus("LOADING");
      const [response] = await Promise.all([
        fetch("/api/signup", {
          method: "POST",
          body: JSON.stringify(trimedData),
          headers: {
            "Content-Type": "application/json",
          },
        }),
        delay(500),
      ]);

      if (!response.ok) {
        setStatus("ERROR");
        const { error } = await response.json();
        toast.error(error.message || "Something went wrong.");
        return;
      }

      const { message, user } = await response.json();

      dispatch(setUser(user));

      // signup success
      setStatus("SUCCESS");
      toast.success(message || "Регистрация прошла успешно!");

      requestFormReset();

      // redirect
      router.push("/dashboard");
    } catch (e) {
      setStatus("ERROR");
      toast.error("Произошла ошибка при регистрации.");
      console.log(e);
    }
  }

  return (
    <form className="space-y-4" onSubmit={(e) => handleSubmit(e)}>
      <InputField
        label="Имя"
        type="text"
        name="name"
        placeholder="Иван"
        value={formData.name}
        onChange={(e) => updateForm(e)}
      />

      <InputField
        label="Фамилия"
        type="text"
        name="lastname"
        placeholder="Иванов"
        value={formData.lastname}
        onChange={(e) => updateForm(e)}
      />

      <InputField
        label="Логин"
        type="email"
        name="email"
        placeholder="example@gmail.com"
        value={formData.email}
        onChange={(e) => updateForm(e)}
      />

      <InputField
        label="Пароль"
        name="password"
        type="password"
        placeholder="Введите ваш пароль"
        className="pr-10"
        value={formData.password}
        onChange={(e) => updateForm(e)}
      />

      <InputField
        label="Подтвердите пароль"
        type="password"
        name="confirmPassword"
        placeholder="Повторите пароль"
        className="pr-10"
        value={formData.confirmPassword}
        onChange={(e) => updateForm(e)}
      />
      <SubmitBtn
        className="mt-7"
        isLoading={status == "LOADING"}
        text={status == "LOADING" ? "Загрузка..." : "Регистрация"}
      />
    </form>
  );
}

const trimeData = (data: SignUpCredentials): SignUpCredentials => {
  return {
    name: data.name?.trim(),
    lastname: data.lastname?.trim(),
    email: data.email?.trim(),
    password: data.password?.trim(),
    confirmPassword: data.confirmPassword?.trim(),
  };
};
