import { useRecoilValue } from "recoil";
import { userAtom } from "../atoms/userAtom";
import {  useNavigate } from "react-router-dom";


const ProtectedRouter = ( {children} : {children : React.ReactNode}) => {
    const user = useRecoilValue(userAtom);

    const navigate = useNavigate();

    if(!user.id){
        navigate('/register')
    }

    return <>{children}</>
};

export default ProtectedRouter;