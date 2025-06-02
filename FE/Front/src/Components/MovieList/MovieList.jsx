import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import "./MovieList.css";

function MovieList() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // 영화 목록과 검색어 입력값
  const [movies, setMovies] = useState([]);
  const [searchVal, SetSearchVal] = useState("");

  // 상세 페이지로 이동하는 함수
  const goToDetail = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // 컴포넌트 최초 렌더링 시 최신 영화 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://movie-api-test-latest.onrender.com/latest`
        );
        setMovies(res.data.results); // 영화 목록 저장
        console.log(res.data);
      } catch (err) {
        console.error("API 요청 실패:", err);
      }
    };

    fetchData(); // API 호출
  }, []); // 최초 한 번 실행

  // 검색 입력창 업데이트
  const handleChange = (e) => {
    SetSearchVal(e.target.value);
  };

  // 검색 버튼 클릭 시 실행되는 함수
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
          console.log(res.data.results);
          setMovies(res.data.results); // 검색 결과 반영
        } catch (err) {
          console.error("API 요청 실패:", err);
        }
      };
      fetchSearchMovie(searchVal);
    }
  };


  return (
    <div className="HomePage">
      {/* 상단 소개 영역 */}
      <div className="Center">
        <div className="MainText">
          <h1>함께 하는 영화 리뷰 사이트</h1>
          <p>
            모두의 리뷰를 공유해 보아요 . 전 세계인과 공유 하는 리뷰 1등 사이트
          </p>
        </div>

        {/* 검색 입력창 + 버튼 */}
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

      {/* 영화 카드 목록 출력 */}
      <div className="Center">
        <div className="cardBody">
          {movies.map((item, idx) => {
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
                  {/* 이미지 위에 마우스를 올리면 개요 표시 */}
                  <div className="overlay">
                    <p className="overview-text">{MovieOverview}</p>
                  </div>
                </div>

                <p className="C_date">개봉일 : {MovieReleaseDate}</p>

                {/* 상세 페이지로 이동하는 버튼 */}
                <button className="C_btn" onClick={() => goToDetail(Movieid)}>
                  리뷰 보기&쓰기
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
