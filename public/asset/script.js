let allDoctors = [];
function createCard(doc) {
    return `
        <div class="bg-white shadow-lg shadow-black w-62 h-82 grid rounded-3xl hover:scale-105 transition-transform duration-300">
            <div class="max-w-[100%]">
                <img src="${doc.image}" alt="${doc.name}" class="bg-cover bg-center w-full h-full rounded-t-2xl">
            </div>
            <div class="max-w-[100%] p-4 relative">
                <h2 class="font-bold text-xl text-blue-500">${doc.name}</h2>
                <p class="text-gray-800">${doc.specialty}</p>
                <div class="flex justify-start items-center">
                    <div class="w-[10px] h-[10px] rounded-full bg-${doc.availabilityColor}-500"></div>
                    <div class="ml-2 text-${doc.availabilityColor}-500">${doc.availabilityText}</div>
                </div>
            </div>
        </div>
    `;
}

function render(doctors) {
    const grid = document.getElementById('doctorsGrid');
    if (doctors.length === 0) {
        grid.innerHTML = '<p class="text-gray-400 text-center col-span-full text-lg">Aucun médecin trouvé pour cette recherche.</p>';
        return;
    }
    grid.innerHTML = doctors.map(createCard).join('');
}
function search(term) {
    const q = term.toLowerCase().trim();
    const filtered = q
        ? allDoctors.filter(d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q))
        : allDoctors;
    render(filtered);
}
function updatePageInfo(pageInfo) {
    document.title = pageInfo.title;
    document.getElementById('heading').textContent = pageInfo.heading;
    document.getElementById('subtitle').textContent = pageInfo.subtitle;
    document.getElementById('description').textContent = pageInfo.description;
}
function getSearchParam() {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('../public/asset/Doctors.json')
        .then(res => {
            if (!res.ok) throw new Error('Failed to load');
            return res.json();
        })
        .then(data => {
            updatePageInfo(data.pageInfo);
            allDoctors = data.doctors;
            const urlSearch = getSearchParam();
            const searchInput = document.getElementById('searchInput');

            if (urlSearch) {
                searchInput.value = urlSearch;
                search(urlSearch);
            } else {
                render(allDoctors);
            }
            searchInput.addEventListener('input', e => search(e.target.value));
            document.querySelector('.form').addEventListener('reset', () => {
                setTimeout(() => {
                    search('');
                    window.history.replaceState({}, '', '/src/medecins.html');
                }, 0);
            });
        })
        .catch(err => {
            console.error('Error loading doctors:', err);
            showError();
        });
});

const slides = document.querySelectorAll('.item');
const total = slides.length;
let current = 0;

function resetSlides() {
    slides.forEach(slide => {
        slide.style.opacity = 0;
        slide.style.zIndex = 0;
        slide.style.transition = 'opacity 1s ease-in-out';
    });
}

function showSlide(index) {
    slides[index].style.opacity = 1;
    slides[index].style.zIndex = 10;
}

resetSlides();
showSlide(current);

setInterval(() => {
    resetSlides();
    current = (current + 1) % total;
    showSlide(current);
}, 5000);
function handleSearch(event) {
    event.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim();
    if (searchTerm) {
        window.location.href = `/src/medecins.html?search=${encodeURIComponent(searchTerm)}`;
    } else {
        window.location.href = '/src/medecins.html'
    }
    return false;
}
const dateInput = document.getElementById('date');
const today = new Date().toISOString().split('T')[0];
dateInput.min = today;

const form = document.getElementById('appointmentForm');
const inputs = form.querySelectorAll('input[required], select[required]');

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    let isValid = true;
    let message = '';

    switch (field.id) {
        case 'fullName':
            if (field.value.trim().length < 2) {
                isValid = false;
                message = 'Le nom doit contenir au moins 2 caractères';
            } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(field.value.trim())) {
                isValid = false;
                message = 'Le nom ne peut contenir que des lettres';
            }
            break;

        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                message = 'Veuillez entrer une adresse email valide';
            }
            break;

        case 'phone':
            const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
            if (!phoneRegex.test(field.value.trim())) {
                isValid = false;
                message = 'Veuillez entrer un numéro de téléphone valide';
            }
            break;

        case 'doctor':
            if (!field.value) {
                isValid = false;
                message = 'Veuillez sélectionner un médecin';
            }
            break;

        case 'date':
            if (!field.value) {
                isValid = false;
                message = 'Veuillez sélectionner une date';
            } else if (new Date(field.value) < new Date(today)) {
                isValid = false;
                message = 'La date ne peut pas être dans le passé';
            }
            break;

        case 'time':
            if (!field.value) {
                isValid = false;
                message = 'Veuillez sélectionner une heure';
            }
            break;
    }

    if (!isValid) {
        field.classList.remove('border-gray-600');
        field.classList.add('border-red-500');
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    } else {
        field.classList.remove('border-red-500');
        field.classList.add('border-gray-600');
        errorMessage.classList.add('hidden');
    }

    return isValid;
}

