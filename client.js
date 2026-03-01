document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('whiteboard');
  const context = canvas.getContext('2d');
  const colorInput = document.getElementById('color-input');
  const brushSizeInput = document.getElementById('brush-size');
  const brushSizeDisplay = document.getElementById('brush-size-display');
  const clearButton = document.getElementById('clear-button');
  const connectionStatus = document.getElementById('connection-status');
  const userCount = document.getElementById('user-count');

  let boardState = [];

  function resizeCanvas() {
    // TODO: Set the canvas width and height based on its parent element

    // Redraw the canvas with the current board state when resized
    // TODO: Call redrawCanvas() function

    const parent = canvas.parentElement;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height;
    redrawCanvas(boardState);
  }

  // Initialize canvas size
  // TODO: Call resizeCanvas()

  resizeCanvas();

  // Handle window resize
  // TODO: Add an event listener for the 'resize' event that calls resizeCanvas

  window.addEventListener('resize', resizeCanvas);

  // Drawing variables
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  // Connect to Socket.IO server
  // TODO: Create a socket connection to the server at 'http://localhost:3000'

  const socket = io("http://localhost:3000");

  // TODO: Set up Socket.IO event handlers

  // Canvas event handlers
  // TODO: Add event listeners for mouse events (mousedown, mousemove, mouseup, mouseout)

  socket.on('connect', () => {
    console.log('Connected');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected');
  });

  // Receive full board state when connecting
  socket.on('boardState', (state) => {
    boardState = state || [];
    redrawCanvas(boardState);
  });

  socket.on('draw', (line) => {
    drawLine(line.x0, line.y0, line.x1, line.y1, line.color, line.size);

    // Save it so I can redraw after resizing
    boardState.push(line);
  });

  socket.on('currentUsers', (count) => {
    userCount.textContent = String(count);
  });

  socket.on('clear', () => {
    boardState = [];
    redrawCanvas(boardState);
  });
  
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  // Touch support (optional)
  // TODO: Add event listeners for touch events (touchstart, touchmove, touchend, touchcancel)

  // Clear button event handler
  // TODO: Add event listener for the clear button

  clearButton.addEventListener('click', clearCanvas);

  // Update brush size display
  // TODO: Add event listener for brush size input changes

  brushSizeInput.addEventListener('input', () => {
    brushSizeDisplay.textContent = brushSizeInput.value;
  });

  brushSizeDisplay.textContent = brushSizeInput.value;


  function startDrawing(e) {
    // TODO: Set isDrawing to true and capture initial coordinates
    isDrawing = true;
    const { x, y } = getCoordinates(e);
    lastX = x;
    lastY = y;
  }

  function draw(e) {
    // TODO: If not drawing, return
    // TODO: Get current coordinates
    // TODO: Emit 'draw' event to the server with drawing data
    // TODO: Update last position
    if (!isDrawing) return;

    const { x, y } = getCoordinates(e);

    const line = {
      x0: lastX,
      y0: lastY,
      x1: x,
      y1: y,
      color: colorInput.value,
      size: Number(brushSizeInput.value)
    };

    // Draw locally for instant feedback
    drawLine(line.x0, line.y0, line.x1, line.y1, line.color, line.size);

    // Send to server
    socket.emit('draw', line);

    // Save locally
    boardState.push(line);

    lastX = x;
    lastY = y;
  }

  function drawLine(x0, y0, x1, y1, color, size) {
    // TODO: Draw a line on the canvas using the provided parameters
    context.strokeStyle = color;
    context.lineWidth = size;
    context.lineCap = 'round';

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
  }

  function stopDrawing() {
    // TODO: Set isDrawing to false
    isDrawing = false;
  }

  function clearCanvas() {
    // TODO: Emit 'clear' event to the server
    socket.emit('clear');
    boardState = [];
    redrawCanvas(boardState);
  }

  function redrawCanvas(boardState = []) {
    // TODO: Clear the canvas
    // TODO: Redraw all lines from the board state
    context.clearRect(0, 0, canvas.width, canvas.height);

    boardState.forEach(line => {
      drawLine(line.x0, line.y0, line.x1, line.y1, line.color, line.size);
    });
  }

  // Helper function to get coordinates from mouse or touch event
  function getCoordinates(e) {
    // TODO: Extract coordinates from the event (for both mouse and touch events)
    // HINT: For touch events, use e.touches[0] or e.changedTouches[0]
    // HINT: For mouse events, use e.offsetX and e.offsetY
    return {
      x: e.offsetX,
      y: e.offsetY
    };
  }

  // Handle touch events
  function handleTouchStart(e) {
    // TODO: Prevent default behavior and call startDrawing
  }

  function handleTouchMove(e) {
    // TODO: Prevent default behavior and call draw
  }
});
