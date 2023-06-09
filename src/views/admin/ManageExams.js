import React, { Suspense, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import DataTable from 'react-data-table-component';
import data from 'src/data/data';
import { cilPen, cilPlus, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';



const ManageExams = () => {
  const [modalHeading, setModalHeading] = useState("Add New Exam");
  const [exams, setExams] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedExamForDelete,setSelectedExamForDelete] = useState(-1);
  const [exam, setExam] = useState({
    title: "",
    date: new Date(),
    maxScore: 5,
    timeAllotted: 1,
    code: "",
    password: "",
    status: "UNPUBLISHED"
  });

  const columns = [
    {
      name: 'S.N',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Exam Date',
      selector: row => row.date,
      sortable: true,
    },
    {
      name: 'Maximum Score',
      selector: row => row.maxScore,
      sortable: true,
    },
    {
      name: 'Allotted Time',
      selector: row => row.timeAllotted,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => {
        if (row.status == 'UNPUBLISHED') {
          return <span className="badge bg-danger">{row.status}</span>
        } else if (row.status == 'PUBLISHED') {
          return <span className="badge bg-warning text-dark">{row.status}</span>
        } else if (row.status == 'COMPLETED') {
          return <span className="badge bg-success">{row.status}</span>
        } else {
          return <span className="badge bg-light text-dark">{row.status}</span>
        }
      },
      sortable: true,
    },
    {
      name: 'Exam Code',
      selector: row => row.code,
      sortable: true,
    },
    {
      name: 'Exam Password',
      selector: row => row.password,
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => {
        var actionsHtml = <>
        <CButton className="btn btn-primary m-1" onClick={() => {
          handleShowEditExamModal(row);
        }}><CIcon icon={cilPen} /></CButton>
          <CButton className="btn btn-danger text-white m-1" onClick={()=>{handleShowDeleteExamModal(row.id);}}><CIcon icon={cilTrash} /></CButton></>
          ;
        return actionsHtml;
      },
      sortable: true,
    }
  ];

  const paginationComponentOptions = {
    rowsPerPageText: 'Showing',
    rangeSeparatorText: 'of'
  };


  const handleChange = ({ currentTarget: input }) => {
    const oldExam = { ...exam };
    oldExam[input.name] = input.value;
    setExam(oldExam);
  };
  const updateExamsTable = ()=>{
    data.getAllExams().then(allExamsInDb=>{
      console.log("All exams in db:",allExamsInDb);
      let data = [];
      allExamsInDb.forEach(d=>{
          data.push(d);
      });
      setExams(data);
    }).catch(err=>{
      console.log(err);
    });
  };

  const handleSubmit = () => {
    data.addExam(exam).then(result => {
      updateExamsTable();
    }).catch(err => {
      console.log(err);
    });
  }
  const handleShowEditExamModal = (exam)=>{
    if(exam){
      let currentExam = {};
          currentExam["id"] = exam.id;
          currentExam["title"] = exam.title;
          currentExam["date"] = exam.date;
          currentExam["maxScore"] = exam.maxScore;
          currentExam["timeAllotted"] = exam.timeAllotted;
          currentExam["status"] = exam.status;
          currentExam["code"] = exam.code;
          currentExam["password"] = exam.password;
          setExam(currentExam);
          setModalHeading("Update Exam");
    }
    setEditModalVisible(true);
  };
  const handleHideEditExamModal = () => {
    setEditModalVisible(false);
  };
  const handleShowDeleteExamModal = (examId)=>{
    setSelectedExamForDelete(examId);
    setDeleteModalVisible(true);
  };
  const handleHideDeleteExamModal = ()=>{
    setDeleteModalVisible(false);
  };
  const handleExamDelete = ()=>{
    if(selectedExamForDelete != -1){
      data.deleteExam(selectedExamForDelete)
      .then(deletedExamId=>{
        updateExamsTable();
      })
      .catch(err=>{
        console.log(err);
      });
    }
  };

  useEffect(() => {
    data.getAllExams().then(examsInDb => {
      let oldExams = [...exams];
      oldExams = oldExams.map(oe => ({ ...oe }));
      oldExams = oldExams.concat(examsInDb);
      setExams(oldExams);
    }).catch(err => {
      console.log(err);
    });

  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Manage Exams</strong>
            </CCardHeader>
            <CCardBody>
              <CButton color="primary" onClick={()=>{
                handleShowEditExamModal(undefined);
              }}>
                <CIcon icon={cilPlus} className="me-2" />
                Add Exam
              </CButton>
              <CModal backdrop="static" visible={editModalVisible} onClose={handleHideEditExamModal} size="lg">
                <CModalHeader>
                  <CModalTitle>{modalHeading}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CRow>
                    <CCol xs={12}>
                      <CForm>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examTitle">Exam Title</CFormLabel>
                          <CFormInput
                            type="text"
                            id="examTitle"
                            placeholder="Title Goes Here"
                            value={exam.title}
                            name="title"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examDate">Date</CFormLabel>
                          <CFormInput
                            type="date"
                            id="examDate"
                            placeholder="Select Exam Date"
                            value={exam.date}
                            name="date"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examMaxScore">Max. Score</CFormLabel>
                          <CFormInput
                            type="number" min="5"
                            id="examMaxScore"
                            placeholder="Max. Score Goes Here"
                            value={exam.maxScore}
                            name="maxScore"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examTimeAllotted">Time Allotted</CFormLabel>
                          <CFormInput
                            type="number" min="1"
                            id="examTimeAllotted"
                            placeholder="Time Allotted Goes Here"
                            value={exam.timeAllotted}
                            name="timeAllotted"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examCode">Exam Code</CFormLabel>
                          <CFormInput
                            type="text"
                            id="examCode"
                            placeholder="Exam Code Goes Here"
                            value={exam.code}
                            name="code"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examPassword">Exam Password</CFormLabel>
                          <CFormInput
                            type="text"
                            id="examPassword"
                            placeholder="Exam Password Goes Here"
                            value={exam.password}
                            name="password"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="mb-3">
                          <CFormLabel htmlFor="examStatus">Exam Password</CFormLabel>
                          <CFormSelect id="examStatus" value={exam.status} name="status" onChange={handleChange}>
                            <option>Select status</option>
                            <option value="UNPUBLISHED">UNPUBLISHED</option>
                            <option value="PUBLISHED">PUBLISHED</option>
                            <option value="COMPLETED">COMPLETED</option>
                          </CFormSelect>
                        </div>
                      </CForm>
                    </CCol>
                  </CRow>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={() => setEditModalVisible(false)}>
                    Close
                  </CButton>
                  <CButton color="primary" onClick={handleSubmit}>Save changes</CButton>
                </CModalFooter>
              </CModal>
              <CModal backdrop="static" visible={deleteModalVisible} onClose={handleHideDeleteExamModal}>
                <CModalHeader>
                  <CModalTitle>Delete Exam</CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <h6>Are you sure you want to delete this exam?</h6>
                </CModalBody>
                <CModalFooter>
                  <CButton color="secondary" onClick={handleHideDeleteExamModal}>
                    Close
                  </CButton>
                  <CButton color="primary" onClick={handleExamDelete}>Save changes</CButton>
                </CModalFooter>
              </CModal>
              <DataTable
                columns={columns}
                data={exams}
                pagination
                paginationComponentOptions={paginationComponentOptions}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default ManageExams
