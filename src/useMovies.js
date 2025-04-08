import { useState, useEffect } from 'react';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const KEY = '7415adfd';
  useEffect(() => {
    const controller = new AbortController();

    async function fetchMoviesData() {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}
      `,
          { signal: controller.signal }
        );

        if (!res.ok)
          throw new Error('Something Went wrong with Fetching movies');

        const data = await res.json();
        if (data.Response === 'False') throw new Error(' Movie not found');

        setMovies(data.Search);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) return;

    // handleCloseMovie();

    fetchMoviesData();

    return () => controller.abort();
  }, [query]);

  return { isLoading, error, movies, setMovies };
}
