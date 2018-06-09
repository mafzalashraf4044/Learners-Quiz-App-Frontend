export const createQuiz = (quiz) => {
    return { type: 'CREATE_QUIZ', quiz };
}

export const editQuiz = (quiz, index) => {
    return { type: 'EDIT_QUIZ', quiz, index };
}

export const dltQuiz = (index) => {
    return { type: 'DLT_QUIZ', index };
}