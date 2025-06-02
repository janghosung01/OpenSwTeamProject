import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import UserContext from "../Context/UserContext";
import "./MyPage.css";

function Mypage() {
  // 사용자 리뷰 데이터와 로딩 상태를 위한 state
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 로그인 상태와 유저 정보 컨텍스트로부터 받아오기
  const { isLogin, userData } = useContext(UserContext);

  useEffect(() => {
    // 유저 ID가 없는 경우 경고 후 중단
    if (!userData.loginId) {
      alert("유저 ID가 전달되지 않았습니다.");
      return;
    }

    // 유저의 리뷰와 각 영화의 제목을 함께 불러오는 비동기 함수
    const fetchData = async () => {
      try {
        // 유저의 리뷰 목록 요청
        const reviewRes = await axios.get(
          `https://movie-api-test-latest.onrender.com/users/${userData.loginId}/reviews`
        );

        // 각 리뷰에 대해 영화 제목을 병렬로 요청하여 추가
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

        setReviews(reviewsWithTitles); // 리뷰 목록 저장
      } catch (err) {
        console.error("에러 발생:", err);
        alert("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchData();
  }, [userData.loginId]); // 유저 ID 변경 시 새로 실행

  // 리뷰 삭제 핸들러
  const handleDeleteReview = async (movieId, reviewId) => {
    const confirmDelete = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      // 리뷰 삭제 요청 (user_id 쿼리 전달 필요)
      await axios.delete(
        `https://movie-api-test-latest.onrender.com/movies/${movieId}/reviews/${reviewId}`,
        {
          params: {
            user_id: userData.loginId,
          },
        }
      );

      // 삭제 후 유저 리뷰 다시 불러오기
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

  // 로딩 상태일 때
  if (loading) return <div>불러오는 중...</div>;

  // 실제 렌더링 부분
  return (
    <div className="mypage-container">
      <div className="mypage-header">
        <h2>마이페이지</h2>
      </div>

      <div className="mypage-content">
        {/* 유저 정보 표시 */}
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

        {/* 리뷰 목록 출력 */}
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
                  <div className="review-date">
                    작성일: {new Date(review.created_at).toLocaleString()}
                  </div>
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
  );
}

export default Mypage;
