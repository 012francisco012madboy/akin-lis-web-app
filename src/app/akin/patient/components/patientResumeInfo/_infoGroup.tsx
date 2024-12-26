import { InfoItem } from "./_infoItemWithCopyFunc";


export function InfoGroup({ title, items }: { title?: string; items: { label: string; value: string }[] }) {
  return (
    <div className="space-y-2">
      {title && <h2 className="flex justify-between items-center text-sm text-gray-400 font-medium">{title}</h2>}
      {items.map((item, index) => (
        <InfoItem key={index} label={item.label} value={item.value} />
      ))}
    </div>
  );
}