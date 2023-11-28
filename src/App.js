import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useKey } from "./useKey";
import { useLocalStorageState } from "./useLocalStorageState";
import { useMovies } from "./useMovies";
//github token  

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


const KEY = "7c302779";
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");

  //   return JSON.parse(storedValue) || [];

  // });


  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie])
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }








  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </NavBar>
      <Main >
        <Box >
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList onSelectMovie={handleSelectMovie} movies={movies} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ?
            <MovieDetails
              onAddWatched={handleAddWatched}
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />
            </>
          }

        </Box>
      </Main>
    </>
  );
}
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>);
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {

  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function NumResult({ movies }) {
  return (
    <p className="num-results">
      Founddd <strong>{movies.length}</strong> results
    </p>
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


//document.querySelector(".search"), belirtilen sınıfa sahip ilk HTML öğesini seçer. Burada, .search sınıfına sahip olan arama kutusu seçilir.
// el.focus(), seçilen HTML öğesine odaklanmayı sağlar.Aşağıda ki gibi kullanabiliriz ya da useRef ile;
// useEffect(function () {
//   const el = document.querySelector(".search");
//   console.log(el);
//   el.focus();
// }, []);
function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current)
      return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(function () {

  //   function callback(e) {
  //     if (document.activeElement === inputEl.current)
  //       return;

  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");

  //     }
  //   }
  //   document.addEventListener("keydown", callback);
  //   return () => document.removeEventListener("keydown", callback);

  // }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function Main({ children }) {



  return (
    <main className="main">
      {children}


    </main>);
}
function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children
      }
    </div>
  );
}
// function WatchedBox() {
//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);


//   return (<div className="box">
//     <button
//       className="btn-toggle"
//       onClick={() => setIsOpen2((open) => !open)}
//     >
//       {isOpen2 ? "–" : "+"}
//     </button>
//     {isOpen2 && (
//       <>
//         <WatchedSummary watched={watched} />
//         <WatchedMoviesList watched={watched} />

//       </>
//     )}
//   </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  return (<ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} onSelectMovie={onSelectMovie} />
    ))}
  </ul>)
}
function Movie({ movie, onSelectMovie }) {
  return (<li onClick={() => onSelectMovie(movie.imdbID)} >
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>🗓</span>
        <span>{movie.Year}</span>
      </p>
    </div>
  </li>)
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime, imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;
  const isWatched = watched.map((movie) => movie.imdbID).
    includes(selectedId);
  const watchedUserRating = watched.find((movie) => movie.imdbID === selectedId)?.userRating;

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    }

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }


  //useRef rbileşenlerin render durumlarından bağımsız olarak aynı değeri korur. Bu, genellikle DOM elemanlarına veya başka bir bileşende bulunan verilere erişim sağlamak için kullanılır.
  useKey("Escape", onCloseMovie);

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);

    }
    getMovieDetails();
  }, [selectedId])


  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "Movie-App";
    };
  }, [title]);


  return (
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull;   {runtime}
              </p>
              <p>{genre}</p>
              <p><span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />

                  {userRating > 0 && (<button className="btn-add" onClick={handleAdd}>+ Add to list</button>)}
                </>
              ) : (
                <p>You rated with movie {watchedUserRating}
                  <span>⭐️</span></p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>


  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

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
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (<ul className="list">
    {watched.map((movie) => (
      <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatched={onDeleteWatched} />
    ))}
  </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li >
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
        <button className="btn-delete" onClick={() => onDeleteWatched(movie.imdbID)}>X</button>
      </div>
    </li>
  );
}




// ******** useRef genellikle şu durumlarda kullanılır:

// DOM Elemanlarına Erişim:

// javascript
// Copy code
// const inputRef = useRef(null);

// useEffect(() => {
//   // input elemanına odaklanma
//   inputRef.current.focus();
// }, []);

// return <input ref={inputRef} />;
// Yukarıdaki örnekte, useRef ile bir input elemanına erişim sağlanır ve useEffect içinde bu elemana odaklanma işlemi gerçekleştirilir.

// Bileşenler Arası İletişim:

// javascript
// Copy code
// const childComponentRef = useRef(null);

// return <ChildComponent ref={childComponentRef} />;
// Yukarıdaki örnekte, bir ana bileşen, alt bileşene bir referans gönderir ve alt bileşende bu referans üzerinden ana bileşenin metotlarına veya durumuna erişim sağlanabilir.

// Functional Component'lerde Değerin Saklanması:

// javascript
// Copy code
// const counter = useRef(0);

// // counter.current, değeri korur ve re-render sırasında değişmez
// Yukarıdaki örnekte, bir sayacın değeri, useRef kullanılarak bileşenin re - render olduğunda sıfırlanmayacak şekilde korunur.


