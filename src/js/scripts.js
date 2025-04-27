// This is where you should write all JavaScript
// for your project. Remember a few things as you start!
// - Use let or const for all variables
// - Do not use jQuery - use JavaScript instead
// - Do not use onclick - use addEventListener instead
// - Run npm run test regularly to check autograding
// - You'll need to link this file to your HTML :)
// After adding a task, add this line

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

	loadThemeAnimation('default');

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

	// Update progress bar. I asked AI how to update a bar based on how many items are there/complete.
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

	// Add new task. I asked AI how to mmake a interactive text box.
	function addTask() {
		console.log("Adding task");
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
});

