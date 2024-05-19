// import React from 'react';
// import { Form, Input, Button } from 'antd';

// const LoginPage = () => {
//     const onFinish = (values) => {
//         console.log('Received values:', values);
//         // Xử lý đăng nhập ở đây
//     };

//     const onFinishFailed = (errorInfo) => {
//         console.log('Failed:', errorInfo);
//     };

//     return (
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: 20, width: 300 }}>
//                 <Form
//                     name="basic"
//                     initialValues={{ remember: true }}
//                     onFinish={onFinish}
//                     onFinishFailed={onFinishFailed}
//                 >
//                     <Form.Item
//                         label="Username"
//                         name="username"
//                         rules={[{ required: true, message: 'Please input your username!' }]}
//                     >
//                         <Input />
//                     </Form.Item>

//                     <Form.Item
//                         label="Password"
//                         name="password"
//                         rules={[{ required: true, message: 'Please input your password!' }]}
//                     >
//                         <Input.Password />
//                     </Form.Item>

//                     <Form.Item style={{ textAlign: 'center' }}>
//                         <Button type="primary" htmlType="submit">
//                             Login
//                         </Button>
//                     </Form.Item>
//                 </Form>
//             </div>
//         </div>
//     );
// };

// export default LoginPage;

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log('Received values:', values);

        try {
            const response = await fetch('http://localhost:9090/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                localStorage.setItem('token', data.token)

                message.success('Login successful!');
                navigate('/home')
                // Handle successful login, e.g., redirect to another page
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                message.error('Login failed: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error during login:', error);
            message.error('Login failed: ' + error.message);
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ border: '1px solid #ccc', borderRadius: 5, padding: 20, width: 300 }}>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item style={{ textAlign: 'center' }}>
                        <Button type="primary" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default LoginPage;

