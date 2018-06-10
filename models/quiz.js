
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
    quizzes[quiz.id] = quiz;

};