import { FunctionalComponent, h } from "preact";
import { useState } from "preact/compat";
import "./menu.css";

const Menu: FunctionalComponent = () => {
  const [menuState, setMenuState] = useState(false);
  function openClose(e: MouseEvent) {
    e.preventDefault();
    setMenuState(!menuState);
  }
  return (
    <div className="menu">
      <h2 onClick={(event) => openClose(event)}>
        {menuState ? (
          <i style={{ fontSize: "1.5rem" }} className="bi bi-x-circle"></i>
        ) : (
          <i style={{ fontSize: "1.5rem" }} className="bi bi-list"></i>
        )}
      </h2>
    </div>
  );
};
export default Menu;
