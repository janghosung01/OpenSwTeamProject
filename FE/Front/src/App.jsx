import { useState } from 'react'
import { Routes, Route} from 'react-router-dom'

import './App.css'
import UserContext from './Context/UserContext'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import MyPage from './pages/Mypage'
import MovieDetail from './pages/MovieDetail'
import Header from './Components/Header'

function App() {
    const [isLogin,SetIsLogin]=useState(false);
    const [userData, SetUserData] = useState({
      loginId: "",
      keyId:"",
      name: "",
      gender: "",
    });
  // 로그인 성공 시 호출, response에서 사용자 정보 받아 상태 업데이트



    const handleLogout = () => {
    SetIsLogin(false);
     SetUserData({
      loginId: "",
      keyId: "",
      name: "",
      gender: "",
    });
  };
  return (
    <>
    <Header LoginInfo={isLogin} onLogout={handleLogout} userData={userData.name}/>
      <UserContext.Provider value={{ isLogin, userData }}>
      {/* 이제 하위 컴포넌트 어디서든 UserContext 쓸 수 있음 */}
      <Routes>
        <Route path='/' element={<Home key={location.key} />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/movie/:movieId" element={<MovieDetail />} />
        <Route path='/mypage'element={<MyPage/>}/>
      </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
