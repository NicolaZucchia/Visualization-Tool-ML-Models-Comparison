let isDragging = false;
let dragStart = { x: 0, y: 0 };
let dragEnd = { x: 0, y: 0 };

let dots = [];

chart.addEventListener('mousedown', e => {
    isDragging = true;
    dragStart = { x: e.offsetX, y: e.offsetY };
	dragEnd = { x: e.offsetX, y: e.offsetY };
	console.log("mousedown");
	console.log(dragStart);
	console.log(dragEnd);
});

chart.addEventListener('mousemove', e => {
	if (isDragging) {
		dragEnd = { x: e.offsetX, y: e.offsetY };
		svg.fillStyle = 'rgba(0, 0, 0, 0.2)';
		//svg.fill(dragStart.x, dragStart.y, dragEnd.x - dragStart.x, dragEnd.y - dragStart.y);
	}
});

chart.addEventListener('mouseup', e => {
	isDragging = false;
	// here it should add selected dots to dots
	// let's try this
	for (let i=0; i<pairs.length; i++) {
		cur_cx = 0;
		cur_cy = pairs[i][0];
		//dots.push();
	}
	const selectedDots = dots.filter(dot => {
		return dot.x > Math.min(dragStart.x, dragEnd.x)
			&& dot.x < Math.max(dragStart.x, dragEnd.x)
			&& dot.y > Math.min(dragStart.y, dragEnd.y)
			&& dot.y < Math.max(dragStart.y, dragEnd.y);
	});
	console.log(selectedDots);
	console.log("mouseup");
	console.log(dragEnd);
});

