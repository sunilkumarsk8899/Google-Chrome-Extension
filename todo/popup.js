document.addEventListener("DOMContentLoaded", function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const noTasksMessage = document.getElementById("noTasksMessage");
    const toast = document.getElementById("toast");

    // Load tasks from localStorage
    loadTasks();

    // Add new task
    addTaskBtn.addEventListener("click", function () {
        const task = taskInput.value.trim();
        if (task) {
            const taskObj = { task: task, completed: false };
            addTaskToList(taskObj); // Add to the list
            saveTask(taskObj); // Save to localStorage (initially incomplete)
            taskInput.value = ""; // Clear input field
            noTasksMessage.style.display = 'none'; // Hide "No tasks" message
            showToast("Task added!");
        }
    });

    // Add task to the UI
    function addTaskToList(task) {
        const li = document.createElement("li");
        li.innerHTML = `${task.task} 
            <button class="complete">${task.completed ? '<i class="fas fa-check"></i>' : '<i class="fas fa-times"></i>'}</button>
            <button class="edit"><i class="fas fa-pencil-alt"></i></button>
            <button class="delete"><i class="fas fa-trash-alt"></i></button>`;

        // Apply styles based on task completion
        if (task.completed) {
            li.classList.add("completed");
            li.style.backgroundColor = "#d4edda"; // Green for completed tasks
        }

        taskList.appendChild(li);

        // Apply animation for task appearance
        setTimeout(() => li.style.opacity = 1, 10);
        setTimeout(() => li.style.transform = 'translateY(0)', 10);

        // Complete task
        li.querySelector(".complete").addEventListener("click", function () {
            const completeButton = li.querySelector(".complete");
            if (li.classList.contains("completed")) {
                completeButton.innerHTML = '<i class="fas fa-times"></i>';
                li.classList.remove("completed");
                li.style.backgroundColor = ""; // Reset background color
                showToast("Task marked as incomplete!");
                updateTaskCompletion(task.task, false);
            } else {
                completeButton.innerHTML = '<i class="fas fa-check"></i>';
                li.classList.add("completed");
                li.style.backgroundColor = "#d4edda"; // Set background to green
                showToast("Task completed!");
                updateTaskCompletion(task.task, true);
            }

            reorderTasks(); // Reorder tasks after completion toggle
        });

        // Edit task
        li.querySelector(".edit").addEventListener("click", function () {
            taskInput.value = task.task; // Set task for editing
            li.remove();
            removeTask(task.task);
            showToast("Editing task...");
        });

        // Delete task
        li.querySelector(".delete").addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this task?")) {
                fadeOutAndDeleteTask(li, task.task);
                showToast("Task deleted!");
            }
        });
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        if (tasks.length > 0) {
            tasks.forEach(task => addTaskToList(task));
        } else {
            noTasksMessage.style.display = 'block'; // Show "No tasks" message if empty
        }
    }

    // Save task to localStorage
    function saveTask(task) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Remove task from localStorage
    function removeTask(taskName) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.filter(task => task.task !== taskName);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Update task completion status in localStorage
    function updateTaskCompletion(taskName, completed) {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const updatedTasks = tasks.map(task => 
            task.task === taskName ? { ...task, completed } : task
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    }

    // Reorder tasks based on completion status
    function reorderTasks() {
        const taskItems = Array.from(taskList.getElementsByTagName("li"));
        const completedTasks = taskItems.filter(item => item.classList.contains("completed"));
        const incompleteTasks = taskItems.filter(item => !item.classList.contains("completed"));

        // Clear current task list
        taskList.innerHTML = "";

        // Add completed tasks at the top, followed by incomplete tasks
        completedTasks.forEach(task => taskList.appendChild(task));
        incompleteTasks.forEach(task => taskList.appendChild(task));
    }

    // Show toast notification
    function showToast(message) {
        toast.innerHTML = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // Fade out and delete task
    function fadeOutAndDeleteTask(taskElement, taskName) {
        taskElement.style.opacity = 0;
        taskElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            taskElement.remove();
            removeTask(taskName);
        }, 300);
    }
});