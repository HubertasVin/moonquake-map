import React from 'react';

function ButtonContainer({ children }) {
    return (
      <div className="flex flex-col gap-2 absolute left-2">
        {children}
      </div>
    );
} 

export default ButtonContainer;