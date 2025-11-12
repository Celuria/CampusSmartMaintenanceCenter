import './Login.css';
//import {useEffect} from 'react';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
//import {Link} from 'react-router-dom';

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/home');
    };
 
     return (
         <div className="worker-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginTop: '100px'
         }}>
             <h1>Login</h1>
           
            <div>
                <label>用户名：</label>
                <input
                type="text"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                placeholder="请输入用户名"
                />
            </div>
 
            <div>
                <label>密码：</label>
                <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="请输入密码"
                />
            </div>

            <button onClick={handleLogin} style={{padding: '8px 20px'}}>
                登录
            </button>
         </div>
     );
}

export default Login;