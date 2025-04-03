// This is where you should write all JavaScript
// for your project. Remember a few things as you start!
// - Use let or const for all variables
// - Do not use jQuery - use JavaScript instead
// - Do not use onclick - use addEventListener instead
// - Run npm run test regularly to check autograding
// - You'll need to link this file to your HTML :)

document.addEventListener("DOMContentLoaded", function () {
	const addButton = document.getElementById("add-btn");
	const taskInput = document.getElementById("new-task");
	const taskList = document.getElementById("task-list");
	const progressBar = document.getElementById("progress-bar");

	// Update progress bar. I asked AI how to update a bar based on how many items are there/complete.
	function updateProgress() {
		const tasks = document.querySelectorAll("#task-list li input[type='checkbox']");
		const completedTasks = document.querySelectorAll("#task-list li input[type='checkbox']:checked");

		let progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
		progressBar.style.width = progress + "%";
	}

	// Add new task. I asked AI how to mmake a interactive text box.
	function addTask() {
		const taskText = taskInput.value.trim();
		if (taskText !== "") {
			const newTask = document.createElement("li");
			newTask.innerHTML = `
				<input type="checkbox">
				<span>${taskText}</span>
				<button class="delete-btn">-</button>
			`;
			taskList.appendChild(newTask);
			taskInput.value = ""; // Clear input field after adding

			newTask.querySelector("input").addEventListener("change", updateProgress);
			newTask.querySelector(".delete-btn").addEventListener("click", function () {
				newTask.remove();
				updateProgress(); // Update progress after removing a task
			});

			updateProgress(); // Update progress after adding a task
		}
	}

	// Click + to add task
	addButton.addEventListener("click", addTask);

	// Click enter to add task
	taskInput.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			addTask();
		}
	});
});
