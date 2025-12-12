export default function ORLine({ text }: { text?: string }) {
  return (
    <div className="my-4 flex items-center">
      <div className="grow border-t" />
      <span className="mx-4 text-sm text-muted-foreground">
        {text ? text : "Или"}
      </span>
      <div className="grow border-t" />
    </div>
  );
}
