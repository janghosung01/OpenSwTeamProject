"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserContext from "../Context/UserContext";
import axios from "axios";
import "./MovieDetail.css";

function MovieDetail() {
  // URL 파라미터에서 movieId 추출
  const { movieId } = useParams();

  // 유저 로그인 상태 및 정보 불러오기
  const { isLogin, userData } = useContext(UserContext);

  // 영화 정보 및 상태 관련 state 정의
  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 리뷰 관련 state 정의
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // 리뷰 입력 값 변경 처리
  const handleChangeReview = (e) => {
    setNewReview(e.target.value);
  };

  // 로그인한 유저의 리뷰를 삭제하는 함수
  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // 삭제 요청 (user_id를 쿼리 파라미터로 전달)
      await axios.delete(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews/${reviewId}`,
        {
          params: {
            user_id: userData.loginId,
          },
        }
      );

      // 삭제 후 리뷰 목록 다시 불러오기
      const reviewResponse = await axios.get(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews`
      );
      setReviews(reviewResponse.data);
      alert("리뷰가 삭제되었습니다.");
    } catch (err) {
      console.error("리뷰 삭제 중 에러 발생:", err);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  // 리뷰 등록 함수
  const reviewRegister = async () => {
    if (!newReview.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      // 리뷰 등록 요청 (user_id를 쿼리 스트링으로 전달)
      await axios.post(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews?user_id=${userData.loginId}`,
        {
          content: newReview,
          rating: 5, // 별점은 고정값 5로 설정
        }
      );

      // 등록 후 리뷰 목록 다시 불러오기
      const reviewResponse = await axios.get(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews`
      );
      setReviews(reviewResponse.data);
      setNewReview(""); // 입력창 초기화
      alert("리뷰가 등록되었습니다.");
    } catch (err) {
      console.error(err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  // 컴포넌트 마운트 시 영화 상세정보 및 리뷰 불러오기
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        // 영화 상세정보 요청
        const response = await axios.get(
          `https://movie-api-test-latest.onrender.com/movies/${movieId}`
        );
        setMovieDetail(response.data);

        // 해당 영화의 리뷰 요청
        const reviewResponse = await axios.get(
          `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews`
        );
        setReviews(reviewResponse.data);
        setLoading(false);
      } catch (err) {
        setError("영화 정보를 불러오는데 실패했습니다.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  // 로딩 중일 때 표시
  if (loading)
    return (
      <div className="movie-detail-container">
        <div className="loading">
          <p>로딩중...</p>
        </div>
      </div>
    );

  // 에러 발생 시 표시
  if (error)
    return (
      <div className="movie-detail-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );

  // 로그인 상태일 때 상세 정보 + 리뷰 출력
  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <h2>{movieDetail.title}</h2>
      </div>

      {isLogin ? (
        <>
          {/* 영화 정보 출력 */}
          <div className="movie-detail-content">
            <div>
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movieDetail.poster_path}`}
                alt={movieDetail.title}
              />
            </div>
            <div className="movie-info">
              <p>{movieDetail.overview}</p>
              <div className="movie-meta">
                <p>개봉일: {movieDetail.release_date}</p>
                <p>
                  평점:{" "}
                  <span className="rating">{movieDetail.vote_average}</span>
                </p>
              </div>
            </div>
          </div>

          {/* 리뷰 섹션 */}
          <div className="reviews-section">
            <h3>리뷰</h3>

            {/* 리뷰 리스트 */}
            {reviews.length > 0 ? (
              reviews.map((item) => (
                <div className="review-item" key={item.id}>
                  <div className="review-header">
                    <p>작성자 Id: {item.user_id}</p>
                    
                  </div>
                  <p className="review-content">{item.content}</p>
                  <p className="review-date">
                    작성일: {new Date(item.created_at).toLocaleString()}
                  </p>

                  {/* 로그인 유저가 작성자일 경우에만 삭제 버튼 노출 */}
                  {item.user_id === userData.loginId && (
                    <button
                      className="delete-review-button"
                      onClick={() => handleDeleteReview(item.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
            )}

            {/* 리뷰 작성 폼 */}
            <div className="review-form">
              <h3>리뷰 작성</h3>
              <div className="review-form-content">
                <input
                  id="newReview"
                  name="newReview"
                  type="text"
                  value={newReview}
                  onChange={handleChangeReview}
                  placeholder="리뷰를 작성해주세요"
                />
                <button onClick={reviewRegister}>등록</button>
              </div>
            </div>
          </div>
        </>
      ) : (
        // 로그인하지 않았을 때 표시
        <div className="login-message">
          <p>영화 상세 정보와 리뷰를 보려면 로그인이 필요합니다.</p>
          <Link to="/login">로그인하러 가기</Link>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
