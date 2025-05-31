import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../Context/UserContext";
import "./MyPage.css"

function Mypage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLogin, userData } = useContext(UserContext);

  useEffect(() => {
    if (!userData.loginId) {
      alert("유저 ID가 전달되지 않았습니다.");
      return;
    }

    const fetchData = async () => {
      try {
        // 해당 유저의 리뷰 가져오기
        const reviewRes = await axios.get(
          `https://movie-api-test-latest.onrender.com/users/${userData.loginId}/reviews`
        );
        const reviewsWithTitles = await Promise.all(
        reviewRes.data.map(async (review) => {
          try {
            const movieRes = await axios.get(
              `https://movie-api-test-latest.onrender.com/movies/${review.movie_id}`
            );
            return {
              ...review,
              movie_title: movieRes.data.title,
            };
          } catch (err) {
            console.warn("영화 제목 불러오기 실패:", review.movie_id);
            return { ...review, movie_title: "제목 불명" };
            }
          })
        );
        setReviews(reviewsWithTitles);
      } catch (err) {
        console.error("에러 발생:", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData.loginId]);

  const handleDeleteReview = async (movieId, reviewId) => {
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

      // 삭제 후 해당 유저의 리뷰만 다시 가져오기
      const reviewRes = await axios.get(
        `https://movie-api-test-latest.onrender.com/users/${userData.loginId}/reviews`
      );

      const reviewsWithTitles = await Promise.all(
        reviewRes.data.map(async (review) => {
          try {
            const movieRes = await axios.get(
              `https://movie-api-test-latest.onrender.com/movies/${review.movie_id}`
            );
            return {
              ...review,
              movie_title: movieRes.data.title,
            };
          } catch (err) {
            console.warn("영화 제목 불러오기 실패:", review.movie_id);
            return { ...review, movie_title: "제목 불명" };
          }
        })
      );

      setReviews(reviewsWithTitles);
      alert("리뷰가 삭제되었습니다.");
    } catch (err) {
      console.error("리뷰 삭제 중 에러 발생:", err);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };


  if (loading) return <div>불러오는 중...</div>;

  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>

      <div className="mypage-content">
        {userData && (
          <div className="user-info-section">
            <h3>회원 정보</h3>
            <div className="user-info-content">
              <div className="user-info-item">
                <strong>이름</strong>
                <span>{userData.name}</span>
              </div>
              <div className="user-info-item">
                <strong>아이디</strong>
                <span>{userData.loginId}</span>
              </div>
              <div className="user-info-item">
                <strong>성별</strong>
                <span>{userData.gender === "MALE" ? "남성" : "여성"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="reviews-section">
          <h3>작성한 리뷰</h3>
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>작성한 리뷰가 없습니다.</p>
            </div>
          ) : (
            <ul className="reviews-list">
              {reviews.map((review) => (
                <li key={review.id} className="review-item">
                  <div className="review-movie-title">{review.movie_title}</div>
                  <div className="review-rating">평점: {review.rating}점</div>
                  <div className="review-content">{review.content}</div>
                  <div className="review-date">작성일: {new Date(review.created_at).toLocaleString()}</div>
                  <button
                    className="review-button-delete"
                    onClick={() => handleDeleteReview(review.movie_id, review.id)}
                  >
                    삭제
                  </button>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Mypage