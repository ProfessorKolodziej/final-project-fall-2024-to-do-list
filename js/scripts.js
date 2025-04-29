// This is where you should write all JavaScript
// for your project. Remember a few things as you start!
// - Use let or const for all variables
// - Do not use jQuery - use JavaScript instead
// - Do not use onclick - use addEventListener instead
// - Run npm run test regularly to check autograding
// - You'll need to link this file to your HTML :)

document.addEventListener("DOMContentLoaded", function () {
	console.log("DOM fully loaded!");

	const addButton = document.getElementById("add-btn");
	const taskInput = document.getElementById("new-task");
	const taskList = document.getElementById("task-list");
	const progressBar = document.getElementById("progress-bar");
	const themeButtons = document.querySelectorAll('.theme-btn');

	let lottieAnimation;
	let totalFrames = 0;

	const themeAnimations = {
		'default': 'animations/pink.flower.json',
		'blue': 'animations/blue.flower.json',
		'green': 'animations/green.flower.json',
		'tan': 'animations/tan.flower.json'
	};

	// Load saved theme or use default/pink
	const savedTheme = localStorage.getItem('selectedTheme') || 'default';

	// Apply saved theme
	if (savedTheme !== 'default') {
		document.body.classList.add('theme-' + savedTheme);
	}

	loadThemeAnimation(savedTheme);

	function loadThemeAnimation(theme) {
		const lottieContainer = document.getElementById('lottie-container');
		if (lottieContainer && typeof lottie !== 'undefined') {
			if (lottieAnimation) {
				lottieAnimation.destroy();
			}

			lottieAnimation = lottie.loadAnimation({
				container: lottieContainer,
				renderer: 'svg',
				loop: false,
				autoplay: false,
				path: themeAnimations[theme],
				rendererSetting: {
					progressiveLoad: true,
					preserveAspectRatio: 'xMidyMid meet'
				}
			});

			lottieAnimation.addEventListener('DOMLoaded', () => {
				totalFrames = lottieAnimation.totalFrames;
				updateProgress();
			});
		}
	}

	// Update progress bar
	function updateProgress() {
		const tasks = document.querySelectorAll("#task-list li input[type='checkbox']");
		const completedTasks = document.querySelectorAll("#task-list li input[type='checkbox']:checked");
		let progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
		progressBar.style.width = progress + "%";

		if (lottieAnimation && totalFrames > 0) {
			const targetFrame = Math.min(Math.floor((progress / 100) * totalFrames), totalFrames - 1);

			if (!lottieAnimation.isPaused) {
				lottieAnimation.pause();
			}

			let obj = { frame: lottieAnimation.currentFrame };
			const duration = 0.8;
			if (typeof gsap !== 'undefined') {
				gsap.to(obj, {
					frame: targetFrame,
					duration: duration,
					ease: "power2.out",
					onUpdate: function () {
						lottieAnimation.goToAndStop(obj.frame, true);
					}
				});
			} else {
				const startFrame = lottieAnimation.currentFrame;
				const frameDistance = targetFrame - startFrame;
				const startTime = performance.now();
				const animDuration = duration * 1000;

				function step(timestamp) {
					const elapsed = timestamp - startTime;
					const progress = Math.min(elapsed / animDuration, 1);
					const easeProgress = 1 - Math.pow(1 - progress, 3);

					const currentFrame = startFrame + frameDistance * easeProgress;
					lottieAnimation.goToAndStop(currentFrame, true);

					if (progress < 1) {
						requestAnimationFrame(step);
					}
				}
				requestAnimationFrame(step);
			}
		}
	}

	// Save tasks to local storage
	function saveTasks() {
		console.log("Saving tasks to local storage");
		const tasks = [];
		document.querySelectorAll("#task-list li").forEach(taskItem => {
			const taskText = taskItem.querySelector("span").textContent;
			const isCompleted = taskItem.querySelector("input[type='checkbox']").checked;
			tasks.push({ text: taskText, completed: isCompleted });
		});

		console.log("Tasks to save:", tasks);
		localStorage.setItem('todoTasks', JSON.stringify(tasks));
	}

	// Load tasks from local storage
	function loadTasks() {
		console.log("Loading tasks from local storage");
		const savedTasks = localStorage.getItem('todoTasks');
		console.log("Retrieved saved tasks:", savedTasks);

		if (savedTasks) {
			try {
				const tasks = JSON.parse(savedTasks);
				console.log("Parsed tasks:", tasks);

				tasks.forEach(task => {
					createTaskElement(task.text, task.completed);
				});

				updateProgress();
			} catch (error) {
				console.error("Error parsing saved tasks:", error);
			}
		}
	}

	// Create a task
	function createTaskElement(text, completed = false) {
		const newTask = document.createElement("li");
		newTask.innerHTML = `
			<input type="checkbox" ${completed ? 'checked' : ''}>
			<span>${text}</span>
			<button class="delete-btn">-</button>
		`;
		taskList.appendChild(newTask);

		const checkbox = newTask.querySelector("input[type='checkbox']");
		const deleteBtn = newTask.querySelector(".delete-btn");

		if (checkbox) {
			checkbox.addEventListener("change", function () {
				updateProgress();
				saveTasks();
			});
		}

		if (deleteBtn) {
			deleteBtn.addEventListener("click", function () {
				newTask.remove();
				updateProgress();
				saveTasks();
			});
		}

		return newTask;
	}

	// Add new task
	function addTask() {
		console.log("Adding task");
		const taskText = taskInput.value.trim();
		if (taskText !== "") {
			const newTask = createTaskElement(taskText);
			taskInput.value = ""; // Clear input field after adding

			updateProgress();
			saveTasks(); // Save tasks after adding a new one
			console.log("Task added:", taskText);
		}
	}

	themeButtons.forEach(button => {
		button.addEventListener('click', function () {
			document.body.classList.remove('theme-blue', 'theme-green', 'theme-tan');
			const theme = this.getAttribute('data-theme');
			if (theme !== 'default') {
				document.body.classList.add('theme-' + theme);
			}

			// Save theme to local storage
			localStorage.setItem('selectedTheme', theme);
			loadThemeAnimation(theme);
		});
	});

	// Click + to add task
	addButton.addEventListener("click", addTask);

	// Click enter to add task
	taskInput.addEventListener("keypress", function (event) {
		if (event.key === "Enter") {
			addTask();
		}
	});

	// Load saved tasks when page loads
	loadTasks();
});