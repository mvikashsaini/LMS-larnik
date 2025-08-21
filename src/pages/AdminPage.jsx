import React from "react";
import AdminDashboard from "../components/AdminDashboard";
import CoursePage from "./CoursePage";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";
import Governance from "../components/dashboard components/Governance";
import UserRoleAccess from "../components/dashboard components/UserRoleAccess";
import BlogManagerDashboard from "../components/dashboard components/BlogManagerDashboard";

export default function AdminPage(){
    return (
        <>
        {/* <AdminDashboard /> */}
        {/* <CoursePage /> */}
        {/* <ContactPage/> */}
        {/* <CoursePage/> */}
        <Governance />
        <UserRoleAccess />
        <BlogManagerDashboard />
        </>
    )
}