import "./greenbutton.css";

interface Props{
    label: string
}

export const GreenButton = ({label} : Props) => {
  return (
    <button className="custom-green-button">
        {label}
    </button>
  );
};
