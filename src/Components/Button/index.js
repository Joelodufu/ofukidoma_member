import React from "react";
import { useNavigate } from "react-router-dom";

const Button = ({
  backgroundcolor,
  width,
  label,
  border = false,
  link,
  parentClassName,
  ...rest
}) => {
  const navigate = useNavigate();
  return (
    <button
      className={` ${parentClassName} ${
        backgroundcolor ? backgroundcolor : "bg-primary"
      }
         ${border && "border border-white"} ${
        width ? width : "w-full"
      } text-white px-4 py-2`}
      {...rest}
    >
      {label}
    </button>
  );
};

export default Button;
