import { CardHeader, CardTitle } from "@/components/ui/card";

export default function FormHeader({
  title,
  subTitle,
}: {
  title: string;
  subTitle?: string;
}) {
  return (
    <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-3xl font-[900]">{title}</CardTitle>
      <p className="text-sm text-muted-foreground ">{subTitle}</p>
    </CardHeader>
  );
}
