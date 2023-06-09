const exams = [
    {
        id: 1,
        title: "Exit Exam 2023",
        date: "2023-06-05",
        maxScore: 5,
        timeAllotted: 30,
        status: "UNPUBLISHED",
        code: "NE2023",
        password: "NE2023",
    }
];

const questions = [
    {
        id: 1,
        description: "UML standa for?",
        points: 1,
        answerChoiceId: 3,
        examId: 1
    },
    {
        id: 2,
        description: "Wich one of the following is not a programming language?",
        points: 2,
        answerChoiceId: 6,
        examId: 1
    },
    {
        id: 3,
        description: "Java is dynamically typed language?",
        points: 2,
        answerChoiceId: 10,
        examId: 1
    },
];

const choices = [
    {
        id: 1,
        description: "Universal Media Line",
        questionId: 1
    },
    {
        id: 2,
        description: "Universal Modeling Language",
        questionId: 1
    },
    {
        id: 3,
        description: "Unified Modeling Language",
        questionId: 1
    },
    {
        id: 4,
        description: "None of the Above",
        questionId: 1
    },
    {
        id: 5,
        description: "Java",
        questionId: 2
    },
    {
        id: 6,
        description: "HTTP",
        questionId: 2
    },
    {
        id: 7,
        description: "Scala",
        questionId: 2
    },
    {
        id: 8,
        description: "C-Sharp",
        questionId: 2
    },
    {
        id: 9,
        description: "True",
        questionId: 3
    },
    {
        id: 10,
        description: "False",
        questionId: 23
    }
];

const users = [
    {
        id: 1,
        firstName: "Bella",
        lastName: "Yitbarek",
        email: "bella.yitbarek@gmail.com",
        password: "123456",
        role: "student"
    },
    {
        id: 1,
        firstName: "Yitbareck",
        lastName: "Zewde",
        email: "ytbareck@gmail.com",
        password: "123456",
        role: "admin"
    }
];

const results = [];

const examState = [];

// Functions

const getStudentByEmailAndPassword = (email, password) => {
    let user = users.find(u => u.email == email && u.password == password);
    if (user) {
        return new Promise((resolve, reject) => {
            let userDTO = { ...user };
            delete userDTO.password;
            resolve(userDTO);
        });
    }
    return new Promise((resolve, reject) => {
        reject(new Error("Invalid email and/or password"));
    });
};

const getAllExams = () => {
    return new Promise((resolve, reject) => {
        resolve(exams);
    });
};

const addExam = (exam) => {
    try {
        if(exam.id){
            //update exam
            var examInDbIndex = exams.findIndex(e=>e.id == exam.id);
            if(examInDbIndex >= 0){
                exams.splice(examInDbIndex,1,exam);
                console.log(exams);
                return new Promise((resolve, reject) => {
                    resolve(exam);
                });
            }else{
                return new Promise((resolve, reject) => {
                    reject(new Error("Exam with the specified ID doesn't exist"));
                });
            }
        }else{
            //add exam
            exam["id"] = exams[exams.length - 1].id + 1;
            exams.push(exam);
            return new Promise((resolve, reject) => {
                resolve(exam);
            });
    }
    } catch (ex) {
        return new Promise((resolve, reject) => {
            reject(ex);
        });
    }
};

const deleteExam = (id)=>{
    var examInDbIndex = exams.findIndex(e=>e.id == id);
    if(examInDbIndex >= 0){
        exams.splice(examInDbIndex,1);
        return new Promise((resolve, reject) => {
            resolve(id);
        });
    }else{
        return new Promise((resolve, reject) => {
            reject(new Error("Exam with the specified ID doesn't exist"));
        });
    }
};

export default {
    getStudentByEmailAndPassword,
    getAllExams,
    addExam,
    deleteExam
};