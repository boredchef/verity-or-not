export const questions = {
    sports: [
        {
            question: "Golf is the only sport that has been played on which celestial body?",
            answers: [
                { text: "The Moon", correct: true },
                { text: "Mars", correct: false },
                { text: "Venus", correct: false },
                { text: "Titan", correct: false }
            ],
            duration: 5
        },
        {
            question: "When basketball was first invented in 1891, what objects were used instead of modern hoops?",
            answers: [
                { text: "Peach baskets", correct: true },
                { text: "Bucket bins", correct: false },
                { text: "Wooden crates", correct: false },
                { text: "Laundry hampers", correct: false }
            ],
            duration: 5
        },
        {
            question: "How is the Olympic flame traditionally lit before the start of the Games?",
            answers: [
                { text: "Using the sun's rays and a parabolic mirror", correct: true },
                { text: "Using a giant ceremonial torch", correct: false },
                { text: "With a custom flint striker", correct: false },
                { text: "Using a match lit in Olympia", correct: false }
            ],
            duration: 5
        }
    ],
    math: [
        {
            question: "What is the slope of f(x) = 2x + 3?",
            answers: [
                { text: "2", correct: true },
                { text: "3", correct: false },
                { text: "1", correct: false },
                { text: "2x", correct: false },
            ]
        }
    ],
    science: [
        {
            question: "What is the chemical symbol for gold?",
            answers: [
                { text: "Au", correct: true },
                { text: "Ag", correct: false },
                { text: "Go", correct: false },
                { text: "Gd", correct: false }
            ]
        }
    ]
}