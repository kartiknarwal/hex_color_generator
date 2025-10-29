let isPrimaryLocked = false;
let isDarkMode = true;
let isGradientMode = false;

const primaryBox = document.getElementById("primary");
const secondaryBox = document.getElementById("secondary");
const previewBox = document.querySelector(".preview-box");
const previewBtn = document.getElementById("preview-btn");
const subtitle = document.getElementById("subtitle");
const themeSelect = document.getElementById("theme-select");

const themes = {
  vintage: [
    ["#d4a373", "#faedcd"],
    ["#ccd5ae", "#e9edc9"],
    ["#9c6644", "#7f5539"],
  ],
  modern: [
    ["#00ADB5", "#393E46"],
    ["#222831", "#FFD369"],
    ["#0077b6", "#90e0ef"],
  ],
  pastel: [
    ["#FFB6B9", "#FAE3D9"],
    ["#BBDED6", "#61C0BF"],
    ["#FBEAFF", "#C9E4DE"],
  ],
  nature: [
    ["#2C5F2D", "#97BC62"],
    ["#006D77", "#83C5BE"],
    ["#3A5A40", "#A3B18A"],
  ],
  tech: [
    ["#0F2027", "#203A43"],
    ["#141E30", "#243B55"],
    ["#00F5A0", "#00D9F5"],
  ],
};

const quotes = {
  vintage: "Timeless, warm, and nostalgic ✨",
  modern: "Clean, sharp, and bold ⚡",
  pastel: "Soft, airy, and friendly 🌈",
  nature: "Fresh, organic, and calm 🌿",
  tech: "Futuristic, vibrant, and dynamic 🧠",
  random: "Endless possibilities of color 🎲",
};

// 🎨 Random color generator
function randomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
  return color;
}

function randomGradient() {
  const color1 = randomColor();
  const color2 = randomColor();
  const color3 = randomColor();
  const angle = Math.floor(Math.random() * 360);
  return {
    css: `linear-gradient(${angle}deg, ${color1}, ${color2}, ${color3})`,
    stops: [color1, color2, color3],
  };
}

// 💡 Generate based on theme
function generateColors() {
  const selectedTheme = themeSelect.value;

  let primary, secondary;

  if (selectedTheme !== "random") {
    const palette = themes[selectedTheme];
    const [p, s] = palette[Math.floor(Math.random() * palette.length)];
    primary = isPrimaryLocked
      ? document.getElementById("primary-code").textContent
      : p;
    secondary = s;
  } else {
    primary = isPrimaryLocked
      ? document.getElementById("primary-code").textContent
      : randomColor();
    secondary = randomColor();
  }

  document.getElementById("primary-code").textContent = primary;
  document.getElementById("secondary-code").textContent = secondary;

  if (!isGradientMode) {
    gsap.to(primaryBox, { backgroundColor: primary, duration: 0.6 });
    gsap.to(secondaryBox, { backgroundColor: secondary, duration: 0.6 });
    gsap.to(previewBox, { backgroundColor: primary, duration: 0.8 });
    gsap.to(previewBtn, { backgroundColor: secondary, duration: 0.8 });
  } else {
    const gradient = randomGradient();
    const gradient2 = randomGradient();
    gsap.to(previewBox, { background: gradient.css, duration: 1 });
    gsap.to(previewBtn, { background: gradient2.css, duration: 1 });
    primaryBox.style.background = gradient.css;
    secondaryBox.style.background = gradient2.css;

    document.getElementById("primary-code").textContent =
      gradient.stops.join(", ");
    document.getElementById("secondary-code").textContent =
      gradient2.stops.join(", ");
  }

  // Animate mini preview boxes
  const miniBoxes = document.querySelectorAll(".mini-box");
  miniBoxes.forEach((box, index) => {
    gsap.to(box, {
      backgroundColor: index % 2 === 0 ? primary : secondary,
      scale: 1.1,
      duration: 0.8,
      yoyo: true,
      repeat: 1,
      ease: "power2.out",
    });
  });

  // Animate subtitle quote
  subtitle.textContent = quotes[selectedTheme];
  gsap.from(subtitle, { opacity: 0, y: 15, duration: 0.6 });
}

// 🔐 Toggle lock
function toggleLock() {
  isPrimaryLocked = !isPrimaryLocked;
  const btn = document.getElementById("lock-primary");
  btn.textContent = isPrimaryLocked ? "🔓 Unlock Primary" : "🔒 Lock Primary";
}

// 🌙 Toggle light/dark mode
function toggleMode() {
  document.body.classList.toggle("light-mode");
  isDarkMode = !isDarkMode;
  const btn = document.getElementById("mode-toggle");
  btn.textContent = isDarkMode ? "🌙 Dark Mode" : "☀️ Light Mode";
}

// 🎨 Toggle solid/gradient mode
function toggleType() {
  isGradientMode = !isGradientMode;
  const btn = document.getElementById("type-toggle");
  btn.textContent = isGradientMode ? "🧱 Solid Mode" : "🎨 Gradient Mode";
  generateColors();
}

// 📋 Copy color
function copyColor(id) {
  const color = document.getElementById(id).textContent;
  navigator.clipboard.writeText(color);
  alert(`Copied: ${color}`);
}

// 🧾 Export CSS
function exportCSS() {
  const primary = document.getElementById("primary-code").textContent;
  const secondary = document.getElementById("secondary-code").textContent;

  let cssSnippet;
  if (!isGradientMode) {
    cssSnippet = `
:root {
  --primary-color: ${primary};
  --secondary-color: ${secondary};
}

body {
  background-color: var(--primary-color);
  color: var(--secondary-color);
}
`;
  } else {
    cssSnippet = `
:root {
  --gradient-primary: linear-gradient(${primary});
  --gradient-secondary: linear-gradient(${secondary});
}

body {
  background: var(--gradient-primary);
}
button {
  background: var(--gradient-secondary);
}
`;
  }

  navigator.clipboard.writeText(cssSnippet);
  alert("✅ CSS variables copied to clipboard!");
}

// 🔄 Event Listeners
document.getElementById("generate-btn").addEventListener("click", generateColors);
document.getElementById("lock-primary").addEventListener("click", toggleLock);
document.getElementById("mode-toggle").addEventListener("click", toggleMode);
document.getElementById("export-btn").addEventListener("click", exportCSS);
document.getElementById("type-toggle").addEventListener("click", toggleType);
themeSelect.addEventListener("change", generateColors);

// 🚀 Initial animation
gsap.from(".color-card", { y: 40, opacity: 0, stagger: 0.1, duration: 0.8 });
gsap.from(".controls button, select", { scale: 0.8, opacity: 0, stagger: 0.05, duration: 0.6 });

generateColors();
