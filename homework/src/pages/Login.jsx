import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { SET_CURRENTUSER } from '../store/actions';

const loginAction = (data) => async (dispatch) => { // вызываем dispatch , чтобы отправить действие, это способ вызвать изменение состояния
    try {
        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        } 

        const jsonResponse = await res.json(); // Парсим JSON

        // Проверка, что ответ валидный JSON и содержит токен
        if (typeof jsonResponse === 'object' && jsonResponse !== null && jsonResponse.token) {
            // Записываем логин и токен в currentUser
            dispatch({ 
                type: SET_CURRENTUSER, 
                payload: { 
                    login: data.username,  // Используем username из data
                    token: jsonResponse.token 
                } 
            });
        } else {
            // Обработка ошибки, если токен отсутствует
            console.error("Ошибка входа: Токен не найден в ответе сервера"); 
            throw new Error('Invalid server response: Token not found');
        }

    } catch (error) {
        console.error("Ошибка входа:", error);
        throw error; 
    }
};

const useForm = () => {  
    const nagitation = useNavigate();
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => { 
        const newError = {};
        if (!username) {
            newError.username = 'Name is required';
        } else if (password.length < 5 || !password.match(/[0-9!@#$%^&*]/)) {
            newError.password = 'Password should be at least 5 characters and contain numbers or special characters';
        } 
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const onSubmitHandle = async (event) => { 
        event.preventDefault();
        if (!validateForm()) { 
            return;
        }

        try {
            const res = await loginAction({ username, password }); // Передача объекта данных
            console.log("Server response:", res); // Выводим ответ сервера в консоль
            nagitation('/chat');
            
            
        } catch (error) {
            alert("Login failed! Please check your login and pass!");
        }
    }

    return { username, setUserName, password, setPassword, error, onSubmitHandle };
};

export const Login = () => { //Компонент с авторизацией
    const { username, setUserName, password, setPassword, error, onSubmitHandle } = useForm();

    return (
        <div className="wrapper">
            <div className="form-container">
                <h1 className="title">LOG IN!</h1>
                <form onSubmit={onSubmitHandle}> 
                    <div className="form-container_item">
                        <input type="text" name="username" placeholder="Enter your login" className="input"
                            onChange={(e) => setUserName(e.target.value)} value={username}/>
                        {error.username && <div className="error-message">{error.username}</div>}
                    </div>

                    <div className="form-container_item">
                        <input type="password" name="password" placeholder="Password" className="input"
                            onChange={(e) => setPassword(e.target.value)} value={password}/>
                        {error.password && <div className="error-message">{error.password}</div>}
                    </div>

                    <button className="button" type="submit">Log in</button>
                </form>
            </div>
        </div>
    );
};

