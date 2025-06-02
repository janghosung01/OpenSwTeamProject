import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import './App.css'
import UserContext from './Context/UserContext'
// 페이지 컴포넌트
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MyPage from './pages/Mypage'
import MovieDetail from './pages/MovieDetail'
//공통 컴포넌트
import Header from './Components/Header'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  //로그인 여부 변수
  const [isLogin, SetIsLogin] = useState(false);
  // 사용자 정보 변수
  const [userData, SetUserData] = useState({
    loginId: "",
    keyId: "",
    name: "",
    gender: "",
  });
  // 로그인 성공 시 호출, response에서 사용자 정보 받아 상태 업데이트
  const handleLoginSuccess = (user) => {
    SetIsLogin(true);
    SetUserData(user); // user는 로그인 API 응답에서 받은 사용자 정보 객체
  };

  //로그아웃 시 상태 초기화
  const handleLogout = () => {
    SetIsLogin(false);
    SetUserData({
      loginId: "",
      keyId: "",
      name: "",
      gender: "",
    });
  };

  //컴포넌트 재렌더링 위한 변수
  const location = useLocation();
  return (
    <>
      {/*헤더 컴포넌트*/}
      <Header LoginInfo={isLogin} onLogout={handleLogout} userData={userData.name} />
      <UserContext.Provider value={{ isLogin, userData }}>
        {/* 모든 하위 컴포넌트에서 UserContext 통해 로그인 정보 이용 */}
        <Routes>
          {/* 홈 페이지: 진입 시 location 이용해 재랜더링 */}
          <Route path='/' element={<Home key={location.key} />} />
          {/* 로그인 페이지*/}
          <Route path='/login' element={<Login onLoginSuccess={handleLoginSuccess} />} />
          {/* 회원가입 페이지 */}
          <Route path='/signup' element={<SignUp />} />
          {/* 영화 상세 페이지 */}
          <Route path="/movie/:movieId" element={<MovieDetail />} />
          {/* 마이 페이지 : 로그인한 사용자만 접근 가능하도록 ProtectedRoute로 보호 */}
          <Route path='/mypage' element={
            <ProtectedRoute isLogin={isLogin}> <MyPage /> </ProtectedRoute>
            } 
          />
        </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
