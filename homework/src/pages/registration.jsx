import {useState} from 'react';
import { useDispatch } from 'react-redux';
import { authSlice } from '../store/actions';

const useForm = () => {  // Мой пользовательский хук
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateForm = () => {
        const newError = {};
        if (!name) {
            newError.name = 'First Name are required';
        } else if (password.length < 5 || !password.match(/[0-9!@#$%^&*]/)) {
            newError.password = 'Password should be at least 5 characters and contain numbers or special characters';
        } 
        setError(newError);
        return Object.keys(newError).length === 0;
    };

    const dispatch = useDispatch();

    const onSubmitHandle = (event) => {
        event.preventDefault();
        if (!validateForm()) {
            return;
        }

        // Валидация прошла успешно, можно авторизоваться на Swagger
        // Здесь нужно заменить на реальный код авторизации
        dispatch(authSlice.login({ name, password }));
        setName('');
        setPassword('');
    };

    return { name, setName, password, setPassword, error, onSubmitHandle };
};


function Registration() {
    const { name, setName, password, setPassword, error, onSubmitHandle } = useForm();

    return (
        <div className="form-container">
            <h1 className="title">Please register to start!</h1>
            <form onSubmit={onSubmitHandle}> 
                <div className="form-container_item">
                    <input type="text" name="name" placeholder="First Name" className="input"
                        onChange={(e) => setName(e.target.value)} value={name}/>
                    {error.name && <div className="error-message">{error.name}</div>}
                </div>

                <div className="form-container_item">
                    <input type="password" name="password" placeholder="Password" className="input"
                        onChange={(e) => setPassword(e.target.value)} value={password}/>
                    {error.password && <div className="error-message">{error.password}</div>}
                </div>

                <button type="submit" className="button">Register</button>
            </form>
        </div>
    );
};

export default Registration;