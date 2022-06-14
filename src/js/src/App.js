import "./App.css";
import { getAllStudents } from "./client";
import { errorNotification } from "./Notification";
import React, { useState, useEffect, Fragment } from "react";
import Container from "./Container";
import Footer from "./Footer";
import AddStudentForm from "./forms/AddStudentForm";
import { Table, Avatar, Spin, Modal, Empty, Popconfirm, Button } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

const getIndicatorIcon = () => (
  <LoadingOutlined style={{ fontSize: 24 }} spin />
);

function App() {
  const [students, setStudents] = useState([]);
  const [isFetching, setisFetching] = useState(false);
  const [isAddStudentModalVisible, setisAddStudentModalVisible] =
    useState(false);

  function FetchStudents() {
    useEffect(() => {
      setisFetching(true);
      getAllStudents()
        .then((res) => res.json())
        .then((data) => {
          setisFetching(false);
          setStudents(data);
          console.log(data);
        })
        .catch((error) => {
          console.log(error.error);
          const message = error.error.message;
          const description = error.error.error;
          errorNotification(message, description);
          setisFetching(false);
        });
    }, []);
  }

  FetchStudents();

  const openAddStudentModal = () => setisAddStudentModalVisible(true);
  const closeAddStudentModal = () => setisAddStudentModalVisible(false);

  const commonElements = () => (
    <div>
      <Modal
        title="Add new student"
        visible={isAddStudentModalVisible}
        onOk={closeAddStudentModal}
        onCancel={closeAddStudentModal}
        width={1000}
      >
        <AddStudentForm
          onSuccess={() => {
            this.closeAddStudentModal();
            FetchStudents();
          }}
        />
      </Modal>
      <Footer
        numberOfStudents={students.length}
        handleAddStudentClickEvent={openAddStudentModal}
      />
    </div>
  );

  if (isFetching) {
    return (
      <Container>
        <Spin indicator={getIndicatorIcon()} />
      </Container>
    );
  }

  if (students && students.length) {
    const columns = [
      {
        title: "",
        key: "avatar",
        render: (text, student) => (
          <Avatar size="large">
            {`${student.firstName.charAt(0).toUpperCase()}${student.lastName
              .charAt(0)
              .toUpperCase()}`}
          </Avatar>
        ),
      },
      {
        title: "Student Id",
        dataIndex: "studentId",
        key: "studentId",
      },
      {
        title: "First Name",
        dataIndex: "firstName",
        key: "firstName",
      },
      {
        title: "Last Name",
        dataIndex: "lastName",
        key: "lastName",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Gender",
        dataIndex: "gender",
        key: "gender",
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <Fragment>
            <Popconfirm
              placement='topRight'
              title={`Are you sure to delete ${record.studentId}`} 
              onConfirm={() => this.deleteStudent(record.studentId)} okText='Yes' cancelText='No'
              onCancel={e => e.stopPropagation()}>
              <Button type='danger' onClick={(e) => e.stopPropagation()}>Delete</Button>
            </Popconfirm>
            <Button style={{marginLeft: '5px'}} type='primary' onClick={() => this.editUser(record)}>Edit</Button>
          </Fragment>
        ),
      }
    ];
    return (
      <Container>
        <Table
          style={{ marginBottom: "100px" }}
          dataSource={students}
          columns={columns}
          rowKey={"studentId"}
          pagination={false}
        />
        { commonElements() }
      </Container>
    );
  }
  return (
    <Container>
      <Empty description={<h1>No Students found</h1>} />
      { commonElements() }
    </Container>
  );
}

export default App;
