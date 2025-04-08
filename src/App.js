import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';
import { useMovies } from './useMovies';
import { useLocalStorageState } from './useLocalStorageState';
import { useKey } from './useKey';

const tempMovieData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt0133093',
    Title: 'The Matrix',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg'
  },
  {
    imdbID: 'tt6751668',
    Title: 'Parasite',
    Year: '2019',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg'
  }
];

const tempWatchedData = [
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10
  },
  {
    imdbID: 'tt0088763',
    Title: 'Back to the Future',
    Year: '1985',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9
  }
];

const average = arr =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState('');

  const [selectedId, setSelectedId] = useState(null);

  const [watched, setWatched] = useLocalStorageState('watched');

  function handleSelectedMovie(selectedId) {
    setSelectedId(prevId => (prevId === selectedId ? null : selectedId));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddToWatched(movie) {
    setWatched(prevWatched => [...prevWatched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id));
  }

  const { isLoading, error, movies, setMovies } = useMovies(query);

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} setMovies={setMovies} />

        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList onSelectedMovie={handleSelectedMovie} movies={movies} />
          )}{' '}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              onAddToWatched={handleAddToWatched}
              onCloseMovie={handleCloseMovie}
              selectedId={selectedId}
            />
          ) : (
            <>
              <MovieWatchedSummary watched={watched} />
              <MovieWatchedList
                onDeleteWatched={handleDeleteWatched}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>❌</span>
      {message}
    </p>
  );
}

function Loader() {
  return <div className="loader">Loading...</div>;
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery, setMovies }) {
  const inputEl = useRef(null);

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  function onSearchFocus() {
    if (document.activeElement === inputEl.current) return;

    inputEl.current.focus();
    setQuery('');
    setMovies([]);
  }

  useKey('Enter', onSearchFocus);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ onSelectedMovie, movies }) {
  return (
    <ul className="list list-movies">
      {movies?.map(movie => (
        <Movie
          onSelectedMovie={onSelectedMovie}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function Movie({ onSelectedMovie, movie }) {
  return (
    <li onClick={() => onSelectedMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ watched, onAddToWatched, onCloseMovie, selectedId }) {
  const [movieDetails, setMovieDetails] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  const isWatched = watched.some(movie => movie.imdbID === selectedId);

  const watchedUserRating = watched.find(
    movie => movie.imdbID === selectedId
  )?.userRating;

  const movie = {
    imdbID: selectedId,
    Title: movieDetails.Title,
    Poster: movieDetails.Poster,
    runtime: parseInt(movieDetails.Runtime),
    userRating: userRating,
    imdbRating: +movieDetails.imdbRating,
    Year: movieDetails.Year,
    userRatingDecisions: countRef.current
  };

  function handleAddToList() {
    onAddToWatched(movie);
    setUserRating(null);
    onCloseMovie();
  }

  useKey('Escape', onCloseMovie);

  useEffect(() => {
    const KEY = '7415adfd';
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );

      const data = await res.json();
      setMovieDetails(data);
      setIsLoading(false);
    };

    fetchMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!movieDetails.Title) return;
    document.title = `Movie | ${movieDetails.Title}`;

    return function () {
      document.title = 'usePopcorn';
    };
  }, [movieDetails.Title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button onClick={onCloseMovie} className="btn-back">
              &larr;
            </button>
            <img src={movieDetails.Poster} alt={movieDetails.Title} />
            <div className="details-overview">
              <h2>{movieDetails.Title}</h2>
              <p>
                {movieDetails.Released} &bull; {movieDetails.Runtime}
              </p>
              <p>{movieDetails.Genre}</p>
              <p>
                <span>🌟</span> {movieDetails.imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    onSetRating={setUserRating}
                    maxRating={10}
                    size={32}
                  />
                  {userRating > 0 && (
                    <button onClick={handleAddToList} className="btn-add">
                      + Add to List
                    </button>
                  )}
                </>
              ) : (
                <p>You have rated the movie {watchedUserRating} 🌟 </p>
              )}
            </div>
            <p>
              <em>{movieDetails.Plot}</em>
            </p>
            <p> Starring {movieDetails.Actors}</p>
            <p>Directed by {movieDetails.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function MovieWatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map(movie => movie.imdbRating));
  const avgUserRating = average(watched.map(movie => movie.userRating));
  const avgRuntime = average(watched.map(movie => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{+avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{+avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function MovieWatchedList({ onDeleteWatched, watched }) {
  return (
    <ul className="list">
      {watched.map(movie => (
        <MovieWatched
          onDeleteWatched={onDeleteWatched}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function MovieWatched({ onDeleteWatched, movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          onClick={() => onDeleteWatched(movie.imdbID)}
          className="btn-delete"
        >
          x
        </button>
      </div>
    </li>
  );
}
