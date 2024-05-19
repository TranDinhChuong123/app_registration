export const API_GetUserInfo = async () => {
    try {
        const response = await fetch(`http://localhost:8082/api/v1/students/20002835`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();

        return jsonData;
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};


export const API_GetAllCourseByMaJorIdc = async () => {
    try {
        const response = await fetch('http://localhost:9090/api/v1/courses/majorid', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_GetClassByCourseId = async (courseId) => {
    try {
        const response = await fetch(`http://localhost:9090/api/v1/classes/course-id/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_Classes = async (courseId) => {
    try {
        const response = await fetch(`http://localhost:9090/api/v1/classes/course-id/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_GetUserId = async () => {
    try {
        const response = await fetch('http://localhost:9090/api/v1/auth/userid-info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_RegisterClass = async (classId) => {
    try {
        const response = await fetch(`http://localhost:9090/api/v1/classes/${classId}/enroll`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_CancelRegisterClass = async (classId) => {
    try {
        const response = await fetch(`http://localhost:9090/api/v1/classes/rm-cls-idstd/${classId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};

export const API_ClassessByEnrolledStd = async () => {
    try {
        const response = await fetch('http://localhost:9090/api/v1/classes/classes-by-enrolled-students', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Error : ', error);
        return null;
    }
};








