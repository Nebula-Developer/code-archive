
export default function AdminInput({
    label,
    value,
    className,
    inputClassName,
    labelClassName,
    required,
    ...props
  }: {
    label: string;
    value: string;
    required?: boolean;
    className?: string;
    inputClassName?: string;
    labelClassName?: string;
    [key: string]: any;
  }) {
    return (
      <div className={"outline-none flex flex-col space-y-1 " + className}>
        <label className={"text-sm " + labelClassName}>
          {label}
          {required && <span className="text-red-500">&nbsp;*</span>}
        </label>
        <input
          value={value}
          {...props}
          className={
            "p-2 border-[1px] border-slate-200 rounded-md " + inputClassName
          }
        />
      </div>
    );
  }
  