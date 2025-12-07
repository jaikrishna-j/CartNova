import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "purple",
};

const Spinner = ({loading}) => {
  const [size, setSize] = useState(50);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 640) {
        // Mobile screens - medium
        setSize(65);
      } else if (window.innerWidth < 1024) {
        // Tablet screens
        setSize(75);
      } else {
        // Laptop/Desktop screens - medium big
        setSize(80);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <ClipLoader
        loading={loading}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
  )
}

export default Spinner