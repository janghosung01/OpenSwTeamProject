"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./signup.css"

function SignUp() {
  // 회원가입 폼 데이터 관리
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
    gender: "",
  })

  const navigate = useNavigate() // 페이지 이동을 위한 훅

  // 입력값 변경 시 호출
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value, // 해당 입력 필드의 값 갱신
    }))
  }

  // 폼 제출 시 실행
  const handleSubmit = async (e) => {
    e.preventDefault() // 폼의 기본 제출 동작 방지

    const { loginId, password, name, gender } = formData

    // 입력값이 비어있을 경우 알림
    if (loginId.trim() === "" || password.trim() === "" || name.trim() === "" || gender.trim() === "") {
      alert("모든정보 입력바람")
      return
    }

    try {
      // 회원가입 API 요청
      const response = await axios.post(
        `https://movie-api-test-latest.onrender.com/register`,
        {
          name: name,
          userId: loginId,
          password: password,
          gender: gender,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      alert("회원가입 성공!") // 성공 시 알림
      navigate("/") // 홈으로 이동
    } catch (error) {
      console.error(error.response.data.detail)
      alert(`회원가입 실패! ${error.response.data.detail}`) // 실패 시 알림
      navigate("/") // 실패해도 홈으로 이동
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>회원가입</h1>

        {/* 아이디 입력 */}
        <div>
          <label htmlFor="loginId">아이디</label>
          <input
            id="loginId"
            name="loginId"
            type="text"
            value={formData.loginId}
            onChange={handleChange}
            placeholder="사용할 아이디를 입력하세요"
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

        {/* 이름 입력 */}
        <div>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="이름을 입력하세요"
          />
        </div>

        {/* 성별 선택 */}
        <div className="gender-container">
          <div className="gender-option">
            <input
              type="radio"
              id="male"
              name="gender"
              value="MALE"
              checked={formData.gender === "MALE"}
              onChange={handleChange}
            />
            <label htmlFor="male">남성</label>
          </div>

          <div className="gender-option">
            <input
              type="radio"
              id="female"
              name="gender"
              value="FEMALE"
              checked={formData.gender === "FEMALE"}
              onChange={handleChange}
            />
            <label htmlFor="female">여성</label>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button type="submit">회원가입</button>

        {/* 취소 버튼 (이전 페이지로 이동) */}
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>

        {/* 로그인 페이지로 이동 링크 */}
        <div className="login-link">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </div>
      </form>
    </div>
  )
}

export default SignUp
