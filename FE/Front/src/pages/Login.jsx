"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"
import "./Login.css"

function Login({ onLoginSuccess }) {
  const navigate = useNavigate() // 페이지 이동용 훅

  // 로그인 폼 데이터 관리
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  })

  // 입력값 변경 시 호출
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // 폼 제출 시 실행
  const handleSubmit = async (e) => {
    e.preventDefault() // 폼의 기본 제출 동작 방지

    const { loginId, password } = formData

    // 입력값이 비어있을 경우 알림
    if (loginId.trim() === "" || password.trim() === "") {
      alert("모든정보 입력바람")
      return
    }

    try {
      // 로그인 API 요청
      const response = await axios.post(
        `https://movie-api-test-latest.onrender.com/login`,
        {
          userId: loginId,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      alert("로그인 성공!")
      console.log(response.data)

      // 로그인 성공 후 사용자 정보를 부모 컴포넌트로 전달
      const user = {
        loginId: response.data.userId,
        keyId: response.data.id,
        name: response.data.name,
        gender: response.data.gender,
      }

      onLoginSuccess(user) // 로그인 처리 함수 호출
      navigate("/") // 홈으로 이동
    } catch (error) {
      console.error(error)
      alert(`로그인 실패! ${error.response.data.detail}`) // 오류 메시지 출력
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>로그인</h1>

        {/* 아이디 입력 */}
        <div>
          <label htmlFor="loginId">아이디</label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            value={formData.loginId}
            onChange={handleChange}
            placeholder="아이디를 입력하세요"
          />
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password">비밀번호</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="비밀번호를 입력하세요"
          />
        </div>

        {/* 로그인 버튼 */}
        <button type="submit">로그인</button>

        {/* 취소 버튼 (이전 페이지로 이동) */}
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>

        {/* 회원가입 페이지로 이동 링크 */}
        <div className="signup-link">
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </div>
      </form>
    </div>
  )
}

export default Login
