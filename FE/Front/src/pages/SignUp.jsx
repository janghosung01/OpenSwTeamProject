"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./signup.css"
function SignUp() {
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    name: "",
    gender: "",
  })

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { loginId, password, name, gender } = formData

    if (loginId.trim() === "" || password.trim() === "" || name.trim() === "" || gender.trim() === "") {
      alert("모든정보 입력바람")
      return
    }

    try {
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
      alert("회원가입 성공!")
      navigate("/")
    } catch (error) {
      console.error(error.response.data.detail)
      alert(`회원가입 실패! ${error.response.data.detail}`)
      navigate("/")
    }
  }

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h1>회원가입</h1>

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

        <button type="submit">회원가입</button>
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>

        <div className="login-link">
          이미 계정이 있으신가요? <a href="/login">로그인</a>
        </div>
      </form>
    </div>
  )
}

export default SignUp
