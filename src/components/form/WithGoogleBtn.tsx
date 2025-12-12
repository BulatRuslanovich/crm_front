import Icons from "@/components/icons";
import GradientLine from "@/components/ui/GradientLine";

export default function WithGoogleBtn() {
  return (
    <div className="grid gap-2">
      <button
        className="group/btn shadow-input relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
        type="submit"
      >
        <Icons.google className="size-6" />
        <span className="text-sm text-neutral-700 dark:text-neutral-300">
          Continue with Google
        </span>
        <GradientLine />
      </button>
    </div>
  );
}
