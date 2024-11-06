import React, { useState, useEffect } from "react";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
} from "../services/authService";
import { clearSession } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { initSocket, getSocket, disconnectSocket } from "../services/socket";
import Modal from "react-modal";
import { FaPlus, FaEdit, FaTrash, FaCheck, FaSignOutAlt } from "react-icons/fa";
import { faClipboardList } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FaClock } from "react-icons/fa";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface User {
  username: string;
  email: string;
  _id: string;
}

interface ITask {
  _id: string;
  title: string;
  status: "pending" | "completed";
  userId: string;
}

interface UserHomeProps {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<UserHomeProps> = ({ setIsAuthenticated }) => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [newTask, setNewTask] = useState<string>("");
  const [editingTask, setEditingTask] = useState<ITask | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    initSocket();
    const socket = getSocket();

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log('parsedUser',parsedUser);
        
        setUser(parsedUser.id);
        socket.emit('join', parsedUser.id);
    }


    socket.on("taskCreated", (newTask: ITask) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("taskUpdated", (updatedTask: ITask) => {
      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
    });

    socket.on("taskDeleted", (taskId: string) => {
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    });

    socket.on("taskCompleted", (completedTask: ITask) => {
      setTasks((prev) =>
        prev.map((task) =>
          task._id === completedTask._id ? completedTask : task
        )
      );
    });

    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
    loadTasks();

    return () => {
      disconnectSocket();
    };
  }, []);

  const loadTasks = async () => {
    try {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask) return;
    try {
      await createTask({ title: newTask, status: "pending" });
      setNewTask("");
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = async () => {
    if (editingTask) {
      try {
        await updateTask(editingTask._id, {
          title: editingTask.title,
          status: editingTask.status,
        });
        setEditingTask(null);
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        setTasks((prev) => prev.filter((task) => task._id !== taskToDelete));
        setIsDeleteConfirmOpen(false);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const openDeleteConfirm = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteConfirmOpen(true);
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    setIsLogoutConfirmOpen(false); // Close the confirmation modal
    navigate("/");
  };

  const data = {
    labels: ["Pending", "Completed"],
    datasets: [
      {
        data: [
          tasks.filter((task) => task.status === "pending").length,
          tasks.filter((task) => task.status === "completed").length,
        ],
        backgroundColor: ["#FF6384", "#36A2EB"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB"],
      },
    ],
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          overflowY: "auto",
          flexDirection: "column",
          height: "100vh",
          background: "linear-gradient(135deg, #1a1a1a, #444)",
          color: "white",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Navbar Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "grey",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            transition: "background-color 0.3s ease",
          }}
        >
          <h3
            style={{
              marginBottom: "10px",
              color: "black",
              fontSize: "2em",
              fontWeight: "700",
              textAlign: "center",
              transition: "color 0.3s ease",
            }}
          >
            <FontAwesomeIcon
              icon={faClipboardList}
              className="intro-icon"
              style={{ marginRight: "5px" }}
            />
            TaskNest
          </h3>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            flex: 1,
            alignItems: "stretch",
          }}
        >
          {/* Left card with user info */}
          <div
            style={{
              flex: "1",
              marginRight: "10px",
              padding: "20px",
              backgroundColor: "#2c2c2c",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              position: "relative",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              marginTop: "20px", // Add marginTop to create distance from the previous div
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
            }}
          >
            <p
              style={{
                margin: "10px 0",
                fontSize: "1.2em",
                fontStyle: "italic",
                textAlign: "center", // Center align the text
                color: "gray", // Change text color to a vibrant shade
                padding: "10px", // Optional: Add some padding for spacing
                borderRadius: "5px", // Optional: Round the corners for a softer look
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)", // Optional: Add a shadow for depth
              }}
            >
              Detail Your Action Items and Execute Them to the End
            </p>

            <p
              style={{
                margin: "5px 0",
                color: "#e0e0e0",
                fontSize: "1.1em",
                lineHeight: "1.5",
                transition: "color 0.3s ease",
              }}
            >
              <strong style={{ color: "#FFFFFF" }}>Welcome </strong>
              <span style={{ color: "#8B6930", fontWeight: "500" }}>
                {user?.username}
              </span>
            </p>
            <p
              style={{
                margin: "5px 0",
                color: "#e0e0e0",
                fontSize: "1.1em",
                lineHeight: "1.5",
                transition: "color 0.3s ease",
              }}
            >
              <strong style={{ color: "#FFFFFF" }}>
               Success! You've logged in using{" "}
              </strong>
              <span style={{ color: "#8B6930", fontWeight: "500" }}>
                {user?.email}
              </span>
            </p>

            <p
              style={{
                fontSize: "1.5em",
                fontWeight: "bold",
                textAlign: "center", // Center the quote
                color: "#FFFFFF", // White text for contrast
                marginBottom: "20px", // Space below the quote
                fontStyle: "italic", // Italic style for the quote
                backgroundColor: "#333333", // Dark grey background for contrast
                padding: "15px", // Padding around the text for better spacing
                borderRadius: "10px", // Rounded corners for a softer look
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Subtle shadow for depth
                maxWidth: "600px", // Maximum width for the paragraph container
                marginLeft: "auto", // Center the paragraph horizontally
                marginRight: "auto", // Center the paragraph horizontally
              }}
            >
              "Start where you are. Use what you have. Do what you can."
            </p>

            <button
              onClick={() => setIsLogoutConfirmOpen(true)}
              style={{
                backgroundColor: "#FF6384",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "15px",
                display: "flex",
                alignItems: "center",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#FF3D5B";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FF6384";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FaSignOutAlt style={{ marginRight: "5px" }} /> Logout
            </button>
          </div>

          {/* Chart Section */}
          <div
            style={{
              flex: "1",
              padding: "20px",
              backgroundColor: "#2c2c2c",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              transition: "transform 0.3s ease",
              marginTop: "20px", // Add marginTop to create distance from the previous div
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {/* <h3 style={{ marginBottom: '15px', textAlign: 'center', color: '#FF6384', fontWeight: '700', fontSize: '1.75em', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
    <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
    Task Status Chart
  </h3> */}

            {/* Task Status Information */}
            <div
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                marginBottom: "20px",
                lineHeight: "1.5",
              }}
            >
              <p style={{ margin: "5px 0", fontSize: "1.2em" }}>
                <strong style={{ color: "#FF6384" }}>Pending Tasks:</strong>
                <span
                  style={{
                    color: "#FF6384",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                  }}
                >
                  {tasks.filter((task) => task.status === "pending").length}
                </span>
              </p>
              <p style={{ margin: "5px 0", fontSize: "1.2em" }}>
                <strong style={{ color: "#36A2EB" }}>Completed Tasks:</strong>
                <span
                  style={{
                    color: "#36A2EB",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                  }}
                >
                  {tasks.filter((task) => task.status === "completed").length}
                </span>
              </p>
              <p
                style={{
                  margin: "10px 0",
                  fontSize: "1em",
                  fontStyle: "italic",
                }}
              >
                Awesome work! You’ve successfully completed
                <strong style={{ color: "#36A2EB" }}>
                  {" "}
                  {
                    tasks.filter((task) => task.status === "completed").length
                  }{" "}
                </strong>
                tasks. Keep the momentum alive and focus on those
                <strong style={{ color: "#FF6384" }}>
                  {" "}
                  {
                    tasks.filter((task) => task.status === "pending").length
                  }{" "}
                </strong>
                tasks waiting to be tackled!
              </p>
            </div>

            {/* Doughnut Chart */}
            <div
              style={{
                maxWidth: "300px",
                maxHeight: "200px",
                width: "90%",
                height: "100%",
              }}
            >
              <Doughnut
                data={data}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        color: "#fff", // Change legend text color
                        boxWidth: 14,
                        font: {
                          size: 14, // Increase legend font size
                          family: "Arial, sans-serif",
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Lower part with task management */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap", // Allow wrapping to enable stacking on smaller screens
            flexDirection: "row", // Default to row for larger screens
          }}
        >
          {/* Left side: Pending tasks */}
          <div
            style={{
              flex: "1 1 45%", // Flex-grow, flex-shrink, and flex-basis
              marginLeft: "10px",
              padding: "20px",
              backgroundColor: "#2c2c2c",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "#FFA500",
                fontSize: "1.2em",
                fontWeight: "700",
                letterSpacing: "1px", // Add some spacing between letters for better readability
                textTransform: "uppercase", // Transform text to uppercase for emphasis
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Add subtle shadow for depth
                backgroundImage: "linear-gradient(90deg, #FFA500, #FF4500)", // Gradient text effect
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", // Make gradient visible
                transition: "transform 0.3s ease", // Add transition for hover effect
                cursor: "pointer", // Indicate interactivity
                textAlign: "center", // Center the text
                width: "100%", // Ensure the element takes the full width for centering
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Scale up on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Reset scale
              }}
            >
              Pending Tasks
            </h3>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              style={{
                backgroundColor: "#36A2EB",
                color: "#fff",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaPlus style={{ marginRight: "5px" }} /> Create Task
            </button>
            {tasks
              .filter((task) => task.status === "pending")
              .map((task) => (
                <div
                  key={task._id}
                  style={{
                    marginBottom: "10px",
                    padding: "10px",
                    backgroundColor: "#3a3a3a",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "orange",
                    }}
                  >
                    <FaClock style={{ fontSize: "1.2em" }} />
                    <p
                      style={{
                        margin: "0",
                        fontWeight: "bold",
                        fontSize: "1.2em",
                        color: "orange",
                      }}
                    >
                      {task.title}
                    </p>
                  </div>{" "}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsEditModalOpen(true);
                      }}
                      style={{
                        backgroundColor: "#FFA500",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.2s, background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e69500")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FFA500")
                      }
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => openDeleteConfirm(task._id)}
                      style={{
                        backgroundColor: "#FF6384",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.2s, background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#e05570")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#FF6384")
                      }
                    >
                      <FaTrash /> Delete
                    </button>

                    <button
                      onClick={() => handleCompleteTask(task._id)}
                      style={{
                        backgroundColor: "#36A2EB",
                        color: "#fff",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                        transition: "transform 0.2s, background-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2e8ad8")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "#36A2EB")
                      }
                    >
                      <FaCheck /> Complete
                    </button>
                  </div>
                </div>
              ))}
          </div>

          {/* Right side: Completed tasks */}
          <div
            style={{
              flex: "1 1 45%", // Flex-grow, flex-shrink, and flex-basis

              marginLeft: "10px",
              padding: "20px",
              backgroundColor: "#2c2c2c",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3) ",
            }}
          >
            <h3
              style={{
                marginBottom: "10px",
                color: "#28a745",
                fontSize: "1.2em",
                fontWeight: "700",
                letterSpacing: "1px", // Adds spacing between letters
                textTransform: "uppercase", // Capitalizes text for emphasis
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Adds a subtle shadow for depth
                backgroundImage: "linear-gradient(90deg, #28a745, #218838)", // Gradient effect
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent", // Shows the gradient text effect
                transition: "transform 0.3s ease", // Hover animation
                cursor: "pointer", // Pointer cursor for interactivity
                textAlign: "center", // Centers the text
                width: "100%", // Ensures the element spans full width for centering
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)"; // Grows slightly on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)"; // Resets size after hover
              }}
            >
              Completed Tasks
            </h3>
            {tasks
              .filter((task) => task.status === "completed")
              .map((task) => (
                <div
                  key={task._id}
                  style={{
                    marginBottom: "10px",
                    padding: "15px",
                    backgroundColor: "#2c2c2c",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 12px rgba(0, 0, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  {/* Task Icon */}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{
                        marginRight: "10px",
                        color: "#28a745", // Green color for completed status
                        fontSize: "1.5em",
                      }}
                    />
                    <p
                      style={{
                        margin: "0",
                        color: "#f1f1f1",
                        fontSize: "1.1em",
                        fontWeight: "500",
                        flex: "1", // Ensures the text takes the remaining space
                      }}
                    >
                      {task.title}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <Modal
          isOpen={isCreateModalOpen}
          onRequestClose={() => setIsCreateModalOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <h2>Create New Task</h2>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Task Title"
            style={{
              padding: "10px",
              marginBottom: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleCreateTask}
            style={{
              backgroundColor: "#36A2EB",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Create
          </button>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            style={{
              marginLeft: "10px",
              backgroundColor: "#F44336",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onRequestClose={() => setIsEditModalOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <h2>Edit Task</h2>
          <input
            type="text"
            value={editingTask?.title || ""}
            onChange={(e) =>
              setEditingTask({ ...editingTask!, title: e.target.value })
            }
            placeholder="Task Title"
            style={{
              padding: "10px",
              marginBottom: "10px",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleEditTask}
            style={{
              backgroundColor: "#36A2EB",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Update
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            style={{
              marginLeft: "10px",
              backgroundColor: "#F44336",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={isDeleteConfirmOpen}
          onRequestClose={() => setIsDeleteConfirmOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <h2>Confirm Deletion</h2>
          <p>Are you sure you want to delete this task?</p>
          <button
            onClick={handleDeleteTask}
            style={{
              backgroundColor: "#F44336",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Delete
          </button>
          <button
            onClick={() => setIsDeleteConfirmOpen(false)}
            style={{
              marginLeft: "10px",
              backgroundColor: "#36A2EB",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </Modal>

        {/* Modal for logout confirmation */}
        <Modal
          isOpen={isLogoutConfirmOpen}
          onRequestClose={() => setIsLogoutConfirmOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
        >
          <h2>Confirm Logout</h2>
          <p>Are you sure you want to logout?</p>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#F44336",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Yes, Logout
          </button>
          <button
            onClick={() => setIsLogoutConfirmOpen(false)}
            style={{
              marginLeft: "10px",
              backgroundColor: "#36A2EB",
              color: "#fff",
              border: "none",
              padding: "10px 15px",
              borderRadius: "5px",
            }}
          >
            Cancel
          </button>
        </Modal>

        {/* Footer Section */}
        <footer
          style={{
            textAlign: "center",
            padding: "10px 0",
            marginTop: "auto",
            color: "#fff",
            position: "relative",
          }}
        >
          <p>
            &copy; {new Date().getFullYear()} TaskNest. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default Dashboard;
