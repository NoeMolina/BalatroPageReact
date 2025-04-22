import "./redbutton.css";

interface Props{
    label: string
}

export const RedButton = ({label} : Props) => {
  return (
    <button className="custom-red-button">
        {label}
    </button>
  );
};
