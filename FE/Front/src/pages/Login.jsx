"use client"

import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"

function Login({ onLoginSuccess }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { loginId, password } = formData

    if (loginId.trim() === "" || password.trim() === "") {
      alert("모든정보 입력바람")
      return
    }

    try {
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
        },
      )
      alert("로그인 성공!")
      console.log(response.data)
      const user = {
        loginId: response.data.userId,
        keyId: response.data.id,
        name: response.data.name,
        gender: response.data.gender,
      }
      onLoginSuccess(user)
      navigate("/")
    } catch (error) {
      console.error(error)
      alert(`로그인 실패! ${error.response.data.detail}`)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>로그인</h1>
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

        <button type="submit">로그인</button>
        <button type="button" onClick={() => navigate(-1)}>
          취소
        </button>

        <div className="signup-link">
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </div>
      </form>
    </div>
  )
}

export default Login
