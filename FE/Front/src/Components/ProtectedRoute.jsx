import { Navigate } from "react-router-dom";

function ProtectedRoute({ isLogin, children }) {
  if (!isLogin) {
    // 로그인 안 되어 있으면 홈으로 이동시킴
    return <Navigate to="/" replace />;
  }

  return children; // 로그인 돼 있으면 자식 컴포넌트 보여줌
}

export default ProtectedRoute;
