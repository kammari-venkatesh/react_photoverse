import { useState } from 'react';
import './index.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
export default function PhotoVerseLogin() {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLoginEmailChange = (e) => {
        setLoginEmail(e.target.value);

    }   
    const handleLoginPasswordChange = (e) => {
        setLoginPassword(e.target.value);
    }       
    const handleSignupEmailChange = (e) => {
        setSignupEmail(e.target.value);
    }
    const handleSignupPasswordChange = (e) => {
        setSignupPassword(e.target.value);
    }
    const handleNameChange = (e) => {
        setSignupName(e.target.value);
    }
 const handleformsubmit = (e) => {
       e.preventDefault();
    const fetchlogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login'
            , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword
                })
            });
            if (response.ok) {
                setErrorMessage('');
                const data = await response.json();
                Cookies.set('token', data.access_token, { expires: 7 });
                Cookies.set('userid', JSON.stringify(data.userid), { expires: 7 });
                setActiveTab('login');
                navigate("/home", { replace: true });
                console.log('Login successful:', data);
            } else {
                console.error('Login failed:', response.statusText);
                setErrorMessage('Invalid email or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    fetchlogin();
    };
   const handlesignupformsubmit = (e) => {
       e.preventDefault();
       const fetchsignup = async () => {
           try {
               const response = await fetch('http://127.0.0.1:8000/api/register', {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify({
                       email: signupEmail,
                       password: signupPassword,
                       username: signupName
                   })
               });
               console.log(response);
               if (response.ok) {
                   const data = await response.json();
                    setActiveTab('login');
                    setErrorMessage('');
                   console.log('Signup successful:', data);
               } else {
                   console.error('Signup failed:', response.statusText);
                    setErrorMessage('Signup failed. Please try again.');
               }
           } catch (error) {
               console.error('Error during signup:', error);
           }
       };
       fetchsignup();
   }

  return (
    <div className="app">
      <div className="header">
        <div className="logo">
            <div className="logo-icon"></div>
          <span className="logo-text">PhotoVerse</span>
        </div>
      </div>
      
      <div className="main-content">
        <div className="login-container">
          <div className="auth-tabs">
            <button 
              className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button 
              className={`tab-button ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
          
          <div className="welcome-text">
            {activeTab === 'login' ? 'Welcome Back!' : 'Join PhotoVerse!'}
          </div>
          
          <div className="auth-form">
            {activeTab === 'login' ? (
              <>
              <form className='form' onSubmit={handleformsubmit}>
                <div className="input-group">
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="Email"
                    value={loginEmail}
                    onChange={handleLoginEmailChange}
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Password"
                    value={loginPassword}
                    onChange={handleLoginPasswordChange}
                  />
                </div>
                
                <button type='submit' className="auth-button">Login</button>
                <p className='error-message'>{errorMessage}</p>
                </form>
              </>
            ) : (
              <>
              <form className='form' onSubmit={handlesignupformsubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Name"
                    value={signupName}
                    onChange={handleNameChange}
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="email" 
                    className="input-field" 
                    placeholder="Email"
                    value={signupEmail}
                    onChange={handleSignupEmailChange}
                  />
                </div>
                
                <div className="input-group">
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Password"
                    value={signupPassword}
                    onChange={handleSignupPasswordChange}
                  />
                </div>
                <button type='submit' className="auth-button">Create Account</button>
                <p className='error-message'>{errorMessage}</p>
              </form>
              </>
            )}
            
            <div className="divider">
              <span className="divider-text">Or continue with</span>
            </div>
            
            <div className="social-buttons">
              <button className="social-button">
                <span className="social-icon github"></span>
                <span className="social-text">SearchEngineCo</span>
              </button>
              
              <button className="social-button">
                <span className="social-icon facebook"></span>
                <span className="social-text">SocialConnect</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}