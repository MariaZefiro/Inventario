import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './styles.css';
import Loader from "../Loader";
import config from "../../config";
import axios from 'axios';
import CryptoJS from 'crypto-js';
import ParticlesBackground from "../ParticlesBackground/ParticlesBackground";

const Login = () => {
    const backendIp = config.backend_ip;
    const secretKey = config.secretKey;
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const cachedData = getUserData();
        if (cachedData) {
            navigate('/home');
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            setIsLoading(true);
            const cachedData = getUserData();

            if (cachedData) {
                if (cachedData.username !== null) {
                    navigate('/home');
                    setIsLoading(false);
                }
                return;
            }

            const response = await axios.post(`${backendIp}/api/login`, {
                username: login,
                senha: password
            });

            if (response.status === 200) {
                const data = response.data;

                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
                localStorage.setItem('userData', encryptedData);
                setIsLoading(false);
                navigate('/home');
            } else {
                setIsLoading(false);
                setErrorMessage(response.data.message || "Erro ao realizar login!");
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage("Verifique suas credenciais.");
        } finally {
            setIsLoading(false);
        }
    };

    const getUserData = () => {
        const cachedData = localStorage.getItem('userData');
        if (!cachedData) return null; // Retorna null se não houver dados no localStorage

        try {
            // Descriptografar o dado
            const bytes = CryptoJS.AES.decrypt(cachedData, secretKey);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            return decryptedData;
        } catch (error) {
            console.error('Erro ao descriptografar os dados:', error);
            return null; // Retorna null se ocorrer um erro na descriptografia
        }
    };

    return (
        <div className="container-login">
            <ParticlesBackground />
            {isLoading ? (
                <Loader />
            ) : (
                <div className="card-login">
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <div style={{ width: '90%', display: 'flex', justifyContent: 'center', borderBottom: '1px solid #ffffff57', marginBottom: '20px', paddingBottom: '10px' }}>
                            <svg width="280" viewBox="0 0 300 80.0011196668991" class="looka-1j8o68f"><defs id="SvgjsDefs1145"></defs><g id="SvgjsG1146" featurekey="symbolFeature-0" transform="matrix(0.05459709092974663,0,0,0.05459709092974663,0.02729854534942521,0.02729854534942521)" fill="#0b6bcb"><path xmlns="http://www.w3.org/2000/svg" d="M893.3,160.7c0,88.7-72,160.9-160.7,161.2v-0.5h-0.5v-0.5h-0.5v0.5h0.5v0.5h0.5v0h-0.5c-88.9,0-161.2-72.3-161.2-161.2  c0-88.9,72.3-161.2,161.2-161.2S893.3,71.8,893.3,160.7z"></path><circle xmlns="http://www.w3.org/2000/svg" cx="160.7" cy="160.7" r="72"></circle><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 4.0354 331.1821)" cx="401.8" cy="160.7" rx="116.6" ry="116.6"></ellipse><rect xmlns="http://www.w3.org/2000/svg" x="731.6" y="320.9" width="0.5" height="0.5"></rect><polygon xmlns="http://www.w3.org/2000/svg" points="732.1,321.4 732.1,320.9 731.6,320.9 731.6,321.4 732.1,321.4 732.1,321.9 732.6,321.9 732.6,321.4 "></polygon><circle xmlns="http://www.w3.org/2000/svg" cx="1062.5" cy="160.7" r="116.6"></circle><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.9871 -0.1602 0.1602 0.9871 -8.9104 210.8861)" cx="1303.6" cy="160.7" rx="71.9" ry="71.9"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -237.0375 231.3207)" cx="160.7" cy="401.8" rx="116.6" ry="116.6"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.2298 -0.9732 0.9732 0.2298 -90.6223 778.3138)" cx="446.4" cy="446.4" rx="71.9" ry="71.9"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -132.8 661.5322)" cx="732.1" cy="491.1" rx="116.6" ry="116.6"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.1602 -0.9871 0.9871 0.1602 414.154 1379.5999)" cx="1017.8" cy="446.4" rx="71.9" ry="72"></ellipse><circle xmlns="http://www.w3.org/2000/svg" cx="1303.6" cy="401.8" r="116.6"></circle><rect xmlns="http://www.w3.org/2000/svg" x="160.2" y="892.4" width="0.5" height="0.5"></rect><path xmlns="http://www.w3.org/2000/svg" d="M321.9,732.1c0,88.7-72,160.9-160.7,161.2v-0.5h-0.5v-0.5h-0.5v0.5h0.5v0.5h0.5v0h-0.5C71.8,893.4-0.5,821-0.5,732.1  c0-88.9,72.3-161.2,161.2-161.2S321.9,643.2,321.9,732.1z"></path><polygon xmlns="http://www.w3.org/2000/svg" points="160.7,892.8 160.7,892.4 160.2,892.4 160.2,892.9 160.7,892.9 160.7,893.3 161.2,893.3 161.2,892.8 "></polygon><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.2298 -0.9732 0.9732 0.2298 -334.3244 1041.8427)" cx="491" cy="732.1" rx="116.6" ry="116.6"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.1602 -0.9871 0.9871 0.1602 -107.7927 1337.5253)" cx="732.1" cy="732.1" rx="71.9" ry="71.9"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -232.6544 902.6021)" cx="973.2" cy="732.1" rx="116.6" ry="116.6"></ellipse><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -135.9015 1136.2052)" cx="1303.6" cy="732.2" rx="161.2" ry="161.2"></ellipse><circle xmlns="http://www.w3.org/2000/svg" cx="160.7" cy="1062.5" r="116.6"></circle><circle xmlns="http://www.w3.org/2000/svg" cx="446.4" cy="1017.8" r="71.9"></circle><path xmlns="http://www.w3.org/2000/svg" d="M848.7,973.2c0,64.3-52.3,116.5-116.6,116.5c-64.3,0-116.6-52.3-116.6-116.5c0-64.3,52.3-116.6,116.6-116.6  S848.7,908.9,848.7,973.2z"></path><circle xmlns="http://www.w3.org/2000/svg" cx="1017.8" cy="1017.8" r="72"></circle><circle xmlns="http://www.w3.org/2000/svg" cx="1303.6" cy="1062.5" r="116.6"></circle><circle xmlns="http://www.w3.org/2000/svg" cx="160.7" cy="1303.5" r="72"></circle><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -804.0676 665.9094)" cx="401.8" cy="1303.6" rx="116.6" ry="116.6"></ellipse><circle xmlns="http://www.w3.org/2000/svg" cx="732.1" cy="1303.6" r="161.2"></circle><circle xmlns="http://www.w3.org/2000/svg" cx="1062.5" cy="1303.5" r="116.6"></circle><ellipse xmlns="http://www.w3.org/2000/svg" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -539.9423 1303.5642)" cx="1303.6" cy="1303.6" rx="71.9" ry="71.9"></ellipse></g><g id="SvgjsG1147" featurekey="nameFeature-0" transform="matrix(2.15669322013855,0,0,2.15669322013855,95.45067197152096,-15.196555629188381)" fill="#fff"><path d="M4.1797 27.578 l-2.0703 0 c1.1719 -6.7578 6.4453 -13.926 12.695 -16.094 c6.4258 -2.2461 11.738 -1.1523 17.363 1.8945 l-1.875 8.0664 l-3.0859 0 c-0.44922 -1.0938 -0.15625 -3.2422 -4.6875 -3.6328 c-6.4453 -0.56641 -10.684 5.0781 -11.445 9.7656 l2.0703 0 c-0.39063 2.4414 0.13672 4.6484 1.7969 5.5469 c1.0938 0.58594 2.6758 0.85938 5.0195 0.58594 l0.039063 0 l0.72266 -3.1641 l-4.6484 0 l0.68359 -2.9688 l-2.1094 0 l1.0156 -4.375 l14.336 0 l-0.99609 4.375 l2.0898 0 l-2.4805 10.762 c-0.99609 0.41016 -2.0313 0.74219 -3.0664 1.0938 c-4.6484 1.4258 -10.605 2.3828 -15.234 0.52734 c-5.4883 -2.1484 -7.0313 -7.1484 -6.1328 -12.383 z M36.13285 27.266 l-2.2461 0 l9.1797 -16.387 l9.7461 0 l1.582 16.387 l2.1875 0 l1.2305 12.715 l-10.059 0 l-0.41016 -5.4883 l-5.5664 0 c-0.97656 1.8164 -1.8945 3.6523 -2.8711 5.4883 l-9.8828 0 z M47.089749999999995 27.676000000000002 l0 -0.41016 l-2.1289 0 l0.039063 -6.4844 l-2.6172 6.4844 l2.168 0 l-0.15625 0.41016 l2.6953 0 z M73.69165625 26.719 l-2.9688 13.359 l-9.9023 0 l3.0469 -13.359 l-1.7773 0 l1.9727 -8.5547 l-7.8125 0 l1.7188 -7.4023 l25.352 0 l-1.6602 7.4023 l-7.793 0 l-1.9141 8.5547 l1.7383 0 z M93.0275625 27.344 l-2.9297 12.734 l-9.8828 0 l2.9297 -12.734 l-1.9922 0 l3.8281 -16.484 l9.8633 0 l-3.7891 16.484 l1.9727 0 z"></path></g></svg>
                        </div>
                    </div>
                    <form onSubmit={handleLogin}>
                        <div className="field-login">
                            <svg className="input-icon-login" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M207.8 20.73c-93.45 18.32-168.7 93.66-187 187.1c-27.64 140.9 68.65 266.2 199.1 285.1c19.01 2.888 36.17-12.26 36.17-31.49l.0001-.6631c0-15.74-11.44-28.88-26.84-31.24c-84.35-12.98-149.2-86.13-149.2-174.2c0-102.9 88.61-185.5 193.4-175.4c91.54 8.869 158.6 91.25 158.6 183.2l0 16.16c0 22.09-17.94 40.05-40 40.05s-40.01-17.96-40.01-40.05v-120.1c0-8.847-7.161-16.02-16.01-16.02l-31.98 .0036c-7.299 0-13.2 4.992-15.12 11.68c-24.85-12.15-54.24-16.38-86.06-5.106c-38.75 13.73-68.12 48.91-73.72 89.64c-9.483 69.01 43.81 128 110.9 128c26.44 0 50.43-9.544 69.59-24.88c24 31.3 65.23 48.69 109.4 37.49C465.2 369.3 496 324.1 495.1 277.2V256.3C495.1 107.1 361.2-9.332 207.8 20.73zM239.1 304.3c-26.47 0-48-21.56-48-48.05s21.53-48.05 48-48.05s48 21.56 48 48.05S266.5 304.3 239.1 304.3z"></path></svg>
                            <input
                                autoComplete="off"
                                id="logemail"
                                placeholder="Login"
                                className="input-field-login"
                                name="logemail"
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                required
                            />
                        </div>
                        <div className="field-login">
                            <svg className="input-icon-login" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
                                <path d="M80 192V144C80 64.47 144.5 0 224 0C303.5 0 368 64.47 368 144V192H384C419.3 192 448 220.7 448 256V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V256C0 220.7 28.65 192 64 192H80zM144 192H304V144C304 99.82 268.2 64 224 64C179.8 64 144 99.82 144 144V192z"></path></svg>
                            <input
                                autoComplete="off"
                                id="logpass"
                                placeholder="Senha"
                                className="input-field-login"
                                name="logpass"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-button-login">
                            <button className="btn-login" type="submit">Login</button>
                        </div>
                        <p style={{ color: 'red' }}>{errorMessage}</p>
                        <p className="btn-link-login">* Faça login apenas se você for um de nossos usuários.</p>
                        <p className="btn-link-login">Se você não possui credenciais de acesso, por favor, entre em contato com os administradores do sistema para obter assistência.</p>
                    </form>
                </div >
            )}
        </div >
    );
};

export default Login;