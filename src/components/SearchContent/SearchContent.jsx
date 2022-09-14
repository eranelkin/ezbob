import React from "react";
import PropTypes from "prop-types";
import SearchItem from "../SearchItem/SearchItem";
import "./searchContent.scss";

const SearchContent = ({ searchItemsData }) => {
  const imagesType = searchItemsData.filter((item) => item.type);
  const searchItem = searchItemsData.filter((item) => !item.type);

  return (
    <div className="search-container">
      {searchItem && searchItem.length > 0 && (
        <SearchItem searchItem={searchItem} />
      )}

      {imagesType && imagesType.length > 0 && (
        <div className="images-container">
          <div className="images-title">{imagesType[0].title}</div>
          <div className="images">
            {imagesType[0].urls.map((url, index) => (
              <a key={`${url}-${index}`} href={url}>
                <img src={url} alt={url} className="image-item" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SearchContent.propTypes = {
  searchItemsData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default SearchContent;
