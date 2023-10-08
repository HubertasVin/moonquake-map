import React from 'react';
import { useState } from "react";
// import { Sphere, changeUpdate } from './Moon';


function QuakeListButton( { itemKey, onclick, name = "" }) {
    const [clicked, setClicked] = useState(false);
    const fullClassName = clicked ? "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" :
                                    "bg-blue-200 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full";
    const handleClick = () => {
        setClicked(current => !current);
        onclick();
        // const update = changeUpdate()
        // Sphere(update);
    };
  return (
    <button onClick={handleClick} className={fullClassName}>
        {name}
    </button>
  );
}

export default QuakeListButton;