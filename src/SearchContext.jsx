import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import mockData from "./mock/mockData";

const SearchContext = createContext();

const asyncFetch = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
};
export const SearchProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSearchKeys, setLastSearchKeys] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const data = await asyncFetch();

        setData(data);
        setIsLoading(false);
      };

      fetchData();
    } catch (error) {
      console.log("ERR#: fetch data");
      setIsLoading(false);
    }
  }, []);

  const fetchAutoComplete = useCallback(
    (search) => {
      let updatedKeys;
      if (search.trim() !== "") {
        const searchKeys =
          (data &&
            Object.keys(data).filter((item) =>
              item.toLowerCase().startsWith(search.toLowerCase())
            )) ||
          [];
        updatedKeys = new Set([
          ...history.filter((item) =>
            item.toLowerCase().startsWith(search.toLowerCase())
          ),
          ...searchKeys,
        ]);
      }
      setLastSearchKeys(
        search.trim() !== "" ? [...updatedKeys].slice(0, 10) : []
      );
    },
    [data, history]
  );
  const updateHistory = (search) => {
    let updatedHistory = history.filter(
      (item) => item.toLowerCase() !== search.toLowerCase().trim()
    );
    updatedHistory.unshift(search);
    setHistory(updatedHistory);
  };

  const removeFromHistory = (key) => {
    const updatedHistory = history.filter((item) => item !== key);
    setHistory(updatedHistory);
    setLastSearchKeys((searchKeys) =>
      searchKeys.filter((search) => search !== key)
    );
  };

  return (
    <SearchContext.Provider
      value={{
        data,
        isLoading,
        lastSearchKeys,
        history,
        fetchAutoComplete,
        updateHistory,
        removeFromHistory,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  return useContext(SearchContext);
};
