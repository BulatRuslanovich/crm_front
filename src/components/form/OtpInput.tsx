interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  isActive: boolean;
  hasValue: boolean;
  ref?: React.Ref<HTMLInputElement>;
}

export default function OtpInput({
  value,
  onChange,
  onKeyDown,
  onPaste,
  onFocus,
  isActive,
  hasValue,
  ref,
}: OtpInputProps) {
  return (
    <input
      ref={ref}
      type="text"
      inputMode="numeric"
      pattern="[a-zA-Z0-9]*"
      maxLength={1}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onFocus={onFocus}
      className={`h-16 w-12 rounded-lg border text-center text-3xl font-medium transition-all focus:outline-none text-gray-600 ${
        isActive
          ? "border-indigo-500 ring-2 ring-indigo-200"
          : hasValue
          ? "border-indigo-300 bg-indigo-50"
          : "border-gray-200 hover:border-gray-300 focus:border-indigo-500"
      }`}
    />
  );
}
