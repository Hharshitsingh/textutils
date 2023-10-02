import './App.css';
import { useState } from "react";
import { TextField, Button, styled } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginButton = styled(Button)`
    margin: 10px 20px;
    background-color: #0e244;
    box-shadow: 5px 5px 10px  2px rgba(88, 88, 88, 0.5);
`;

const loginInValues = {
    username: '',
    password: ''
}

function App() {

const [loginValue, setloginValue] = useState(loginInValues);

    const onInputLogin = (e) => {
        setloginValue({
            ...loginValue,
            [e.target.name]: e.target.value
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

    const loginUser = async () => {

        if (loginValue.username === '') {
            errorNotify('Username is required');
            return;
        } else if (loginValue.password === '') {
            errorNotify('Password is required');
            return;
        } else {
            successNotify('Login Successfully');
        }
    }

  return (
    <div className="App">
       <ToastContainer />
            <TextField label="Username" variant="standard" value={loginValue.username} name="username" onChange={(e) => onInputLogin(e)} />
            <TextField label="Password" variant="standard" value={loginValue.password} name="password" onChange={(e) => onInputLogin(e)} />
            <ReCAPTCHA
                sitekey="Your client site key"
                onChange={onChange}
            />,
            <LoginButton variant="contained" onClick={() => loginUser()}>Login</LoginButton>
    </div>
  );
}

export default App;
