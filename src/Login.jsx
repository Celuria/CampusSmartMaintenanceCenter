import './Login.css';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Input, Button} from 'antd';
import backgroundImage from './assets/1001.jpg';

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
          minHeight: '100vh',
          // 背景图并叠加 50% 透明度的遮罩（使背景看起来 50% 不透明）
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          paddingTop: '100px'
        }}>
           <h1>理工管家——校园报修中心</h1>

           <form onSubmit={handleLogin} style={{display: 'flex',flexDirection: 'column', alignItems: 'center', gap: '15px',backgroundColor: 'rgba(240,242,245,0.85)', padding: '30px', borderRadius: '8px' }}>
             <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <label style={{minWidth: '70px', textAlign: 'right'}}>用户名</label>
                <Input
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    placeholder="请输入用户名"
                    required
                    style={{width: 260,boxShadow:'0 5 5px rgba(0,0,0,0.1)'}}
                />
             </div>
 
             <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                <label style={{minWidth: '70px', textAlign: 'right'}}>密码：</label>
                <Input
                    type="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="请输入密码"
                    required
                    style={{width: 260,boxShadow:'0 5 5px rgba(0,0,0,0.1)'}}
                />
             </div>

             {error && (
                <div style={{color: 'red', fontSize: '14px', textAlign: 'center', width: 330}}>
                    {error}
                </div>
             )}

             <Button htmlType="submit" type="primary" style={{padding: '8px 20px'}}>
                登录
             </Button>
          </form>
        </div>
    );
}

export default Login;