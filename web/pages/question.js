import React from "react";
import { Row, Col, Card, Form, FloatingLabel, Button } from "react-bootstrap";
import axios from "axios";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faX,
  faInfo,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import Link from "../components/Link";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useRequest from "../hooks/use-request";
import QuestionCard from "../components/QuestionCard";
import AnalogyCard from "../components/AnalogyCard";
import jsPDF from "jspdf";
import Modal from "../components/Modal";

const auth_url = process.env.NEXT_PUBLIC_AUTH_BASE_URL;
const assignment_url = process.env.NEXT_PUBLIC_ASSIGNMENT_BASE_URL;

const multiChoiceTemplate = [
  "Which of the following analogies for cell wall is better and why?",
  "Which of the following sentences in this analogy are flawed and why?",
];

const question = ({
  userInfo,
  collectedAnalogies,
  savedQuestions,
  savedQuestionnaires,
}) => {
  console.log(collectedAnalogies);
  const [analogies, setAnalogies] = useState(collectedAnalogies);

  const [templateType, setTemplateType] = useState(0);

  const [questions, setQuestions] = useState([
    {
      id: null, // id is null - new question
      name: "New Question",
      title: "",
      note: "",
      type: 0,
      choices: [], // { text: '', isCorrect: false }
    },
  ]);
  const [qIndex, setQIndex] = useState(0);

  const [questionnaires, setQuestionnaires] = useState([
    {
      id: null, // id is null - new questionnaire
      name: "New Questionnaire",
      questions: [], // { id, name }
    },
  ]);
  const [qnIndex, setQnIndex] = useState(0);

  const [myQuestions, setMyQuestions] = useState(savedQuestions);

  const [myQuestionnaires, setMyQuestionnaires] = useState(savedQuestionnaires);

  const [downloadId, setDownloadId] = useState(null);

  const [isDownload, setIsDownload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsDownload(false);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      id: null,
      name: `New Question`,
      title: "",
      type: 0,
      choices: [],
    };
    setQuestions([...questions, newQuestion]);
    setQIndex(questions.length);
  };

  const handleAddQuestionnaire = () => {
    const newQuestionnaire = {
      id: null,
      name: `New Questionnaire`,
      questions: [],
    };
    setQuestionnaires([...questionnaires, newQuestionnaire]);
    setQnIndex(questionnaires.length);
  };

  const handleRemoveQuestion = (index) => {
    console.log("handleRemoveQuestion", index);
    if (index === null || index < 0) return;
    let newQuestions = [
      {
        id: null,
        name: "New Question",
        title: "",
        note: "",
        type: 0,
        choices: [],
      },
    ];
    if (questions.length === 1) {
      setQuestions(newQuestions);
    } else {
      newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
    }
    console.log("remove question", index, qIndex);
    if (index === qIndex) {
      setQIndex(newQuestions.length > 0 ? newQuestions.length - 1 : null);
    } else if (index < qIndex) {
      setQIndex(qIndex - 1);
    }
  };

  const handleRemoveQuestionnaire = (index) => {
    if (index === null || index < 0) return;
    let newQuestionnaires = [
      {
        id: null,
        name: "New Questionnaire",
        questions: [],
      },
    ];
    if (questionnaires.length === 1) {
      setQuestionnaires(newQuestionnaires);
    } else {
      newQuestionnaires = questionnaires.filter((_, i) => i !== index);
      setQuestionnaires(newQuestionnaires);
    }
    if (index === qnIndex) {
      setQnIndex(
        newQuestionnaires.length > 0 ? newQuestionnaires.length - 1 : null
      );
    } else if (index < qnIndex) {
      setQnIndex(qnIndex - 1);
    }
  };

  const handleAddChoice = () => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const selectedQuestion = updatedQuestions[qIndex];
      selectedQuestion.choices = [
        ...selectedQuestion.choices,
        { text: "", isCorrect: false },
      ];
      return updatedQuestions;
    });
  };

  const handleRemoveChoice = (choiceIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const selectedQuestion = updatedQuestions[qIndex];
      selectedQuestion.choices = selectedQuestion.choices.filter(
        (_, i) => i !== choiceIndex
      );
      return updatedQuestions;
    });
  };

  const handleChoiceChange = (choiceIndex, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const selectedQuestion = updatedQuestions[qIndex];
      selectedQuestion.choices = selectedQuestion.choices.map((choice, i) =>
        i === choiceIndex ? { ...choice, text: value } : choice
      );
      return updatedQuestions;
    });
  };

  const handleCorrectChange = (choiceIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const selectedQuestion = updatedQuestions[qIndex];
      selectedQuestion.choices = selectedQuestion.choices.map((choice, i) =>
        i === choiceIndex ? { ...choice, isCorrect: !choice.isCorrect } : choice
      );
      return updatedQuestions;
    });
  };

  const handleDragEndQuestion = (result) => {
    if (!result.destination) return;

    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      const selectedQuestion = updatedQuestions[qIndex];
      const updatedChoices = Array.from(selectedQuestion.choices);

      const [movedChoice] = updatedChoices.splice(result.source.index, 1);
      updatedChoices.splice(result.destination.index, 0, movedChoice);

      selectedQuestion.choices = updatedChoices;

      return updatedQuestions;
    });
  };

  const handleRemoveQuestionFromQuestionnaire = (index) => {
    setQuestionnaires((prevQuestionnaires) => {
      const updatedQuestionnaires = [...prevQuestionnaires];
      const selectedQuestionnaire = updatedQuestionnaires[qnIndex];
      selectedQuestionnaire.questions = selectedQuestionnaire.questions.filter(
        (_, i) => i !== index
      );
      return updatedQuestionnaires;
    });
  };

  const handleDragEndQuestionnaires = (result) => {
    if (!result.destination) return;

    setQuestionnaires((prevQuestionnaires) => {
      const updatedQuestionnaires = [...prevQuestionnaires];
      const selectedQuestionnaire = updatedQuestionnaires[qnIndex];
      const updatedQuestions = Array.from(selectedQuestionnaire.questions);

      const [movedChoice] = updatedQuestions.splice(result.source.index, 1);
      updatedQuestions.splice(result.destination.index, 0, movedChoice);

      selectedQuestionnaire.questions = updatedQuestions;

      return updatedQuestionnaires;
    });
  };

  const { doRequest: doRequestSaveQuestion, errors: saveQuestionError } =
    useRequest({
      url: assignment_url + "/api/assignment/question",
      method: "put",
      body: {
        name: questions[qIndex].name,
        title: questions[qIndex].title,
        type: questions[qIndex].type,
        note: questions[qIndex].note,
        choices: questions[qIndex].choices.map((choice) => ({
          text: choice.text,
          is_correct: choice.isCorrect,
        })),
      },
      onSuccess: (data) => {
        console.log(data);
        setMyQuestions((prevQuestions) => {
          const updatedQuestions = [
            ...prevQuestions,
            {
              id: data.question.id,
              name: data.question.name,
            },
          ];
          return updatedQuestions;
        });
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex].id = data.question.id;
        setQuestions(updatedQuestions);
      },
    });

  const { doRequest: doRequestUpdateQuestion, errors: updateQuestionError } =
    useRequest({
      url: assignment_url + "/api/assignment/question",
      method: "post",
      body: {
        id: questions[qIndex].id,
        name: questions[qIndex].name,
        title: questions[qIndex].title,
        type: questions[qIndex].type,
        note: questions[qIndex].note,
        choices: questions[qIndex].choices.map((choice) => ({
          text: choice.text,
          is_correct: choice.isCorrect,
        })),
      },
      onSuccess: (data) => {
        console.log(data);
        setMyQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === data.question.id
              ? { ...question, name: data.question.name }
              : question
          )
        );
        setQuestionnaires((prevQuestionnaires) =>
          prevQuestionnaires.map((questionnaire) => {
            const updatedQuestions = questionnaire.questions.map((question) =>
              question.id === data.question.id
                ? { ...question, name: data.question.name }
                : question
            );

            return { ...questionnaire, questions: updatedQuestions };
          })
        );
      },
    });

  const handleSaveQuestion = async () => {
    console.log("save question", questions[qIndex]);
    if (window.confirm("Are you sure to save this question?")) {
      if (questions[qIndex].title === "") {
        window.alert("Please fill in the question title");
        return;
      }
      if (
        questions[qIndex].type === 0 &&
        questions[qIndex].choices.length < 2
      ) {
        window.alert(
          "For multi choices question, please add at least 2 choices"
        );
        return;
      }
      if (questions[qIndex].id === null) {
        await doRequestSaveQuestion();
      } else {
        await doRequestUpdateQuestion();
      }
    }
  };

  const {
    doRequest: doRequestSaveQuestionnaire,
    errors: saveQuestionnaireError,
  } = useRequest({
    url: assignment_url + "/api/assignment/questionnaire",
    method: "put",
    body: {
      name: questionnaires[qnIndex].name,
      questions: questionnaires[qnIndex].questions.map(
        (question) => question.id
      ),
    },
    onSuccess: (data) => {
      console.log(data);
      setMyQuestionnaires((prevQuestionnaires) => {
        const updatedQuestionnaires = [
          ...prevQuestionnaires,
          {
            id: data.questionnaire.id,
            name: data.questionnaire.name,
          },
        ];
        return updatedQuestionnaires;
      });
      const updatedQuestionnaires = [...questionnaires];
      updatedQuestionnaires[qnIndex].id = data.questionnaire.id;
      setQuestionnaires(updatedQuestionnaires);
    },
  });

  const {
    doRequest: doRequestUpdateQuestionnaire,
    errors: updateQuestionnaireError,
  } = useRequest({
    url: assignment_url + "/api/assignment/questionnaire",
    method: "post",
    body: {
      id: questionnaires[qnIndex].id,
      name: questionnaires[qnIndex].name,
      questions: questionnaires[qnIndex].questions.map(
        (question) => question.id
      ),
    },
    onSuccess: (data) => {
      console.log(data);
      setMyQuestionnaires((prevQuestionnaires) =>
        prevQuestionnaires.map((questionnaire) =>
          questionnaire.id === data.questionnaire.id
            ? { ...questionnaire, name: data.questionnaire.name }
            : questionnaire
        )
      );
    },
  });

  const handleSaveQuestionnaire = async () => {
    console.log("save questionnaire", questionnaires[qnIndex]);
    if (window.confirm("Are you sure to save this questionnaire?")) {
      if (questionnaires[qnIndex].name === "") {
        window.alert("Please fill in the questionnaire name");
        return;
      }
      if (questionnaires[qnIndex].id === null) {
        await doRequestSaveQuestionnaire();
      } else {
        await doRequestUpdateQuestionnaire();
      }
    }
  };

  const {
    doRequest: doRequestGetQuestionDetail,
    errors: getQuestionDetailError,
  } = useRequest({
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      let opened = false;

      const updatedQuestions = questions.map((q, index) => {
        if (q.id === data.question.id) {
          opened = true;
          return {
            id: data.question.id,
            name: data.question.name,
            title: data.question.title,
            type: data.question.type,
            note: data.question.note,
            choices: data.question.choices.map((choice) => ({
              text: choice.text,
              isCorrect: choice.is_correct,
            })),
          };
        }
        return q;
      });

      if (opened) {
        setQuestions(updatedQuestions);
        setQIndex(questions.findIndex((q) => q.id === data.question.id));
      } else {
        const newQuestion = {
          id: data.question.id,
          name: data.question.name,
          title: data.question.title,
          type: data.question.type,
          note: data.question.note,
          choices: data.question.choices.map((choice) => ({
            text: choice.text,
            isCorrect: choice.is_correct,
          })),
        };

        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions, newQuestion];
          setQIndex(updatedQuestions.length - 1);
          return updatedQuestions;
        });
      }
    },
  });

  const handleGetQuestionDetail = async (id) => {
    const requestUrl = `${assignment_url}/api/assignment/question/${id}`;
    await doRequestGetQuestionDetail({ url: requestUrl });
  };

  const { doRequest: doRequestDeleteQuestion, errors: deleteQuestionError } =
    useRequest({
      url: assignment_url + "/api/assignment/question",
      method: "delete",
      onSuccess: (data) => {
        setMyQuestions((prevQuestions) =>
          prevQuestions.filter((question) => question.id !== data.id)
        );
        handleRemoveQuestion(questions.findIndex((q) => q.id === data.id));
        setQuestionnaires((prevQuestionnaires) =>
          prevQuestionnaires.map((questionnaire) => {
            const updatedQuestions = questionnaire.questions.filter(
              (question) => question.id !== data.id
            );

            return { ...questionnaire, questions: updatedQuestions };
          })
        );
      },
    });

  const {
    doRequest: doRequestGetQuestionnaireDetail,
    errors: getQuestionnaireDetailError,
  } = useRequest({
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      let opened = false;

      const updatedQuestionnaires = questionnaires.map((qn, index) => {
        if (qn.id === data.questionnaire.id) {
          opened = true;
          return {
            id: data.questionnaire.id,
            name: data.questionnaire.name,
            questions: data.questionnaire.questions.map((question) => ({
              id: question.id,
              name: question.name,
            })),
          };
        }
        return qn;
      });

      if (opened) {
        setQuestionnaires(updatedQuestionnaires);
        setQnIndex(
          questionnaires.findIndex((qn) => qn.id === data.questionnaire.id)
        );
      } else {
        const newQuestionnaire = {
          id: data.questionnaire.id,
          name: data.questionnaire.name,
          questions: data.questionnaire.questions.map((question) => ({
            id: question.id,
            name: question.name,
          })),
        };

        setQuestionnaires((prevQuestionnaires) => {
          const updatedQuestionnaires = [
            ...prevQuestionnaires,
            newQuestionnaire,
          ];
          setQnIndex(updatedQuestionnaires.length - 1);
          return updatedQuestionnaires;
        });
      }
    },
  });

  const {
    doRequest: doRequestDeleteQuestionnaire,
    errors: deleteQuestionnaireError,
  } = useRequest({
    url: assignment_url + "/api/assignment/questionnaire",
    method: "delete",
    onSuccess: (data) => {
      setMyQuestionnaires((prevQuestionnaires) =>
        prevQuestionnaires.filter(
          (questionnaire) => questionnaire.id !== data.id
        )
      );
      handleRemoveQuestionnaire(
        questionnaires.findIndex((qn) => qn.id === data.id)
      );
    },
  });

  const { doRequest: doRequestDownload, errors: downloadError } = useRequest({
    method: "get",
    onSuccess: (data) => {
      console.log(data);
      const isStuVer = data.questionnaire.is_student_version === 1;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(data.questionnaire.name, 10, 10);
      doc.setFontSize(12);
      doc.text(`Created by: ${data.questionnaire.created_by}`, 10, 20);
      doc.text(
        `Created at: ${new Date(
          data.questionnaire.created_at
        ).toLocaleString()}`,
        10,
        30
      );

      let yPosition = 40;
      data.questionnaire.questions.forEach((question, index) => {
        doc.text(`Q${index + 1}: ${question.title}`, 10, yPosition);
        yPosition += 10;

        if (question.type === 0) {
          question.choices.forEach((choice, choiceIndex) => {
            const choiceLetter = String.fromCharCode(65 + choiceIndex);
            let choiceText = `${choiceLetter}. ${choice.text}`;

            if (!isStuVer && choice.is_correct) {
              choiceText += " (Correct)";
            }

            doc.text(choiceText, 15, yPosition);
            yPosition += 10;
          });
        }

        if (!isStuVer && question.note) {
          doc.text(`Note: ${question.note}`, 10, yPosition);
          yPosition += 10;
        }

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 10;
        }
      });

      if (isStuVer) {
        doc.save(`${data.questionnaire.name}.pdf`);
      } else {
        doc.save(`${data.questionnaire.name} - Teacher Version.pdf`);
      }
    },
  });

  const handleReceiveMessage = async (op, type, id, name) => {
    console.log(op, type, id, name);
    if (type === "question") {
      if (op === "choose") {
        await handleGetQuestionDetail(id);
      } else if (op === "delete") {
        if (
          window.confirm(
            "Are you sure to delete this question? This will also move the question in questionnaires"
          )
        ) {
          await doRequestDeleteQuestion({
            body: {
              id: id,
            },
          });
        }
      } else if (op === "add") {
        questionnaires.questions;
        setQuestionnaires((prevQuestionnaires) => {
          const updatedQuestionnaires = [...prevQuestionnaires];
          const selectedQuestionnaire = updatedQuestionnaires[qnIndex];

          const questionExists = selectedQuestionnaire.questions.some(
            (question) => question.id === id
          );

          if (questionExists) {
            const userConfirmed = window.confirm(
              "You already added this question to this questionnaire, do you still want to add it?"
            );
            if (!userConfirmed) {
              return prevQuestionnaires;
            }
          }
          const updatedQuestions = [
            ...selectedQuestionnaire.questions,
            { id, name },
          ];
          selectedQuestionnaire.questions = updatedQuestions;
          return updatedQuestionnaires;
        });
      }
    } else if (type === "questionnaire") {
      if (op === "choose") {
        await doRequestGetQuestionnaireDetail({
          url: `${assignment_url}/api/assignment/questionnaire/${id}`,
        });
      } else if (op === "delete") {
        if (window.confirm("Are you sure to delete this questionnaire?")) {
          await doRequestDeleteQuestionnaire({
            body: {
              id: id,
            },
          });
        }
      } else if (op === "download") {
        setDownloadId(id);
        setIsDownload(true);
        setIsModalOpen(true);
      }
    }
  };

  const handleCancelCollection = async (id) => {
    console.log("cancel collection", id);
    setAnalogies((prevAnalogies) =>
      prevAnalogies.filter((analogy) => analogy.pid !== id)
    );
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleDownload = async (isStuVer) => {
    await doRequestDownload({
      url: `${assignment_url}/api/assignment/download/${downloadId}/${isStuVer}`,
    });
  };

  if (userInfo) {
    return (
      <div style={{ margin: "3%", height: "100vh" }}>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          {isDownload && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Button
                style={{ width: "40%", marginBottom: "10px" }}
                onClick={() => {
                  handleDownload(1);
                }}
              >
                Download Student Version
              </Button>
              <div>There are no correct answer and note in student version</div>
              <br />
              <Button
                style={{ width: "40%", marginBottom: "10px" }}
                onClick={() => {
                  handleDownload(0);
                }}
              >
                Download Teacher Version
              </Button>
              <div>There are correct answer and note in teacher version</div>
            </div>
          )}
        </Modal>
        <Row>
          <a
            href="/search"
            style={{
              display: "inline-block",
              width: "auto",
              cursor: "pointer",
            }}
          >
            Back
          </a>
        </Row>
        <br />
        <Row style={{ height: "100%" }}>
          <Col md="4">
            <Card style={{ height: "100%" }}>
              <Card.Body
                style={{
                  height: "70vh",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  overflowY: "auto",
                }}
              >
                <Card.Title>Analogy Collection</Card.Title>
                {analogies.map((analogy, index) => {
                  return (
                    <AnalogyCard
                      key={index}
                      searchResult={analogy}
                      isCard={true}
                      userInfo={userInfo}
                      isCollected={true}
                      inCollection={true}
                      onSendMessage={handleCancelCollection}
                    />
                  );
                })}
              </Card.Body>
            </Card>
          </Col>
          <Col md="4">
            <Row
              style={{ height: "49%", marginBottom: "1%", marginRight: "1%" }}
            >
              <Card style={{ height: "100%" }}>
                <Card.Body
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {questions.map((q, index) => (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          cursor: "pointer",
                          border: "1px solid black",
                          borderLeft: index === 0 ? "1px solid black" : "none",
                          borderBottom:
                            index === qIndex ? "none" : "1px solid black",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                          padding: "5px",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          boxSizing: "border-box",
                          boxShadow:
                            index === qIndex
                              ? "none"
                              : "0px 4px 8px rgba(0, 0, 0, 0.2)",
                          backgroundColor:
                            index === qIndex ? "white" : "#f0f0f0",
                        }}
                        onClick={() => {
                          setQIndex(index);
                        }}
                      >
                        {q.name}{" "}
                        <FontAwesomeIcon
                          icon={faX}
                          size="2xs"
                          style={{ marginLeft: "3px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveQuestion(index);
                          }}
                        />
                      </div>
                    ))}
                    <Link title="Create a new question">
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="lg"
                        style={{ marginLeft: "5px", cursor: "pointer" }}
                        onClick={handleAddQuestion}
                      />
                    </Link>
                  </div>
                  <div style={{ overflowY: "auto", paddingTop: "3%" }}>
                    <Form.Select
                      value={questions[qIndex]?.type || ""}
                      onChange={(e) => {
                        const updatedQuestions = [...questions];
                        updatedQuestions[qIndex].type = e.target.value;
                        setQuestions(updatedQuestions);
                      }}
                      style={{ width: "50%" }}
                    >
                      <option value={0}>Multi-Choice</option>
                    </Form.Select>
                    <br />
                    <FloatingLabel
                      controlId="name"
                      label="Question Name"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        value={questions[qIndex]?.name || ""}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[qIndex].name = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="title"
                      label="Question Title"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        value={questions[qIndex]?.title || ""}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[qIndex].title = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                    </FloatingLabel>
                    {questions[qIndex]?.type == 0 && (
                      <>
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={handleAddChoice}
                        >
                          <FontAwesomeIcon
                            icon={faPlus}
                            style={{ marginRight: "3%" }}
                          />
                          Add a choice
                        </div>
                        <br />
                        <DragDropContext onDragEnd={handleDragEndQuestion}>
                          <Droppable droppableId="choices">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {questions[qIndex].choices.map(
                                  (choice, index) => (
                                    <Draggable
                                      key={index}
                                      draggableId={`choice-${index}`}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <Row
                                          className="d-flex align-items-center"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            width: "90%",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            paddingLeft: "3%",
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <Col xs="auto" className="p-0">
                                            <Link title="remove this choice">
                                              <FontAwesomeIcon
                                                icon={faMinus}
                                                style={{ cursor: "pointer" }}
                                                onClick={() =>
                                                  handleRemoveChoice(index)
                                                }
                                              />
                                            </Link>
                                          </Col>
                                          <Col>
                                            <Form.Control
                                              type="text"
                                              value={choice.text}
                                              onChange={(e) =>
                                                handleChoiceChange(
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              placeholder={`Choice ${
                                                index + 1
                                              }`}
                                              style={{ marginLeft: "8px" }}
                                            />
                                          </Col>
                                          <Col xs="auto" className="p-0">
                                            <Link title="check if this is a correct answer">
                                              <Form.Check
                                                type="checkbox"
                                                checked={choice.isCorrect}
                                                onChange={() =>
                                                  handleCorrectChange(index)
                                                }
                                                style={{ marginLeft: "8px" }}
                                              />
                                            </Link>
                                          </Col>
                                        </Row>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </>
                    )}
                    <br />
                    <FloatingLabel
                      controlId="note"
                      label="Note"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        value={questions[qIndex]?.note || ""}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[qIndex].note = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                      />
                    </FloatingLabel>
                    <div>
                      <Button
                        as="input"
                        type="button"
                        value="Save"
                        style={{ width: "100%", marginTop: "3%" }}
                        onClick={handleSaveQuestion}
                      />
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Row>
            <Row style={{ height: "49%", marginTop: "1%", marginRight: "1%" }}>
              <Card style={{ height: "100%" }}>
                <Card.Body
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      overflowX: "auto",
                      whiteSpace: "nowrap",
                      margin: "0",
                      padding: "0",
                    }}
                  >
                    {questionnaires.map((q, index) => (
                      <div
                        key={index}
                        style={{
                          display: "inline-block",
                          cursor: "pointer",
                          border: "1px solid black",
                          borderBottom:
                            index === qnIndex ? "none" : "1px solid black",
                          borderLeft: index === 0 ? "1px solid black" : "none",
                          borderTopLeftRadius: "5px",
                          borderTopRightRadius: "5px",
                          padding: "5px",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          boxSizing: "border-box",
                          boxShadow:
                            index === qnIndex
                              ? "none"
                              : "0px 4px 8px rgba(0, 0, 0, 0.2)",
                          backgroundColor:
                            index === qnIndex ? "white" : "#f0f0f0",
                        }}
                        onClick={() => setQnIndex(index)}
                      >
                        {q.name}{" "}
                        <FontAwesomeIcon
                          icon={faX}
                          size="2xs"
                          style={{ marginLeft: "3px" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveQuestionnaire(index);
                          }}
                        />
                      </div>
                    ))}
                    <Link title="Create a new questionaire">
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="lg"
                        style={{ marginLeft: "5px", cursor: "pointer" }}
                        onClick={handleAddQuestionnaire}
                      />
                    </Link>
                  </div>
                  <div style={{ overflowY: "auto", paddingTop: "3%" }}>
                    <FloatingLabel
                      controlId="qnName"
                      label="Questionnaire Name"
                      className="mb-3"
                    >
                      <Form.Control
                        as="textarea"
                        value={questionnaires[qnIndex]?.name || ""}
                        onChange={(e) => {
                          const updatedQuestionnaires = [...questionnaires];
                          updatedQuestionnaires[qnIndex].name = e.target.value;
                          setQuestionnaires(updatedQuestionnaires);
                        }}
                      />
                    </FloatingLabel>
                    <>
                      <DragDropContext onDragEnd={handleDragEndQuestionnaires}>
                        <Droppable droppableId="questionnaires">
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              style={{
                                marginTop: "20px",
                                padding: "10px",
                                borderRadius: "5px",
                              }}
                            >
                              {questionnaires[qnIndex].questions.map(
                                (question, index) => (
                                  <Draggable
                                    key={index}
                                    draggableId={`question-${index}`}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          border: "1px solid #ccc",
                                          borderRadius: "4px",
                                          padding: "10px",
                                          marginBottom: "8px",
                                          ...provided.draggableProps.style,
                                        }}
                                      >
                                        <span
                                          style={{
                                            wordBreak: "break-word",
                                            maxWidth: "90%",
                                          }}
                                        >
                                          {question.name}
                                        </span>
                                        <span
                                          style={{
                                            marginLeft: "auto",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Link title="Get Detail of this question">
                                            <FontAwesomeIcon
                                              icon={faInfo}
                                              size="sm"
                                              style={{
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                              }}
                                              onClick={() =>
                                                handleGetQuestionDetail(
                                                  question.id
                                                )
                                              }
                                            />
                                          </Link>
                                          <Link title="Delete this question">
                                            <FontAwesomeIcon
                                              icon={faX}
                                              size="sm"
                                              style={{
                                                cursor: "pointer",
                                                marginLeft: "10px",
                                              }}
                                              onClick={() =>
                                                handleRemoveQuestionFromQuestionnaire(
                                                  index
                                                )
                                              }
                                            />
                                          </Link>
                                        </span>
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </>
                    <Button
                      as="input"
                      type="button"
                      value="Save"
                      style={{ width: "100%", marginTop: "3%" }}
                      onClick={handleSaveQuestionnaire}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Row>
          </Col>
          <Col md="4">
            <Row style={{ height: "33%", marginBottom: "1%" }}>
              <Card style={{ height: "100%" }}>
                <Card.Body
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card.Title>Template</Card.Title>
                  <Form.Select
                    value={templateType}
                    onChange={(e) => setTemplateType(e.target.value)}
                    style={{ width: "50%" }}
                  >
                    <option value={0}>Multi-Choice</option>
                  </Form.Select>
                  <br />
                  {templateType === 0 && (
                    <>
                      {multiChoiceTemplate.map((template, index) => (
                        <div
                          key={index}
                          style={{
                            marginBottom: "3%",
                            border: "1px solid black",
                            padding: "5px",
                            borderRadius: "5px",
                          }}
                        >
                          {template}{" "}
                          <Link title="Copy the template">
                            <FontAwesomeIcon
                              icon={faCopy}
                              style={{ cursor: "pointer" }}
                              onClick={() => handleCopy(template)}
                            />
                          </Link>
                        </div>
                      ))}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Row>
            <Row style={{ height: "32%", marginBottom: "1%" }}>
              <Card style={{ height: "100%" }}>
                <Card.Body
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card.Title>My Question</Card.Title>
                  <QuestionCard
                    type={"question"}
                    items={myQuestions}
                    onSendMessage={handleReceiveMessage}
                  />
                </Card.Body>
              </Card>
            </Row>
            <Row style={{ height: "32%" }}>
              <Card style={{ height: "100%" }}>
                <Card.Body
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Card.Title>My Questionnaire</Card.Title>
                  <QuestionCard
                    type={"questionnaire"}
                    items={myQuestionnaires}
                    onSendMessage={handleReceiveMessage}
                  />
                </Card.Body>
              </Card>
            </Row>
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <Row style={{ textAlign: "center", marginTop: "10%" }}>
        <h2>
          Only Subscribed User Could Use Assignment Function,{" "}
          <a href="/login">Subscribe Now!</a>
        </h2>
      </Row>
    );
  }
};

question.getInitialProps = async ({ req }) => {
  let collectedAnalogies = [];
  let savedQuestions = [];
  let savedQuestionnaires = [];
  let userInfo = null;

  let cookies = "";
  if (req && req.headers.cookie) {
    cookies = req.headers.cookie;
  }

  try {
    const res = await axios.get(auth_url + "/api/users/info", {
      headers: {
        cookie: cookies,
      },
      withCredentials: true,
    });
    if (res.status == 200) {
      userInfo = res.data.data;
    }
  } catch (err) {
    console.log(err);
  }

  // get all collected analogies
  try {
    const res = await axios.get(assignment_url + "/api/assignment/analogy", {
      headers: {
        cookie: cookies,
      },
      withCredentials: true,
    });
    if (res.status == 200) {
      collectedAnalogies = res.data.analogies;
    }
  } catch (err) {
    console.log(err);
  }

  // get all questions
  try {
    const res = await axios.get(assignment_url + "/api/assignment/question", {
      headers: {
        cookie: cookies,
      },
      withCredentials: true,
    });
    if (res.status == 200) {
      savedQuestions = res.data.questions;
    }
  } catch (err) {
    console.log(err);
  }

  // get all questionnaires
  try {
    const res = await axios.get(
      assignment_url + "/api/assignment/questionnaire",
      {
        headers: {
          cookie: cookies,
        },
        withCredentials: true,
      }
    );
    if (res.status == 200) {
      savedQuestionnaires = res.data.questionnaires;
    }
  } catch (err) {
    console.log(err);
  }

  return {
    userInfo,
    collectedAnalogies,
    savedQuestions,
    savedQuestionnaires,
  };
};

export default question;
