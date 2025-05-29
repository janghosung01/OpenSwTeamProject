import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function MovieList(props) {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [searchVal, SetSearchVal] = useState("");

  const goToDetail = (movieId) => {
    navigate(`/movie/${movieId}`);
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://movie-api-test-latest.onrender.com/latest`
        );
        setMovies(res.data.results);
        console.log(res.data);
      } catch (err) {
        console.error("API 요청 실패:", err);
      }
    };

    fetchData(); // 함수 실행
  }, []); // 빈 배열: 최초 1회 실행

  const handleChange = (e) => {
    SetSearchVal(e.target.value);
  };
  const handleSearchClick = () => {
    const trimmed = searchVal.trim();
    if (trimmed === "") {
      alert("검색어를 입력 해주세요");
    } else {
      const fetchSearchMovie = async (searchVal) => {
        try {
          const res = await axios.get(
            `https://movie-api-test-latest.onrender.com/search`,
            {
              params: {
                query: searchVal,
              },
            }
          );
          console.log(res.data.results); // 영화 결과 출력
          setMovies(res.data.results);
        } catch (err) {
          console.error("API 요청 실패:", err);
        }
      };
      fetchSearchMovie(searchVal);
    }
  };
  return (
    <div className="HomePage">
      <div className="Center">
        <div className="MainText">
          <h1>함께 하는 영화 리뷰 사이트</h1>
          <p>
            모두의 리뷰를 공유해 보아요 . 전 세계인과 공유 하는 리뷰 1등 사이트
          </p>
        </div>

        <div className="SearchName">
          <input
            className="inputName"
            value={searchVal}
            type="text"
            placeholder="검색하고자 하는 영화 제목 입력하세요!!"
            onChange={handleChange}
          />
          <button className="inputBtn" onClick={handleSearchClick}>
            검색
          </button>
        </div>
      </div>

      <div className="Center">
        <div className="cardBody">
          {movies.map((item, idx) => {
            //console.log(item);
            const Movieid = item.id;
            const MovieOverview = item.overview;
            const MovieReleaseDate = item.release_date;
            const MovieTitle = item.title;
            const MovieimgURL = `https://image.tmdb.org/t/p/w200${item.poster_path}`;
            return (
              <div className="Card" key={idx}>
                <p className="C_title">{MovieTitle}</p>

                <div className="img-container">
                  <img className="C_img" src={MovieimgURL} alt="이미지 없음" />
                  <div className="overlay">
                    <p className="overview-text">{MovieOverview}</p>
                  </div>
                </div>

                <p className="C_date">개봉일 : {MovieReleaseDate}</p>
                <button className="C_btn" key={Movieid} onClick={() => goToDetail(Movieid)}>리뷰 보기&쓰기</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
