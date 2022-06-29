type Props = {
  value: number;
  name: string;
  unit?: string;
};

const Stat = ({ value, name, unit }: Props) => {
  return (
    <div className="w-100 h-100 flex flex-col items-center">
      <p className="text-4xl font-bold">
        {value}
        <span className="text-xl">{unit}</span>
      </p>
      <p className="text-sm">{name}</p>
    </div>
  );
};

export default Stat;
