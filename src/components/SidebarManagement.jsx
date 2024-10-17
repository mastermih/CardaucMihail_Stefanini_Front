import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Correct import
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem,
} from 'cdbreact';
import { getUser } from './dataService';

const SidebarManagement = () => {
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);

    const getRoleFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.roles || [];
            } catch (error) {
                console.error('Error decoding token:', error);
                return [];
            }
        }
        return [];
    };

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                return decodedToken.id;
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    };

    useEffect(() => {
        const userIdFromToken = getUserIdFromToken();
        if (userIdFromToken) {
            const fetchUserProfile = async () => {
                try {
                    const user = await getUser(userIdFromToken);  // Fetch user data from backend
                    setUserProfile(user);  // Set the user profile with fetched data
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            };
            fetchUserProfile();
        }
    }, []);

    const role = getRoleFromToken();

    // Collect menu items, including the conditional one
    const menuItems = [
        <NavLink key="orders" exact="true" to="/orders/" className={({ isActive }) => (isActive ? 'activeClicked' : '')}>
            <CDBSidebarMenuItem icon="columns">Orders</CDBSidebarMenuItem>
        </NavLink>,
        <NavLink key="viewusers" exact="true" to="/ViewUsers" className={({ isActive }) => (isActive ? 'activeClicked' : '')}>
            <CDBSidebarMenuItem icon="table">View Users</CDBSidebarMenuItem>
        </NavLink>,
        role.includes('ADMIN') ? (
            <NavLink key="createuser" to="/createUser/Superior" className={({ isActive }) => (isActive ? 'activeClicked' : '')}>
                <CDBSidebarMenuItem icon="user">Create User</CDBSidebarMenuItem>
            </NavLink>
        ) : null,
        <NavLink key="sales" exact="true" to="/Sales" className={({ isActive }) => (isActive ? 'activeClicked' : '')}>
            <CDBSidebarMenuItem icon="chart-line">Sales</CDBSidebarMenuItem>
        </NavLink>,
        <NavLink key="createproducts" exact="true" to="/CreateProducts" target="_blank" className={({ isActive }) => (isActive ? 'activeClicked' : '')}>
            <CDBSidebarMenuItem icon="sticky-note">Create Products</CDBSidebarMenuItem>
        </NavLink>,
    ];

    // Filter out null values
    const validMenuItems = menuItems.filter((item) => item !== null);

    return (
        <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CDBSidebar textColor="#fff" backgroundColor="#333">
                <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                    <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                        To User Main Page
                    </a>
                </CDBSidebarHeader>
                <CDBSidebarContent className="sidebar-content">
                    <CDBSidebarMenu>
                        {validMenuItems}
                    </CDBSidebarMenu>
                </CDBSidebarContent>

                {/* Move the user profile image to the bottom */}
                <CDBSidebarFooter style={{ textAlign: 'left', paddingLeft: '10px', marginTop: 'auto' }}>
                    <div
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#333',
                            paddingRight: '10px',
                        }}
                        onClick={() => navigate(`/UserProfile/${userProfile?.id}`)}
                    >
                        {userProfile && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`http://localhost:8080/${userProfile?.image}`}
                                    alt="Profile"
                                    style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '2px solid #fff',
                                    }}
                                />
                                <p
                                    style={{
                                        margin: '0 15px',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        color: '#fff',
                                    }}
                                >
                                    View Profile
                                </p>
                            </div>
                        )}
                    </div>
                </CDBSidebarFooter>
            </CDBSidebar>
        </div>
    );
};

export default SidebarManagement;
