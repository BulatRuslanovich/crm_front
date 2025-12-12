import { FiMail } from "react-icons/fi";

interface OtpHeaderProps {
  email: string;
}

export default function OtpHeader({ email }: OtpHeaderProps) {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
        <FiMail className="h-6 w-6 text-indigo-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Email Verification</h1>
      <p className="mt-3 text-gray-500">
        Enter the 6-digit code sent to{" "}
        <span className="font-medium text-indigo-600">{email}</span>
      </p>
    </div>
  );
}
