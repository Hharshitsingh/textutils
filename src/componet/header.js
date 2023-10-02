
import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../redux/actions/authAction";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login";
import axios from "axios";
import { BASE_URL } from "../config";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { AiFillApple } from "react-icons/ai";

const LoginButton = styled(Button)`
    margin: 10px 20px;
    background-color: #0e244;
    box-shadow: 5px 5px 10px 2px rgba(88, 88, 88, 0.5);
    `;
const loginInValues = {
    username: "",
    password: "",
    };
const checkBoxValues = {
    rememberMe: false,
    };
function Login() {

}

// header list value
const headerList = [
    {
        id: 1,
        name: "Home",
        path: "/",
    },
    {
        id: 2,
        name: "About",
        path: "/about",
    },
    {
        id: 3,
        name: "Contact",
        path: "/contact",
    },
    {
        id: 4,
        name: "Login",
        path: "/login",
    },
    {
        id: 5,
        name: "Register",
        path: "/register",
    },
];


export default Login;

const [loginValue, setloginValue] = useState(loginInValues);

const onInputLogin = (e) => {
    setloginValue({
        ...loginValue,
        [e.target.name]: e.target.value,
    });
}

function onChange(value) {
    console.log("Captcha value:", value);
}

const errorNotify = (message) => {
    toast.error(message, {
        position: "top-right",
    });
}

const successNotify = (message) => {
    toast.success(message, {
        position: "top-right",
    });
}

const onCheckBox = (e) => {
    setloginValue({
        ...loginValue,
        [e.target.name]: e.target.checked,
    });
}

const loginUser = async () => {
    if (loginValue.username === "") {
        errorNotify("Username is required");
        return;
    } else if (loginValue.password === "") {
        errorNotify("Password is required");
        return;
    }
    const res = await axios.post(`${BASE_URL}/auth/login`, loginValue);
    if (res.data.success) {
        successNotify(res.data.message);
        localStorage.setItem("firstLogin", true);
        dispatch(login());
        history.push("/");
    } else {
        errorNotify(res.data.message);
    }
}

const responseGoogle = async (response) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/google_login`, {
            tokenId: response.tokenId,
        });
        if (res.data.success) {
            localStorage.setItem("firstLogin", true);
            dispatch(login());
            history.push("/");
        } else {
            errorNotify(res.data.message);
        }
    } catch (err) {
        errorNotify(err.response.data.message);
    }
}  

const responseFacebook = async (response) => {
    try {
        const { accessToken, userID } = response;
        const res = await axios.post(`${BASE_URL}/auth/facebook_login`, {
            accessToken,
            userID,
        });
        if (res.data.success) {
            localStorage.setItem("firstLogin", true);
            dispatch(login());
            history.push("/");
        } else {
            errorNotify(res.data.message);
        }
    } catch (err) {
        errorNotify(err.response.data.message);
    }
}

const history = useHistory();

const dispatch = useDispatch();

return(
    <>
    <div className="login">
    <ToastContainer />
    {/* add header  */}
    <div className="header">
        <div className="header__logo">
            <h1>
                <Link to="/">Logo</Link>
            </h1>
        </div>
        <div className="header__list">
            <ul>
                {headerList.map((list) => (
                    <li key={list.id}>
                        <Link to={list.path}>{list.name}</Link>
                    </li>
                ))}
            </ul>
        </div>

        <div className="header__login">
            <LoginButton variant="primary" onClick={() => history.push("/login")}>
                Login
            </LoginButton>
            </div>
            


    </div>
    </>
)
