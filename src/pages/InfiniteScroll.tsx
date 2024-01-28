import { useCallback, useRef, useState } from "react";
import useBookSearch from "../hooks/fetchBooks";

function InfiniteScroll() {
  const [query, setQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const { error, loading, hasMore, results } = useBookSearch(query, pageNumber);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastBookElementRef = useCallback(
    (node: Element | null) => {
      if (loading) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  return (
    <div>
      <input
        type="text"
        id="search"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
      />
      {results.map((val, index) => {
        if (results.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={val}>
              {val}
            </div>
          );
        } else {
          return (
            <div key={val}>
              {index + 1}: {val}
            </div>
          );
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}

export default InfiniteScroll;
