import React, { useState } from "react";
import { Redirect } from "react-router-dom";

function Redirection() {
  const [redirect, setRedirect] = useState(false);

  const handleButtonClick = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Redirect to="/misTurnos" />;
  }

  return (
    <div>
      <button onClick={handleButtonClick}>Ir a nueva página</button>
      <p>Contenido de MyComponent</p>
    </div>
  );
}

export default Redirection;
