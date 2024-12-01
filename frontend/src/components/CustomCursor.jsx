import React, { useEffect } from 'react';
import '../CSS/CustomCursor.css'; // Make sure to import the CSS file

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const handleMouseMove = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div id="cursor" style={{width: "100px" , height: "100px", backgroundColor: "red"}}>
      <div className="cursor-circle"></div>
    </div>
  );
};

export default CustomCursor;