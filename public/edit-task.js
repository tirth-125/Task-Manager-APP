// const taskIDDOM = document.querySelector('.task-edit-id')
// const taskNameDOM = document.querySelector('.task-edit-name')
// const taskCompletedDOM = document.querySelector('.task-edit-completed')
// const editFormDOM = document.querySelector('.single-task-form')
// const editBtnDOM = document.querySelector('.task-edit-btn')
// const formAlertDOM = document.querySelector('.form-alert')
// const params = window.location.search
// const id = new URLSearchParams(params).get('id')
// let tempName

// const showTask = async () => {
//   try {
//     const {
//       data: { task },
//     } = await axios.get(`/api/v1/tasks/${id}`)
//     const { _id: taskID, completed, name } = task

//     taskIDDOM.textContent = taskID
//     taskNameDOM.value = name
//     tempName = name
//     if (completed) {
//       taskCompletedDOM.checked = true
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// showTask()

// editFormDOM.addEventListener('submit', async (e) => {
//   editBtnDOM.textContent = 'Loading...'
//   e.preventDefault()
//   try {
//     const taskName = taskNameDOM.value
//     const taskCompleted = taskCompletedDOM.checked

//     const {
//       data: { task },
//     } = await axios.patch(`/api/v1/tasks/${id}`, {
//       name: taskName,
//       completed: taskCompleted,
//     })

//     const { _id: taskID, completed, name } = task

//     taskIDDOM.textContent = taskID
//     taskNameDOM.value = name
//     tempName = name
//     if (completed) {
//       taskCompletedDOM.checked = true
//     }
//     formAlertDOM.style.display = 'block'
//     formAlertDOM.textContent = `success, edited task`
//     formAlertDOM.classList.add('text-success')
//   } catch (error) {
//     console.error(error)
//     taskNameDOM.value = tempName
//     formAlertDOM.style.display = 'block'
//     formAlertDOM.innerHTML = `error, please try again`
//   }
//   editBtnDOM.textContent = 'Edit'
//   setTimeout(() => {
//     formAlertDOM.style.display = 'none'
//     formAlertDOM.classList.remove('text-success')
//   }, 3000)
// })
document.addEventListener('DOMContentLoaded', () => {
  const taskIDDOM = document.querySelector('.task-edit-id');
  const taskNameDOM = document.querySelector('.task-edit-name');
  const taskCompletedDOM = document.querySelector('.task-edit-completed');
  const editFormDOM = document.querySelector('.single-task-form');
  const editBtnDOM = document.querySelector('.task-edit-btn');
  const formAlertDOM = document.querySelector('.form-alert');
  const params = new URLSearchParams(window.location.search);
  const taskIdValue = params.get('id'); // Renamed to avoid conflict
  let tempName;

  const showTask = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/v1/task/${taskIdValue}`);
      console.log(response.data," = data");
      const { task } = response.data;
      const { _id: taskId, completed, name } = task;

      taskIDDOM.textContent = taskId;
      taskNameDOM.value = name;
      tempName = name;
      taskCompletedDOM.checked = completed;
    } catch (error) {
      console.log(error);
    }
  };

  showTask();

  editFormDOM.addEventListener('submit', async (e) => {
    e.preventDefault();
    editBtnDOM.textContent = 'Loading...';
    try {
      const taskName = taskNameDOM.value;
      const taskCompleted = taskCompletedDOM.checked;

      const response = await axios.put(`http://127.0.0.1:5000/api/v1/task/${taskIdValue}`, {
        name: taskName,
        completed: taskCompleted,
      });

      const { task } = response.data;
      const { _id: taskId, completed, name } = task;

      console.log(task, "tasks");

      taskIDDOM.textContent = taskId;
      taskNameDOM.value = name;
      tempName = name;
      taskCompletedDOM.checked = completed;

      formAlertDOM.style.display = 'block';
      formAlertDOM.textContent = 'Success, edited task';
      formAlertDOM.classList.add('text-success');
    } catch (error) {
      console.log(error);
      taskNameDOM.value = tempName;
      formAlertDOM.style.display = 'block';
      formAlertDOM.innerHTML = 'Error, please try again';
    } finally {
      editBtnDOM.textContent = 'Edit';
      setTimeout(() => {
        formAlertDOM.style.display = 'none';
        formAlertDOM.classList.remove('text-success');
      }, 3000);
    }
  });
});

