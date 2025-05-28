import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import {  useNavigate } from "react-router-dom";

type ProtectedRouterProps = {
  children: React.ReactNode;
};

const ProtectedRouter = ({ children }: ProtectedRouterProps) => {
    const user = useRecoilValue(userAtom);

    const navigate = useNavigate();

    return (
        user.id != "" ? children : navigate('/register')
    )
};

export default ProtectedRouter;