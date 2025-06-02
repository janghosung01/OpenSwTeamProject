import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
function Header(props) {
  const isLogin = props.LoginInfo;  // 로그인 여부
  const onLogout = props.onLogout;  // 로그아웃 핸들러 함수
  const name = props.userData;      // 사용자 이름

  return (
    <div className="headerContainer">
      {/* 로고 또는 메인 페이지 링크 */}
      <Link className="Mainpage" to="/">
          영화 리뷰 사이트
        </Link>

      {/* 우측 메뉴 그룹 */}
      <div className="Group right">
        <Link className="right word" to="/">
          홈
        </Link>


        {/* 로그인 상태에 따라 다른 메뉴 렌더링 */}
        {isLogin ? (
          <>
            {/* 로그인한 사용자 이름 표시 */}
            <div className="right ">
              <p className="Name">{name}</p>님
            </div>
            {/* 마이페이지 이동 */}
            <Link className="right word" to="/mypage">
              마이페이지
            </Link>
            {/* 로그아웃 버튼 */}
            <button className="logoutBtn" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            {/* 로그인 및 회원가입 링크 */}
            <Link className="loginBtn" to="/login">
              로그인
            </Link>

            <Link className="signUpBtn" to="/signup">
              회원 가입
            </Link>
          </>
        )}
        
            
      </div>
    </div>
  );
}

export default Header;
