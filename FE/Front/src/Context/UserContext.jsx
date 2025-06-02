import { createContext } from "react";
// 이 Context를 통해 로그인 상태, 사용자 정보 등을 공유할 수 있음
const UserContext = createContext(null);

export default UserContext;
