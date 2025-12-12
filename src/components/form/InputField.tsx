import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ChangeEvent, useState } from "react";
import Icons from "@/components/icons";

export default function InputField({
  label,
  type,
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
  isFromLogin = false,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  placeholder?: string;
  className?: string;
  isFromLogin?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="space-y-2">
      {isFromLogin && name == "password" ? (
        <ForgetPasswordBtn />
      ) : (
        <Label htmlFor={name}>{label}</Label>
      )}

      {name == "password" || name == "confirmPassword" ? (
        <div className="relative">
          <Input
            name={name}
            placeholder={placeholder}
            type={showPassword ? "text" : "password"}
            className="pr-10"
            value={value}
            onChange={onChange}
          />
          <EyeBtn show={showPassword} setShow={setShowPassword} />
        </div>
      ) : (
        <Input
          type={type == "email" ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  );
}

function ForgetPasswordBtn() {
  return (
    <div className="flex items-center justify-between">
      <Label htmlFor="password">Пароль</Label>{" "}
      <button
        type="button"
        className="text-sm font-medium text-primary hover:underline"
      >
        Забыли пароль?
      </button>
    </div>
  );
}

function EyeBtn({
  show,
  setShow,
}: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      type="button"
      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
      onClick={() => setShow((prev) => !prev)}
    >
      {show ? (
        <Icons.eyeOff className="h-4 w-4" />
      ) : (
        <Icons.eye className="h-4 w-4" />
      )}
    </button>
  );
}
