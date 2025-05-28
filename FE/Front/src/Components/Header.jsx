import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
function Header(props) {
  const isLogin = props.LoginInfo;
  const onLogout = props.onLogout;
  const name = props.userData;

  return (
    <div className="headerContainer">
      
      <Link className="Mainpage" to="/">
          영화 리뷰 사이트
        </Link>
      <div className="Group right">
        <Link className="right word" to="/">
          홈
        </Link>

        {isLogin ? (
          <>
                  <div className="right ">
          <p className="Name">{name}</p>님
        </div>
        <Link className="right word" to="/mypage">
          마이페이지
        </Link>
            <button className="logoutBtn" onClick={onLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
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
