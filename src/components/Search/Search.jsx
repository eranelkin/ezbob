import React, { useState, useEffect, createRef, memo } from "react";
import { useSearch } from "../../SearchContext";
import { useItemActive } from "./useItemActive";
import SearchContent from "../SearchContent/SearchContent";
import { customDebounce } from "../../utils/utils";
import useShowToggle from "../../hooks/useShowToggle";
import { translations } from "../../translations/translations";
import "./search.scss";

const Search = () => {
  const [showClear, toggleShowClear] = useShowToggle();
  const [showAutoComplete, toggleAutoComplete] = useShowToggle();
  const [selectedSearchKey, setSelectedSearchKey] = useState(null);
  const [areNavigateKeys, setAreNavigateKeys] = useState(false);
  const {
    data,
    lastSearchKeys,
    fetchAutoComplete,
    updateHistory,
    history,
    removeFromHistory,
  } = useSearch();
  const { currentFocus, changeCurrentFocus, resetCurrentFocus } =
    useItemActive();
  const searchRef = createRef();
  const autoCompleteRef = createRef();

  const searchItemsData =
    data &&
    selectedSearchKey &&
    Object.keys(data)
      .filter((key) =>
        key.toLowerCase().startsWith(selectedSearchKey.toLowerCase())
      )
      .map((key) => data[key]);

  useEffect(() => {
    if (showAutoComplete && autoCompleteRef.current) {
      autoCompleteRef.current.focus();
    }
  }, [showAutoComplete, autoCompleteRef]);

  const InputIsReady = (ev) => {
    const search = ev.target.value;

    if (!areNavigateKeys) {
      toggleShowClear(search !== "");
      resetCurrentFocus();
      fetchAutoComplete(search);
    }
    toggleAutoComplete(ev.keyCode !== 13);
  };

  const handlerClearOnClick = () => {
    searchRef.current.value = "";
    toggleShowClear();
    resetCurrentFocus();
  };

  const handlerItemOnClick = (key) => (ev) => {
    setAreNavigateKeys(false);
    toggleAutoComplete();
    searchRef.current.value = key;
    setSelectedSearchKey(key);
    updateHistory(key);
  };

  const handlerSearchKeyDown = (ev) => {
    setAreNavigateKeys(ev.keyCode === 40 || ev.keyCode === 38);

    if (ev.keyCode === 40 || ev.keyCode === 38) {
      showAutoComplete &&
        changeCurrentFocus(autoCompleteRef, ev.keyCode === 40);
    }
    if (ev.keyCode === 13) {
      const currentValue =
        currentFocus !== null
          ? autoCompleteRef.current.children[currentFocus].children[0].innerText
          : searchRef.current.value.trim();
      setSelectedSearchKey(currentValue);
      updateHistory(currentValue);
      if (currentFocus !== null) {
        searchRef.current.value =
          autoCompleteRef.current.children[currentFocus].children[0].innerText;
      }
      resetCurrentFocus();
    }
  };

  const handlerRemoveFromHistory = (key) => (ev) => {
    ev.preventDefault();
    removeFromHistory(key);
  };

  return (
    <div className="container">
      <div className="search-header">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Ezbob_logo.svg/800px-Ezbob_logo.svg.png"
          alt="ezbob"
          className="search-image"
        />
        <div className="text">
          <input
            ref={searchRef}
            autoFocus
            type="text"
            className="search-input"
            placeholder={translations.search.placeholder}
            // onBlur={() => toggleAutoComplete(false)}
            onKeyUp={customDebounce((ev) => InputIsReady(ev))}
            onKeyDown={handlerSearchKeyDown}
          />
          {showClear && (
            <button className="clear" onClick={handlerClearOnClick}>
              X
            </button>
          )}
        </div>
      </div>
      {showAutoComplete && lastSearchKeys && (
        <div className="auto-complete" ref={autoCompleteRef}>
          {lastSearchKeys.map((item, index) => (
            <div key={`${item}-${index}`} className="item">
              <div className="item-wrap" onMouseDown={handlerItemOnClick(item)}>
                {item}
              </div>
              {history && history.includes(item) && (
                <div
                  style={{
                    display: "inline-block",
                    right: 14,
                    position: "absolute",
                    color: "red",
                  }}
                  onMouseDown={handlerRemoveFromHistory(item)}
                >
                  {translations.search.remove}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {searchItemsData && searchItemsData.length > 0 && (
        <SearchContent searchItemsData={searchItemsData} />
      )}
    </div>
  );
};

export default memo(Search);
