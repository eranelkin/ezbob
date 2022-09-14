import { useState, useEffect } from "react";

export const useItemActive = () => {
  const [currentFocus, setCurrentFocus] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    const changeActive = () => {
      for (let index = 0; index < items.length; index++) {
        index === currentFocus
          ? items[index].classList.add("autocomplete-active")
          : items[index].classList.remove("autocomplete-active");
      }
    };

    if (items && items.length > 0) {
      changeActive();
    }
  }, [currentFocus, items]);

  const changeCurrentFocus = (items, isIncrement) => {
    const children = items.current.children;
    setCurrentFocus((current) => {
      if (currentFocus === null) return 0;
      const value = isIncrement ? ++current : --current;
      if (value < 0) return children.length - 1;
      if (value > children.length - 1) return 0;
      return value;
    });
    setItems(children);
  };

  const resetCurrentFocus = () => setCurrentFocus(null);

  return { currentFocus, changeCurrentFocus, resetCurrentFocus };
};
