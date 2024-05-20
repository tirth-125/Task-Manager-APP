// // browser-app.js

// // Check if the current page is 'index.html' or 'login.html' before executing the redirection logic
// const CheckToken = () => {
//   const token = localStorage.getItem('Authorization');
//   if (token) {
//     window.location.href = 'index.html';
//   } else {
//     window.location.href = 'login.html';
//   }
// }

// window.addEventListener("load", CheckToken)

// // Load tasks from backend and other functionality...
// const tasksDOM = document.querySelector('.tasks');
// const loadingDOM = document.querySelector('.loading-text');
// const formDOM = document.querySelector('.task-form');
// const taskInputDOM = document.querySelector('.task-input');
// const formAlertDOM = document.querySelector('.form-alert');

// // Load tasks from backend if token is present
// const showTasks = async () => {
//   // loadingDOM.style.visibility = 'visible';
//   try {
//     const response = await axios.get('http://localhost:5000/api/v1/task/');
//     const { task } = response.data;
//     console.log(task,"task");
//     if (task.length < 1) {
//       tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
//       // loadingDOM.style.visibility = 'hidden';
//       return;
//     }
//     const allTasks = task
//       .map((task) => {
//         const { completed, _id: id, name } = task;
//         return `<div class="single-task ${completed && 'task-completed'}">
//           <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
//           <div class="task-links">
//             <!-- edit link -->
//             <a href="task.html?id=${id}" class="edit-link">
//               <i class="fas fa-edit"></i>
//             </a>
//             <!-- delete btn -->
//             <button type="button" class="delete-btn" data-id="${id}">
//               <i class="fas fa-trash"></i>
//             </button>
//           </div>
//         </div>`;
//       })
//       .join('');
//     tasksDOM.innerHTML = allTasks;
//   } catch (error) {
//     tasksDOM.innerHTML =
//       '<h5 class="empty-list">There was an error, please try later....</h5>';
//   }
//   loadingDOM.style.visibility = 'hidden';
// };

// // Delete task from backend
// tasksDOM.addEventListener('click', async (e) => {
//   const el = e.target;
//   if (el.parentElement.classList.contains('delete-btn')) {
//     loadingDOM.style.visibility = 'visible';
//     const id = el.parentElement.dataset.id;
//   const header = `authorization: Bearer ${token}`;
//     try {
//       await axios.delete(`http://127.0.0.1:5000/api/v1/task/${id}`,{ headers: { header } });
//       showTasks();
//     } catch (error) {
//       console.log(error);
//     } finally {
//       loadingDOM.style.visibility = 'hidden';
//     }
//   }
// });

// // Create task on the backend
// formDOM.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const name = taskInputDOM.value;
//   // const header = `authorization: Bearer ${token}`;
//   try {
//     await axios.post('http://127.0.0.1:5000/api/v1/task/', {name},
//     {headers : {
//       'Authorization': `Bearer ${token}`
//     }});
//     showTasks();
//     taskInputDOM.value = '';
//     formAlertDOM.style.display = 'block';
//     formAlertDOM.textContent = 'Success, task added';
//     formAlertDOM.classList.add('text-success');
//   } catch (error) {
//     formAlertDOM.style.display = 'block';
//     formAlertDOM.innerHTML = 'Error, please try again';
//   } finally {
//     setTimeout(() => {
//       formAlertDOM.style.display = 'none';
//       formAlertDOM.classList.remove('text-success');
//     }, 3000);
//   }
// });
// showTasks();
// // Execute tasks-related functionality if token is present
// // if (localStorage.getItem('Authorization')) {
// //   showTasks();
// // }

// Check if the current page is 'index.html' or 'login.html' before executing the redirection logic
const CheckToken = () => {
  const token = localStorage.getItem('Authorization');
  if (token) {
    const tasksContainer = document.querySelector('.tasks-container');
    const loadingText = document.querySelector('.loading-text');
    const taskForm = document.querySelector('.task-form');
    const taskInput = document.querySelector('.task-input');
    const formAlert = document.querySelector('.form-alert');
    const LogoutButton = document.querySelector('.logout-btn');

    // Load tasks from backend if token is present
    const showTasks = async () => {
      loadingText.style.visibility = 'visible';
      try {
        const response = await axios.get('http://localhost:5000/api/v1/task/');
        const { task } = response.data;
        console.log(task, "task");
        if (task.length < 1) {
          tasksContainer.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>';
          return;
        }
        const allTasks = task
          .map((task) => {
            const { completed, _id: id, name } = task;
            return `<div class="single-task ${completed && 'task-completed'}">
          <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
          <div class="task-links">
            <!-- edit link -->
            <a href="task.html?id=${id}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            <!-- delete btn -->
            <button type="button" class="delete-btn" data-id="${id}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
          })
          .join('');
        tasksContainer.innerHTML = allTasks;
      } catch (error) {
        tasksContainer.innerHTML =
          '<h5 class="empty-list">There was an error, please try later....</h5>';
      }
      loadingText.style.visibility = 'hidden';
    };

    // Delete task from backend
    tasksContainer.addEventListener('click', async (e) => {
      const el = e.target;
      if (el.parentElement.classList.contains('delete-btn')) {
        loadingText.style.visibility = 'visible';
        const id = el.parentElement.dataset.id;
        const token = localStorage.getItem('Authorization');
        try {
          await axios.delete(`http://127.0.0.1:5000/api/v1/task/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          showTasks();
        } catch (error) {
          console.log(error);
        } finally {
          loadingText.style.visibility = 'hidden';
        }
      }
    });
    LogoutButton.addEventListener('click', async (e) => {
       localStorage.clear();
       window.location.reload()

    });

    // Create task on the backend
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = taskInput.value;
      const token = localStorage.getItem('Authorization');
      try {
        await axios.post('http://127.0.0.1:5000/api/v1/task/', { name }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        showTasks();
        taskInput.value = '';
        formAlert.style.display = 'block';
        formAlert.textContent = 'Success, task added';
        formAlert.classList.add('text-success');
      } catch (error) {
        formAlert.style.display = 'block';
        formAlert.innerHTML = 'Error, please try again';
      } finally {
        setTimeout(() => {
          formAlert.style.display = 'none';
          formAlert.classList.remove('text-success');
        }, 3000);
      }
    });

    showTasks();
  } else {
    // console.log(window.location.href,'http://127.0.0.1:5500/public/login.html');
    // if (window.location.href.includes('http://127.0.0.1:5500/public/login.html')) {
    //   localStorage.removeItem('Authorization');
    // } else {
      window.location.href = './login.html'; 
    // }
  }
}

window.addEventListener("load", CheckToken);
