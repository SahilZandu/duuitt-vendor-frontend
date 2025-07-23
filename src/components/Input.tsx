
interface Props {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

const Input = ({ placeholder, value, onChange, type = "text" }: Props) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full  text-black px-4 py-2 border border-gray-300 rounded mb-4"
  />
);

export default Input;
