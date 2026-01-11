document.addEventListener('DOMContentLoaded', () => {
    
    // --- Data for Modals ---
    const modalData = {
        gastronomie: {
            title: "L'Art Culinaire Ivoirien",
            image: "img/gastronomie_final.jpg",
            text: "La cuisine ivoirienne est l'une des plus variées d'Afrique de l'Ouest. Au-delà de l'Alloco (banane plantain frite), découvrez le Garba (semoule de manioc au thon), le Kedjenou (ragoût de poulet cuit à l'étouffée) ou encore le Foutou sauce graine. Chaque région offre des saveurs uniques basées sur des produits locaux frais et des épices traditionnelles.",
            link: "html/Spécialités/Spécialités.html"
        },
        nature: {
            title: "Sanctuaires de Biodiversité",
            image: "img/nature_final.jpg",
            text: "La Côte d'Ivoire abrite des trésors écologiques inestimables. Le Parc National de Taï, classé par l'UNESCO, est l'un des derniers vestiges de la forêt tropicale primaire d'Afrique de l'Ouest, refuge des hippopotames pygmées et des chimpanzés. Du Nord au Sud, entre savanes et mangroves, la nature y est reine.",
            link: "html/Visiter/Visiter.html"
        },
        histoire: {
            title: "Une Histoire Millénaire",
            image: "img/histoire_final.jpg",
            text: "De la légende de la Reine Abla Pokou à l'ère moderne menée par Félix Houphouët-Boigny, l'histoire ivoirienne est fascinante. Yamoussoukro, la capitale politique, abrite la Basilique Notre-Dame de la Paix, l'un des plus grands édifices religieux chrétiens au monde, véritable chef-d'œuvre architectural et symbole de paix.",
            link: "html/Présentation/Histoire.html"
        },
        art: {
            title: "Masques, Rythmes et Traditions",
            image: "img/art_final.jpg",
            text: "Avec plus de 60 ethnies, la richesse culturelle de la Côte d'Ivoire est immense. Le masque Zaouli (peuple Gouro), classé au patrimoine de l'UNESCO, est célèbre pour sa danse rapide et hypnotique. Les tissages traditionnels, les toiles de Korhogo et les rythmes vibrants comme le Zouglou et le Coupé-Décalé rayonnent à travers le monde.",
            link: "html/Art/Art.html"
        }
    };

    // --- DOM Elements ---
    const modal = document.getElementById('info-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalLink = document.getElementById('modal-link');
    const closeModalBtn = document.querySelector('.close-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');

    // --- Event Listeners ---

    // Open Modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            const category = btn.getAttribute('data-category');
            const data = modalData[category];

            if (data) {
                modalImg.src = data.image;
                modalTitle.textContent = data.title;
                modalText.textContent = data.text;
                modalLink.href = data.link;

                modal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Disable background scrolling
            }
        });
    });

    // Close Modal (Button)
    closeModalBtn.addEventListener('click', () => {
        closeModal();
    });

    // Close Modal (Click Outside)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close Modal (Escape Key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    }
});
