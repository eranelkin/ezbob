import { useState } from "react";

const useShowToggle = (state = false) => {
  const [isShowing, setIsShowing] = useState(state);

  function toggle(show) {
    setIsShowing((isShow) => (show !== undefined ? show : !isShow));
  }

  return [isShowing, toggle];
};

export default useShowToggle;
