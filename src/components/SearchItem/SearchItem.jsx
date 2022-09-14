import React from "react";
import PropTypes from "prop-types";

import "./searchItem.scss";
const SearchItem = ({ searchItem }) => {
  return searchItem.map((item, index) => (
    <div key={`${item.title}-${index}`} className="search-item">
      <a href={item.url}>
        <div className="search-link">{item.title}</div>
      </a>
      <div className="search-item-description">{item.description}</div>
      {item.items && <SearchItem searchItem={item.items} />}
    </div>
  ));
};

SearchItem.propTypes = {
  searchItem: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SearchItem;
