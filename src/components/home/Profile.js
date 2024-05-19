// src/components/Profile.js

import React, { useEffect, useState } from 'react';
import { API_GetUserInfo } from '../../services/Api_Service';
import { Card, Avatar } from 'antd';

const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await API_GetUserInfo();
                console.log("datacmm", data);
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

    if (!userInfo) {
        return <p>Loading...</p>;
    }

    return (
        <Card title="Thông tin cá nhân" style={{ width: 300, margin: '0 auto' }}>
            <Card.Meta
                avatar={<Avatar src="https://via.placeholder.com/150" />}
                title={userInfo.name}
                description={userInfo.email}
            />
            <p><strong>ID:</strong> {userInfo.id}</p>
            <p><strong>Khoa:</strong> {userInfo.major.faculty.name}</p>
            <p><strong>Ngành:</strong> {userInfo.major.name}</p>
            <p><strong>Số tín chỉ đã hoàn thành:</strong> {userInfo.creditsCompleted}</p>
            <p><strong>Điểm trung bình (GPA):</strong> {userInfo.gpa}</p>
        </Card>
    );
};

export default Profile;
