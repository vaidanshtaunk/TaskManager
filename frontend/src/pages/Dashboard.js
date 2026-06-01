import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get('http://localhost:5000/api/tasks', config);
    setTasks(res.data);
  };

  const addTask = async () => {
    if (!title) return;
    await axios.post('http://localhost:5000/api/tasks', { title, description }, config);
    setTitle('');
    setDescription('');
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task._id}`, { completed: !task.completed }, config);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`, config);
    fetchTasks();
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Welcome, {user?.name}! 👋</h2>
        <button style={styles.logout} onClick={logout}>Logout</button>
      </div>

      <div style={styles.addBox}>
        <input style={styles.input} placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} />
        <input style={styles.input} placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
        <button style={styles.addBtn} onClick={addTask}>Add Task</button>
      </div>

      <div style={styles.taskList}>
        {tasks.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>No tasks yet! Add one above.</p>}
        {tasks.map(task => (
          <div key={task._id} style={styles.taskCard}>
            <div style={styles.taskInfo}>
              <h4 style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#333' }}>{task.title}</h4>
              {task.description && <p style={styles.desc}>{task.description}</p>}
            </div>
            <div style={styles.actions}>
              <button style={task.completed ? styles.undoBtn : styles.doneBtn} onClick={() => toggleTask(task)}>
                {task.completed ? 'Undo' : 'Done'}
              </button>
              <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '30px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  logout: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  addBox: { background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '15px' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  taskCard: { background: 'white', padding: '15px 20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskInfo: { flex: 1 },
  desc: { color: '#666', fontSize: '13px', marginTop: '4px' },
  actions: { display: 'flex', gap: '8px' },
  doneBtn: { padding: '6px 12px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  undoBtn: { padding: '6px 12px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default Dashboard;