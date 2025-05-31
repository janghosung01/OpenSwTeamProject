"use client";

import { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import UserContext from "../Context/UserContext";
import axios from "axios";
import "./MovieDetail.css"
function MovieDetail() {
  const { movieId } = useParams();
  const { isLogin, userData } = useContext(UserContext);

  const [movieDetail, setMovieDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  const handleChangeReview = (e) => {
    setNewReview(e.target.value);
  };




/* 여기 143줄 handleDeleteReview 구현 내아이디와 동일 리뷰 삭제 기능*/
const handleDeleteReview= async (reviewId)=>{
  const confirmDelete = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    await axios.delete(
      `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews/${reviewId}`,
      {
        params: {
          user_id: userData.loginId
        }
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
}


  const reviewRegister = async () => {
    if (!newReview.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews?user_id=${userData.loginId}`,
        {
          content: newReview,
          rating: 5,
        }
      );

      const reviewResponse = await axios.get(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews`
      );
      setReviews(reviewResponse.data);
      setNewReview("");
      alert("리뷰가 등록되었습니다.");
    } catch (err) {
      console.error(err);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://movie-api-test-latest.onrender.com/movies/${movieId}`
        );
        setMovieDetail(response.data);

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

  if (loading)
    return (
      <div className="movie-detail-container">
        <div className="loading">
          <p>로딩중...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="movie-detail-container">
        <div className="error">
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <h2>{movieDetail.title}</h2>
      </div>

      {isLogin ? (
        <>
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

          <div className="reviews-section">
            <h3>리뷰</h3>

            {reviews.length > 0 ? (
              reviews.map((item) => (
                <div className="review-item" key={item.id}>
                  <div className="review-header">
                    <p>작성자 Id: {item.user_id}</p>
                    <p className="review-rating">평점: {item.rating}</p>
                  </div>
                  <p className="review-content">{item.content}</p>
                  <p className="review-date">
                    작성일: {new Date(item.created_at).toLocaleString()}
                  </p>

                  {/* 작성자와 로그인 유저가 같을 때만 삭제 버튼 노출 */}
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
        <div className="login-message">
          <p>영화 상세 정보와 리뷰를 보려면 로그인이 필요합니다.</p>
          <Link to="/login">로그인하러 가기</Link>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;
