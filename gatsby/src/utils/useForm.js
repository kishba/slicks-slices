import { useState } from 'react';

export default function useForm(defaults) {
  // own custom hook!
  const [values, setValues] = useState(defaults);

  function updateValue(e) {
    // check if it's number and convert (handy)
    let { value } = e.target;
    if (e.target.type === 'number') {
      value = parseInt(value);
    }
    setValues({
      // copy the existing values into it
      ...values,
      // update the new value that changed
      [e.target.name]: value,
    });
  }

  return { values, updateValue };
}
