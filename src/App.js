import React from "react";
import Search from "./components/Search/Search";
import { SearchProvider } from "./SearchContext";
import "./App.css";

function App() {
  return (
    <SearchProvider>
      <Search />
    </SearchProvider>
  );
}

export default App;
