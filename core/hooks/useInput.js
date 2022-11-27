import { useState } from "react";

export const useInput = (initValue) => {
  const [value, setValue] = useState(initValue || "");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return { bind: { value, onChange }, setValue };
};
