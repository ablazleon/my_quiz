
// Data model

const quizzes = [
{
    id: 1,
    question:   "Capital city of Spain",
    answer:     "Madrid"
},

{
    id: 2,
    question:   "Capital city of Italy",
    answer:     "Rome"
}

];

/*
*  findAll: shows the array.
*/
exports.findAll = () => quizzes;

/*
*  findById
*/
exports.findById = (id) => {
    //const quiz = quizzes[id];
    //return quiz;
    return quizzes.find(quiz => quiz.id === id );
};

/*
*  update
*  @params quiz
*  @return void
*/
exports.update = (quiz) => {
    // quizzes.quiz.id = quiz; By an strange reason, in this way assign the entire array.

    const index = quizzes.findIndex(q => quiz.id === q.id);
    if (index >= 0 ){
        quizzes[index] ={
            id: quiz.id,
            question: (quiz.question || "").trim(),
            answer: (quiz.answer || "" ).trim()
        };
    }
};