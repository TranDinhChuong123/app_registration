
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Table, Button, Modal, message } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { API_CancelRegisterClass, API_ClassessByEnrolledStd, API_GetAllCourseByMaJorIdc, API_GetClassByCourseId, API_GetUserId, API_RegisterClass } from '../../services/Api_Service';
// import {resetInstance} from '../../services/InstanceAPI';
import Profile from '../../components/home/Profile';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const HomePage = () => {


    const [classesWithEnrolledStudents, setClassesWithEnrolledStudents] = useState([]);

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');

    };

    const [classobj, setClassObj] = useState(null);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null); // Môn học được chọn để đăng ký
    const [userId, setUserId] = useState(null); //
    const handleRegisterCourse = async (course) => {
        setSelectedCourse(course);
        setShowClasses(true);
        setShowCourseInfo(false)
        setPageTitle("Đăng ký lớp học")
        // setIsModalVisible(true); // Hiển thị modal khi đăng ký môn học
    };
    const [pageTitle, setPageTitle] = useState("Trang chủ"); // State để lưu trạng thái tiêu đề trang
    const [showCourseInfo, setShowCourseInfo] = useState(false); // Thêm trạng thái mới
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [classes, setClasses] = useState([]); // Danh sách lớp
    const [showClasses, setShowClasses] = useState(false); // Trạng thái hiển thị danh sách lớp

    const [showClassesDK, setShowClassesDK] = useState(false);
    const [registeredClasses, setRegisteredClasses] = useState([]);
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await API_GetAllCourseByMaJorIdc();
                setCourses(data);




            } catch (error) {
                console.error('Error fetching courses:', error);
                // Xử lý lỗi
            }
        };
        fetchCourses();
    }, []);

    const fetchClasses = async () => {
        try {

            const data = await API_GetClassByCourseId(selectedCourse.id)
            setClasses(data);
            console.log("data ", data);
            setShowClasses(true);
        } catch (error) {
            console.error('Error fetching classes:', error);
            // Handle error
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const data = await API_GetClassByCourseId(selectedCourse.id)
                setClasses(data);
                console.log("data API_GetClassByCourseId", data);
                setShowClasses(true);
                const filteredClasses = data.filter(classItem => classItem.enrolledStudents.includes(1));
                setClassesWithEnrolledStudents(filteredClasses);
                console.log("filteredClasses ", filteredClasses);
            } catch (error) {
                console.error('Error fetching classes:', error);
                // Handle error
            }
        };
        if (showClasses) {
            fetchClasses();
        }
    }, [showClasses, selectedCourse]);


    useEffect(() => {
        const fetchUserId = async () => {
            try {

                const data = await API_GetUserId();
                setUserId(data)
                console.log("UserId", data);
                const token = localStorage.getItem('token');
                console.log("token ", token);

            } catch (error) {
                console.error('Error fetching classes:', error);
                // Handle error
            }
        };
        fetchUserId();
    }, [])

    const [refreshData, setRefreshData] = useState(false);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const data = await API_ClassessByEnrolledStd()
                if (Array.isArray(data) && data.length > 0) {
                    setClassesWithEnrolledStudents(data);

                }


            } catch (error) {
                console.error('Error fetching classes:', error);
                // Handle error
            }
        }
        if (showClassesDK || refreshData) {
            fetchdata();
        }
        setRefreshData(false);

    }, [showClassesDK, refreshData])


    const handleRegisterClass = async (selectedClass) => {
        try {

            console.log("selectedClass.id", selectedClass.id);
            const data = await API_RegisterClass(selectedClass.id)
            console.log("success");
            message.success('Đăng ký thành công!');
            console.log("data :", data);
            setRegisteredClasses([...registeredClasses, selectedClass.id]);
            fetchClasses();
            // setIsModalVisible(true);
            // Xử lý khi API thành công, có thể hiển thị thông báo hoặc thực hiện hành động khác
        } catch (error) {
            console.error('Error registering class:', error);
            // Xử lý khi có lỗi xảy ra
        }
    };

    const fetchRemoveStudentFromClass = async (selectedClass) => {
        try {
            const data = await API_CancelRegisterClass(selectedClass.id)
            console.log("success");
            message.success('Hủy Đăng ký thành công!');
            console.log("Hủy đăng ký  :", data);

        } catch (error) {
            console.error('Error registering class:', error);
            // Xử lý khi có lỗi xảy ra
        }
    };
    const handleModalOk = () => {
        // Xử lý khi nhấn OK trong modal, ví dụ chuyển hướng đến trang đăng ký lớp học
        setIsModalVisible(false);
        handleRegisterClass(classobj)
        // navigate('/register-class');
    };

    const OpenModal = (classobj1) => {
        // Xử lý khi nhấn OK trong modal, ví dụ chuyển hướng đến trang đăng ký lớp học
        setIsModalVisible(true);
        setClassObj(classobj1);
        // navigate('/register-class');
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
    };
    const handleCancelRegisterClass = async (selectedClass) => {
        // Logic xử lý hủy đăng ký lớp
        await fetchRemoveStudentFromClass(selectedClass);
        const updatedClasses = classes.map(cls => {
            if (cls.id === selectedClass.id) {
                cls.enrolledStudents = cls.enrolledStudents.filter(studentId => studentId !== userId);
            }
            return cls;
        });
        setClasses(updatedClasses);
        setRefreshData(true);
    };

    const columnsLopHoc = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Lớp',
            dataIndex: 'className',
            key: 'className',
        },

        {
            title: 'Tên Môn Học',
            dataIndex: ['course', 'name'], // Sử dụng mảng để truy cập đến fullName trong đối tượng lecturer
            key: 'course.name', // Key phản ánh đường dẫn đến fullName
        },
        {
            title: 'Đã đăng ký',
            key: 'enrolledStudents',
            render: (text, record) => `${record.enrolledStudents.length} / ${record.maxStudents}`,
        },
        {
            title: 'Tên Giáo Viên',
            dataIndex: ['lecturer', 'fullName'], // Sử dụng mảng để truy cập đến fullName trong đối tượng lecturer
            key: 'lecturer.fullName', // Key phản ánh đường dẫn đến fullName
        },
        {
            title: 'Phòng Học',
            key: 'room',
            render: (text, record) => `${record.room.roomNumber} - ${record.room.building}`,
        },
        {
            title: 'Học Phí',
            key: 'registrationFee',
            render: (text, record) => `${record.registrationFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`

        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                // Kiểm tra xem lớp đã đăng ký hay chưa và hiển thị nút tương ứng
                record.enrolledStudents.includes(userId) ? (
                    <Button style={{ backgroundColor: "red" }} type="primary" onClick={() => handleCancelRegisterClass(record)}>Hủy đăng ký</Button>
                ) : (
                    <Button type="primary" onClick={() => OpenModal(record)}>Đăng ký</Button>
                )
            ),
        },
    ];

    const columnsMonHoc = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Môn Học',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số Tín chỉ',
            dataIndex: 'credits',
            key: 'credits',
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (text, record) => (
                <Button type="primary" onClick={() => handleRegisterCourse(record)}>Xem chi Tiết</Button>
            ),
        },
    ];

    const totalRegistrationFee = classesWithEnrolledStudents !== null
        ? classesWithEnrolledStudents.reduce((total, classItem) => total + classItem.registrationFee, 0)
        : 0;


    const columnsLopHocDK = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Lớp',
            dataIndex: 'className',
            key: 'className',
        },

        {
            title: 'Tên Môn Học',
            dataIndex: ['course', 'name'], // Sử dụng mảng để truy cập đến fullName trong đối tượng lecturer
            key: 'course.name', // Key phản ánh đường dẫn đến fullName
        },
        {
            title: 'Đã đăng ký',
            key: 'enrolledStudents',
            render: (text, record) => `${record.enrolledStudents.length} / ${record.maxStudents}`,
        },
        {
            title: 'Tên Giáo Viên',
            dataIndex: ['lecturer', 'fullName'], // Sử dụng mảng để truy cập đến fullName trong đối tượng lecturer
            key: 'lecturer.fullName', // Key phản ánh đường dẫn đến fullName
        },
        {
            title: 'Phòng Học',
            key: 'room',
            render: (text, record) => `${record.room.roomNumber} - ${record.room.building}`,
        },
        {
            title: 'Học Phí',
            key: 'registrationFee',
            render: (text, record) => `${record.registrationFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`

        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                // Kiểm tra xem lớp đã đăng ký hay chưa và hiển thị nút tương ứng
                record.enrolledStudents.includes(userId) ? (
                    <Button style={{ backgroundColor: "red" }} type="primary" onClick={() => handleCancelRegisterClass(record)}>Hủy đăng ký</Button>
                ) : (
                    <Button type="primary" onClick={() => OpenModal(record)}>Đăng ký</Button>
                )
            ),
        },
    ];

    const handleShowCourseInfo = () => {
        setShowCourseInfo(true);
        setShowClasses(false);
        setPageTitle("Danh sách môn học");
        setShowClassesDK(false);
    };

    const handleShowClassInfoDK = () => {
        setShowClassesDK(true);
        setShowCourseInfo(false);
        setShowClasses(false);
        setShowProfile(false);
        setPageTitle("Danh sách lớp học đã đăng ký ")
    };

    const handleGoBackToCourses = () => {
        setShowClasses(false); // Ẩn danh sách lớp học
        setShowCourseInfo(true); // Hiển thị danh sách môn học
        setShowProfile(false);
    };




    const [showProfile, setShowProfile] = useState(false);

    const handleShowProfile = () => {
        setShowProfile(true);
        setShowCourseInfo(false);
        setShowClasses(false);
        setShowClassesDK(false);
        setPageTitle("Thông tin cá nhân");
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <div className="logo" />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1">Trang chủ</Menu.Item>
                    <Menu.Item key="2" onClick={handleShowProfile}>Thông tin cá nhân</Menu.Item>
                    <Menu.Item key="3">Thời khóa biểu</Menu.Item>
                    <Menu.Item key="4" onClick={handleLogout}>Đăng xuất</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu key="sub1" icon={<UserOutlined />} title="Danh mục">
                            <Menu.Item key="1">Môn học</Menu.Item>
                            <Menu.Item key="2">Thông báo</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub2" icon={<LaptopOutlined />} title="Học phần">
                            <Menu.Item key="3" onClick={handleShowClassInfoDK}>Danh sách lớp học </Menu.Item>
                            <Menu.Item key="4" onClick={handleShowCourseInfo}>Đăng ký học phần</Menu.Item>
                        </SubMenu>
                        <SubMenu key="sub3" icon={<NotificationOutlined />} title="Thông báo">
                            <Menu.Item key="5">Thông báo mới</Menu.Item>
                            <Menu.Item key="6">Lịch học</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ marginTop: '10px', fontSize: "20px", fontWeight: "bolder", alignSelf: "center" }}>
                        <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                        }}
                    >
                        {showProfile && <Profile />}
                        {showClasses && (
                            <>
                                <Button style={{ marginBottom: 10 }} onClick={handleGoBackToCourses}>Trở lại</Button>
                                <Table dataSource={classes} columns={columnsLopHoc} />


                            </>
                        )}

                        {showClassesDK && (
                            <>
                                <Table dataSource={classesWithEnrolledStudents} columns={columnsLopHocDK} pagination={false} />
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <h4 style={{ marginLeft: 'auto', marginRight: '10px' }}>Tổng tiền học phí</h4>

                                    <p style={{ color: 'red' }}>{totalRegistrationFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                                </div>


                            </>
                        )}
                        <Modal
                            title="Xác nhận đăng ký lớp học"
                            visible={isModalVisible}
                            onOk={handleModalOk}
                            onCancel={handleModalCancel}
                        >
                            {selectedCourse && (
                                <p>Xác nhận đăng ký môn {selectedCourse.name}?</p>
                            )}
                        </Modal>

                        {showCourseInfo && <Table dataSource={courses} columns={columnsMonHoc} />}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};
export default HomePage;
