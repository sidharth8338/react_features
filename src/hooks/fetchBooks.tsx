import axios, { type Canceler } from "axios";
import { useEffect, useState } from "react";

interface Book {
  title: string;
  // Add other properties as needed
}

interface SearchResult {
  docs: Book[];
  // Add other properties as needed
}

function useBookSearch(query: string, pageNumber: number) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setResults([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let cancel: Canceler;
    const fetchData = async () => {
      try {
        const response = await axios.get<SearchResult>(
          "http://openlibrary.org/search.json",
          {
            params: {
              q: query,
              page: pageNumber,
            },
            cancelToken: new axios.CancelToken((c) => (cancel = c)),
          }
        );

        setResults((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...response.data.docs.map((b) => b.title),
            ]),
          ];
        });

        setHasMore(response.data.docs.length > 0);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) return;
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, results, hasMore };
}

export default useBookSearch;
