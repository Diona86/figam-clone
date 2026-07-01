import React, { useState } from "react";
import { Comments } from "./Comments";

export const NewThread = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen((n) => !n);
    console.log("NewThread Clicked");
  };

  const enhancedChildren = React.cloneElement(children, {
    onClick: handleClick,
  });
  return (
    <>
      {enhancedChildren}
      {isOpen && (
        <div className="fixed top-20 left-1/2 z-50">
          <Comments />
        </div>
      )}
    </>
  );
};
