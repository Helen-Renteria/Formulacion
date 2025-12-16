// ----- SCROLL APPEAR -----
const fades = document.querySelectorAll(".fade");

function showOnScroll() {
    fades.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", showOnScroll);
showOnScroll();

// ----- FAQ -----
document.querySelectorAll(".faq-item").forEach(item => {
    item.addEventListener("click", () => {
        item.classList.toggle("active");
    });
});

// ----- CARRUSEL -----
const track = document.querySelector(".carousel-track");
document.querySelector(".prev").onclick = () => track.scrollBy({ left: -300, behavior: "smooth" });
document.querySelector(".next").onclick = () => track.scrollBy({ left: 300, behavior: "smooth" });


//mision
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        contents.forEach(c => c.classList.remove("active"));
        document.getElementById(tab.dataset.tab).classList.add("active");
    });
});
