import './Login.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login() {
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        setError('');       //清空之前的错误信息

        if(username === 'stu' && password === '123'){
            navigate('/stuhome');
        }else if(username === 'worker' && password === '456'){
            navigate('/workerhome');
        }else if(username === 'admin' && password === '789'){
            navigate('/adminhome');
        }else{
            setError('用户名或密码错误');
        }
        
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

             <form onSubmit={handleLogin} style={{display: 'flex',
                flexDirection: 'column', alignItems: 'center', gap: '15px'}}>
                <div>
                    <label>用户名：</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}
                        placeholder="请输入用户名"
                        required
                    />
                </div>
 
                <div>
                    <label>密码：</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                        placeholder="请输入密码"
                        required
                    />
                </div>

                {error && (
                    <div style={{color: 'red', fontSize: '14px', textAlign: 'center'}}>
                        {error}
                    </div>
                )}

                <button type="submit" style={{padding: '8px 20px'}}>
                    登录
                </button>
            </form>
         </div>
     );
}

export default Login;